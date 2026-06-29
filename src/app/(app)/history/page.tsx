"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useSession } from "@/lib/auth-client"
import {
  AlertTriangle,
  Check,
  Loader2,
  ArrowUpRight,
  FileText,
  Link2,
  ArrowRight,
  ListFilter,
  Flag,
  ShieldCheck,
  Trash2,
  X,
  CheckSquare,
  Square,
} from "lucide-react"
import type { AnalysisRecord } from "@/types"
import { NavBar } from "@/components/nav-bar"
import { SignInRequired } from "@/components/sign-in-required"

const PLATFORM_COLORS: Record<string, string> = {
  meta: "#1877F2",
  google: "#EA4335",
  taboola: "#6C2BD9",
  tiktok: "#000000",
}

function scoreColor(n: number) {
  if (n <= 25) return "text-emerald-600 bg-emerald-50 ring-emerald-200"
  if (n <= 60) return "text-amber-600 bg-amber-50 ring-amber-200"
  if (n <= 85) return "text-orange-600 bg-orange-50 ring-orange-200"
  return "text-red-600 bg-red-50 ring-red-200"
}

export default function HistoryPage() {
  const { data: session, isPending: sessionPending } = useSession()
  const [records, setRecords] = useState<AnalysisRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "flagged" | "clean">("all")
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set())

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

  const filtered = useMemo(
    () =>
      records.filter((r) => {
        if (filter === "all") return true
        if (filter === "flagged") return (r.riskScore ?? 0) > 60
        return (r.riskScore ?? 0) <= 60
      }),
    [records, filter]
  )

  const visibleFiltered = useMemo(
    () => filtered.filter((r) => !removedIds.has(r.id)),
    [filtered, removedIds]
  )

  const allSelected =
    visibleFiltered.length > 0 &&
    visibleFiltered.every((r) => selectedIds.has(r.id))

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(visibleFiltered.map((r) => r.id)))
    }
  }

  function exitSelection() {
    setSelectionMode(false)
    setSelectedIds(new Set())
  }

  async function handleDelete() {
    if (selectedIds.size === 0) return
    const count = selectedIds.size
    const confirmed = window.confirm(
      `Delete ${count} scan${count !== 1 ? "s" : ""}? This cannot be undone.`
    )
    if (!confirmed) return

    setDeleting(true)
    try {
      const res = await fetch(
        `/api/history?ids=${Array.from(selectedIds).join(",")}`,
        { method: "DELETE" }
      )
      if (!res.ok) throw new Error("Delete failed")
      setRemovedIds((prev) => {
        const next = new Set(prev)
        for (const id of selectedIds) next.add(id)
        return next
      })
      setRecords((prev) =>
        prev.filter((r) => !selectedIds.has(r.id))
      )
      setSelectedIds(new Set())
      setSelectionMode(false)
      setTimeout(() => {
        setRemovedIds(new Set())
      }, 600)
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Failed to delete scans"
      )
    } finally {
      setDeleting(false)
    }
  }

  if (!sessionPending && !session) {
    return (
      <SignInRequired message="Your scan history is saved to your account. Sign in to view it." />
    )
  }

  return (
    <div className="relative min-h-screen">
      <NavBar variant="transparent" />

      {/* HERO — compact */}
      <section className="relative z-[2] flex flex-col items-center text-center px-5 pt-24 sm:pt-32 pb-6 sm:pb-8">
        <div className="animate-fade-down inline-flex items-center gap-1.5 rounded-full bg-white/30 backdrop-blur-xl ring-1 ring-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_4px_20px_rgba(0,0,0,0.04)] px-3.5 py-1.5 mb-4">
          <span className="text-[12px] text-gray-700 font-medium">
            Compliance log
          </span>
        </div>
        <h1 className="text-gray-900 font-normal leading-[1.05] tracking-[-0.03em] text-[36px] min-[400px]:text-[40px] sm:text-[56px] lg:text-[64px] max-w-3xl">
          <span className="block animate-fade-up">Your past</span>
          <span className="block animate-fade-up [animation-delay:100ms]">
            scans.
          </span>
        </h1>
        <p className="animate-fade-up [animation-delay:220ms] text-gray-600 text-sm sm:text-base mt-3 max-w-md leading-relaxed">
          Every ad you&apos;ve checked. Every verdict we gave. Every rewrite
          we generated.
        </p>
      </section>

      {/* CONTENT CARD */}
      <div className="relative z-[2] px-5 sm:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="animate-fade-up [animation-delay:340ms] rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-5 sm:p-7">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading scans…
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="h-12 w-12 rounded-2xl bg-gray-50 ring-1 ring-gray-200 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-[15px] text-gray-900 font-medium mb-1">
                  No analyses yet
                </p>
                <p className="text-sm text-gray-500 mb-5 max-w-xs">
                  Run your first compliance scan and the full audit log will
                  show up here.
                </p>
                <Link
                  href="/analyzer"
                  className="group inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium pl-5 pr-1.5 py-1.5 rounded-full hover:bg-black transition-all duration-300"
                >
                  <span className="px-1.5 transition-transform duration-300 group-hover:translate-x-0.5">
                    Start scanning
                  </span>
                  <span className="w-8 h-8 rounded-full bg-orange-500 text-white inline-flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            ) : (
              <>
                {selectionMode ? (
                  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap p-3 rounded-2xl bg-orange-50 ring-1 ring-orange-200/60">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={toggleSelectAll}
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 hover:text-gray-900"
                      >
                        {allSelected ? (
                          <CheckSquare className="w-4 h-4 text-orange-500" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                        {allSelected ? "Deselect all" : "Select all"}
                      </button>
                      <span className="text-[13px] text-gray-500">
                        {selectedIds.size} selected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={exitSelection}
                        disabled={deleting}
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-full disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={selectedIds.size === 0 || deleting}
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-red-500 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {deleting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                    <div className="inline-flex items-center gap-1 bg-gray-200/80 rounded-full p-1">
                      {[
                        {
                          value: "all",
                          label: `All (${records.length})`,
                          icon: ListFilter,
                        },
                        { value: "flagged", label: "Flagged", icon: Flag },
                        { value: "clean", label: "Clean", icon: ShieldCheck },
                      ].map((opt) => {
                        const Icon = opt.icon
                        const active = filter === opt.value
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setFilter(opt.value as "all" | "flagged" | "clean")
                            }
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
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] text-gray-400">
                        Showing {visibleFiltered.length} of {records.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectionMode(true)}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-900 px-2.5 py-1.5 rounded-full transition-colors"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        Select
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {visibleFiltered.map((r, i) => {
                    const score = r.riskScore ?? 0
                    const isSelected = selectedIds.has(r.id)
                    const isRemoving = removedIds.has(r.id)
                    return (
                      <div
                        key={r.id}
                        className="relative animate-fade-up"
                        style={{
                          animationDelay: `${i * 60}ms`,
                          ...(isRemoving && { opacity: 0, transform: "scale(0.96)" }),
                          transition: "opacity 400ms, transform 400ms",
                        }}
                      >
                        {selectionMode ? (
                          <div
                            onClick={() => toggleSelect(r.id)}
                            className={`block w-full text-left rounded-2xl ring-1 p-4 sm:p-5 transition-all cursor-pointer bg-white/70 ${
                              isSelected
                                ? "ring-2 ring-orange-500 bg-orange-50/60"
                                : "ring-gray-200 hover:ring-gray-300"
                            }`}
                          >
                            <RecordContent r={r} score={score} isSelected={isSelected} selectionMode />
                          </div>
                        ) : (
                          <Link
                            href={`/analyzer?scan=${r.id}`}
                            className="block rounded-2xl ring-1 ring-gray-200 hover:ring-gray-300 p-4 sm:p-5 transition-all bg-white/70"
                          >
                            <RecordContent r={r} score={score} isSelected={false} selectionMode={false} />
                          </Link>
                        )}
                      </div>
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

function RecordContent({
  r,
  score,
  isSelected,
  selectionMode,
}: {
  r: AnalysisRecord
  score: number
  isSelected: boolean
  selectionMode: boolean
}) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      {selectionMode && (
        <div className="shrink-0 mt-0.5">
          {isSelected ? (
            <CheckSquare className="w-5 h-5 text-orange-500" />
          ) : (
            <Square className="w-5 h-5 text-gray-300" />
          )}
        </div>
      )}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-semibold ring-1 ${scoreColor(
          score
        )}`}
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
          <span className="inline-flex items-center gap-1.5 text-gray-500">
            {r.platform.split(",").map((p) => {
              const trimmed = p.trim()
              const color = PLATFORM_COLORS[trimmed] || "#6b7280"
              return (
                <span
                  key={trimmed}
                  className="inline-flex items-center gap-1"
                  style={{ color }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: color }}
                  />
                  {trimmed}
                </span>
              )
            })}
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
      {!selectionMode && (
        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors shrink-0 mt-1" />
      )}
    </div>
  )
}
