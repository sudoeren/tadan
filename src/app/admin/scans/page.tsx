"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Link2,
  Loader2,
  Users,
  X,
} from "lucide-react"
import { PlatformList } from "@/components/admin/platform-badge"

interface AdminScan {
  id: string
  inputType: string
  rawContent: string
  platform: string
  riskScore: number | null
  status: string
  createdAt: string | Date
  user: { id: string; email: string; name: string | null } | null
  violationCount: number
  variantCount: number
}

interface FilteredUser {
  id: string
  email: string
  name: string | null
}

const PLATFORMS = ["meta", "google", "taboola", "tiktok"] as const
type PlatformFilter = (typeof PLATFORMS)[number] | "all"

function scoreColor(n: number) {
  if (n <= 25) return "text-emerald-600 bg-emerald-50 ring-emerald-200"
  if (n <= 60) return "text-amber-600 bg-amber-50 ring-amber-200"
  if (n <= 85) return "text-orange-600 bg-orange-50 ring-orange-200"
  return "text-red-600 bg-red-50 ring-red-200"
}

export default function AdminScansPage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")?.trim() || null
  return <AdminScansContent key={userId ?? "all"} userId={userId} />
}

function AdminScansContent({ userId }: { userId: string | null }) {
  const [records, setRecords] = useState<AdminScan[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [platform, setPlatform] = useState<PlatformFilter>("all")
  const [filteredUser, setFilteredUser] = useState<FilteredUser | null>(null)
  const limit = 30

  function changePlatform(next: PlatformFilter) {
    setPlatform(next)
    setOffset(0)
  }

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}`)
        if (cancelled) return
        if (!res.ok) {
          setFilteredUser(null)
          return
        }
        const data = await res.json()
        if (!cancelled) {
          setFilteredUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
          })
        }
      } catch {
        if (!cancelled) setFilteredUser(null)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  const userLoading = !!userId && !filteredUser

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({
          limit: String(limit),
          offset: String(offset),
        })
        if (userId) params.set("userId", userId)
        if (platform !== "all") params.set("platform", platform)
        const res = await fetch(`/api/admin/scans?${params.toString()}`)
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || "Failed to load scans")
        }
        const data = await res.json()
        setRecords(data.records ?? [])
        setTotal(data.total ?? 0)
        setHasMore(Boolean(data.hasMore))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load scans")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [offset, userId, platform])

  const showingUserFilter = !!userId

  return (
    <div className="relative z-[2] px-5 sm:px-8 pb-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="animate-fade-up">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/30 backdrop-blur-xl ring-1 ring-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_4px_20px_rgba(0,0,0,0.04)] px-3.5 py-1.5 mb-3">
            <FileText className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-[12px] text-gray-700 font-medium">
              {total} {total === 1 ? "scan" : "scans"}{" "}
              {showingUserFilter ? "for this user" : "total"}
            </span>
          </div>
          <h1 className="text-gray-900 font-normal leading-[1.05] tracking-[-0.03em] text-[32px] sm:text-[44px] max-w-2xl">
            {showingUserFilter ? "User scan feed" : "Global scan feed"}
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-lg leading-relaxed">
            {showingUserFilter
              ? "Filtered to a single user. Clear the filter to see every scan."
              : "Every scan, across every user. Useful for spotting abuse or just watching the product breathe."}
          </p>
        </header>

        {!showingUserFilter && (
          <div className="animate-fade-up [animation-delay:60ms] flex items-center justify-between gap-3 flex-wrap rounded-2xl bg-orange-50/60 ring-1 ring-orange-200/50 px-4 py-3">
            <div className="flex items-center gap-2 text-[13px] text-gray-700">
              <Users className="w-4 h-4 text-orange-600" />
              <span>Need to inspect a specific user&apos;s scans?</span>
            </div>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white bg-orange-500 hover:bg-orange-600 px-3.5 py-1.5 rounded-full transition-colors"
            >
              Browse users
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {showingUserFilter && (
          <div className="animate-fade-up [animation-delay:60ms] flex items-center justify-between gap-3 flex-wrap rounded-2xl bg-blue-50/70 ring-1 ring-blue-200/60 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold flex items-center justify-center text-sm">
                {userLoading
                  ? "…"
                  : (filteredUser?.name || filteredUser?.email || "?")
                      .slice(0, 1)
                      .toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-gray-900 truncate">
                  Showing scans for{" "}
                  {filteredUser?.name || filteredUser?.email || "this user"}
                </p>
                {filteredUser?.email && filteredUser.name && (
                  <p className="text-[12px] text-gray-500 truncate">
                    {filteredUser.email}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {filteredUser && (
                <Link
                  href={`/admin/users/${filteredUser.id}`}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-700 hover:text-gray-900 ring-1 ring-gray-200 hover:ring-gray-300 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  View user
                </Link>
              )}
              <Link
                href="/admin/scans"
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-700 hover:text-gray-900 ring-1 ring-gray-200 hover:ring-gray-300 px-3 py-1.5 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear filter
              </Link>
            </div>
          </div>
        )}

        <div className="animate-fade-up [animation-delay:80ms] flex items-center gap-3 flex-wrap">
          {!showingUserFilter && (
            <div className="inline-flex items-center gap-1 bg-gray-200/80 rounded-full p-1">
              {(
                [
                  { value: "all", label: "All" },
                  ...PLATFORMS.map((p) => ({ value: p, label: p })),
                ] as const
              ).map((opt) => {
                const active = platform === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => changePlatform(opt.value)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-full transition-all ${
                      active
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="animate-fade-up [animation-delay:120ms] rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-5 sm:p-7">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading scans…
            </div>
          ) : records.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-gray-500">
                {showingUserFilter
                  ? "This user hasn't run any scans yet."
                  : "No scans yet."}
              </p>
              {showingUserFilter && filteredUser && (
                <Link
                  href={`/admin/users/${filteredUser.id}`}
                  className="inline-flex items-center gap-1 text-[12px] text-gray-500 hover:text-gray-900 mt-2"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Back to user
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((r) => {
                const score = r.riskScore ?? 0
                return (
                  <div
                    key={r.id}
                    className="rounded-2xl ring-1 ring-gray-200 hover:ring-gray-300 p-4 sm:p-5 transition-all bg-white/70"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
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
                          <PlatformList platform={r.platform} />
                          <span className="text-gray-300">·</span>
                          <span>
                            {new Date(r.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {r.violationCount > 0 && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span className="inline-flex items-center gap-1 text-amber-600">
                                <AlertTriangle className="w-3 h-3" />
                                {r.violationCount} violation
                                {r.violationCount !== 1 ? "s" : ""}
                              </span>
                            </>
                          )}
                          {r.variantCount > 0 && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span className="inline-flex items-center gap-1 text-emerald-600">
                                <Check className="w-3 h-3" />
                                {r.variantCount} variant
                                {r.variantCount !== 1 ? "s" : ""}
                              </span>
                            </>
                          )}
                        </div>
                        {r.user && (
                          <div className="mt-2">
                            <Link
                              href={`/admin/users/${r.user.id}`}
                              className="inline-flex items-center gap-1 text-[12px] text-gray-500 hover:text-gray-900 transition-colors"
                            >
                              <span className="font-medium text-gray-700">
                                {r.user.name || r.user.email}
                              </span>
                              <span className="text-gray-400">
                                {r.user.name ? r.user.email : null}
                              </span>
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[12px] text-gray-500">
          <span>
            Showing {records.length === 0 ? 0 : offset + 1}–
            {offset + records.length} of {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0 || loading}
              className="px-3 py-1.5 rounded-full ring-1 ring-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setOffset(offset + limit)}
              disabled={!hasMore || loading}
              className="px-3 py-1.5 rounded-full ring-1 ring-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
