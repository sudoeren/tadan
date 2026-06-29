"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import type { Platform, Violation } from "@/types"
import { NavBar } from "@/components/nav-bar"
import AnalyzerForm from "@/components/analyzer-form"
import PipelineView, { type StageName } from "@/components/pipeline-view"
import ScanResult from "@/components/scan-result"
import { SignInRequired } from "@/components/sign-in-required"

interface Result {
  id: string
  riskScore: number
  violations: Violation[]
  positiveAspects: { label: string; description: string }[]
  variants: {
    text: string
    parts?: { headline: string; body: string; cta: string }
    complianceScore: number
    hookPreservation: number
  }[]
}

type View = "form" | "scanning" | "result"

export default function AnalyzerPage() {
  const { data: session, isPending: sessionPending } = useSession()
  const searchParams = useSearchParams()
  const scanId = searchParams.get("scan")
  const quickInput = searchParams.get("input")
  const quickMode = searchParams.get("mode")
  const quickPlatforms = searchParams.get("platforms")

  const [view, setView] = useState<View>("form")
  const [mode, setMode] = useState<"text" | "url">("url")
  const [input, setInput] = useState("")
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [stage, setStage] = useState<StageName>("loading")
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState("")
  const [loadingExisting, setLoadingExisting] = useState<string | null>(null)
  const autoRunRef = useRef(false)

  useEffect(() => {
    if (sessionPending) return

    if (!quickInput) return

    queueMicrotask(() => {
      setInput(quickInput)
      if (quickMode === "text" || quickMode === "url") {
        setMode(quickMode)
      } else {
        const looksLikeUrl =
          /^https?:\/\//.test(quickInput) || /\.[a-z]{2,}/i.test(quickInput)
        setMode(looksLikeUrl ? "url" : "text")
      }
      if (quickPlatforms) {
        const valid: Platform[] = ["meta", "google", "taboola", "tiktok"]
        const parsed = quickPlatforms
          .split(",")
          .map((p) => p.trim())
          .filter((p): p is Platform => valid.includes(p as Platform))
        if (parsed.length > 0) setPlatforms(parsed)
      }
      autoRunRef.current = true
      const url = new URL(window.location.href)
      url.searchParams.delete("input")
      url.searchParams.delete("mode")
      url.searchParams.delete("platforms")
      window.history.replaceState({}, "", url.toString())
    })
  }, [quickInput, quickMode, quickPlatforms, sessionPending])

  useEffect(() => {
    if (!scanId) return
    let cancelled = false

    queueMicrotask(() => {
      if (cancelled) return
      setLoadingExisting(scanId)
      setView("scanning")
      setStage("loading")
      setResult(null)
      setError("")
    })

    const load = async () => {
      try {
        const res = await fetch(`/api/history`)
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        const found = (data.records || []).find((r: { id: string }) => r.id === scanId)
        if (cancelled) return
        if (!found) {
          setError("Scan not found")
          setView("form")
          return
        }
        setResult({
          id: found.id,
          riskScore: found.riskScore ?? 0,
          violations: found.violations || [],
          positiveAspects: found.positiveAspects || [],
          variants: (found.variants || []).map((v: {
            variantText: string
            variantParts: { headline: string; body: string; cta: string } | null
            complianceScore?: number
            hookPreservation?: number
          }) => ({
            text: v.variantText,
            parts: v.variantParts || undefined,
            complianceScore: v.complianceScore ?? 0,
            hookPreservation: v.hookPreservation ?? 0,
          })),
        })
        setView("result")
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load")
        setView("form")
      } finally {
        if (!cancelled) setLoadingExisting(null)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [scanId])

  const canRun = input.trim().length > 0 && platforms.length > 0

  async function executeRun() {
    if (!canRun) return
    setError("")
    setView("scanning")
    setStage("loading")
    setResult(null)
    setStage("loading")

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputType: mode,
          content: mode === "text" ? input : undefined,
          url: mode === "url" ? normalizeUrl(input) : undefined,
          platforms,
          stream: true,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed")
      const reader = res.body?.getReader()
      if (!reader) throw new Error("No stream")
      const dec = new TextDecoder()
      let buf = ""
      let done = false
      while (!done) {
        const { done: streamDone, value } = await reader.read()
        if (streamDone) {
          done = true
          break
        }
        buf += dec.decode(value, { stream: true })
        const lines = buf.split("\n")
        buf = lines.pop() || ""
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          try {
            const d = JSON.parse(line.slice(6))
            if (d.stage) {
              if (d.stage === "loading") setStage("loading")
              else if (d.stage === "scraping") setStage("scraping")
              else if (d.stage === "analyzing") setStage("analyzing")
              else if (d.stage === "optimizing") setStage("optimizing")
            } else if (d.error) {
              setError(d.error)
              setView("form")
            } else if (typeof d.riskScore === "number") {
              setResult({
                ...d,
                positiveAspects: d.positiveAspects ?? [],
              })
              setStage("done")
              setView("result")
            }
          } catch {}
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setView("form")
    }
  }

  function normalizeUrl(raw: string): string {
    return raw.match(/^https?:\/\//) ? raw : `https://${raw}`
  }

  function run(e: React.FormEvent) {
    e.preventDefault()
    void executeRun()
  }

  const executeRunRef = useRef(executeRun)
  useEffect(() => {
    executeRunRef.current = executeRun
  })

  useEffect(() => {
    if (
      autoRunRef.current &&
      canRun &&
      view === "form" &&
      !result &&
      !error
    ) {
      autoRunRef.current = false
      void executeRunRef.current()
    }
  }, [canRun, view, result, error])

  function resetForm() {
    setInput("")
    setPlatforms([])
    setMode("url")
    setResult(null)
    setError("")
    setStage("loading")
    setView("form")
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.delete("scan")
      window.history.replaceState({}, "", url.toString())
    }
  }

  if (!sessionPending && !session && !scanId && !quickInput) {
    return (
      <SignInRequired message="Create a free account to keep scanning ads and landing pages. No credit card required." />
    )
  }

  return (
    <div className="relative min-h-screen">
      <NavBar variant="transparent" />

      <section className="relative z-[2] flex flex-col items-center text-center px-5 pt-24 sm:pt-32 pb-6 sm:pb-8">
        <div className="animate-fade-down inline-flex items-center gap-1.5 rounded-full bg-white/30 backdrop-blur-xl ring-1 ring-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_4px_20px_rgba(0,0,0,0.04)] px-3.5 py-1.5 mb-4">
          <span className="text-[12px] text-gray-700 font-medium">
            Ad Compliance Scanner
          </span>
        </div>
        <h1 className="text-gray-900 font-normal leading-[1.05] tracking-[-0.03em] text-[36px] min-[400px]:text-[40px] sm:text-[56px] lg:text-[64px] max-w-3xl">
          <span className="block animate-fade-up">Paste copy.</span>
          <span className="block animate-fade-up [animation-delay:100ms]">
            Get a verdict.
          </span>
        </h1>
        <p className="animate-fade-up [animation-delay:220ms] text-gray-600 text-sm sm:text-base mt-3 max-w-md leading-relaxed">
          Two agents, 1,200+ policy rules, and a risk score in under 6
          seconds.
        </p>
      </section>

      <div className="relative z-[2] px-5 sm:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <div
            key={view}
            className="animate-fade-up rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-5 sm:p-7"
          >
            {view === "form" && (
              <AnalyzerForm
                mode={mode}
                setMode={setMode}
                input={input}
                setInput={setInput}
                platforms={platforms}
                setPlatforms={setPlatforms}
                loading={false}
                error={error}
                onSubmit={run}
                onClearError={() => setError("")}
              />
            )}

            {view === "scanning" && (
              <div className="py-4 sm:py-6">
                <PipelineView
                  inputMode={mode}
                  currentStage={stage}
                  hasViolations={false}
                />
                {error && (
                  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
              </div>
            )}

            {view === "result" && result && (
              <ScanResult
                result={result}
                platforms={platforms}
                onScanAnother={resetForm}
              />
            )}

            {loadingExisting && !result && (
              <div className="py-6 text-center text-gray-400 text-sm">
                Loading scan…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
