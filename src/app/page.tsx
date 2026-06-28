"use client"

import { useState } from "react"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"
import { AdInput } from "@/components/ad-input"
import { RiskGauge } from "@/components/risk-gauge"
import { ViolationsTable } from "@/components/violations-table"
import { VariantCard } from "@/components/variant-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Platform, Violation } from "@/types"

interface Result {
  id: string
  riskScore: number
  violations: Violation[]
  variants: {
    text: string
    complianceScore: number
    hookPreservation: number
  }[]
}

type State = "idle" | "loading" | "result" | "error"

export default function AnalyzerPage() {
  const { data: session, isPending: sessionLoading } = useSession()
  const [state, setState] = useState<State>("idle")
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState("")

  async function handleAnalyze(input: {
    inputType: "text" | "url"
    content?: string
    url?: string
    platforms: Platform[]
  }) {
    setState("loading")
    setError("")

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Analysis failed")
      }

      const data = await response.json()
      setResult(data)
      setState("result")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setState("error")
    }
  }

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4 max-w-6xl mx-auto w-full">
        <div className="flex flex-col items-center gap-8 py-24 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              Alpha
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Ship compliant ads, not banned accounts
            </h1>
            <p className="max-w-lg text-muted-foreground text-lg leading-relaxed">
              Scan your ad copy against Meta, Google, and Taboola policies.
              Get instant risk scores, violations, and safe alternatives that
              preserve your marketing hook.
            </p>
          </div>

          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg border px-6 text-sm font-medium transition-colors hover:bg-muted"
            >
              Sign in
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 rounded-lg border px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm">Meta Ads</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-sm">Google Ads</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-sm">Taboola</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Ad Compliance Analyzer
          </h1>
          <p className="text-muted-foreground">
            Paste your ad copy or landing page URL to scan for policy
            violations across platforms.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <AdInput onAnalyze={handleAnalyze} loading={state === "loading"} />
          </CardContent>
        </Card>

        {state === "loading" && (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">
                Scanning against platform policies...
              </p>
            </CardContent>
          </Card>
        )}

        {state === "error" && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="py-6 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setState("idle")}
              >
                Try again
              </Button>
            </CardContent>
          </Card>
        )}

        {state === "result" && result && (
          <div className="flex flex-col gap-6">
            <Separator />

            <div className="grid gap-6 md:grid-cols-[200px_1fr]">
              <RiskGauge score={result.riskScore} />
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold">
                  {result.violations.length > 0
                    ? `${result.violations.length} violation${result.violations.length > 1 ? "s" : ""} found`
                    : "Analysis complete"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {result.violations.length > 0
                    ? "Review each violation and use the safe variants below."
                    : "Your ad copy is clean. No policy violations detected."}
                </p>
              </div>
            </div>

            {result.violations.length > 0 && (
              <ViolationsTable violations={result.violations} />
            )}

            {result.variants.length > 0 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">
                    Safe Variants ({result.variants.length})
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Click copy to use any variant in your ad account.
                  </p>
                </div>
                <div className="grid gap-4">
                  {result.variants.map((v, i) => (
                    <VariantCard
                      key={i}
                      index={i}
                      text={v.text}
                      complianceScore={v.complianceScore}
                      hookPreservation={v.hookPreservation}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
