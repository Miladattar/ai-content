import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/db"
import { compileTemplate, getGlobalWritingRules, sanitizeFencedJSON, validateContent } from "@/lib/prompt"
import type { Idea120 } from "@/lib/schemas-ui"

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const { briefId, inputs } = await request.json()

    // Get brief and template
    const brief = await prisma.brief.findUnique({
      where: { id: briefId },
    })

    if (!brief) {
      return NextResponse.json({ error: "Brief یافت نشد" }, { status: 404 })
    }

    const template = await prisma.template.findUnique({
      where: { slug: "idea120" },
    })

    if (!template) {
      return NextResponse.json({ error: "Template یافت نشد" }, { status: 404 })
    }

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
      inputs,
      hooks: hooks.map((h) => h.text),
      viralSignal: viralSignal?.content,
    }

    const systemPrompt = getGlobalWritingRules(brief.tone || undefined) + "\n\n" + template.systemPrompt
    const userPrompt = compileTemplate(template.userTemplate, context)

    // Simulate AI generation (replace with actual AI call)
    const mockResponse = generateMockIdea120(brief.domain, brief.goal)
    const sanitizedOutput = sanitizeFencedJSON(JSON.stringify(mockResponse))
    const output = JSON.parse(sanitizedOutput) as Idea120

    // Validate output
    const validation = await validateContent(output, "idea120")
    if (!validation.valid) {
      return NextResponse.json({ error: "محتوای تولید شده معتبر نیست", issues: validation.issues }, { status: 422 })
    }

    // Save run
    const run = await prisma.run.create({
      data: {
        templateId: template.id,
        briefId: brief.id,
        inputs,
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
    console.error("Backlog generation error:", error)
    return NextResponse.json({ error: "خطا در تولید محتوا" }, { status: 500 })
  }
}

function generateMockIdea120(domain: string, goal: string): Idea120 {
  const items = []
  for (let i = 1; i <= 120; i++) {
    items.push({
      n: i,
      title: `ایده ${i} برای ${domain}: ${goal}`,
      format: i % 10 === 0 ? "ویدیو" : undefined,
    })
  }

  return {
    items,
    assumptions: `فرضیات بر اساس ${domain} و هدف ${goal}`,
    buckets: [
      { name: "آموزشی", count: 40 },
      { name: "تبلیغاتی", count: 50 },
      { name: "تعاملی", count: 30 },
    ],
  }
}
