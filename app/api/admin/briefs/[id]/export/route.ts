import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const brief = await db.brief.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { email: true },
        },
        runs: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!brief) {
      return NextResponse.json({ error: "Brief not found" }, { status: 404 })
    }

    return NextResponse.json(brief)
  } catch (error) {
    console.error("Error exporting brief:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
