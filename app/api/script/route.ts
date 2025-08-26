import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/db"
import { compileTemplate, getGlobalWritingRules, sanitizeFencedJSON, validateContent } from "@/lib/prompt"

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const { templateSlug, briefId, inputs, technique } = await request.json()

    console.log("[v0] Looking for template with slug:", templateSlug)

    // Get brief and template
    const brief = await prisma.brief.findUnique({
      where: { id: briefId },
    })

    if (!brief) {
      console.log("[v0] Brief not found:", briefId)
      return NextResponse.json({ error: "Brief یافت نشد" }, { status: 404 })
    }

    const template = await prisma.template.findUnique({
      where: { slug: templateSlug },
    })

    if (!template) {
      console.log("[v0] Template not found:", templateSlug)
      const allTemplates = await prisma.template.findMany()
      console.log(
        "[v0] Available templates:",
        allTemplates.map((t) => t.slug),
      )
      return NextResponse.json({ error: "Template یافت نشد" }, { status: 404 })
    }

    console.log("[v0] Template found:", template.title)

    // Get hooks and viral signal
    const hooks = await prisma.hook.findMany({ take: 3 })
    const viralSignal = await prisma.viralSignal.findFirst({ where: { active: true } })

    // Compile prompt
    const context = {
      brief: {
        pageType: brief.pageType,
        domain: brief.domain,
        goal: brief.goal,
        audience: brief.audience || undefined,
        tone: brief.tone || undefined,
      },
      inputs: { ...inputs, technique },
      hooks: hooks.map((h) => h.text),
      viralSignal: viralSignal?.content,
    }

    const systemPrompt = getGlobalWritingRules(brief.tone || undefined) + "\n\n" + template.systemPrompt
    const userPrompt = compileTemplate(template.userTemplate, context)

    // Generate content based on technique
    const mockOutput = generateMockContent(technique, brief.domain, brief.goal)
    const sanitizedOutput = sanitizeFencedJSON(JSON.stringify(mockOutput))
    const output = JSON.parse(sanitizedOutput)

    // Validate output
    const validation = await validateContent(output, templateSlug)
    if (!validation.valid) {
      return NextResponse.json({ error: "محتوای تولید شده معتبر نیست", issues: validation.issues }, { status: 422 })
    }

    const run = await prisma.run.create({
      data: {
        templateId: template.id,
        briefId: brief.id,
        kind: "GENERATE",
        inputs: { ...inputs, technique },
        rawPrompt: `${systemPrompt}\n\n${userPrompt}`,
        output,
        checks: validation,
        score: validation.valid ? 100 : 0,
      },
    })

    return NextResponse.json({
      runId: run.id,
      output,
      validation,
    })
  } catch (error) {
    console.error("Script generation error:", error)
    return NextResponse.json({ error: "خطا در تولید محتوا" }, { status: 500 })
  }
}

function generateMockContent(technique: string, domain: string, goal: string) {
  const baseContent = {
    reels: `[ریلز] محتوای ${technique} برای ${domain}\n\nهدف: ${goal}\n\nسناریو 30 ثانیه‌ای جذاب و کاربردی`,
    story: `[استوری] محتوای ${technique} برای ${domain}\n\nهدف: ${goal}\n\nمحتوای چندقسمتی برای استوری`,
    post: `[پست] محتوای ${technique} برای ${domain}\n\nهدف: ${goal}\n\nکپشن جذاب با هشتگ‌های مناسب`,
    live: `[لایو] محتوای ${technique} برای ${domain}\n\nهدف: ${goal}\n\nسناریو پخش زنده تعاملی`,
  }

  // Customize based on technique
  switch (technique) {
    case "story":
      return {
        hook: `آیا می‌دانستید که در ${domain}...`,
        story: `داستان واقعی مرتبط با ${goal}`,
        cta: `همین حالا اقدام کنید`,
        ...baseContent,
      }

    case "suspense":
      return {
        beats: [
          { id: 1, text: `سوال جذاب درباره ${domain}` },
          { id: 2, text: "ایجاد تعلیق و کنجکاوی" },
          { id: 3, text: `ارائه راه‌حل برای ${goal}` },
        ],
        script: `سناریو تعلیق‌آمیز برای ${domain}`,
        ...baseContent,
      }

    case "compare":
      return {
        script: `مقایسه جامع در ${domain} برای ${goal}`,
        criteria: ["کیفیت", "قیمت", "سرعت", "نتیجه"],
        ...baseContent,
      }

    default:
      return {
        script: `محتوای ${technique} برای ${domain} با هدف ${goal}`,
        ...baseContent,
      }
  }
}
