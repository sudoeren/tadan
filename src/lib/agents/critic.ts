import { openRouterCompletion, extractJsonFromResponse } from "@/lib/openrouter"
import { META_AD_POLICIES } from "@/lib/policies/meta"
import { GOOGLE_ADS_POLICIES } from "@/lib/policies/google"
import { TABOOLA_POLICIES } from "@/lib/policies/taboola"
import type { Platform, AnalysisResult, ViolationLevel } from "@/types"

const POLICY_MAP = {
  meta: META_AD_POLICIES,
  google: GOOGLE_ADS_POLICIES,
  taboola: TABOOLA_POLICIES,
} as const

function buildSystemPrompt(platforms: Platform[]): string {
  const policySections = platforms
    .map((p) => {
      const policy = POLICY_MAP[p]
      const rules = policy.categories
        .map(
          (c) =>
            `### ${c.category}\n${c.rules.map((r) => `- ${r}`).join("\n")}`
        )
        .join("\n\n")
      return `--- ${p.toUpperCase()} ADS POLICIES ---\n${rules}`
    })
    .join("\n\n")

  return `You are a senior ad compliance officer for ${platforms.join(", ")} Ads platforms. Your task is to review ad copy or landing page content against the platform advertising policies provided below.

## Review Instructions

1. Read the provided content carefully.
2. Check EVERY sentence, phrase, and claim against the policies.
3. Flag ANY violation, no matter how subtle — be aggressive in your review.
4. Assign a risk score from 0 to 100:
   - 0-25: Clean, no violations (Green)
   - 26-60: Minor issues, needs slight edits (Yellow)  
   - 61-85: Significant risk, likely disapproval (Orange)
   - 86-100: Account ban risk, immediate rewrite needed (Red)
5. For each violation, specify:
   - "text": the exact problematic phrase from the content
   - "reason": which specific policy rule it violates
   - "level": "Red" for account-banning violations, "Yellow" for likely-disapproval issues

## Platform Policies

${policySections}

## Output Format

Respond ONLY with valid JSON — no markdown, no commentary:

{
  "risk_score": number,
  "violations": [
    {
      "text": "exact violating text from the content",
      "reason": "which policy rule and why",
      "level": "Red" | "Yellow"
    }
  ]
}

If there are no violations, return an empty violations array with risk_score 0.`
}

export async function analyzeContent(
  content: string,
  platforms: Platform[]
): Promise<AnalysisResult> {
  const systemPrompt = buildSystemPrompt(platforms)
  const model = "google/gemini-2.5-flash-preview"

  const response = await openRouterCompletion({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Review the following ad content for compliance with ${platforms.join(", ")} advertising policies:\n\n${content}`,
      },
    ],
    temperature: 0.1,
    maxTokens: 4096,
    responseFormat: { type: "json_object" },
  })

  const raw = response.choices[0]?.message?.content
  if (!raw) {
    throw new Error("Empty response from LLM")
  }

  const parsed = extractJsonFromResponse(raw) as {
    risk_score: number
    violations: { text: string; reason: string; level: string }[]
  }

  if (
    typeof parsed.risk_score !== "number" ||
    !Array.isArray(parsed.violations)
  ) {
    throw new Error(`Invalid response structure: ${raw.slice(0, 200)}`)
  }

  return {
    riskScore: parsed.risk_score,
    violations: parsed.violations.map((v) => ({
      text: v.text,
      reason: v.reason,
      level: v.level as ViolationLevel,
    })),
  }
}
