"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatDistanceToNow } from "date-fns"
import { faIR } from "date-fns/locale"
import { Plus, Edit, Trash2 } from "lucide-react"

interface AdminTemplate {
  id: string
  slug: string
  name: string
  description: string | null
  prompt: string
  contractType: string
  createdAt: Date
  _count: {
    runs: number
  }
}

interface TemplateManagementProps {
  templates: AdminTemplate[]
}

export function TemplateManagement({ templates }: TemplateManagementProps) {
  const [templateList, setTemplateList] = useState(templates)
  const [editingTemplate, setEditingTemplate] = useState<AdminTemplate | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    description: "",
    prompt: "",
    contractType: "REEL",
  })

  const resetForm = () => {
    setFormData({
      slug: "",
      name: "",
      description: "",
      prompt: "",
      contractType: "REEL",
    })
    setEditingTemplate(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingTemplate ? `/api/admin/templates/${editingTemplate.id}` : "/api/admin/templates"
      const method = editingTemplate ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error saving template:", error)
    }
  }

  const deleteTemplate = async (templateId: string) => {
    if (!confirm("آیا از حذف این قالب اطمینان دارید؟")) return

    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTemplateList(templateList.filter((template) => template.id !== templateId))
      }
    } catch (error) {
      console.error("Error deleting template:", error)
    }
  }

  const startEdit = (template: AdminTemplate) => {
    setEditingTemplate(template)
    setFormData({
      slug: template.slug,
      name: template.name,
      description: template.description || "",
      prompt: template.prompt,
      contractType: template.contractType,
    })
    setIsCreateDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div></div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 ml-2" />
              قالب جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? "ویرایش قالب" : "ایجاد قالب جدید"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">شناسه (Slug)</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نام قالب</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">توضیحات</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نوع قرارداد</label>
                <select
                  value={formData.contractType}
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="REEL">ریلز</option>
                  <option value="STORY">استوری</option>
                  <option value="POST">پست</option>
                  <option value="LIVE">لایو</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">پرامپت</label>
                <Textarea
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  rows={8}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  انصراف
                </Button>
                <Button type="submit">{editingTemplate ? "بروزرسانی" : "ایجاد"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {templateList.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                  <Badge variant="outline">{template.contractType}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">شناسه: {template.slug}</p>
                {template.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{template.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    {formatDistanceToNow(template.createdAt, {
                      addSuffix: true,
                      locale: faIR,
                    })}
                  </span>
                  <span>{template._count.runs} استفاده</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(template)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteTemplate(template.id)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}

          {templateList.length === 0 && <div className="text-center py-8 text-gray-500">هنوز قالبی ایجاد نشده است</div>}
        </div>
      </Card>
    </div>
  )
}
