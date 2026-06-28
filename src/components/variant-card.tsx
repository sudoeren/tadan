"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Check, Copy } from "lucide-react"

interface VariantCardProps {
  index: number
  text: string
  complianceScore: number
  hookPreservation: number
}

export function VariantCard({
  index,
  text,
  complianceScore,
  hookPreservation,
}: VariantCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="group border-border/60 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              {index + 1}
            </span>
            <div>
              <span className="font-display text-base font-semibold">
                Variant {index + 1}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Compliance</span>
              <span className="font-mono font-semibold text-emerald-600">
                {complianceScore}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Hook</span>
              <span className="font-mono font-semibold text-primary">
                {hookPreservation}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg bg-secondary/50 p-4 border border-border/40">
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-foreground/90">
            {text}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full group/btn border-border/60"
          onClick={handleCopy}
        >
          {copied ? (
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-600">Copied</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              <span>Copy to clipboard</span>
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
