"use client"

import { useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  Globe,
  FileText,
  Link2,
  Check,
  ClipboardPaste,
} from "lucide-react"
import type { Platform } from "@/types"

interface AnalyzerFormProps {
  mode: "text" | "url"
  setMode: (m: "text" | "url") => void
  input: string
  setInput: (s: string) => void
  platforms: Platform[]
  setPlatforms: (p: Platform[]) => void
  loading: boolean
  error: string
  onSubmit: (e: React.FormEvent) => void
  onClearError: () => void
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
    color: "#1E5BD9",
    tint: {
      bg: "bg-blue-50",
      border: "border-blue-300",
      text: "text-blue-700",
    },
  },
  {
    value: "tiktok",
    label: "TikTok",
    color: "#000000",
    tint: { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-900" },
  },
]

const SAMPLE_ADS = [
  "Guaranteed $500/day with this one weird trick! Limited time offer — only 3 spots left. Click now before your financial freedom disappears forever. Risk-free. 100% success rate.",
  "Lose 30 pounds in 7 days with no diet or exercise! Doctors hate this one weird trick. Click here to discover the secret that celebrities don't want you to know. Free trial — act now!",
  "Make $10,000 a week working from home! No experience needed. This revolutionary system has helped thousands quit their jobs. Limited spots — don't miss your financial freedom. 100% guaranteed.",
  "Exclusive investment opportunity! Turn $250 into $12,500 in 30 days, guaranteed. Our AI trading bot has a 97% success rate. Join the 50,000+ members already earning passive income. Limited spots — sign up now before this offer ends!",
]

const SAMPLE_URLS = [
  "https://www.linear.app",
  "https://www.notion.so/product",
  "https://www.stripe.com",
  "https://www.figma.com",
]

function normalizeUrl(raw: string): string {
  return raw.match(/^https?:\/\//) ? raw : `https://${raw}`
}

async function pasteFromClipboard(setInput: (s: string) => void) {
  try {
    const text = await navigator.clipboard.readText()
    if (text) setInput(text)
  } catch {
    // ignore — user may have denied clipboard permission
  }
}

export default function AnalyzerForm({
  mode,
  setMode,
  input,
  setInput,
  platforms,
  setPlatforms,
  loading,
  error,
  onSubmit,
  onClearError,
}: AnalyzerFormProps) {
  const [sampleIndex, setSampleIndex] = useState(0)
  const [sampleUrlIndex, setSampleUrlIndex] = useState(0)
  const canRun = input.trim().length > 0 && platforms.length > 0

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="inline-flex items-center gap-1 bg-gray-200/80 rounded-full p-1">
          {[
            { value: "url", label: "Landing page", icon: Link2 },
            { value: "text", label: "Ad copy", icon: FileText },
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
                    ? "bg-orange-500 text-white shadow-sm"
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
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your ad headline, body copy, and CTA…"
            rows={4}
            className="w-full resize-y rounded-2xl border-2 border-gray-200 bg-white/90 px-4 py-3 pr-14 text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white focus:ring-0 transition-all"
          />
          <button
            type="button"
            onClick={() => pasteFromClipboard(setInput)}
            className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-lg bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-600 px-2.5 py-1.5 text-[12px] font-medium transition-colors"
            aria-label="Paste from clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            Paste
          </button>
        </div>
      ) : (
        <div className="relative">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={(e) => setInput(normalizeUrl(e.target.value.trim()))}
            placeholder="https://example.com/landing-page"
            className="w-full rounded-2xl border-2 border-gray-200 bg-white/90 pl-11 pr-24 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white focus:ring-0 transition-all"
          />
          <button
            type="button"
            onClick={() => pasteFromClipboard(setInput)}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-lg bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-600 px-2.5 py-1.5 text-[12px] font-medium transition-colors"
            aria-label="Paste from clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            Paste
          </button>
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
                  setPlatforms(
                    on
                      ? platforms.filter((x) => x !== p.value)
                      : [...platforms, p.value]
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
                        width="24"
                        height="24"
                        rx="5"
                        fill={on ? "white" : p.color}
                      />
                      <ellipse
                        cx="8.5"
                        cy="9"
                        rx="2.4"
                        ry="3"
                        fill={on ? p.color : "white"}
                      />
                      <ellipse
                        cx="15.5"
                        cy="9"
                        rx="2.4"
                        ry="3"
                        fill={on ? p.color : "white"}
                      />
                      <path
                        d="M 5.5 14 Q 12 20 18.5 14 L 18.5 16 Q 12 22 5.5 16 Z"
                        fill={on ? p.color : "white"}
                      />
                    </svg>
                  )}
                  {p.value === "tiktok" && (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <g transform="translate(-1 0)">
                        <path
                          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.892 2.892 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.932 2.932 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"
                          fill="#25F4EE"
                          opacity={on ? 0 : 1}
                        />
                      </g>
                      <g transform="translate(1 0)">
                        <path
                          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.892 2.892 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.932 2.932 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"
                          fill="#FE2C55"
                          opacity={on ? 0 : 1}
                        />
                      </g>
                      <path
                        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.892 2.892 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.932 2.932 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"
                        fill={on ? "white" : "#000"}
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
        {mode === "text" ? (
          <button
            type="button"
            onClick={() => {
              setInput(SAMPLE_ADS[sampleIndex])
              setSampleIndex((i) => (i + 1) % SAMPLE_ADS.length)
            }}
            className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors"
          >
            Try a sample ad ({sampleIndex + 1}/{SAMPLE_ADS.length}) →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setInput(SAMPLE_URLS[sampleUrlIndex])
              setSampleUrlIndex((i) => (i + 1) % SAMPLE_URLS.length)
            }}
            className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors"
          >
            Try a sample URL ({sampleUrlIndex + 1}/{SAMPLE_URLS.length}) →
          </button>
        )}
        <button
          type="submit"
          disabled={!canRun || loading}
          className="group ml-auto inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium pl-5 pr-1.5 py-1.5 rounded-full hover:bg-black disabled:opacity-30 transition-all duration-300"
        >
          <span className="px-1.5 transition-transform duration-300 group-hover:translate-x-0.5">
            Run compliance scan
          </span>
          <span className="w-8 h-8 rounded-full bg-orange-500 text-white inline-flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </span>
          <button
            type="button"
            onClick={onClearError}
            className="text-xs text-red-400 hover:text-red-600"
          >
            Dismiss
          </button>
        </div>
      )}
    </form>
  )
}
