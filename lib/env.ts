export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "dev-secret-key",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
} as const

export function isDevelopment() {
  return env.NODE_ENV === "development"
}

export function isProduction() {
  return env.NODE_ENV === "production"
}
