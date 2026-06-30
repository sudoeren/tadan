import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

vi.mock("@/lib/rag", () => ({
  ensurePolicyEmbeddings: vi.fn().mockResolvedValue(undefined),
  retrieveRelevantPolicies: vi.fn().mockResolvedValue([]),
}))

vi.mock("@/lib/openrouter", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/openrouter")>("@/lib/openrouter")
  return {
    ...actual,
    openRouterCompletion: vi.fn(),
  }
})

vi.mock("@/lib/agents/critic", () => ({
  analyzeContent: vi.fn(),
}))

vi.mock("@/lib/agents/optimizer", () => ({
  generateVariants: vi.fn(),
}))

vi.mock("@/lib/scraper", () => ({
  scrapeLandingPage: vi.fn(),
  formatScrapedContent: vi.fn(),
}))

vi.mock("@/lib/db", () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: "test-id" }]),
  },
}))

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { analyzeContent } from "@/lib/agents/critic"
import { generateVariants } from "@/lib/agents/optimizer"
import { scrapeLandingPage, formatScrapedContent } from "@/lib/scraper"
import { POST } from "@/app/api/analyze/route"

const mockedHeaders = vi.mocked(headers)
const mockedAuth = vi.mocked(auth.api.getSession)
const mockedAnalyze = vi.mocked(analyzeContent)
const mockedGenerate = vi.mocked(generateVariants)
const mockedScrape = vi.mocked(scrapeLandingPage)
const mockedFormat = vi.mocked(formatScrapedContent)

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/analyze", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

let ipCounter = 0
function nextIp(): string {
  ipCounter += 1
  return `10.0.0.${ipCounter}`
}

beforeEach(() => {
  vi.clearAllMocks()
  const ip = nextIp()
  const headerStore: Record<string, string> = {
    "x-forwarded-for": ip,
    "x-real-ip": "",
    "cf-connecting-ip": "",
  }
  mockedHeaders.mockResolvedValue({
    get: vi.fn((name: string) => {
      const key = name.toLowerCase()
      if (key in headerStore) return headerStore[key]
      return null
    }),
  } as never)
  mockedAuth.mockResolvedValue(null)
  mockedAnalyze.mockResolvedValue({
    riskScore: 0,
    violations: [],
    positiveAspects: [],
  })
  mockedGenerate.mockResolvedValue([])
  mockedScrape.mockResolvedValue({
    title: "",
    headings: [],
    bodyText: "",
    buttonTexts: [],
    links: [],
    metaDescription: "",
    privacyPolicyUrl: null,
    hasBaitAndSwitch: false,
  })
  mockedFormat.mockReturnValue("scraped content")
})

describe("POST /api/analyze - input validation", () => {
  it("returns 400 when inputType is missing", async () => {
    const res = await POST(makeRequest({ platforms: ["meta"] }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/inputType/i)
  })

  it("returns 400 when platforms is missing", async () => {
    const res = await POST(makeRequest({ inputType: "text", content: "ad" }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/platforms/i)
  })

  it("returns 400 when platforms is empty array", async () => {
    const res = await POST(
      makeRequest({ inputType: "text", content: "ad", platforms: [] })
    )
    expect(res.status).toBe(400)
  })

  it("returns 400 when platforms is not an array", async () => {
    const res = await POST(
      makeRequest({ inputType: "text", content: "ad", platforms: "meta" })
    )
    expect(res.status).toBe(400)
  })

  it("returns 400 when no valid platforms are provided", async () => {
    const res = await POST(
      makeRequest({
        inputType: "text",
        content: "ad",
        platforms: ["unknown_platform", "another"],
      })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/no valid platforms/i)
  })

  it("filters out invalid platforms but accepts valid ones", async () => {
    const res = await POST(
      makeRequest({
        inputType: "text",
        content: "buy now",
        platforms: ["meta", "unknown", "google"],
      })
    )
    expect(res.status).toBe(200)
    expect(mockedAnalyze).toHaveBeenCalledWith(
      "buy now",
      ["meta", "google"],
      true,
      undefined
    )
  })

  it("returns 400 for url input without a url", async () => {
    const res = await POST(
      makeRequest({ inputType: "url", platforms: ["meta"] })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/url/i)
  })

  it("returns 400 for text input with empty content", async () => {
    const res = await POST(
      makeRequest({ inputType: "text", content: "   ", platforms: ["meta"] })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/content/i)
  })

  it("returns 400 for text input with missing content", async () => {
    const res = await POST(
      makeRequest({ inputType: "text", platforms: ["meta"] })
    )
    expect(res.status).toBe(400)
  })
})

describe("POST /api/analyze - successful text analysis (no stream)", () => {
  it("calls analyzeContent and returns the result", async () => {
    mockedAnalyze.mockResolvedValue({
      riskScore: 75,
      violations: [
        { text: "guaranteed", reason: "Meta policy", level: "Red" },
      ],
      positiveAspects: [],
    })
    mockedGenerate.mockResolvedValue([
      {
        text: "Variant",
        parts: { headline: "H", body: "B", cta: "C" },
        complianceScore: 90,
        hookPreservation: 80,
      },
    ])

    const res = await POST(
      makeRequest({
        inputType: "text",
        content: "guaranteed earnings!",
        platforms: ["meta"],
      })
    )

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.riskScore).toBe(75)
    expect(body.violations).toHaveLength(1)
    expect(body.variants).toHaveLength(1)
    expect(body.variants[0].text).toBe("Variant")
  })

  it("does not call the optimizer when there are no violations", async () => {
    mockedAnalyze.mockResolvedValue({
      riskScore: 5,
      violations: [],
      positiveAspects: [{ label: "Clear", description: "Yes" }],
    })

    const res = await POST(
      makeRequest({
        inputType: "text",
        content: "Buy a $29 fitness tracker.",
        platforms: ["meta"],
      })
    )

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.variants).toEqual([])
    expect(mockedGenerate).not.toHaveBeenCalled()
  })
})

describe("POST /api/analyze - URL input", () => {
  it("scrapes the URL and uses the scraped content for analysis", async () => {
    mockedScrape.mockResolvedValue({
      title: "Landing",
      headings: ["H1"],
      bodyText: "scraped body",
      buttonTexts: ["Buy"],
      links: [],
      metaDescription: "m",
      privacyPolicyUrl: "/privacy",
      hasBaitAndSwitch: false,
    })
    mockedFormat.mockReturnValue("formatted scraped content")

    const res = await POST(
      makeRequest({
        inputType: "url",
        url: "https://example.com/landing",
        platforms: ["meta"],
      })
    )

    expect(res.status).toBe(200)
    expect(mockedScrape).toHaveBeenCalledWith("https://example.com/landing")
    expect(mockedAnalyze).toHaveBeenCalledWith(
      "formatted scraped content",
      ["meta"],
      true,
      []
    )
  })
})

describe("POST /api/analyze - authenticated user gets a stable userId", () => {
  it("uses userId-based rate limiting when authenticated", async () => {
    mockedAuth.mockResolvedValue({
      user: { id: "user-123", email: "x@y.com" },
    } as never)

    const res = await POST(
      makeRequest({
        inputType: "text",
        content: "buy now",
        platforms: ["meta"],
      })
    )

    expect(res.status).toBe(200)
  })
})

describe("POST /api/analyze - error handling", () => {
  it("returns 500 on unexpected LLM error", async () => {
    mockedAnalyze.mockRejectedValue(new Error("OPENROUTER_API_KEY is not configured"))

    const res = await POST(
      makeRequest({
        inputType: "text",
        content: "buy now",
        platforms: ["meta"],
      })
    )

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })
})
