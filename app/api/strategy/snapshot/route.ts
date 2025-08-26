import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const { briefData } = await request.json()

    // Create brief in database
    const brief = await prisma.brief.create({
      data: {
        pageType: briefData.pageType,
        domain: briefData.domain,
        goal: briefData.goal,
        audience: briefData.audience,
        tone: briefData.tone,
        guardrails: [],
      },
    })

    // Get active hooks and viral signals
    const hooks = await prisma.hook.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    })

    const viralSignal = await prisma.viralSignal.findFirst({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      briefId: brief.id,
      snapshot: {
        brief: {
          pageType: brief.pageType,
          domain: brief.domain,
          goal: brief.goal,
          audience: brief.audience,
          tone: brief.tone,
        },
        hooks: hooks.map((h) => h.text),
        viralSignal: viralSignal?.content,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Strategy snapshot error:", error)
    return NextResponse.json({ error: "خطا در ایجاد snapshot" }, { status: 500 })
  }
}
