"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  FileText,
  Link2,
  Loader2,
  Mail,
  ShieldCheck,
  Trash2,
  User as UserIcon,
} from "lucide-react"
import { PlatformList } from "@/components/admin/platform-badge"
import type { AnalysisRecord } from "@/types"

interface UserDetail {
  id: string
  email: string
  name: string | null
  emailVerified: boolean
  image: string | null
  createdAt: string | Date
  updatedAt: string | Date
  isAdmin: boolean
}

function scoreColor(n: number) {
  if (n <= 25) return "text-emerald-600 bg-emerald-50 ring-emerald-200"
  if (n <= 60) return "text-amber-600 bg-amber-50 ring-amber-200"
  if (n <= 85) return "text-orange-600 bg-orange-50 ring-orange-200"
  return "text-red-600 bg-red-50 ring-red-200"
}

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session } = useSession()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [records, setRecords] = useState<AnalysisRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!params?.id) return
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/users/${params.id}`)
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || "Failed to load user")
        }
        const data = await res.json()
        setUser(data.user)
        setRecords(data.records ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params?.id])

  const stats = useMemo(() => {
    if (records.length === 0) {
      return { total: 0, flagged: 0, avg: 0, totalViolations: 0, totalVariants: 0 }
    }
    const flagged = records.filter((r) => (r.riskScore ?? 0) > 60).length
    const totalViolations = records.reduce(
      (acc, r) => acc + (r.violations?.length ?? 0),
      0
    )
    const totalVariants = records.reduce(
      (acc, r) => acc + (r.variants?.length ?? 0),
      0
    )
    const scored = records.filter(
      (r): r is AnalysisRecord & { riskScore: number } => r.riskScore !== null
    )
    const avg =
      scored.length === 0
        ? 0
        : Math.round(
            scored.reduce((acc, r) => acc + r.riskScore, 0) / scored.length
          )
    return { total: records.length, flagged, avg, totalViolations, totalVariants }
  }, [records])

  async function handleDelete() {
    if (!user) return
    if (user.id === session?.user.id) return
    if (user.isAdmin) return
    const confirmed = window.confirm(
      `Delete ${user.email}? This will permanently remove the user and all their data. This cannot be undone.`
    )
    if (!confirmed) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Delete failed")
      }
      router.push("/admin/users")
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Delete failed")
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading user…
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="px-5 sm:px-8 py-12 max-w-3xl mx-auto">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to users
        </Link>
        <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 px-5 py-4 text-sm text-red-700">
          {error || "User not found."}
        </div>
      </div>
    )
  }

  const isSelf = user.id === session?.user.id
  const canDelete = !isSelf && !user.isAdmin

  return (
    <div className="relative z-[2] px-5 sm:px-8 pb-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to users
        </Link>

        <header className="animate-fade-up rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-5 sm:p-7">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[20px] sm:text-[24px] font-semibold text-gray-900">
                  {user.name || user.email}
                </h1>
                {user.isAdmin && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 bg-orange-50 ring-1 ring-orange-200 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    Admin
                  </span>
                )}
                {isSelf && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 ring-1 ring-blue-200 px-2 py-0.5 rounded-full">
                    <UserIcon className="w-3 h-3" />
                    You
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1 break-all">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                {user.email}
              </p>
              <p className="text-[12px] text-gray-400 mt-2">
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                {" · "}
                ID: {user.id}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/admin/scans?userId=${user.id}`}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-700 hover:text-gray-900 ring-1 ring-gray-200 hover:ring-gray-300 px-3.5 py-1.5 rounded-full transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                View in scan feed
                <ArrowRight className="w-3 h-3 text-gray-400" />
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!canDelete || deleting}
                title={
                  isSelf
                    ? "You can't delete your own account."
                    : user.isAdmin
                      ? "Admins can only be removed from ADMIN_EMAILS."
                      : "Delete user"
                }
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-red-600 hover:text-white hover:bg-red-500 ring-1 ring-red-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-red-600 disabled:hover:bg-transparent px-3.5 py-1.5 rounded-full transition-colors"
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Delete user
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Stat label="Scans" value={stats.total} />
            <Stat label="Flagged" value={stats.flagged} tone={stats.flagged > 0 ? "warning" : "default"} />
            <Stat
              label="Avg. score"
              value={stats.avg}
              tone={stats.avg > 60 ? "danger" : "default"}
            />
            <Stat label="Violations" value={stats.totalViolations} />
            <Stat label="Variants" value={stats.totalVariants} />
          </div>
        </header>

        <section className="animate-fade-up [animation-delay:80ms] rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-5 sm:p-7">
          <h2 className="text-[15px] font-semibold text-gray-900 mb-4">
            Scan history
          </h2>
          {records.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              This user hasn&apos;t run any scans yet.
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((r) => {
                const score = r.riskScore ?? 0
                return (
                  <div
                    key={r.id}
                    className="rounded-2xl ring-1 ring-gray-200 hover:ring-gray-300 p-4 sm:p-5 transition-all bg-white/70 flex items-start gap-3 sm:gap-4"
                  >
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
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string
  value: number
  tone?: "default" | "warning" | "danger"
}) {
  const toneText = {
    default: "text-gray-900",
    warning: "text-amber-600",
    danger: "text-red-600",
  }[tone]
  return (
    <div className="rounded-2xl bg-white/60 ring-1 ring-gray-200 p-3 sm:p-4">
      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
        {label}
      </p>
      <p className={`text-xl sm:text-2xl font-semibold tabular-nums mt-1 ${toneText}`}>
        {value}
      </p>
    </div>
  )
}
