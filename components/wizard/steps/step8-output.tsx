"use client"

import { useState } from "react"
import { StepCard } from "@/components/ui/step-card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditChat } from "@/components/edit-chat/edit-chat"
import { MessageCircleIcon, CopyIcon, DownloadIcon } from "lucide-react"
import type { BriefData } from "../brief-wizard"

interface Step8Props {
  data: BriefData
  onUpdate: (updates: Partial<BriefData>) => void
}

export function Step8Output({ data }: Step8Props) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [output, setOutput] = useState<any>(null)
  const [error, setError] = useState<string>("")
  const [showEditChat, setShowEditChat] = useState(false)
  const [currentRunId, setCurrentRunId] = useState<string>("")
  const [briefId, setBriefId] = useState<string>("")
  const [templateSlug, setTemplateSlug] = useState<string>("")

  const generateContent = async () => {
    setIsGenerating(true)
    setError("")

    try {
      // First create a strategy snapshot
      const snapshotResponse = await fetch("/api/strategy/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefData: data }),
      })

      if (!snapshotResponse.ok) {
        throw new Error("خطا در ایجاد snapshot")
      }

      const { briefId: newBriefId } = await snapshotResponse.json()
      setBriefId(newBriefId)

      // Then generate content based on output path
      let apiEndpoint = "/api/script"
      let newTemplateSlug = "story" // default

      if (data.outputPath.includes("ایده کوتاه")) {
        apiEndpoint = "/api/backlog"
        newTemplateSlug = "idea120"
      }

      setTemplateSlug(newTemplateSlug)

      const generateResponse = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateSlug: newTemplateSlug,
          briefId: newBriefId,
          inputs: {
            topic: data.domain,
            style: "خلاقانه",
          },
          technique: data.technique,
        }),
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json()
        throw new Error(errorData.error || "خطا در تولید محتوا")
      }

      const result = await generateResponse.json()
      setOutput(result.output)
      setCurrentRunId(result.runId)
    } catch (err) {
      console.error("Content generation error:", err)
      setError(err instanceof Error ? err.message : "خطا در تولید محتوا")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleOutputUpdate = (newOutput: any, newRunId: string) => {
    setOutput(newOutput)
    setCurrentRunId(newRunId)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const downloadContent = () => {
    const content = JSON.stringify(output, null, 2)
    const blob = new Blob([content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `content-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!output && !isGenerating && !error) {
    return (
      <StepCard title="تولید محتوا" description="آماده تولید محتوای نهایی بر اساس اطلاعات وارد شده">
        <div className="space-y-6">
          {/* Brief Summary */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg">خلاصه اطلاعات وارد شده</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">نوع پیج:</span> {data.pageType}
              </div>
              <div>
                <span className="font-medium">حوزه:</span> {data.domain}
              </div>
              <div>
                <span className="font-medium">هدف:</span> {data.goal}
              </div>
              {data.audience && (
                <div>
                  <span className="font-medium">پرسونا:</span> {data.audience}
                </div>
              )}
              {data.tone && (
                <div>
                  <span className="font-medium">لحن:</span> {data.tone}
                </div>
              )}
              <div>
                <span className="font-medium">مسیر خروجی:</span> {data.outputPath}
              </div>
              <div>
                <span className="font-medium">تکنیک:</span> {data.technique}
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" onClick={generateContent}>
              تولید محتوا
            </Button>
          </div>
        </div>
      </StepCard>
    )
  }

  if (isGenerating) {
    return (
      <StepCard title="در حال تولید محتوا" description="لطفاً صبر کنید، محتوای شما در حال تولید است...">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">تولید محتوا ممکن است چند لحظه طول بکشد</p>
        </div>
      </StepCard>
    )
  }

  if (error) {
    return (
      <StepCard title="خطا در تولید محتوا" description="متأسفانه در تولید محتوا خطایی رخ داده است">
        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
          <div className="text-center">
            <Button onClick={() => setError("")}>تلاش مجدد</Button>
          </div>
        </div>
      </StepCard>
    )
  }

  // Show different output formats based on content type
  if (data.outputPath.includes("ایده کوتاه") && output.items) {
    return (
      <div className="space-y-6">
        <StepCard title="120 ایده تولید شده" description="ایده‌های کوتاه و جذاب برای محتوای شما">
          <div className="space-y-6">
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" size="sm" onClick={() => setShowEditChat(true)}>
                <MessageCircleIcon className="w-4 h-4" />
                ویرایش (چت)
              </Button>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(output, null, 2))}>
                <CopyIcon className="w-4 h-4" />
                کپی
              </Button>
              <Button variant="outline" size="sm" onClick={downloadContent}>
                <DownloadIcon className="w-4 h-4" />
                دانلود
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {output.items.slice(0, 20).map((item: any, index: number) => (
                <div key={index} className="bg-muted/50 rounded-lg p-3">
                  <div className="text-sm font-medium">#{item.n}</div>
                  <div className="text-sm">{item.title}</div>
                  {item.format && <div className="text-xs text-muted-foreground mt-1">{item.format}</div>}
                </div>
              ))}
            </div>

            {output.items.length > 20 && (
              <div className="text-center text-sm text-muted-foreground">و {output.items.length - 20} ایده دیگر...</div>
            )}

            <div className="flex justify-center pt-6">
              <Button onClick={() => window.location.reload()}>شروع ویزارد جدید</Button>
            </div>
          </div>
        </StepCard>

        {/* Edit Chat Panel */}
        {showEditChat && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <EditChat
              runId={currentRunId}
              templateSlug={templateSlug}
              briefId={briefId}
              currentOutput={output}
              onOutputUpdate={handleOutputUpdate}
              onClose={() => setShowEditChat(false)}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StepCard title="محتوای تولید شده" description="محتوای شما با موفقیت تولید شد">
        <div className="space-y-6">
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" size="sm" onClick={() => setShowEditChat(true)}>
              <MessageCircleIcon className="w-4 h-4" />
              ویرایش (چت)
            </Button>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(output, null, 2))}>
              <CopyIcon className="w-4 h-4" />
              کپی
            </Button>
            <Button variant="outline" size="sm" onClick={downloadContent}>
              <DownloadIcon className="w-4 h-4" />
              دانلود
            </Button>
          </div>

          <Tabs defaultValue="reels" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="reels">ریلز</TabsTrigger>
              <TabsTrigger value="story">استوری</TabsTrigger>
              <TabsTrigger value="post">پست</TabsTrigger>
              <TabsTrigger value="live">لایو</TabsTrigger>
            </TabsList>

            <TabsContent value="reels" className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">محتوای ریلز</h3>
                <p className="whitespace-pre-wrap">{output.reels || "محتوای ریلز در حال تولید..."}</p>
              </div>
            </TabsContent>

            <TabsContent value="story" className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">محتوای استوری</h3>
                <p className="whitespace-pre-wrap">{output.story || "محتوای استوری در حال تولید..."}</p>
              </div>
            </TabsContent>

            <TabsContent value="post" className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">محتوای پست</h3>
                <p className="whitespace-pre-wrap">{output.post || "محتوای پست در حال تولید..."}</p>
              </div>
            </TabsContent>

            <TabsContent value="live" className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">محتوای لایو</h3>
                <p className="whitespace-pre-wrap">{output.live || "محتوای لایو در حال تولید..."}</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center pt-6">
            <Button onClick={() => window.location.reload()}>شروع ویزارد جدید</Button>
          </div>
        </div>
      </StepCard>

      {/* Edit Chat Panel */}
      {showEditChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <EditChat
            runId={currentRunId}
            templateSlug={templateSlug}
            briefId={briefId}
            currentOutput={output}
            onOutputUpdate={handleOutputUpdate}
            onClose={() => setShowEditChat(false)}
          />
        </div>
      )}
    </div>
  )
}
