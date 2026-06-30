"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  FileText,
  Loader2,
  Search,
  Users,
} from "lucide-react"

interface AdminUser {
  id: string
  email: string
  name: string | null
  emailVerified: boolean
  image: string | null
  createdAt: string | Date
  updatedAt: string | Date
  analysisCount: number
  lastScanAt: string | Date | null
}

export default function AdminUsersPage() {
  const [records, setRecords] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [offset, setOffset] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const limit = 25

  function handleSearch(next: string) {
    setInputValue(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setQ(next)
      setOffset(0)
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({
          limit: String(limit),
          offset: String(offset),
        })
        if (q.trim()) params.set("q", q.trim())

        const res = await fetch(`/api/admin/users?${params.toString()}`)
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || "Failed to load users")
        }
        const data = await res.json()
        setRecords(data.records ?? [])
        setTotal(data.total ?? 0)
        setHasMore(Boolean(data.hasMore))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [q, offset])

  return (
    <div className="relative z-[2] px-5 sm:px-8 pb-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="animate-fade-up">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/30 backdrop-blur-xl ring-1 ring-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_4px_20px_rgba(0,0,0,0.04)] px-3.5 py-1.5 mb-3">
            <Users className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-[12px] text-gray-700 font-medium">
              {total} {total === 1 ? "user" : "users"}
            </span>
          </div>
          <h1 className="text-gray-900 font-normal leading-[1.05] tracking-[-0.03em] text-[32px] sm:text-[44px] max-w-2xl">
            Users
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-lg leading-relaxed">
            Browse accounts, inspect their scan history, and remove accounts
            that shouldn&apos;t be here.
          </p>
        </header>

        <div className="animate-fade-up [animation-delay:60ms] flex items-center justify-between gap-3 flex-wrap rounded-2xl bg-white/60 ring-1 ring-gray-200 px-4 py-3">
          <div className="flex items-center gap-2 text-[13px] text-gray-600">
            <FileText className="w-4 h-4 text-gray-500" />
            <span>
              Looking for a specific scan? Browse the global feed.
            </span>
          </div>
          <Link
            href="/admin/scans"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white bg-orange-500 hover:bg-orange-600 px-3.5 py-1.5 rounded-full transition-colors"
          >
            Open scan feed
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="animate-fade-up [animation-delay:80ms]">
          <label className="relative block max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by email or name…"
              className="w-full pl-11 pr-4 h-11 rounded-full bg-white/80 backdrop-blur-xl ring-1 ring-gray-200 focus:ring-orange-400 focus:outline-none text-sm text-gray-900 placeholder:text-gray-400"
            />
          </label>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="animate-fade-up [animation-delay:160ms] rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading users…
            </div>
          ) : records.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-500">
              No users match these filters.
            </div>
          ) : (
            <div className="p-2 sm:p-3 space-y-2">
              {records.map((u) => (
                <Link
                  key={u.id}
                  href={`/admin/users/${u.id}`}
                  className="flex items-center gap-4 px-4 sm:px-5 py-4 rounded-2xl ring-1 ring-gray-100 hover:ring-orange-200 bg-white/50 hover:bg-orange-50/40 transition-all duration-200 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-gray-900 truncate group-hover:text-orange-700 transition-colors">
                      {u.name || u.email}
                    </p>
                    <p className="text-[12px] text-gray-400 truncate mt-0.5">
                      {u.email}
                    </p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end shrink-0">
                    <span className="text-[12px] font-medium text-gray-700 tabular-nums">
                      {u.analysisCount} scan{u.analysisCount !== 1 ? "s" : ""}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      {u.lastScanAt
                        ? new Date(u.lastScanAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "No scans"}
                    </span>
                  </div>
                </Link>
              ))}
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
