import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/db"
import { getGlobalWritingRules, sanitizeFencedJSON, validateContent } from "@/lib/prompt"

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const { runId, templateSlug, briefId, lastOutput, instruction, history } = await request.json()

    // Get original run and brief
    const originalRun = await prisma.run.findUnique({
      where: { id: runId },
      include: { template: true, brief: true },
    })

    if (!originalRun) {
      return NextResponse.json({ error: "Run اصلی یافت نشد" }, { status: 404 })
    }

    // Create revision prompt
    const systemPrompt =
      getGlobalWritingRules(originalRun.brief?.tone || undefined) +
      `

شما در حال ویرایش محتوای قبلی هستید. باید:
1. همان نوع contract JSON را حفظ کنید
2. تغییرات درخواست شده را اعمال کنید
3. کیفیت و استانداردها را حفظ کنید`

    const userPrompt = `محتوای قبلی:
${JSON.stringify(lastOutput, null, 2)}

درخواست ویرایش:
${instruction}

${history ? `تاریخچه ویرایش‌های قبلی:\n${history}` : ""}

لطفاً محتوا را با همان فرمت JSON ویرایش کنید.`

    // Simulate AI revision (replace with actual AI call)
    const revisedOutput = reviseContent(lastOutput, instruction)
    const sanitizedOutput = sanitizeFencedJSON(JSON.stringify(revisedOutput))
    const output = JSON.parse(sanitizedOutput)

    // Validate revised output
    const validation = await validateContent(output, templateSlug)
    if (!validation.valid) {
      return NextResponse.json({ error: "محتوای ویرایش شده معتبر نیست", issues: validation.issues }, { status: 422 })
    }

    // Save revision run
    const revisionRun = await prisma.run.create({
      data: {
        kind: "REVISE",
        parentId: runId,
        templateId: originalRun.templateId,
        briefId: originalRun.briefId,
        inputs: { ...originalRun.inputs, revision: instruction },
        rawPrompt: `${systemPrompt}\n\n${userPrompt}`,
        output,
        checks: validation,
        score: validation.valid ? 100 : 0,
      },
    })

    return NextResponse.json({
      runId: revisionRun.id,
      output,
      validation,
    })
  } catch (error) {
    console.error("Revision error:", error)
    return NextResponse.json({ error: "خطا در ویرایش محتوا" }, { status: 500 })
  }
}

function reviseContent(originalContent: any, instruction: string) {
  // Simple mock revision logic
  const revised = { ...originalContent }

  if (instruction.includes("کوتاه")) {
    // Make content shorter
    Object.keys(revised).forEach((key) => {
      if (typeof revised[key] === "string") {
        revised[key] = revised[key].substring(0, Math.floor(revised[key].length * 0.7))
      }
    })
  }

  if (instruction.includes("رسمی")) {
    // Make tone more formal
    Object.keys(revised).forEach((key) => {
      if (typeof revised[key] === "string") {
        revised[key] = revised[key].replace(/می‌کنی/g, "می‌کنید").replace(/بیا/g, "بیایید")
      }
    })
  }

  if (instruction.includes("جذاب")) {
    // Make more engaging
    Object.keys(revised).forEach((key) => {
      if (typeof revised[key] === "string") {
        revised[key] = `🔥 ${revised[key]} 🔥`
      }
    })
  }

  return revised
}
