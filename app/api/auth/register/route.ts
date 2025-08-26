import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"
import { createSession } from "@/lib/session"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "ایمیل و رمز عبور الزامی است" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "رمز عبور باید حداقل 6 کاراکتر باشد" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "کاربری با این ایمیل قبلاً ثبت‌نام کرده است" }, { status: 409 })
    }

    const user = await createUser(email, password)
    await createSession(user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "خطا در ثبت‌نام" }, { status: 500 })
  }
}
