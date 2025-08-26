import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const template = await prisma.template.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        inputsSchema: true,
        systemPrompt: true,
        userTemplate: true,
        constraints: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!template) {
      return NextResponse.json({ error: "قالب یافت نشد" }, { status: 404 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error("Error fetching template:", error)
    return NextResponse.json({ error: "خطا در دریافت قالب" }, { status: 500 })
  }
}
