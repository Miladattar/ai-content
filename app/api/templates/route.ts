import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageType = searchParams.get("pageType")

    const templates = await prisma.template.findMany({
      where: pageType ? { pageType } : undefined,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        inputsSchema: true,
        constraints: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ error: "خطا در دریافت قالب‌ها" }, { status: 500 })
  }
}
