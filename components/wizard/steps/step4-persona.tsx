"use client"

import { StepCard } from "@/components/ui/step-card"
import { Input } from "@/components/ui/input"
import { wizardConfig } from "@/lib/wizard-config"
import type { BriefData } from "../brief-wizard"

interface Step4Props {
  data: BriefData
  onUpdate: (updates: Partial<BriefData>) => void
}

export function Step4Persona({ data, onUpdate }: Step4Props) {
  const samplePersona = data.pageType
    ? wizardConfig.personaSample[data.pageType as keyof typeof wizardConfig.personaSample]
    : ""

  return (
    <StepCard title="تعریف پرسونا (اختیاری)" description="مخاطب هدف خود را توصیف کنید تا محتوا بهتر شخصی‌سازی شود">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="audience" className="text-sm font-medium">
            مخاطب هدف شما
          </label>
          <Input
            id="audience"
            value={data.audience || ""}
            onChange={(e) => onUpdate({ audience: e.target.value })}
            placeholder={`مثال: ${samplePersona}`}
            className="text-base"
          />
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>اختیاری:</strong> اگر مخاطب خاصی در نظر ندارید، می‌توانید این قسمت را خالی بگذارید.
          </p>
        </div>
      </div>
    </StepCard>
  )
}
