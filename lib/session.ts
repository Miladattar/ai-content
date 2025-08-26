import { cookies } from "next/headers"
import { getUserById } from "./auth"
import type { User } from "@prisma/client"

const SESSION_COOKIE_NAME = "session"

export async function createSession(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie) {
    return null
  }

  return getUserById(sessionCookie.value)
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function requireAuth(): Promise<User> {
  const user = await getSession()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== "ADMIN") {
    throw new Error("Admin access required")
  }
  return user
}

export const getCurrentUser = getSession
