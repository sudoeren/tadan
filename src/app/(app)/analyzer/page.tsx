"use client"

import { useState } from "react"
import {
  Shield,
  AlertTriangle,
  Copy,
  Check,
  ArrowUp,
  Loader2,
  Globe,
  FileText,
  Link2,
} from "lucide-react"
import type { Platform, Violation } from "@/types"
import { NavBar } from "@/components/nav-bar"

interface Result {
  id: string
  riskScore: number
  violations: Violation[]
  variants: { text: string; complianceScore: number; hookPreservation: number }[]
}

const PLATFORMS: {
  value: Platform
  label: string
  color: string
  tint: { bg: string; border: string; text: string }
}[] = [
  {
    value: "meta",
    label: "Meta Ads",
    color: "#1877F2",
    tint: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700" },
  },
  {
    value: "google",
    label: "Google Ads",
    color: "#EA4335",
    tint: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700" },
  },
  {
    value: "taboola",
    label: "Taboola",
    color: "#6C2BD9",
    tint: {
      bg: "bg-purple-50",
      border: "border-purple-300",
      text: "text-purple-700",
    },
  },
]

const SAMPLE_ADS = [
  "Guaranteed $500/day with this one weird trick! Limited time offer — only 3 spots left. Click now before your financial freedom disappears forever. Risk-free. 100% success rate.",
  "Lose 30 pounds in 7 days with no diet or exercise! Doctors hate this one weird trick. Click here to discover the secret that celebrities don't want you to know. Free trial — act now!",
  "Make $10,000 a week working from home! No experience needed. This revolutionary system has helped thousands quit their jobs. Limited spots — don't miss your financial freedom. 100% guaranteed.",
  "Exclusive investment opportunity! Turn $250 into $12,500 in 30 days, guaranteed. Our AI trading bot has a 97% success rate. Join the 50,000+ members already earning passive income. Limited spots — sign up now before this offer ends!",
]

