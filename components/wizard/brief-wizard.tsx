"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WizardProgress } from "@/components/ui/wizard-progress"
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react"

// Step Components
import { Step1PageType } from "./steps/step1-page-type"
import { Step2Domain } from "./steps/step2-domain"
import { Step3Goal } from "./steps/step3-goal"
import { Step4Persona } from "./steps/step4-persona"
import { Step5Tone } from "./steps/step5-tone"
import { Step6OutputPath } from "./steps/step6-output-path"
import { Step7Technique } from "./steps/step7-technique"
import { Step8Output } from "./steps/step8-output"

export interface BriefData {
  pageType: string
  domain: string
  goal: string
  audience?: string
  tone?: string
  outputPath: string
  technique: string
}

const STEP_TITLES = ["نوع پیج", "حوزه", "هدف", "پرسونا", "لحن", "مسیر خروجی", "تکنیک", "خروجی نهایی"]

export function BriefWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [briefData, setBriefData] = useState<BriefData>({
    pageType: "",
    domain: "",
    goal: "",
    audience: "",
    tone: "",
    outputPath: "",
    technique: "",
  })

  const updateBriefData = (updates: Partial<BriefData>) => {
    setBriefData((prev) => ({ ...prev, ...updates }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return briefData.pageType !== ""
      case 2:
        return briefData.domain.trim() !== ""
      case 3:
        return briefData.goal.trim() !== ""
      case 4:
        return true // Optional step
      case 5:
        return true // Optional step
      case 6:
        return briefData.outputPath !== ""
      case 7:
        return briefData.technique !== ""
      case 8:
        return true // Final step
      default:
        return false
    }
  }

  const nextStep = () => {
    if (currentStep < 8 && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PageType data={briefData} onUpdate={updateBriefData} />
      case 2:
        return <Step2Domain data={briefData} onUpdate={updateBriefData} />
      case 3:
        return <Step3Goal data={briefData} onUpdate={updateBriefData} />
      case 4:
        return <Step4Persona data={briefData} onUpdate={updateBriefData} />
      case 5:
        return <Step5Tone data={briefData} onUpdate={updateBriefData} />
      case 6:
        return <Step6OutputPath data={briefData} onUpdate={updateBriefData} />
      case 7:
        return <Step7Technique data={briefData} onUpdate={updateBriefData} />
      case 8:
        return <Step8Output data={briefData} onUpdate={updateBriefData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-8 space-y-8">
      {/* Progress */}
      <div className="max-w-4xl mx-auto px-4">
        <WizardProgress currentStep={currentStep} totalSteps={8} stepTitles={STEP_TITLES} />
      </div>

      {/* Step Content */}
      <div className="px-4">{renderStep()}</div>

      {/* Navigation */}
      {currentStep < 8 && (
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              <ChevronRightIcon className="w-4 h-4" />
              مرحله قبل
            </Button>

            <Button onClick={nextStep} disabled={!canProceed()}>
              مرحله بعد
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
