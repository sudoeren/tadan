"use client"

import { useState } from "react"
import { Shield, AlertTriangle, Copy, Check, Sparkles } from "lucide-react"
import type { Platform, Violation } from "@/types"

interface Result {
  id: string
  riskScore: number
  violations: Violation[]
  variants: { text: string; complianceScore: number; hookPreservation: number }[]
}

const PLATFORMS: { value: Platform; label: string; color: string }[] = [
  { value: "meta", label: "Meta Ads", color: "#1877F2" },
  { value: "google", label: "Google Ads", color: "#4285F4" },
  { value: "taboola", label: "Taboola", color: "#6C2BD9" },
]

function scoreColor(n: number) {
  if (n <= 25) return "text-emerald-600"
  if (n <= 60) return "text-amber-600"
  if (n <= 85) return "text-orange-600"
  return "text-red-600"
}

function scoreBg(n: number) {
  if (n <= 25) return "bg-emerald-50 border-emerald-200"
  if (n <= 60) return "bg-amber-50 border-amber-200"
  if (n <= 85) return "bg-orange-50 border-orange-200"
  return "bg-red-50 border-red-200"
}

function scoreLabel(n: number) {
  if (n <= 25) return "Clean"
  if (n <= 60) return "Needs review"
  if (n <= 85) return "Risky"
  return "Bannable"
}

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setOk(true)
        setTimeout(() => setOk(false), 2000)
      }}
      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-900 transition-colors"
    >
      {ok ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      {ok ? "Copied" : "Copy"}
    </button>
  )
}

export default function AnalyzerPage() {
  const [mode, setMode] = useState<"text" | "url">("text")
  const [input, setInput] = useState("")
  const [platforms, setPlatforms] = useState<Platform[]>(["meta", "google", "taboola"])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState("")
  const [stage, setStage] = useState("")

  const canRun = input.trim().length > 0 && platforms.length > 0

  async function run(e: React.FormEvent) {
    e.preventDefault()
    if (!canRun || loading) return
    setLoading(true)
    setError("")
    setStage("Scanning policies...")

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputType: mode,
          content: mode === "text" ? input : undefined,
          url: mode === "url" ? input : undefined,
          platforms,
          stream: true,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed")
      const reader = res.body?.getReader()
      if (!reader) throw new Error("No stream")
      const dec = new TextDecoder()
      let buf = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split("\n")
        buf = lines.pop() || ""
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          try {
            const d = JSON.parse(line.slice(6))
            if (d.stage) setStage(d.stage === "scraping" ? "Fetching page..." : d.stage === "optimizing" ? "Generating variants..." : "Scanning policies...")
            else if (typeof d.riskScore === "number") { setResult(d); setLoading(false) }
          } catch {}
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-[28px] font-semibold tracking-tight text-gray-900">Ad Compliance</h1>
        <p className="text-sm text-gray-500 mt-1.5">Scan ad copy against Meta, Google, and Taboola policies.</p>
      </div>

      {/* INPUT */}
      <form onSubmit={run} className="mb-14">
        <div className="flex items-center gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${mode === "text" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Ad copy
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${mode === "url" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Landing page
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {PLATFORMS.map((p) => {
            const on = platforms.includes(p.value)
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setPlatforms((prev) => prev.includes(p.value) ? prev.filter((x) => x !== p.value) : [...prev, p.value])}
                className={`flex items-center gap-2 text-[13px] px-3.5 py-2 rounded-full border transition-colors ${
                  on ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {p.value === "meta" && (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={on ? "white" : p.color}>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                {p.value === "google" && (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill={on ? "white" : "#4285F4"}/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill={on ? "white" : "#34A853"}/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill={on ? "white" : "#FBBC05"}/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill={on ? "white" : "#EA4335"}/>
                  </svg>
                )}
                {p.value === "taboola" && (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2" fill={on ? "white" : "#6C2BD9"}/>
                    <path d="M7 8h3l2 4-2 4H7l2-4-2-4zM14 8h3v8h-3z" fill={on ? "#111" : "white"}/>
                  </svg>
                )}
                {p.label}
              </button>
            )
          })}
        </div>

        {mode === "text" ? (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your ad headline, body copy, CTA..."
            rows={6}
            className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-400 focus:ring-0 transition-colors"
          />
        ) : (
          <input
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com/landing-page"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-400 focus:ring-0 transition-colors"
          />
        )}

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-400">{input.length} characters</span>
          <button
            type="submit"
            disabled={!canRun || loading}
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 disabled:opacity-30 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                {stage}
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Scan
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center justify-between">
            {error}
            <button onClick={() => setError("")} className="text-xs text-red-400 hover:text-red-600">Dismiss</button>
          </div>
        )}
      </form>

      {/* RESULTS */}
      {result && (
        <div>
          {/* Score */}
          <div className={`flex items-center gap-5 rounded-2xl border px-6 py-5 mb-10 ${scoreBg(result.riskScore)}`}>
            <span className={`text-[56px] font-bold tracking-tight leading-none ${scoreColor(result.riskScore)}`}>
              {result.riskScore}
            </span>
            <div>
              <p className={`text-sm font-semibold ${scoreColor(result.riskScore)}`}>{scoreLabel(result.riskScore)}</p>
              <p className="text-[13px] text-gray-500 mt-0.5">
                {result.violations.length === 0 ? "No violations detected." : `${result.violations.length} violation${result.violations.length > 1 ? "s" : ""} found`}
              </p>
            </div>
          </div>

          {/* Violations */}
          {result.violations.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-5">Violations</h2>
              <div className="space-y-3">
                {result.violations.map((v, i) => (
                  <div key={i} className={`rounded-xl border p-4 ${v.level === "Red" ? "border-red-200 bg-red-50/40" : "border-amber-200 bg-amber-50/30"}`}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${v.level === "Red" ? "text-red-500" : "text-amber-500"}`} />
                      <div className="min-w-0">
                        <code className="text-sm font-medium text-red-700 bg-red-100 px-1.5 py-0.5 rounded break-words">
                          &ldquo;{v.text}&rdquo;
                        </code>
                        <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">{v.reason}</p>
                      </div>
                      <span className={`ml-auto shrink-0 text-[11px] font-semibold uppercase tracking-wider ${v.level === "Red" ? "text-red-500" : "text-amber-500"}`}>
                        {v.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Variants */}
          {result.variants.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Safe alternatives</h2>
                <button
                  onClick={() => navigator.clipboard.writeText(result.variants.map((v) => v.text).join("\n\n"))}
                  className="text-xs text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy all
                </button>
              </div>
              <div className="space-y-6">
                {result.variants.map((v, i) => (
                  <div key={i} className="group">
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 text-[11px] font-mono font-semibold text-gray-500">
                        {i + 1}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Compliance <span className="font-mono font-medium text-emerald-600">{v.complianceScore}%</span>
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Hook <span className="font-mono font-medium text-gray-700">{v.hookPreservation}%</span>
                      </span>
                    </div>
                    <p className="text-[15px] leading-relaxed text-gray-700 border-l-2 border-gray-200 pl-4 py-0.5 group-hover:border-gray-400 transition-colors">
                      {v.text}
                    </p>
                    <div className="mt-2 pl-9">
                      <CopyBtn text={v.text} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All clear */}
          {result.violations.length === 0 && result.variants.length === 0 && (
            <div className="text-center py-16">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-lg font-medium text-gray-900">All clear</p>
              <p className="text-sm text-gray-500 mt-1">Ship this ad with confidence.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
