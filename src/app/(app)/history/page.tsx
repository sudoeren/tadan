"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Shield, AlertTriangle, Check, Loader2, ArrowUpRight, FileText, Link2 } from "lucide-react"
import type { AnalysisRecord } from "@/types"

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
        // graceful fail — show empty state
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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50">
      {/* Header */}
      <section className="relative bg-cover bg-center overflow-hidden border-b border-gray-100">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85)`,
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28 text-center">
          <div className="animate-fade-down inline-flex items-center gap-2 mb-5 rounded-full bg-white/70 backdrop-blur-md ring-1 ring-gray-200 px-3.5 py-1.5">
            <Shield className="w-3.5 h-3.5 text-gray-700" />
            <span className="text-[12px] text-gray-700 font-medium">
              Compliance log
            </span>
          </div>
          <h1 className="animate-fade-up text-gray-900 font-normal leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl">
            Your past scans
          </h1>
          <p className="animate-fade-up [animation-delay:100ms] text-gray-600 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            Every ad you&apos;ve checked. Every verdict we gave. Every rewrite we
            generated. All in one place.
          </p>
        </div>
        <img
          src="https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png"
          alt=""
          className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none opacity-50"
        />
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 -mt-8 relative z-10 pb-20">
        <div className="animate-fade-up [animation-delay:220ms] rounded-3xl bg-white/90 backdrop-blur-xl ring-1 ring-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-5 sm:p-7">
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
                Run your first compliance scan and the full audit log will show up here.
              </p>
              <Link
                href="/analyzer"
                className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
              >
                Start scanning
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full p-1">
                  {[
                    { value: "all", label: `All (${records.length})` },
                    { value: "flagged", label: "Flagged" },
                    { value: "clean", label: "Clean" },
                  ].map((opt) => {
                    const active = filter === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setFilter(opt.value as "all" | "flagged" | "clean")}
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
                    <div
                      key={r.id}
                      className="animate-fade-up group rounded-2xl ring-1 ring-gray-200 hover:ring-gray-300 p-4 sm:p-5 transition-all cursor-pointer"
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
                          <div className="flex items-center gap-3 text-[12px] text-gray-500">
                            <span
                              className="inline-flex items-center gap-1.5"
                              style={{ color: PLATFORM_COLORS[r.platform] || "#6b7280" }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: PLATFORM_COLORS[r.platform] || "#6b7280" }}
                              />
                              {r.platform}
                            </span>
                            <span className="text-gray-300">·</span>
                            <span>
                              {new Date(r.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
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
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
