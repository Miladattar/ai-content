import bcrypt from "bcryptjs"
import { prisma } from "./db"
import type { User } from "@prisma/client"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password)

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  })
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return null
  }

  return user
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  })
}
