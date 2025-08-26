import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StepCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function StepCard({ title, description, children, className }: StepCardProps) {
  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <CardDescription className="text-base">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  )
}
