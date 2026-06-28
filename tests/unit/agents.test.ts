import { describe, it, expect } from "vitest"
import { extractJsonFromResponse } from "@/lib/openrouter"
import { withRetry, AppError, LLMError } from "@/lib/errors"

describe("extractJsonFromResponse", () => {
  it("extracts JSON from markdown code block", () => {
    const result = extractJsonFromResponse(
      '```json\n{"risk_score": 50, "violations": []}\n```'
    )
    expect(result).toEqual({ risk_score: 50, violations: [] })
  })

  it("extracts bare JSON object", () => {
    const result = extractJsonFromResponse(
      '{"risk_score": 50, "violations": []}'
    )
    expect(result).toEqual({ risk_score: 50, violations: [] })
  })

  it("extracts bare JSON array", () => {
    const result = extractJsonFromResponse('[{"text": "test"}]')
    expect(result).toEqual([{ text: "test" }])
  })

  it("throws on non-JSON content", () => {
    expect(() => extractJsonFromResponse("just some text")).toThrow(
      "Could not extract JSON"
    )
  })
})

describe("withRetry", () => {
  it("succeeds on first try", async () => {
    const fn = async () => 42
    const result = await withRetry(fn)
    expect(result).toBe(42)
  })

  it("retries on failure and succeeds", async () => {
    let calls = 0
    const fn = async () => {
      calls++
      if (calls < 3) throw new Error("fail")
      return "ok"
    }
    const result = await withRetry(fn, { maxRetries: 3 })
    expect(result).toBe("ok")
    expect(calls).toBe(3)
  })

  it("does not retry non-retryable errors", async () => {
    let calls = 0
    const fn = async () => {
      calls++
      throw new AppError("bad input", 400, "VALIDATION", false)
    }
    await expect(
      withRetry(fn, { maxRetries: 3 })
    ).rejects.toThrow("bad input")
    expect(calls).toBe(1)
  })

  it("retries retryable LLM errors", async () => {
    let calls = 0
    const fn = async () => {
      calls++
      if (calls < 2) throw new LLMError("timeout")
      return "ok"
    }
    const result = await withRetry(fn, { maxRetries: 2, baseDelayMs: 10 })
    expect(result).toBe("ok")
    expect(calls).toBe(2)
  })
})
