import { describe, it, expect, vi, beforeEach } from "vitest"
import { openRouterCompletion } from "@/lib/openrouter"
import {
  analyzeContent,
  computeDeterministicRiskScore,
  finalizeRiskScore,
  RED_WEIGHT,
  YELLOW_WEIGHT,
  RISK_SCORE_MAX,
} from "@/lib/agents/critic"
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

function buildViolation(
  text: string,
  reason: string,
  level: "Red" | "Yellow" | "Green" = "Red"
) {
  return { text, reason, level }
}

beforeEach(() => {
  mockedCompletion.mockReset()
})

describe("critic agent — golden cases", () => {
  it("policy database covers the high-risk categories a real media buyer worries about", () => {
    const allCategories = [
      ...META_AD_POLICIES.categories.map((c) => c.category),
      ...GOOGLE_ADS_POLICIES.categories.map((c) => c.category),
      ...TIKTOK_POLICIES.categories.map((c) => c.category),
      ...TABOOLA_POLICIES.categories.map((c) => c.category),
    ]

    const expectedHighRisk = [
      "Health & Wellness",
      "Finance",
      "Personal Attributes",
      "Clickbait",
      "Landing Page",
    ]
    for (const category of expectedHighRisk) {
      expect(
        allCategories.some((c) => c.toLowerCase().includes(category.toLowerCase())),
        `expected at least one platform to have a category covering "${category}"`
      ).toBe(true)
    }

    const totalRules = [
      ...META_AD_POLICIES.categories,
      ...GOOGLE_ADS_POLICIES.categories,
      ...TIKTOK_POLICIES.categories,
      ...TABOOLA_POLICIES.categories,
    ].reduce((sum, c) => sum + c.rules.length, 0)

    expect(totalRules).toBeGreaterThan(80)

    expect(META_AD_POLICIES.source).toMatch(/^https:\/\//)
    expect(GOOGLE_ADS_POLICIES.source).toMatch(/^https:\/\//)
    expect(TIKTOK_POLICIES.source).toMatch(/^https:\/\//)
    expect(TABOOLA_POLICIES.source).toMatch(/^https:\/\//)
  })

  it("flags a 'guaranteed earnings' ad as Red on Meta", async () => {
    mockLLMResponse({
      risk_score: 92,
      violations: [
        buildViolation(
          "Earn $500/day guaranteed",
          "Meta policy: guaranteed income claims are strictly prohibited.",
          "Red"
        ),
        buildViolation(
          "No experience needed",
          "Work-from-home / 'no experience' framing triggers financial promotion review.",
          "Yellow"
        ),
      ],
      positiveAspects: [],
    })

    const result = await analyzeContent(
      "Earn $500/day guaranteed! No experience needed. Start now.",
      ["meta"],
      false
    )

    expect(result.riskScore).toBeGreaterThan(60)
    expect(result.violations.some((v) => v.level === "Red")).toBe(true)
    expect(
      result.violations.some((v) => /guaranteed/i.test(v.text))
    ).toBe(true)
  })

  it("flags 'struggling with debt' as personal-attribute violation", async () => {
    mockLLMResponse({
      risk_score: 78,
      violations: [
        buildViolation(
          "Are you struggling with debt?",
          "Personal Attributes policy: targeting based on implied financial status is prohibited.",
          "Red"
        ),
      ],
      positiveAspects: [],
    })

    const result = await analyzeContent(
      "Are you struggling with debt? Find relief today.",
      ["meta", "google", "tiktok"],
      false
    )

    expect(result.violations.some((v) => v.level === "Red")).toBe(true)
    expect(
      result.violations.some((v) => /debt|struggling/i.test(v.text))
    ).toBe(true)
  })

  it("flags a health-cure claim across Meta, Google, and TikTok", async () => {
    mockLLMResponse({
      risk_score: 95,
      violations: [
        buildViolation(
          "This pill cures cancer",
          "All three platforms prohibit claims of curing, treating, or preventing any disease.",
          "Red"
        ),
        buildViolation(
          "in 7 days",
          "Specific timeframe for a health claim is an additional misleading-health-claims trigger.",
          "Red"
        ),
      ],
      positiveAspects: [],
    })

    const result = await analyzeContent(
      "This pill cures cancer in 7 days. Doctor approved.",
      ["meta", "google", "tiktok"],
      false
    )

    const red = result.violations.filter((v) => v.level === "Red")
    expect(red.length).toBeGreaterThanOrEqual(1)
    expect(red.some((v) => /cure|cancer/i.test(v.text))).toBe(true)
  })

  it("flags unrealistic weight-loss with timeframe", async () => {
    mockLLMResponse({
      risk_score: 88,
      violations: [
        buildViolation(
          "Lose 10 pounds in 1 week",
          "Specific weight loss with timeframe is prohibited on Meta, TikTok, and Taboola.",
          "Red"
        ),
      ],
      positiveAspects: [],
    })

    const result = await analyzeContent(
      "Lose 10 pounds in 1 week with our miracle supplement.",
      ["meta", "tiktok", "taboola"],
      false
    )

    expect(result.riskScore).toBeGreaterThan(60)
    expect(
      result.violations.some((v) => /10 pounds|1 week/i.test(v.text))
    ).toBe(true)
  })

  it("flags clickbait / sensationalist headline on Taboola specifically", async () => {
    mockLLMResponse({
      risk_score: 84,
      violations: [
        buildViolation(
          "What this woman did next will amaze you",
          "Taboola Clickbait policy: curiosity-gap headlines that don't reflect actual content are rejected.",
          "Red"
        ),
        buildViolation(
          "Numbered list with no real value",
          "Numbered list clickbait (17 reasons why...) must be substantiated; padded listicles are rejected.",
          "Yellow"
        ),
      ],
      positiveAspects: [],
    })

    const result = await analyzeContent(
      "What this woman did next will amaze you. 17 reasons doctors don't want you to know.",
      ["taboola"],
      false
    )

    expect(result.violations.some((v) => v.level === "Red")).toBe(true)
    expect(
      result.violations.some((v) => /amaze|won't believe|17 reasons/i.test(v.text))
    ).toBe(true)
  })

  it("returns a Safe score and positiveAspects for a compliant ad", async () => {
    mockLLMResponse({
      risk_score: 12,
      violations: [],
      positiveAspects: [
        {
          label: "Empowerment framing",
          description: "Uses 'supports your body's natural response' rather than a direct health claim.",
        },
        {
          label: "Authority positioning",
          description: "References a board-certified endocrinologist without making a cure claim.",
        },
        {
          label: "Specific social proof",
          description: "Quantified '10,000+ professionals across 40 countries' is verifiable.",
        },
      ],
    })

    const result = await analyzeContent(
      "Trusted by 10,000+ professionals across 40 countries. Formulated by a board-certified endocrinologist. Supports your body's natural energy response.",
      ["meta", "google", "tiktok", "taboola"],
      false
    )

    expect(result.riskScore).toBeLessThanOrEqual(25)
    expect(result.violations).toEqual([])
    expect(result.positiveAspects.length).toBeGreaterThanOrEqual(3)
  })

  it("passes the LLM's system prompt through unchanged (useRag=false path uses full policy docs)", async () => {
    mockLLMResponse({
      risk_score: 0,
      violations: [],
      positiveAspects: [],
    })

    await analyzeContent("Generic clean ad copy.", ["meta"], false)

    expect(mockedCompletion).toHaveBeenCalledTimes(1)
    const call = mockedCompletion.mock.calls[0][0]
    const system = call.messages[0]?.content ?? ""

    expect(system).toContain("META ADS POLICIES")
    expect(system).toContain("Prohibited Content")
    expect(system).toContain("Personal Attributes")
    expect(system).toContain("Landing Page")

    expect(call.messages[0]?.role).toBe("system")
    expect(call.messages[1]?.role).toBe("user")
    expect(call.messages[1]?.content).toContain("Generic clean ad copy.")
  })

  it("skips the optimizer when risk_score is 0 and no violations are returned", async () => {
    mockLLMResponse({
      risk_score: 5,
      violations: [],
      positiveAspects: [
        { label: "Clear offer", description: "Specific product, specific price." },
      ],
    })

    const result = await analyzeContent(
      "Buy a $29 fitness tracker. Free shipping in the US.",
      ["meta"],
      false
    )

    expect(result.violations).toEqual([])
    expect(result.positiveAspects.length).toBeGreaterThan(0)
    expect(mockedCompletion).toHaveBeenCalledTimes(1)
  })

  it("rejects LLM response with malformed JSON structure", async () => {
    mockedCompletion.mockResolvedValueOnce({
      id: "test",
      choices: [
        {
          message: {
            content: JSON.stringify({ wrong_field: "yes" }),
          },
        },
      ],
    })

    await expect(
      analyzeContent("Test ad copy.", ["meta"], false)
    ).rejects.toThrow(/Invalid response structure/)
  })

  it("rejects empty LLM response", async () => {
    mockedCompletion.mockResolvedValueOnce({
      id: "test",
      choices: [{ message: { content: "" } }],
    })

    await expect(
      analyzeContent("Test ad copy.", ["meta"], false)
    ).rejects.toThrow(/Empty response/)
  })
})

describe("deterministic risk score", () => {
  it("returns 0 when there are no violations", () => {
    expect(computeDeterministicRiskScore([])).toBe(0)
  })

  it("weights Red violations at 20 each", () => {
    expect(
      computeDeterministicRiskScore([
        { text: "a", reason: "r", level: "Red" },
      ])
    ).toBe(RED_WEIGHT)
    expect(
      computeDeterministicRiskScore([
        { text: "a", reason: "r", level: "Red" },
        { text: "b", reason: "r", level: "Red" },
        { text: "c", reason: "r", level: "Red" },
      ])
    ).toBe(3 * RED_WEIGHT)
  })

  it("weights Yellow violations at 5 each", () => {
    expect(
      computeDeterministicRiskScore([
        { text: "a", reason: "r", level: "Yellow" },
      ])
    ).toBe(YELLOW_WEIGHT)
  })

  it("mixes Red and Yellow weights additively", () => {
    const score = computeDeterministicRiskScore([
      { text: "a", reason: "r", level: "Red" },
      { text: "b", reason: "r", level: "Yellow" },
      { text: "c", reason: "r", level: "Yellow" },
    ])
    expect(score).toBe(RED_WEIGHT + 2 * YELLOW_WEIGHT)
  })

  it("caps the deterministic score at 100", () => {
    const many = Array.from({ length: 10 }, (_, i) => ({
      text: `v${i}`,
      reason: "r",
      level: "Red" as const,
    }))
    expect(computeDeterministicRiskScore(many)).toBe(RISK_SCORE_MAX)
  })
})

describe("finalizeRiskScore — deterministic floor over LLM", () => {
  it("uses the LLM score when no violations exist (LLM signal preserved)", () => {
    expect(finalizeRiskScore([], 12)).toBe(12)
    expect(finalizeRiskScore([], 5)).toBe(5)
    expect(finalizeRiskScore([], 0)).toBe(0)
  })

  it("clamps a too-high LLM score to 100", () => {
    expect(finalizeRiskScore([], 250)).toBe(RISK_SCORE_MAX)
    expect(finalizeRiskScore([{ text: "x", reason: "r", level: "Red" }], 999)).toBe(
      RISK_SCORE_MAX
    )
  })

  it("clamps a negative LLM score to 0", () => {
    expect(finalizeRiskScore([], -10)).toBe(0)
  })

  it("rounds fractional LLM scores", () => {
    expect(finalizeRiskScore([], 12.6)).toBe(13)
    expect(finalizeRiskScore([], 12.4)).toBe(12)
  })

  it("uses deterministic score as a floor when LLM under-scores", () => {
    const violations = [
      { text: "guaranteed $500/day", reason: "financial", level: "Red" as const },
      { text: "limited spots", reason: "scarcity", level: "Yellow" as const },
    ]
    const deterministic = computeDeterministicRiskScore(violations)
    expect(finalizeRiskScore(violations, 5)).toBe(deterministic)
    expect(finalizeRiskScore(violations, 15)).toBe(deterministic)
  })

  it("keeps a higher LLM score (no floor cap)", () => {
    const violations = [
      { text: "guaranteed $500/day", reason: "financial", level: "Red" as const },
    ]
    expect(finalizeRiskScore(violations, 85)).toBe(85)
  })

  it("falls back to deterministic when LLM score is non-numeric", () => {
    const violations = [
      { text: "x", reason: "r", level: "Red" as const },
    ]
    expect(finalizeRiskScore(violations, NaN)).toBe(RED_WEIGHT)
  })
})

describe("analyzeContent — score stability (A/B identical-input determinism)", () => {
  it("returns the same risk score for identical input on repeated calls", async () => {
    const payload = {
      risk_score: 73,
      violations: [
        buildViolation("guaranteed $500/day", "financial", "Red"),
        buildViolation("are you struggling", "personal attribute", "Red"),
      ],
      positiveAspects: [],
    }
    mockLLMResponse(payload)
    const first = await analyzeContent(
      "Guaranteed $500/day. Are you struggling with debt?",
      ["meta", "google", "tiktok", "taboola"],
      false
    )

    mockLLMResponse(payload)
    const second = await analyzeContent(
      "Guaranteed $500/day. Are you struggling with debt?",
      ["meta", "google", "tiktok", "taboola"],
      false
    )

    expect(first.riskScore).toBe(second.riskScore)
  })

  it("raises an under-scored LLM response to the deterministic floor", async () => {
    mockLLMResponse({
      risk_score: 8,
      violations: [
        buildViolation("guaranteed $500/day", "financial", "Red"),
      ],
      positiveAspects: [],
    })
    const result = await analyzeContent(
      "Guaranteed $500/day. Click now.",
      ["meta"],
      false
    )
    expect(result.riskScore).toBe(RED_WEIGHT)
  })
})
