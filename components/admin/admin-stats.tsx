import { Card } from "@/components/ui/card"
import { Users, FileText, BookTemplate as Template } from "lucide-react"

interface AdminStatsProps {
  userCount: number
  briefCount: number
  templateCount: number
}

export function AdminStats({ userCount, briefCount, templateCount }: AdminStatsProps) {
  const stats = [
    {
      name: "کل کاربران",
      value: userCount,
      icon: Users,
      color: "text-blue-600",
    },
    {
      name: "کل بریف‌ها",
      value: briefCount,
      icon: FileText,
      color: "text-green-600",
    },
    {
      name: "قالب‌ها",
      value: templateCount,
      icon: Template,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.name} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString("fa-IR")}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
        </Card>
      ))}
    </div>
  )
}
