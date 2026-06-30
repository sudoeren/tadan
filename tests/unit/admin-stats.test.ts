import { describe, expect, it } from "vitest"
import {
  aggregatePlatformUsage,
  averageRiskScore,
  startOfToday,
  topViolationReasons,
} from "@/lib/admin-stats"

describe("aggregatePlatformUsage", () => {
  it("splits comma-separated platforms and counts", () => {
    const result = aggregatePlatformUsage([
      { platform: "meta,google" },
      { platform: "meta" },
      { platform: "tiktok" },
    ])
    expect(result).toEqual([
      { platform: "meta", count: 2 },
      { platform: "google", count: 1 },
      { platform: "tiktok", count: 1 },
    ])
  })

  it("ignores null and empty platforms", () => {
    const result = aggregatePlatformUsage([
      { platform: null },
      { platform: "" },
      { platform: "  " },
      { platform: "meta" },
    ])
    expect(result).toEqual([{ platform: "meta", count: 1 }])
  })

  it("returns empty array for empty input", () => {
    expect(aggregatePlatformUsage([])).toEqual([])
  })
})

describe("topViolationReasons", () => {
  it("returns the most common reasons sorted by count", () => {
    const result = topViolationReasons(
      [
        { reason: "Misleading claim" },
        { reason: "Misleading claim" },
        { reason: "Missing disclosure" },
      ],
      5
    )
    expect(result).toEqual([
      { reason: "Misleading claim", count: 2 },
      { reason: "Missing disclosure", count: 1 },
    ])
  })

  it("respects the n limit", () => {
    const reasons = [
      { reason: "A" },
      { reason: "A" },
      { reason: "B" },
      { reason: "C" },
      { reason: "D" },
    ]
    expect(topViolationReasons(reasons, 2)).toHaveLength(2)
  })

  it("ignores null and whitespace reasons", () => {
    const result = topViolationReasons([
      { reason: null },
      { reason: "" },
      { reason: "   " },
      { reason: "Real reason" },
    ])
    expect(result).toEqual([{ reason: "Real reason", count: 1 }])
  })
})

describe("averageRiskScore", () => {
  it("rounds to nearest integer", () => {
    expect(
      averageRiskScore([{ riskScore: 33 }, { riskScore: 67 }])
    ).toBe(50)
  })

  it("ignores null scores", () => {
    expect(
      averageRiskScore([{ riskScore: null }, { riskScore: 80 }])
    ).toBe(80)
  })

  it("returns 0 for empty input", () => {
    expect(averageRiskScore([])).toBe(0)
  })
})

describe("startOfToday", () => {
  it("returns a Date at 00:00:00.000 of today", () => {
    const d = startOfToday()
    expect(d).toBeInstanceOf(Date)
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
    expect(d.getSeconds()).toBe(0)
    expect(d.getMilliseconds()).toBe(0)
  })
})
