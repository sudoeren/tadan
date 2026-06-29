"use client"

import { useState } from "react"
import {
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Check,
  Copy,
  FileEdit,
  Globe,
  ShieldCheck,
} from "lucide-react"
import type { Platform, Violation, PositiveAspect } from "@/types"
import { cn } from "@/lib/utils"

interface Variant {
  text: string
  parts?: { headline: string; body: string; cta: string }
  complianceScore: number
  hookPreservation: number
}

interface Result {
  id: string
  riskScore: number
  violations: Violation[]
  positiveAspects: PositiveAspect[]
  variants: Variant[]
}

interface ScanResultProps {
  result: Result
  platforms: Platform[]
  onScanAnother: () => void
}

type Tone = "red" | "amber" | "green" | "neutral"

const TONE_CLASS: Record<Tone, { bg: string; ring: string; text: string; iconBg: string }> = {
  red: {
    bg: "bg-red-50",
    ring: "ring-red-200/70",
    text: "text-red-700",
    iconBg: "bg-red-500",
  },
  amber: {
    bg: "bg-amber-50",
    ring: "ring-amber-200/70",
    text: "text-amber-700",
    iconBg: "bg-amber-500",
  },
  green: {
    bg: "bg-emerald-50",
    ring: "ring-emerald-200/70",
    text: "text-emerald-700",
    iconBg: "bg-emerald-500",
  },
  neutral: {
    bg: "bg-gray-50",
    ring: "ring-gray-200/70",
    text: "text-gray-700",
    iconBg: "bg-gray-700",
  },
}

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      type="button"
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
      {ok ? "Copied" : label}
    </button>
  )
}

function ScoreGauge({ score }: { score: number }) {
  const s = scoreColor(score)
  const radius = 76
  const strokeWidth = 10
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const dashoffset = circumference - (score / 100) * circumference
  const dims = radius * 2

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dims}
          height={dims}
          className="-rotate-90"
        >
          <circle
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            className={cn("transition-colors duration-700", s.strokeTrack)}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            className={cn("animate-gauge-fill", s.strokeFill)}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={
              {
                "--gauge-circumference": circumference,
                "--gauge-target": dashoffset,
              } as React.CSSProperties
            }
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-5xl sm:text-[56px] font-semibold tracking-tight leading-none", s.text)}>
            {score}
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mt-1.5">
            / 100
          </span>
        </div>
      </div>
      <div className="mt-3 inline-flex items-center gap-1.5">
        <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
        <span className={cn("text-[12px] font-semibold uppercase tracking-wider", s.text)}>
          {s.label}
        </span>
      </div>
    </div>
  )
}

function scoreColor(n: number) {
  if (n <= 25)
    return {
      text: "text-emerald-700",
      strokeTrack: "stroke-emerald-100",
      strokeFill: "stroke-emerald-500",
      label: "Clean",
      dot: "bg-emerald-500",
    }
  if (n <= 60)
    return {
      text: "text-amber-700",
      strokeTrack: "stroke-amber-100",
      strokeFill: "stroke-amber-500",
      label: "Needs review",
      dot: "bg-amber-500",
    }
  if (n <= 85)
    return {
      text: "text-orange-700",
      strokeTrack: "stroke-orange-100",
      strokeFill: "stroke-orange-500",
      label: "Risky",
      dot: "bg-orange-500",
    }
  return {
    text: "text-red-700",
    strokeTrack: "stroke-red-100",
    strokeFill: "stroke-red-500",
    label: "Bannable",
    dot: "bg-red-500",
  }
}

interface BulletItem {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  sublabel?: string
  value: string
  tone: Tone
}

function BulletCard({ item }: { item: BulletItem }) {
  const tone = TONE_CLASS[item.tone]
  const Icon = item.icon
  return (
    <div
      className={cn(
        "rounded-2xl p-4 flex items-center gap-3.5 ring-1",
        tone.bg,
        tone.ring
      )}
    >
      <div
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm",
          tone.iconBg
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-gray-900 leading-tight">
          {item.label}
        </p>
        {item.sublabel && (
          <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
            {item.sublabel}
          </p>
        )}
      </div>
      <div
        className={cn(
          "text-2xl font-bold tabular-nums leading-none shrink-0",
          tone.text
        )}
      >
        {item.value}
      </div>
    </div>
  )
}

