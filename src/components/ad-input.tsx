"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import type { Platform } from "@/types"

const PLATFORMS: { value: Platform; label: string; color: string }[] = [
  { value: "meta", label: "Meta Ads", color: "bg-emerald-500" },
  { value: "google", label: "Google Ads", color: "bg-blue-500" },
  { value: "taboola", label: "Taboola", color: "bg-violet-500" },
]

interface AdInputProps {
  onAnalyze: (input: { inputType: "text" | "url"; content?: string; url?: string; platforms: Platform[] }) => void
  loading: boolean
}

export function AdInput({ onAnalyze, loading }: AdInputProps) {
  const [inputType, setInputType] = useState<"text" | "url">("text")
  const [textContent, setTextContent] = useState("")
  const [urlContent, setUrlContent] = useState("")
  const [platforms, setPlatforms] = useState<Platform[]>(["meta", "google", "taboola"])

  function togglePlatform(platform: Platform) {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (platforms.length === 0) return

    onAnalyze({
      inputType,
      content: inputType === "text" ? textContent : undefined,
      url: inputType === "url" ? urlContent : undefined,
      platforms,
    })
  }

  const canSubmit =
    platforms.length > 0 &&
    (inputType === "text" ? textContent.trim().length > 0 : urlContent.trim().length > 0)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => togglePlatform(p.value)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              platforms.includes(p.value)
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${p.color}`} />
            {p.label}
          </button>
        ))}
      </div>

      <Tabs value={inputType} onValueChange={(v) => setInputType(v as "text" | "url")}>
        <TabsList className="w-full">
          <TabsTrigger value="text" className="flex-1">
            Ad Copy
          </TabsTrigger>
          <TabsTrigger value="url" className="flex-1">
            Landing Page URL
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <Textarea
            placeholder="Paste your ad copy here..."
            className="min-h-[160px] resize-y"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
        </TabsContent>
        <TabsContent value="url">
          <Input
            type="url"
            placeholder="https://example.com/landing-page"
            value={urlContent}
            onChange={(e) => setUrlContent(e.target.value)}
          />
        </TabsContent>
      </Tabs>

      <Button type="submit" disabled={!canSubmit || loading} size="lg">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Compliance"
        )}
      </Button>
    </form>
  )
}
