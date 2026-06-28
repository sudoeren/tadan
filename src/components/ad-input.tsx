"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import type { Platform } from "@/types"

const PLATFORMS: { value: Platform; label: string; description: string }[] = [
  { value: "meta", label: "Meta", description: "Facebook & Instagram" },
  { value: "google", label: "Google", description: "Search & Display" },
  { value: "taboola", label: "Taboola", description: "Native ads" },
]

interface AdInputProps {
  onAnalyze: (input: {
    inputType: "text" | "url"
    content?: string
    url?: string
    platforms: Platform[]
  }) => void
  loading: boolean
}

export function AdInput({ onAnalyze, loading }: AdInputProps) {
  const [inputType, setInputType] = useState<"text" | "url">("text")
  const [textContent, setTextContent] = useState("")
  const [urlContent, setUrlContent] = useState("")
  const [platforms, setPlatforms] = useState<Platform[]>([
    "meta",
    "google",
    "taboola",
  ])

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
    (inputType === "text"
      ? textContent.trim().length > 0
      : urlContent.trim().length > 0)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label className="text-sm font-medium mb-3 block">
          Target platforms
        </label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => {
            const selected = platforms.includes(p.value)
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => togglePlatform(p.value)}
                className={`group relative inline-flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm transition-all ${
                  selected
                    ? "border-primary/40 bg-primary/5 text-primary shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full transition-colors ${
                    selected ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
                <span className="font-medium">{p.label}</span>
                <span className="hidden sm:inline text-muted-foreground/60 text-xs">
                  {p.description}
                </span>
                {selected && platforms.length > 1 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-medium">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <Tabs
        value={inputType}
        onValueChange={(v) => setInputType(v as "text" | "url")}
      >
        <TabsList className="w-full rounded-lg bg-secondary p-1">
          <TabsTrigger
            value="text"
            className="flex-1 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            Ad Copy
          </TabsTrigger>
          <TabsTrigger
            value="url"
            className="flex-1 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            Landing Page URL
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="mt-4">
          <Textarea
            placeholder="Paste your ad headline, body copy, and CTA here..."
            className="min-h-[180px] resize-y bg-card border-border/80 focus:border-primary/40 font-mono text-sm leading-relaxed placeholder:text-muted-foreground/50"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-2 font-mono">
            {textContent.length} characters
          </p>
        </TabsContent>
        <TabsContent value="url" className="mt-4">
          <Input
            type="url"
            placeholder="https://example.com/landing-page"
            className="bg-card border-border/80 focus:border-primary/40 font-mono text-sm"
            value={urlContent}
            onChange={(e) => setUrlContent(e.target.value)}
          />
        </TabsContent>
      </Tabs>

      <Button
        type="submit"
        disabled={!canSubmit || loading}
        size="lg"
        className="w-full h-12 text-sm font-medium rounded-lg transition-all active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing...
          </span>
        ) : (
          "Analyze Compliance"
        )}
      </Button>
    </form>
  )
}
