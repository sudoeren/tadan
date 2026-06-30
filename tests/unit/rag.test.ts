import { describe, it, expect, vi, beforeEach } from "vitest"
import { openRouterCompletion } from "@/lib/openrouter"
import { analyzeContent } from "@/lib/agents/critic"
import { META_AD_POLICIES } from "@/lib/policies/meta"
import { GOOGLE_ADS_POLICIES } from "@/lib/policies/google"
import { TIKTOK_POLICIES } from "@/lib/policies/tiktok"
import { TABOOLA_POLICIES } from "@/lib/policies/taboola"

vi.mock("@/lib/openrouter", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/openrouter")>("@/lib/openrouter")
  return {
    ...actual,
    openRouterCompletion: vi.fn(),
  }
})

const mockedCompletion = vi.mocked(openRouterCompletion)

function mockLLMResponse(payload: unknown) {
  mockedCompletion.mockResolvedValueOnce({
    id: "test-completion",
    choices: [
      {
        message: {
          content: JSON.stringify(payload),
        },
      },
    ],
  })
}

beforeEach(() => {
  mockedCompletion.mockReset()
})

describe("RAG pipeline - bug regression: empty precomputedRag must fall through to full policy docs", () => {
  it("falls back to full policy docs when precomputedRag is an empty array (not a valid RAG hit)", async () => {
    mockLLMResponse({
      risk_score: 78,
      violations: [
        {
          text: "guaranteed earnings",
          reason: "Meta policy: financial promises",
          level: "Red",
        },
      ],
      positiveAspects: [],
    })

    const result = await analyzeContent(
      "Earn $500/day guaranteed!",
      ["meta"],
      true,
      []
    )

    expect(result.riskScore).toBeGreaterThan(0)
    expect(result.violations.length).toBeGreaterThan(0)

    const call = mockedCompletion.mock.calls[0][0]
    const system = call.messages[0]?.content ?? ""
    expect(system).toContain("META ADS POLICIES")
    expect(system).toContain("Financial")
    expect(system).not.toContain("Most Relevant Policy Rules")
  })

  it("uses precomputed RAG rules when precomputedRag has matches", async () => {
    mockLLMResponse({
      risk_score: 65,
      violations: [
        {
          text: "guaranteed $500",
          reason: "Financial claim",
          level: "Red",
        },
      ],
      positiveAspects: [],
    })

    const precomputed = [
      {
        id: "p1",
        platform: "meta",
        category: "Finance",
        ruleText: "Guaranteed income claims are prohibited",
        similarity: 0.9,
      },
    ]

    await analyzeContent("Earn $500/day guaranteed", ["meta"], true, precomputed)

    const call = mockedCompletion.mock.calls[0][0]
    const system = call.messages[0]?.content ?? ""
    expect(system).toContain("Most Relevant Policy Rules (RAG-matched)")
    expect(system).toContain("Guaranteed income claims are prohibited")
    expect(system).not.toContain("META ADS POLICIES\n\n### Prohibited Content")
  })
})

describe("RAG pipeline - short input skip behavior", () => {
  it("uses full policy docs for very short content (skips RAG round-trip)", async () => {
    mockLLMResponse({
      risk_score: 0,
      violations: [],
      positiveAspects: [],
    })

    const shortAd = "Buy now" // < 200 chars
    await analyzeContent(shortAd, ["meta"], true)

    const call = mockedCompletion.mock.calls[0][0]
    const system = call.messages[0]?.content ?? ""
    expect(system).toContain("META ADS POLICIES")
    expect(system).not.toContain("Most Relevant Policy Rules (RAG-matched)")
  })
})

describe("policy database - structural integrity for RAG indexing", () => {
  it("every policy rule is a non-empty string", () => {
    const all = [
      ...META_AD_POLICIES.categories,
      ...GOOGLE_ADS_POLICIES.categories,
      ...TIKTOK_POLICIES.categories,
      ...TABOOLA_POLICIES.categories,
    ]
    expect(all.length).toBeGreaterThan(0)
    for (const cat of all) {
      expect(cat.category).toBeTruthy()
      expect(cat.rules.length).toBeGreaterThan(0)
      for (const rule of cat.rules) {
        expect(typeof rule).toBe("string")
        expect(rule.trim().length).toBeGreaterThan(10)
      }
    }
  })

  it("each platform has a valid https source URL and a version string", () => {
    const policies = [
      META_AD_POLICIES,
      GOOGLE_ADS_POLICIES,
      TIKTOK_POLICIES,
      TABOOLA_POLICIES,
    ]
    for (const p of policies) {
      expect(p.source).toMatch(/^https:\/\//)
      expect(p.version).toBeTruthy()
    }
  })

  it("each platform has at least 5 categories", () => {
    for (const p of [
      META_AD_POLICIES,
      GOOGLE_ADS_POLICIES,
      TIKTOK_POLICIES,
      TABOOLA_POLICIES,
    ]) {
      expect(p.categories.length).toBeGreaterThanOrEqual(5)
    }
  })

  it("category names are unique within each platform", () => {
    for (const p of [
      META_AD_POLICIES,
      GOOGLE_ADS_POLICIES,
      TIKTOK_POLICIES,
      TABOOLA_POLICIES,
    ]) {
      const names = p.categories.map((c) => c.category)
      expect(new Set(names).size).toBe(names.length)
    }
  })
})
