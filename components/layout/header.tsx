"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { LogOutIcon, UserIcon } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">و</span>
              </div>
              <span className="font-semibold text-lg">ویزارد محتوا</span>
            </Link>

            {user && (
              <nav className="hidden md:flex items-center gap-4">
                <Link
                  href="/brief"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  ویزارد جدید
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    مدیریت
                  </Link>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOutIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">خروج</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">ورود</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">ثبت‌نام</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
