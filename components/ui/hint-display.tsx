import { cn } from "@/lib/utils"
import { LightbulbIcon } from "lucide-react"

interface HintDisplayProps {
  hints: string[]
  title?: string
  className?: string
}

export function HintDisplay({ hints, title = "مثال‌ها", className }: HintDisplayProps) {
  if (!hints.length) return null

  return (
    <div className={cn("bg-muted/50 rounded-lg p-4 space-y-3", className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <LightbulbIcon className="w-4 h-4" />
        <span>{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {hints.map((hint, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-background border text-muted-foreground"
          >
            {hint}
          </span>
        ))}
      </div>
    </div>
  )
}