function scoreColor(n: number) {
  if (n <= 25)
    return {
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      ring: "ring-emerald-200/60",
      label: "Clean",
    }
  if (n <= 60)
    return {
      text: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      ring: "ring-amber-200/60",
      label: "Needs review",
    }
  if (n <= 85)
    return {
      text: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      ring: "ring-orange-200/60",
      label: "Risky",
    }
  return {
    text: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    ring: "ring-red-200/60",
    label: "Bannable",
  }
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
      className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-900 transition-colors"
    >
      {ok ? (
        <Check className="w-3.5 h-3.5 text-emerald-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {ok ? "Copied" : "Copy"}
    </button>
  )
}

export default function AnalyzerPage() {
  const [mode, setMode] = useState<"text" | "url">("text")
  const [input, setInput] = useState("")
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState("")
  const [stage, setStage] = useState("")
  const [sampleIndex, setSampleIndex] = useState(0)

  const canRun = input.trim().length > 0 && platforms.length > 0

  async function run(e: React.FormEvent) {
    e.preventDefault()
    if (!canRun || loading) return
    setLoading(true)
    setError("")
    setStage("Scanning policies…")
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
            if (d.stage)
              setStage(
                d.stage === "scraping"
                  ? "Fetching page…"
                  : d.stage === "optimizing"
                    ? "Generating variants…"
                    : "Scanning policies…"
              )
            else if (typeof d.riskScore === "number") {
              setResult(d)
              setLoading(false)
            }
          } catch {}
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error")
      setLoading(false)
    }
  }

  const score = result ? scoreColor(result.riskScore) : null

  return (
    <div className="relative min-h-screen">
      <NavBar variant="transparent" />

      {/* HERO — compact */}
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

      {/* FORM — floating card */}
      <div className="relative z-[2] px-5 sm:px-8 pb-8">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={run}
            className="animate-fade-up [animation-delay:340ms] rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div className="inline-flex items-center gap-1 bg-gray-200/80 rounded-full p-1">
                {[
                  { value: "text", label: "Ad copy", icon: FileText },
                  { value: "url", label: "Landing page", icon: Link2 },
                ].map((opt) => {
                  const Icon = opt.icon
                  const active = mode === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setMode(opt.value as "text" | "url")}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-all ${
                        active
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {opt.label}
                    </button>
                  )
                })}
              </div>
              <span className="text-[12px] text-gray-400">
                {input.length} characters
              </span>
            </div>

            {mode === "text" ? (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your ad headline, body copy, and CTA…"
                rows={4}
                className="w-full resize-y rounded-2xl border-2 border-gray-200 bg-white/90 px-4 py-3 text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white focus:ring-0 transition-all"
              />
            ) : (
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="https://example.com/landing-page"
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white/90 pl-11 pr-4 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white focus:ring-0 transition-all"
                />
              </div>
            )}

            <div className="mt-4">
              <div className="flex items-baseline justify-between mb-2 gap-3">
                <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-medium">
                  Target platforms
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-[11px] text-gray-400">
                    Pick at least one — we&apos;ll check your copy against its
                    policies
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setPlatforms(
                        platforms.length === PLATFORMS.length
                          ? []
                          : PLATFORMS.map((p) => p.value)
                      )
                    }
                    className="text-[11px] font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-900 transition-colors"
                  >
                    {platforms.length === PLATFORMS.length
                      ? "Clear"
                      : "Select all"}
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => {
                  const on = platforms.includes(p.value)
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() =>
                        setPlatforms((prev) =>
                          prev.includes(p.value)
                            ? prev.filter((x) => x !== p.value)
                            : [...prev, p.value]
                        )
                      }
                      className={`group flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-2xl transition-all ${
                        on
                          ? `${p.tint.bg} shadow-sm`
                          : "bg-white/70 hover:bg-white"
                      }`}
                    >
                      <span
                        className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                        style={{
                          backgroundColor: on ? p.color : `${p.color}1f`,
                        }}
                      >
                        {p.value === "meta" && (
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill={on ? "white" : p.color}
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        )}
                        {p.value === "google" && (
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                              fill={on ? "white" : "#4285F4"}
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill={on ? "white" : "#34A853"}
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill={on ? "white" : "#FBBC05"}
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill={on ? "white" : "#EA4335"}
                            />
                          </svg>
                        )}
                        {p.value === "taboola" && (
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <rect
                              x="2"
                              y="4"
                              width="20"
                              height="16"
                              rx="2"
                              fill={on ? "white" : p.color}
                            />
                            <path
                              d="M7 8h3l2 4-2 4H7l2-4-2-4zM14 8h3v8h-3z"
                              fill={on ? p.color : "white"}
                            />
                          </svg>
                        )}
                        {on && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white shadow flex items-center justify-center">
                            <Check
                              className="w-2.5 h-2.5"
                              style={{ color: p.color }}
                              strokeWidth={4}
                            />
                          </span>
                        )}
                      </span>
                      <span
                        className={`text-[13px] font-medium transition-colors ${
                          on ? p.tint.text : "text-gray-700"
                        }`}
                      >
                        {p.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              {!result && !loading ? (
                <button
                  type="button"
                  onClick={() => {
                    setInput(SAMPLE_ADS[sampleIndex])
                    setSampleIndex((i) => (i + 1) % SAMPLE_ADS.length)
                  }}
                  className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Try a sample ({sampleIndex + 1}/{SAMPLE_ADS.length}) →
                </button>
              ) : (
                <span />
              )}
              <button
                type="submit"
                disabled={!canRun || loading}
                className="ml-auto inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium pl-5 pr-1.5 py-1.5 rounded-full hover:bg-gray-800 disabled:opacity-30 transition-all"
              >
                <span className="px-1.5">
                  {loading ? stage || "Scanning…" : "Run compliance scan"}
                </span>
                {loading ? (
                  <span className="w-9 h-9 rounded-full bg-white/10 inline-flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </span>
                ) : (
                  <span className="w-9 h-9 rounded-full bg-white/10 inline-flex items-center justify-center">
                    <ArrowUp className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </span>
                <button
                  onClick={() => setError("")}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Dismiss
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* RESULTS */}
      {result && score && (
        <div className="relative z-[2] max-w-3xl mx-auto px-5 sm:px-8 pb-20">
          {/* Score card */}
          <div className="animate-fade-up flex flex-col sm:flex-row items-stretch sm:items-center gap-5 rounded-3xl bg-white/90 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] px-6 sm:px-8 py-6 mb-8">
            <div
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ${score.bg} ${score.border} ring-1`}
            >
              <span
                className={`text-4xl font-semibold tracking-tight ${score.text}`}
              >
                {result.riskScore}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${score.text}`}
                >
                  {score.label}
                </span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">risk score / 100</span>
              </div>
              <p className="text-[15px] text-gray-700">
                {result.violations.length === 0
                  ? "No violations detected. Ship with confidence."
                  : `${result.violations.length} violation${result.violations.length > 1 ? "s" : ""} found across ${platforms.length} platform${platforms.length > 1 ? "s" : ""}`}
              </p>
              <p className="text-[13px] text-gray-400 mt-1">
                Score is the maximum risk across selected platforms.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              <span className="text-[12px] text-gray-500">
                Analysis complete
              </span>
            </div>
          </div>

          {/* Violations */}
          {result.violations.length > 0 && (
            <section className="mb-12">
              <div className="flex items-end justify-between mb-5">
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                  Violations
                </h2>
                <span className="text-[12px] text-gray-400">
                  {result.violations.length} flagged
                </span>
              </div>
              <div className="space-y-3">
                {result.violations.map((v, i) => {
                  const isRed = v.level === "Red"
                  return (
                    <div
                      key={i}
                      className={`animate-fade-up rounded-2xl ring-1 p-4 sm:p-5 bg-white/90 backdrop-blur-xl ${
                        isRed ? "ring-red-200/60" : "ring-amber-200/60"
                      }`}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle
                          className={`w-4 h-4 mt-0.5 shrink-0 ${isRed ? "text-red-500" : "text-amber-500"}`}
                        />
                        <div className="min-w-0 flex-1">
                          <code
                            className={`text-sm font-medium px-1.5 py-0.5 rounded break-words inline-block ${
                              isRed
                                ? "text-red-700 bg-red-100"
                                : "text-amber-700 bg-amber-100"
                            }`}
                          >
                            &ldquo;{v.text}&rdquo;
                          </code>
                          <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
                            {v.reason}
                          </p>
                        </div>
                        <span
                          className={`ml-auto shrink-0 text-[11px] font-semibold uppercase tracking-wider ${
                            isRed ? "text-red-500" : "text-amber-500"
                          }`}
                        >
                          {isRed ? "Critical" : "Warning"}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Variants */}
          {result.variants.length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                    Safe rewrites
                  </h2>
                  <p className="text-[13px] text-gray-500 mt-1">
                    Same hook. Eight different techniques. Zero banned-account
                    regret.
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      result.variants.map((v) => v.text).join("\n\n")
                    )
                  }
                  className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy all
                </button>
              </div>
              <div className="space-y-4">
                {result.variants.map((v, i) => (
                  <div
                    key={i}
                    className="animate-fade-up group rounded-2xl bg-white/90 backdrop-blur-xl ring-1 ring-white/40 hover:ring-gray-200 p-5 transition-all"
                    style={{ animationDelay: `${i * 100 + 200}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 text-[11px] font-mono font-semibold text-gray-500">
                        {i + 1}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Compliance
                        <span className="font-mono font-medium text-emerald-600 ml-1">
                          {v.complianceScore}%
                        </span>
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Hook
                        <span className="font-mono font-medium text-gray-700 ml-1">
                          {v.hookPreservation}%
                        </span>
                      </span>
                      <div className="ml-auto">
                        <CopyBtn text={v.text} />
                      </div>
                    </div>
                    <p className="text-[15px] leading-relaxed text-gray-800 border-l-2 border-gray-200 pl-4 group-hover:border-gray-900 transition-colors">
                      {v.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All clear */}
          {result.violations.length === 0 && result.variants.length === 0 && (
            <div className="text-center py-16">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center mx-auto mb-5">
                <Shield className="w-7 h-7 text-emerald-500" />
              </div>
              <p className="text-xl font-medium text-gray-900">All clear</p>
              <p className="text-sm text-gray-500 mt-1.5">
                Ship this ad with confidence.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
