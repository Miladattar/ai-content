import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "ایمیل و رمز عبور الزامی است" }, { status: 400 })
    }

    const user = await authenticateUser(email, password)
    if (!user) {
      return NextResponse.json({ error: "ایمیل یا رمز عبور اشتباه است" }, { status: 401 })
    }

    await createSession(user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "خطا در ورود به سیستم" }, { status: 500 })
  }
}
