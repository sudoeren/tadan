import { headers } from "next/headers"

interface RateLimitConfig {
  limit: number
  windowMs: number
}

interface RateLimitState {
  count: number
  resetAt: number
}

type RateLimitResult =
  | { ok: true; remaining: number; resetAt: number }
  | { ok: false; resetAt: number; retryAfterSec: number }

const store = new Map<string, RateLimitState>()

let lastCleanup = Date.now()
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [key, state] of store) {
    if (state.resetAt <= now) store.delete(key)
  }
}

export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  cleanup(now)

  const existing = store.get(key)
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + config.windowMs
    store.set(key, { count: 1, resetAt })
    return { ok: true, remaining: config.limit - 1, resetAt }
  }

  if (existing.count >= config.limit) {
    const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
    return { ok: false, resetAt: existing.resetAt, retryAfterSec }
  }

  existing.count++
  return { ok: true, remaining: config.limit - existing.count, resetAt: existing.resetAt }
}

export async function getClientIp(): Promise<string> {
  const h = await headers()
  const xff = h.get("x-forwarded-for")
  if (xff) {
    const first = xff.split(",")[0]?.trim()
    if (first) return first
  }
  return (
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown"
  )
}

export const RATE_LIMITS = {
  analyze: {
    authenticated: { limit: 50, windowMs: 60 * 60 * 1000 },
    anonymous: { limit: 5, windowMs: 60 * 60 * 1000 },
  },
  scrape: {
    authenticated: { limit: 50, windowMs: 60 * 60 * 1000 },
    anonymous: { limit: 5, windowMs: 60 * 60 * 1000 },
  },
} as const
