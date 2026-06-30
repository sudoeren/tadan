export interface PlatformCount {
  platform: string
  count: number
}

export interface ReasonCount {
  reason: string
  count: number
}

export function aggregatePlatformUsage(
  analyses: { platform: string | null }[]
): PlatformCount[] {
  const counts = new Map<string, number>()
  for (const a of analyses) {
    if (!a.platform) continue
    for (const p of a.platform.split(",")) {
      const trimmed = p.trim()
      if (!trimmed) continue
      counts.set(trimmed, (counts.get(trimmed) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count)
}

export function topViolationReasons(
  violations: { reason: string | null }[],
  n = 5
): ReasonCount[] {
  const counts = new Map<string, number>()
  for (const v of violations) {
    if (!v.reason) continue
    const key = v.reason.trim()
    if (!key) continue
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
}

export function averageRiskScore(
  analyses: { riskScore: number | null }[]
): number {
  const scored = analyses.filter(
    (a): a is { riskScore: number } => a.riskScore !== null
  )
  if (scored.length === 0) return 0
  const sum = scored.reduce((acc, a) => acc + a.riskScore, 0)
  return Math.round(sum / scored.length)
}

export function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}