function VariantCard({ variant, index }: { variant: Variant; index: number }) {
  const hasParts = variant.parts && (variant.parts.headline || variant.parts.body || variant.parts.cta)
  const headline = variant.parts?.headline || ""
  const body = variant.parts?.body || ""
  const cta = variant.parts?.cta || ""

  return (
    <div
      className="animate-fade-up rounded-2xl bg-white/90 ring-1 ring-white/40 hover:ring-gray-200 p-4 transition-all"
      style={{ animationDelay: `${index * 80 + 150}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 text-[11px] font-mono font-semibold text-gray-500">
          {index + 1}
        </span>
        <span className="text-[11px] text-gray-400">
          Compliance
          <span className="font-mono font-medium text-emerald-600 ml-1">
            {variant.complianceScore}%
          </span>
        </span>
        <span className="text-[11px] text-gray-400">
          Hook
          <span className="font-mono font-medium text-gray-700 ml-1">
            {variant.hookPreservation}%
          </span>
        </span>
        <div className="ml-auto">
          <CopyBtn text={variant.text} label="Copy all" />
        </div>
      </div>

      {hasParts ? (
        <div className="space-y-3">
          {headline && (
            <div className="rounded-xl bg-orange-50/60 ring-1 ring-orange-200/50 px-3.5 py-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-[0.15em] text-orange-600 font-semibold">
                  Headline
                </span>
                <CopyBtn text={headline} label="Copy" />
              </div>
              <p className="text-[14px] font-semibold text-gray-900 leading-snug">
                {headline}
              </p>
            </div>
          )}
          {body && (
            <div className="rounded-xl bg-white ring-1 ring-gray-200/70 px-3.5 py-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold">
                  Body
                </span>
                <CopyBtn text={body} label="Copy" />
              </div>
              <p className="text-[14px] text-gray-800 leading-relaxed whitespace-pre-line">
                {body}
              </p>
            </div>
          )}
          {cta && (
            <div className="rounded-xl bg-emerald-50/60 ring-1 ring-emerald-200/50 px-3.5 py-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-[0.15em] text-emerald-700 font-semibold">
                  CTA
                </span>
                <CopyBtn text={cta} label="Copy" />
              </div>
              <p className="text-[14px] font-medium text-gray-900 leading-snug">
                {cta}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[14px] leading-relaxed text-gray-800 border-l-2 border-gray-200 pl-3.5">
          {variant.text}
        </p>
      )}
    </div>
  )
}

export default function ScanResult({ result, platforms, onScanAnother }: ScanResultProps) {
  const criticalCount = result.violations.filter((v) => v.level === "Red").length
  const warningCount = result.violations.filter(
    (v) => v.level !== "Red"
  ).length
  const allClear = result.violations.length === 0 && result.variants.length === 0

  const bullets: BulletItem[] = []
  if (result.violations.length > 0) {
    bullets.push({
      icon: AlertTriangle,
      label: "Critical violations",
      sublabel: `flagged across ${platforms.length} platform${platforms.length !== 1 ? "s" : ""}`,
      value: String(criticalCount),
      tone: criticalCount > 0 ? "red" : "neutral",
    })
    if (warningCount > 0) {
      bullets.push({
        icon: AlertCircle,
        label: "Warnings",
        sublabel: "minor policy concerns",
        value: String(warningCount),
        tone: "amber",
      })
    }
  } else {
    bullets.push({
      icon: ShieldCheck,
      label: "Violations found",
      sublabel: "clean across all platforms",
      value: "0",
      tone: "green",
    })
  }
  bullets.push({
    icon: FileEdit,
    label: "Safe variants generated",
    sublabel: "compliant rewrites",
    value: String(result.variants.length),
    tone: result.variants.length > 0 ? "green" : "neutral",
  })
  bullets.push({
    icon: Globe,
    label: "Platforms checked",
    sublabel: "policies scanned",
    value: String(platforms.length),
    tone: "neutral",
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-5 lg:gap-6 items-stretch">
        <div className="flex justify-center lg:justify-start">
          <ScoreGauge score={result.riskScore} />
        </div>

        <div className="min-w-0 flex flex-col gap-2.5">
          {bullets.map((b, i) => (
            <BulletCard key={i} item={b} />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onScanAnother}
          className="group inline-flex items-center gap-2 bg-gray-900 text-white text-[13px] font-medium pl-5 pr-1.5 py-1.5 rounded-full hover:bg-black transition-all duration-300"
        >
          <span className="px-1.5 transition-transform duration-300 group-hover:translate-x-0.5">
            New scan
          </span>
          <span className="w-7 h-7 rounded-full bg-orange-500 text-white inline-flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

      {result.violations.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight">
              Violations
            </h2>
            <span className="text-[12px] text-gray-400">
              {result.violations.length} flagged
            </span>
          </div>
          <div className="space-y-2.5">
            {result.violations.map((v, i) => {
              const isRed = v.level === "Red"
              return (
                <div
                  key={i}
                  className={cn(
                    "animate-fade-up rounded-2xl ring-1 p-4 bg-white/90",
                    isRed ? "ring-red-200/60" : "ring-amber-200/60"
                  )}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={cn(
                        "w-4 h-4 mt-0.5 shrink-0",
                        isRed ? "text-red-500" : "text-amber-500"
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <code
                        className={cn(
                          "text-[13px] font-medium px-1.5 py-0.5 rounded break-words inline-block",
                          isRed
                            ? "text-red-700 bg-red-100"
                            : "text-amber-700 bg-amber-100"
                        )}
                      >
                        &ldquo;{v.text}&rdquo;
                      </code>
                      <p className="text-[13px] text-gray-600 mt-1.5 leading-relaxed">
                        {v.reason}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "ml-auto shrink-0 text-[10px] font-semibold uppercase tracking-wider",
                        isRed ? "text-red-500" : "text-amber-500"
                      )}
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

      {result.variants.length > 0 && (
        <section>
          <div className="mb-3">
            <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight">
              Safe rewrites
            </h2>
            <p className="text-[12px] text-gray-500 mt-0.5">
              Same hook. Different techniques. Zero banned-account regret.
            </p>
          </div>
          <div className="space-y-3">
            {result.variants.map((v, i) => (
              <VariantCard key={i} variant={v} index={i} />
            ))}
          </div>
        </section>
      )}

      {allClear && result.positiveAspects.length > 0 && (
        <section>
          <div className="mb-3">
            <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight">
              Why this passed
            </h2>
            <p className="text-[12px] text-gray-500 mt-0.5">
              What our critic agent verified from your actual ad.
            </p>
          </div>
          <div className="rounded-2xl bg-white/90 ring-1 ring-gray-200/70 p-4">
            <ul className="divide-y divide-gray-100">
              {result.positiveAspects.map((item, i, arr) => (
                <li
                  key={i}
                  className={cn(
                    "flex items-start gap-3 py-3",
                    i === arr.length - 1 && "pb-0"
                  )}
                >
                  <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check
                      className="h-3.5 w-3.5 text-white"
                      strokeWidth={3}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900 leading-tight">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
