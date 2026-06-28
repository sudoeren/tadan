import { openRouterCompletion, extractJsonFromResponse } from "@/lib/openrouter"
import type { Platform, Violation } from "@/types"

function buildOptimizerPrompt(
  original: string,
  violations: Violation[],
  platforms: Platform[]
): string {
  const violationsSummary = violations
    .map(
      (v, i) =>
        `${i + 1}. Problem: "${v.text}"\n   Violates: ${v.reason}\n   Severity: ${v.level}`
    )
    .join("\n")

  return `You are an elite affiliate marketing copywriter who specializes in rewriting ad copy to be 100% compliant with ${platforms.join(", ")} advertising policies while preserving the psychological hook and conversion power of the original.

## Critical Rules

1. NEVER use the following patterns (they trigger bans):
   - Direct health/weight claims ("lose X pounds in Y days")
   - Before/after comparisons or imagery language
   - Guaranteed income/financial promises
   - Negative body image or personal attribute targeting
   - Sensationalist clickbait headlines
   - Misleading urgency ("limited time", fake countdowns)
   - Questions that imply personal shortcomings ("Are you struggling with...?")

2. DO use these safe psychological angles:
   - Curiosity-driven openings
   - Empowerment and self-improvement framing
   - Social proof and authority signals
   - Benefit-focused language (not claim-focused)
   - Metaphors and indirect language for sensitive topics
   - Professional expertise positioning

## Original Ad Copy

"""
${original}
"""

## Compliance Violations Found

${violationsSummary}

## Task

Rewrite the ad copy into 3 distinct safe variants. Each variant must:
- Be 100% compliant with ${platforms.join(", ")} policies
- Preserve the core marketing hook and conversion intent
- Use a different psychological angle from the other variants
- Sound natural and persuasive, not robotic

## Output Format

Respond ONLY with valid JSON:

{
  "variants": [
    {
      "text": "The rewritten safe ad copy...",
      "compliance_score": number (0-100),
      "hook_preservation": number (0-100)
    }
  ]
}

Generate exactly 3 variants.`
}

export interface OptimizedVariant {
  text: string
  complianceScore: number
  hookPreservation: number
}

export async function generateVariants(
  original: string,
  violations: Violation[],
  platforms: Platform[]
): Promise<OptimizedVariant[]> {
  const systemPrompt = `You are an elite affiliate copywriter. Always respond ONLY with the requested JSON — no markdown, no commentary.`
  const userPrompt = buildOptimizerPrompt(original, violations, platforms)
  const model = "google/gemini-2.5-flash-preview"

  const response = await openRouterCompletion({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    maxTokens: 4096,
    responseFormat: { type: "json_object" },
  })

  const raw = response.choices[0]?.message?.content
  if (!raw) {
    throw new Error("Empty response from LLM")
  }

  const parsed = extractJsonFromResponse(raw) as {
    variants: OptimizedVariant[]
  }

  if (!Array.isArray(parsed.variants)) {
    throw new Error(`Invalid optimizer response: ${raw.slice(0, 200)}`)
  }

  return parsed.variants
}
