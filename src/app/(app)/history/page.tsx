"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Shield,
  AlertTriangle,
  Check,
  Loader2,
  ArrowUpRight,
  FileText,
  Link2,
  ArrowUp,
} from "lucide-react"
import type { AnalysisRecord } from "@/types"
import { NavBar } from "@/components/nav-bar"

const PLATFORM_COLORS: Record<string, string> = {
  meta: "#1877F2",
  google: "#4285F4",
  taboola: "#6C2BD9",
}

function scoreColor(n: number) {
  if (n <= 25) return "text-emerald-600 bg-emerald-50 ring-emerald-200"
  if (n <= 60) return "text-amber-600 bg-amber-50 ring-amber-200"
  if (n <= 85) return "text-orange-600 bg-orange-50 ring-orange-200"
  return "text-red-600 bg-red-50 ring-red-200"
}

export default function HistoryPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "flagged" | "clean">("all")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/history")
        if (res.ok) {
          const data = await res.json()
          setRecords(data.records || [])
        }
      } catch {
        // graceful fail
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = records.filter((r) => {
    if (filter === "all") return true
    if (filter === "flagged") return (r.riskScore ?? 0) > 60
    return (r.riskScore ?? 0) <= 60
  })

  return (
    <div
      className="relative min-h-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85)`,
      }}
    >
      <NavBar variant="transparent" />
      <div className="pointer-events-none absolute inset-0 hero-overlay z-[1]" />

      {/* HERO */}
      <div className="relative z-[2] flex flex-col items-center text-center px-5 pt-32 sm:pt-44 pb-8">
        <div className="animate-fade-down inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-md ring-1 ring-gray-200 px-3 py-1.5 mb-6">
          <Shield className="w-3.5 h-3.5 text-gray-700" />
          <span className="text-[12px] text-gray-700 font-medium">
            Compliance log
          </span>
        </div>
        <h1 className="text-gray-900 font-normal leading-[1.02] tracking-[-0.04em] text-[44px] min-[400px]:text-[48px] sm:text-[68px] lg:text-[80px] xl:text-[92px] max-w-4xl">
          <span className="block animate-fade-up">Your past</span>
          <span className="block animate-fade-up [animation-delay:100ms]">
            scans.
          </span>
        </h1>
        <p className="animate-fade-up [animation-delay:220ms] text-gray-600 text-base sm:text-lg mt-5 max-w-xl leading-relaxed">
          Every ad you&apos;ve checked. Every verdict we gave. Every rewrite
          we generated. All in one place.
        </p>
      </div>

      {/* CONTENT CARD */}
      <div className="relative z-[2] px-5 sm:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="animate-fade-up [animation-delay:340ms] rounded-3xl bg-white/85 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-6 sm:p-8">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading scans…
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="h-14 w-14 rounded-2xl bg-gray-50 ring-1 ring-gray-200 flex items-center justify-center mb-5">
                  <FileText className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-[15px] text-gray-900 font-medium mb-1">
                  No analyses yet
                </p>
                <p className="text-sm text-gray-500 mb-6 max-w-xs">
                  Run your first compliance scan and the full audit log will
                  show up here.
                </p>
                <Link
                  href="/analyzer"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium pl-5 pr-1.5 py-1.5 rounded-full hover:bg-gray-800 transition-all"
                >
                  <span className="px-1.5">Start scanning</span>
                  <span className="w-9 h-9 rounded-full bg-white/10 inline-flex items-center justify-center">
                    <ArrowUp className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            ) : (
              <>
                {/* Filters */}
                <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                  <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full p-1">
                    {[
                      {
                        value: "all",
                        label: `All (${records.length})`,
                      },
                      { value: "flagged", label: "Flagged" },
                      { value: "clean", label: "Clean" },
                    ].map((opt) => {
                      const active = filter === opt.value
                      return (
                        <button
                          key={opt.value}
                          onClick={() =>
                            setFilter(opt.value as "all" | "flagged" | "clean")
                          }
                          className={`px-3.5 py-1.5 text-[12px] font-medium rounded-full transition-all ${
                            active
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                  <span className="text-[12px] text-gray-400">
                    Showing {filtered.length} of {records.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {filtered.map((r, i) => {
                    const score = r.riskScore ?? 0
                    return (
                      <Link
                        key={r.id}
                        href={`/analyzer?scan=${r.id}`}
                        className="animate-fade-up block rounded-2xl ring-1 ring-gray-200 hover:ring-gray-300 p-4 sm:p-5 transition-all bg-white/70"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-semibold ring-1 ${scoreColor(score)}`}
                          >
                            {score}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              {r.inputType === "url" ? (
                                <Link2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              ) : (
                                <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              )}
                              <p className="text-[14px] text-gray-900 truncate font-medium">
                                {r.rawContent}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 text-[12px] text-gray-500 flex-wrap">
                              <span
                                className="inline-flex items-center gap-1.5"
                                style={{
                                  color: PLATFORM_COLORS[r.platform] || "#6b7280",
                                }}
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{
                                    background:
                                      PLATFORM_COLORS[r.platform] || "#6b7280",
                                  }}
                                />
                                {r.platform}
                              </span>
                              <span className="text-gray-300">·</span>
                              <span>
                                {new Date(r.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                              {r.violations && r.violations.length > 0 && (
                                <>
                                  <span className="text-gray-300">·</span>
                                  <span className="inline-flex items-center gap-1 text-amber-600">
                                    <AlertTriangle className="w-3 h-3" />
                                    {r.violations.length} violation
                                    {r.violations.length !== 1 ? "s" : ""}
                                  </span>
                                </>
                              )}
                              {r.variants && r.variants.length > 0 && (
                                <>
                                  <span className="text-gray-300">·</span>
                                  <span className="inline-flex items-center gap-1 text-emerald-600">
                                    <Check className="w-3 h-3" />
                                    {r.variants.length} variant
                                    {r.variants.length !== 1 ? "s" : ""}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors shrink-0 mt-1" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
