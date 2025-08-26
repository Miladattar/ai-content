"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SendIcon, XIcon, MessageCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface EditChatProps {
  runId: string
  templateSlug: string
  briefId: string
  currentOutput: any
  onOutputUpdate: (newOutput: any, newRunId: string) => void
  onClose: () => void
  className?: string
}

export function EditChat({
  runId,
  templateSlug,
  briefId,
  currentOutput,
  onOutputUpdate,
  onClose,
  className,
}: EditChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "سلام! چه تغییری در محتوا می‌خواهید؟ مثلاً: 'لحن رسمی‌تر کن' یا 'CTA کوتاه‌تر باشد'",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsProcessing(true)

    try {
      // Build history from previous messages
      const history = messages
        .filter((m) => m.type === "user")
        .map((m) => m.content)
        .join("\n")

      const response = await fetch("/api/script/revise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runId,
          templateSlug,
          briefId,
          lastOutput: currentOutput,
          instruction: userMessage.content,
          history: history || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "خطا در ویرایش محتوا")
      }

      const result = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "محتوا با موفقیت ویرایش شد! تغییرات در پنل اصلی نمایش داده شده است.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      onOutputUpdate(result.output, result.runId)
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `متأسفانه خطایی رخ داد: ${error instanceof Error ? error.message : "خطای نامشخص"}`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircleIcon className="w-5 h-5" />
          ویرایش با چت
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <XIcon className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Messages */}
        <div className="h-80 overflow-y-auto space-y-3 p-2 border rounded-lg bg-muted/20">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex", {
                "justify-end": message.type === "user",
                "justify-start": message.type === "assistant",
              })}
            >
              <div
                className={cn("max-w-[80%] rounded-lg px-3 py-2 text-sm", {
                  "bg-primary text-primary-foreground": message.type === "user",
                  "bg-muted text-muted-foreground": message.type === "assistant",
                })}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                <LoadingSpinner size="sm" />
                در حال پردازش...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="تغییر مورد نظر خود را بنویسید..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isProcessing} size="sm">
            <SendIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick suggestions */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">پیشنهادات سریع:</div>
          <div className="flex flex-wrap gap-2">
            {["لحن رسمی‌تر کن", "کوتاه‌تر کن", "جذاب‌تر کن", "CTA قوی‌تر"].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="text-xs h-7 bg-transparent"
                onClick={() => setInputValue(suggestion)}
                disabled={isProcessing}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
