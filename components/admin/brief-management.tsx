"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { faIR } from "date-fns/locale"
import { Search, Trash2, Download } from "lucide-react"

interface AdminBrief {
  id: string
  title: string | null
  pageType: string
  domain: string
  goal: string
  createdAt: Date
  user: {
    email: string
  }
  runs: Array<{
    id: string
    kind: string
    createdAt: Date
  }>
}

interface BriefManagementProps {
  briefs: AdminBrief[]
}

export function BriefManagement({ briefs }: BriefManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBriefs, setFilteredBriefs] = useState(briefs)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = briefs.filter(
      (brief) =>
        brief.title?.toLowerCase().includes(term.toLowerCase()) ||
        brief.domain.toLowerCase().includes(term.toLowerCase()) ||
        brief.user.email.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredBriefs(filtered)
  }

  const deleteBrief = async (briefId: string) => {
    if (!confirm("آیا از حذف این بریف اطمینان دارید؟")) return

    try {
      const response = await fetch(`/api/admin/briefs/${briefId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setFilteredBriefs(filteredBriefs.filter((brief) => brief.id !== briefId))
      }
    } catch (error) {
      console.error("Error deleting brief:", error)
    }
  }

  const exportBrief = async (briefId: string) => {
    try {
      const response = await fetch(`/api/admin/briefs/${briefId}/export`)
      const data = await response.json()

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `brief-${briefId}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting brief:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="جستجو در بریف‌ها..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {filteredBriefs.map((brief) => (
            <div
              key={brief.id}
              className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{brief.title || "بریف بدون عنوان"}</h3>
                  <Badge variant="outline">{brief.pageType}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">حوزه: {brief.domain}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">هدف: {brief.goal.substring(0, 100)}...</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>توسط {brief.user.email}</span>
                  <span>
                    {formatDistanceToNow(brief.createdAt, {
                      addSuffix: true,
                      locale: faIR,
                    })}
                  </span>
                  <span>{brief.runs.length} اجرا</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => exportBrief(brief.id)}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteBrief(brief.id)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}

          {filteredBriefs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "هیچ بریفی یافت نشد" : "هنوز بریفی ایجاد نشده است"}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
