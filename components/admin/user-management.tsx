"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { faIR } from "date-fns/locale"
import { Shield, UserIcon } from "lucide-react"

interface AdminUser {
  id: string
  email: string
  role: string
  createdAt: Date
  _count: {
    briefs: number
  }
}

interface UserManagementProps {
  users: AdminUser[]
}

export function UserManagement({ users }: UserManagementProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error updating user role:", error)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                {user.role === "ADMIN" ? (
                  <Shield className="w-5 h-5 text-blue-600" />
                ) : (
                  <UserIcon className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user._count.briefs} بریف • عضویت{" "}
                  {formatDistanceToNow(user.createdAt, {
                    addSuffix: true,
                    locale: faIR,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                {user.role === "ADMIN" ? "مدیر" : "کاربر"}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => toggleUserRole(user.id, user.role)}>
                {user.role === "ADMIN" ? "حذف مدیریت" : "ارتقا به مدیر"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
