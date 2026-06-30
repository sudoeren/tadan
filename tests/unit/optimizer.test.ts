import { describe, it, expect, vi, beforeEach } from "vitest"
import { openRouterCompletion } from "@/lib/openrouter"
import { generateVariants } from "@/lib/agents/optimizer"
import type { Violation } from "@/types"

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

const sampleViolations: Violation[] = [
  {
    text: "Earn $500/day guaranteed",
    reason: "Meta policy: guaranteed income claims are strictly prohibited.",
    level: "Red",
  },
]

beforeEach(() => {
  mockedCompletion.mockReset()
})

describe("optimizer agent - variant generation", () => {
  it("returns three distinct variants with parts (headline, body, cta)", async () => {
    mockLLMResponse({
      variants: [
        {
          headline: "Take control of your income",
          body: "A proven system that puts you in the driver's seat.",
          cta: "Start today",
          complianceScore: 92,
          hookPreservation: 85,
        },
        {
          headline: "The income strategy professionals trust",
          body: "Designed for people who want to build on their terms.",
          cta: "Learn more",
          complianceScore: 95,
          hookPreservation: 78,
        },
        {
          headline: "Join 10,000+ who chose a smarter path",
          body: "Real stories. Real results. Real empowerment.",
          cta: "See how",
          complianceScore: 90,
          hookPreservation: 80,
        },
      ],
    })

    const result = await generateVariants(
      "Earn $500/day guaranteed! Start now.",
      sampleViolations,
      ["meta", "google"]
    )

    expect(result).toHaveLength(3)
    for (const v of result) {
      expect(v.parts.headline).toBeTruthy()
      expect(v.parts.body).toBeTruthy()
      expect(v.text).toContain(v.parts.body)
      expect(typeof v.complianceScore).toBe("number")
      expect(typeof v.hookPreservation).toBe("number")
    }
  })

  it("preserves the violations list in the user prompt (instructs LLM to fix them)", async () => {
    mockLLMResponse({
      variants: [
        { headline: "H1", body: "B1", cta: "C1", complianceScore: 90, hookPreservation: 80 },
        { headline: "H2", body: "B2", cta: "C2", complianceScore: 90, hookPreservation: 80 },
        { headline: "H3", body: "B3", cta: "C3", complianceScore: 90, hookPreservation: 80 },
      ],
    })

    await generateVariants(
      "Original ad with a violation.",
      sampleViolations,
      ["meta"]
    )

    expect(mockedCompletion).toHaveBeenCalledTimes(1)
    const call = mockedCompletion.mock.calls[0][0]
    const userContent = call.messages[1]?.content ?? ""

    expect(userContent).toContain("Earn $500/day guaranteed")
    expect(userContent).toContain("Meta policy")
    expect(userContent).toContain("Red")
    expect(call.messages[0]?.role).toBe("system")
    expect(call.messages[1]?.role).toBe("user")
  })

  it("uses the structured variant strategy in the system prompt", async () => {
    mockLLMResponse({
      variants: [
        { headline: "H", body: "B", cta: "C", complianceScore: 90, hookPreservation: 80 },
      ],
    })

    await generateVariants("Some ad.", [], ["meta"])

    const call = mockedCompletion.mock.calls[0][0]
    const system = call.messages[0]?.content ?? ""

    expect(system).toContain("complianceScore")
    expect(system).toContain("hookPreservation")
    expect(system).toContain("Curiosity")
    expect(system).toContain("Empowerment")
    expect(system).toContain("Social Proof")
  })

  it("accepts alternate LLM keys for variants array", async () => {
    mockLLMResponse({
      rewrites: [
        { headline: "H1", body: "B1", cta: "C1", complianceScore: 90, hookPreservation: 80 },
      ],
    })

    const result = await generateVariants("Ad.", [], ["meta"])
    expect(result).toHaveLength(1)
    expect(result[0].parts.body).toBe("B1")
  })

  it("normalizes a single combined text string into parts", async () => {
    mockLLMResponse({
      variants: [
        {
          text: "Headline here\n\nBody paragraph one.\n\nBody paragraph two.\n\nClick here",
          complianceScore: 88,
          hookPreservation: 75,
        },
      ],
    })

    const result = await generateVariants("Ad.", [], ["meta"])
    expect(result).toHaveLength(1)
    expect(result[0].parts.headline).toBe("Headline here")
    expect(result[0].parts.body).toContain("Body paragraph one")
    expect(result[0].parts.cta).toContain("Click here")
  })

  it("falls back to default compliance/hook scores when LLM omits them", async () => {
    mockLLMResponse({
      variants: [
        { headline: "H", body: "B", cta: "C" },
      ],
    })

    const result = await generateVariants("Ad.", [], ["meta"])
    expect(result[0].complianceScore).toBe(85)
    expect(result[0].hookPreservation).toBe(80)
  })

  it("rejects an optimizer response with no usable variants", async () => {
    mockedCompletion.mockResolvedValueOnce({
      id: "test",
      choices: [
        {
          message: {
            content: JSON.stringify({ variants: [null, { junk: true }] }),
          },
        },
      ],
    })

    await expect(generateVariants("Ad.", [], ["meta"])).rejects.toThrow(
      /no usable variants/
    )
  })

  it("rejects empty optimizer response", async () => {
    mockedCompletion.mockResolvedValueOnce({
      id: "test",
      choices: [{ message: { content: "" } }],
    })

    await expect(generateVariants("Ad.", [], ["meta"])).rejects.toThrow(
      /Empty optimizer response/
    )
  })

  it("rejects optimizer response with no variants key", async () => {
    mockedCompletion.mockResolvedValueOnce({
      id: "test",
      choices: [
        {
          message: {
            content: JSON.stringify({ unrelated: "shape" }),
          },
        },
      ],
    })

    await expect(generateVariants("Ad.", [], ["meta"])).rejects.toThrow(
      /Invalid optimizer response/
    )
  })

  it("produces a single text blob from headline/body/cta (joined with double newlines)", async () => {
    mockLLMResponse({
      variants: [
        { headline: "H", body: "B", cta: "C", complianceScore: 90, hookPreservation: 80 },
      ],
    })

    const result = await generateVariants("Ad.", [], ["meta"])
    expect(result[0].text).toBe("H\n\nB\n\nC")
  })

  it("drops variants that have no body, even if they have a headline", async () => {
    mockLLMResponse({
      variants: [
        { headline: "H", body: "", cta: "C", complianceScore: 90, hookPreservation: 80 },
        { headline: "H2", body: "B2", cta: "C2", complianceScore: 90, hookPreservation: 80 },
      ],
    })

    const result = await generateVariants("Ad.", [], ["meta"])
    expect(result).toHaveLength(1)
    expect(result[0].parts.body).toBe("B2")
  })
})
