import { describe, it, expect } from "vitest"

describe("scraper ssrf guard (compile-time + doc)", () => {
  it("scrapeLandingPage is exported and async", async () => {
    const mod = await import("@/lib/scraper")
    expect(typeof mod.scrapeLandingPage).toBe("function")
  })

  it("formatScrapedContent is exported and pure", async () => {
    const mod = await import("@/lib/scraper")
    const out = mod.formatScrapedContent({
      title: "T",
      headings: ["H1"],
      bodyText: "body",
      buttonTexts: ["B"],
      links: [{ text: "p", href: "/privacy" }],
      metaDescription: "m",
      privacyPolicyUrl: "/privacy",
      baitSwitchEvidence: { detected: false, promise: "", patterns: [], mismatchScore: 0 },
    })
    expect(out).toContain("PAGE TITLE: T")
    expect(out).toContain("PRIVACY POLICY URL: /privacy")
  })
})

describe("rate limit (compile + doc)", () => {
  it("module exports are present", async () => {
    const mod = await import("@/lib/rate-limit")
    expect(typeof mod.rateLimit).toBe("function")
    expect(typeof mod.getClientIp).toBe("function")
    expect(mod.RATE_LIMITS.analyze.anonymous.limit).toBeGreaterThan(0)
    expect(mod.RATE_LIMITS.analyze.authenticated.limit).toBeGreaterThan(0)
  })

  it("allows up to limit, then blocks", async () => {
    const { rateLimit } = await import("@/lib/rate-limit")
    const config = { limit: 2, windowMs: 60_000 }
    expect(rateLimit("t:1", config).ok).toBe(true)
    expect(rateLimit("t:1", config).ok).toBe(true)
    const third = rateLimit("t:1", config)
    expect(third.ok).toBe(false)
    if (!third.ok) {
      expect(third.retryAfterSec).toBeGreaterThan(0)
    }
  })

  it("isolates keys", async () => {
    const { rateLimit } = await import("@/lib/rate-limit")
    const config = { limit: 1, windowMs: 60_000 }
    expect(rateLimit("t:a", config).ok).toBe(true)
    expect(rateLimit("t:b", config).ok).toBe(true)
  })
})
