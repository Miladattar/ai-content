"use client"

import { StepCard } from "@/components/ui/step-card"
import { Button } from "@/components/ui/button"
import { wizardConfig } from "@/lib/wizard-config"
import type { BriefData } from "../brief-wizard"
import { cn } from "@/lib/utils"

interface Step5Props {
  data: BriefData
  onUpdate: (updates: Partial<BriefData>) => void
}

export function Step5Tone({ data, onUpdate }: Step5Props) {
  return (
    <StepCard title="انتخاب لحن (اختیاری)" description="لحن و سبک نوشتاری مورد نظر خود را انتخاب کنید">
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {wizardConfig.tones.map((tone) => (
            <Button
              key={tone}
              variant={data.tone === tone ? "default" : "outline"}
              className={cn("h-auto p-4", {
                "ring-2 ring-primary ring-offset-2": data.tone === tone,
              })}
              onClick={() => onUpdate({ tone: tone })}
            >
              {tone}
            </Button>
          ))}
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>پیش‌فرض:</strong> اگر انتخاب نکنید، لحن خودمونی-حرفه‌ای استفاده می‌شود.
          </p>
        </div>
      </div>
    </StepCard>
  )
}
