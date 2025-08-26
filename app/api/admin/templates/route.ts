import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug, name, description, prompt, contractType } = await request.json()

    const template = await db.template.create({
      data: {
        slug,
        name,
        description,
        prompt,
        contractType,
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
