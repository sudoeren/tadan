"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useSession } from "@/lib/auth-client"
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  FileText,
  Loader2,
  Search,
  Trash2,
  Users,
  ShieldCheck,
} from "lucide-react"
import { isAdminEmail } from "@/lib/admin-shared"

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
  const { data: session } = useSession()
  const [records, setRecords] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [offset, setOffset] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
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

  async function handleDelete(user: AdminUser) {
    if (user.id === session?.user.id) return
    if (isAdminEmail(user.email)) return
    const confirmed = window.confirm(
      `Delete ${user.email}? This will permanently remove the user, all their scans, sessions, and accounts. This cannot be undone.`
    )
    if (!confirmed) return

    setDeletingId(user.id)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Delete failed")
      }
      setRecords((prev) => prev.filter((r) => r.id !== user.id))
      setTotal((prev) => Math.max(0, prev - 1))
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Delete failed")
    } finally {
      setDeletingId(null)
    }
  }

  const isTargetAdmin = (email: string) => isAdminEmail(email)
  const isSelf = (id: string) => id === session?.user.id

  return (
    <div className="relative z-[2] px-5 sm:px-8 pb-16">
      <div className="max-w-5xl mx-auto space-y-6">
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

        <div className="animate-fade-up [animation-delay:60ms] flex items-center justify-between gap-3 flex-wrap rounded-2xl bg-orange-50/60 ring-1 ring-orange-200/50 px-4 py-3">
          <div className="flex items-center gap-2 text-[13px] text-gray-700">
            <FileText className="w-4 h-4 text-orange-600" />
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
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3.5 font-semibold text-gray-700">User</th>
                    <th className="px-5 py-3.5 font-semibold text-gray-700 text-right">Scans</th>
                    <th className="px-5 py-3.5 font-semibold text-gray-700 text-right hidden md:table-cell">Last scan</th>
                    <th className="px-5 py-3.5 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((u) => {
                    const isAdmin = isTargetAdmin(u.email)
                    const self = isSelf(u.id)
                    const disabled = isAdmin || self
                    return (
                      <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-4 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">
                              {u.name || u.email}
                            </p>
                          </div>
                          <p className="text-[12px] text-gray-500 truncate max-w-[240px]">
                            {u.email}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="tabular-nums font-medium text-gray-900">
                            {u.analysisCount}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right hidden md:table-cell">
                          <span className="text-gray-500 text-[12px]">
                            {u.lastScanAt
                              ? new Date(u.lastScanAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Link
                              href={`/admin/users/${u.id}`}
                              className="inline-flex items-center gap-1 text-[12px] font-medium text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-full transition-colors"
                            >
                              View
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(u)}
                              disabled={disabled || deletingId === u.id}
                              title={
                                self
                                  ? "You can't delete your own account."
                                  : isAdmin
                                    ? "Admins can only be removed from ADMIN_EMAILS."
                                    : "Delete user"
                              }
                              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed px-3 py-1.5 rounded-full transition-colors"
                            >
                              {deletingId === u.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
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
