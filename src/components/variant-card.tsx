"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {index + 1}
            </span>
            <CardTitle className="text-base font-medium">
              Variant {index + 1}
            </CardTitle>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              Compliance:{" "}
              <span className="font-medium text-emerald-600">{complianceScore}%</span>
            </span>
            <span>
              Hook:{" "}
              <span className="font-medium text-primary">{hookPreservation}%</span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
