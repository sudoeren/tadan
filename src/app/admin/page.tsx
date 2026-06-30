"use client"

import { useEffect, useState } from "react"
import { BarChart3, Flag, ShieldCheck, TrendingUp, Users } from "lucide-react"
import { StatCard } from "@/components/admin/stat-card"
import { PlatformBadge } from "@/components/admin/platform-badge"

interface AdminStats {
  totals: {
    users: number
    analyses: number
    flagged: number
    clean: number
    today: number
    avgRiskScore: number
  }
  platformUsage: { platform: string; count: number }[]
  topViolationReasons: { reason: string; count: number }[]
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || "Failed to load stats")
        }
        const data = await res.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const maxPlatform = Math.max(
    1,
    ...(stats?.platformUsage.map((p) => p.count) ?? [1])
  )

  return (
    <div className="relative z-[2] px-5 sm:px-8 pb-16">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="animate-fade-up">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/30 backdrop-blur-xl ring-1 ring-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_4px_20px_rgba(0,0,0,0.04)] px-3.5 py-1.5 mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-[12px] text-gray-700 font-medium">
              Overview
            </span>
          </div>
          <h1 className="text-gray-900 font-normal leading-[1.05] tracking-[-0.03em] text-[32px] sm:text-[44px] max-w-2xl">
            Admin dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-lg leading-relaxed">
            Aggregate metrics across all users, scans and platform usage.
          </p>
        </header>

        {error && (
          <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up [animation-delay:80ms]">
          <StatCard
            label="Total users"
            value={stats?.totals.users ?? 0}
            tone="default"
            loading={loading}
            icon={<Users className="w-4 h-4 text-gray-400" />}
          />
          <StatCard
            label="Total scans"
            value={stats?.totals.analyses ?? 0}
            hint={
              stats ? `${stats.totals.today} today` : undefined
            }
            tone="default"
            loading={loading}
          />
          <StatCard
            label="Avg. risk score"
            value={stats?.totals.avgRiskScore ?? 0}
            tone={
              (stats?.totals.avgRiskScore ?? 0) > 60 ? "danger" : "default"
            }
            loading={loading}
          />
          <StatCard
            label="Flagged vs clean"
            value={
              stats
                ? `${stats.totals.flagged} / ${stats.totals.clean}`
                : "0 / 0"
            }
            tone="warning"
            loading={loading}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="animate-fade-up [animation-delay:160ms] rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-5 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                Platform usage
              </h2>
              <span className="text-[12px] text-gray-400">
                {stats?.platformUsage.reduce((acc, p) => acc + p.count, 0) ?? 0} scans
              </span>
            </div>
            {loading ? (
              <p className="text-sm text-gray-400 py-6">Loading…</p>
            ) : !stats || stats.platformUsage.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">
                No scans yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {stats.platformUsage.map((p) => {
                  const pct = (p.count / maxPlatform) * 100
                  return (
                    <li key={p.platform} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[13px]">
                        <PlatformBadge platform={p.platform} />
                        <span className="text-gray-500 font-medium tabular-nums">
                          {p.count}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background:
                              p.platform === "meta"
                                ? "#1877F2"
                                : p.platform === "google"
                                  ? "#EA4335"
                                  : p.platform === "taboola"
                                    ? "#6C2BD9"
                                    : "#111827",
                          }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className="animate-fade-up [animation-delay:240ms] rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-5 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
                <Flag className="w-4 h-4 text-gray-500" />
                Top violation reasons
              </h2>
              <span className="text-[12px] text-gray-400">Top 5</span>
            </div>
            {loading ? (
              <p className="text-sm text-gray-400 py-6">Loading…</p>
            ) : !stats || stats.topViolationReasons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShieldCheck className="w-7 h-7 text-emerald-400 mb-2" />
                <p className="text-sm text-gray-500">No violations recorded.</p>
              </div>
            ) : (
              <ol className="space-y-3">
                {stats.topViolationReasons.map((r, i) => (
                  <li
                    key={r.reason}
                    className="flex items-start gap-3 text-[13px]"
                  >
                    <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-50 text-orange-600 text-[11px] font-semibold mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 leading-snug line-clamp-2">
                        {r.reason}
                      </p>
                    </div>
                    <span className="shrink-0 text-gray-500 font-medium tabular-nums">
                      {r.count}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
