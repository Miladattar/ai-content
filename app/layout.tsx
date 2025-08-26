import type React from "react"
import type { Metadata } from "next"
import { Vazirmatn } from "next/font/google"
import { AuthProvider } from "@/hooks/use-auth"
import "./globals.css"

import "@/lib/db"

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazirmatn",
})

export const metadata: Metadata = {
  title: "ویزارد تولید محتوا",
  description: "سیستم هوشمند تولید محتوای فارسی",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`font-sans ${vazirmatn.variable} antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-background flex flex-col">{children}</div>
        </AuthProvider>
      </body>
    </html>
  )
}
