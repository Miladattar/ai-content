import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    if (error instanceof Error && error.message.includes("SQLITE_CANTOPEN")) {
      console.error("Database connection error - database may not be initialized")
    }
    return NextResponse.json({ error: "خطا در دریافت اطلاعات کاربر" }, { status: 500 })
  }
}
