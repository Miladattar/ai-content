"use client"

import { StepCard } from "@/components/ui/step-card"
import { Input } from "@/components/ui/input"
import { HintDisplay } from "@/components/ui/hint-display"
import { wizardConfig } from "@/lib/wizard-config"
import type { BriefData } from "../brief-wizard"

interface Step2Props {
  data: BriefData
  onUpdate: (updates: Partial<BriefData>) => void
}

export function Step2Domain({ data, onUpdate }: Step2Props) {
  const hints = data.pageType
    ? wizardConfig.hintsByType[data.pageType as keyof typeof wizardConfig.hintsByType] || []
    : []

  return (
    <StepCard title="انتخاب حوزه" description="حوزه یا زمینه کاری خود را به صورت آزاد وارد کنید">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="domain" className="text-sm font-medium">
            حوزه کاری شما
          </label>
          <Input
            id="domain"
            value={data.domain}
            onChange={(e) => onUpdate({ domain: e.target.value })}
            placeholder="مثال: آموزش زبان انگلیسی"
            className="text-base"
          />
        </div>

        {hints.length > 0 && <HintDisplay hints={hints} title="مثال‌هایی برای الهام" />}
      </div>
    </StepCard>
  )
}
