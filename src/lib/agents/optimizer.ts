import { openRouterCompletion, extractJsonFromResponse, DEFAULT_MODEL } from "@/lib/openrouter"
import type { Platform, Violation } from "@/types"

const OPTIMIZER_SYSTEM_PROMPT = `You are an elite affiliate marketing copywriter who rewrites ad copy to pass platform compliance checks while maximizing conversion. You understand the difference between what algorithms flag and what humans buy.

## Copywriting Philosophy

Your goal is NOT to neuter the ad. It's to restructure the same persuasion using compliant language patterns:

1. **Reframe claims as benefits**: Instead of "Lose 10 lbs in 1 week" → "Finally feel light and energized"
2. **Replace direct questions with universal statements**: Instead of "Are you struggling with debt?" → "Debt relief is closer than you think"
3. **Swap guarantees for empowerment**: Instead of "Guaranteed $500/day" → "Proven system that puts you in control"
4. **Use curiosity hooks**: Instead of "This pill melts belly fat" → "The metabolism trick Wall Street doesn't want you to know"
5. **Authority positioning**: Instead of "Best weight loss product" → "Formulated by a board-certified endocrinologist"
6. **Social proof**: Instead of "Everyone is making money with this" → "Trusted by 10,000+ professionals across 40 countries"
7. **Indirect benefit language**: Instead of "Miracle cure for X" → "Supports your body's natural X response"
8. **Eliminate time-bound claims**: Instead of "In just 3 days" → "From day one, you'll notice the difference"

## Never-Use Patterns

- Personal attribute questions: "Are you...?", "Do you suffer from...?"
- Direct medical/health claims: "cures", "treats", "eliminates [disease]"
- Financial promises: "guaranteed", "risk-free returns", "earn $X/day"
- Before/after: "see the transformation", any comparison imagery
- False urgency: "limited time", "only X spots left"
- Superlatives without evidence: "the best", "#1", "top rated"
- Clickbait: "You won't believe...", "Shocking truth..."
- Body shaming: "tired of being fat", "embarrassed by your..."

## Variant Strategies

For each rewrite, pick a distinct angle:
- **Variant 1:** Curiosity + Authority (hook with intrigue, close with credibility)
- **Variant 2:** Empowerment + Benefit (focus on transformation and positive outcome)
- **Variant 3:** Social Proof + Relatability (lean on trust and shared experience)

## Output Rules

- Output ONLY valid JSON, no markdown, no commentary
- Exactly 3 variants
- The JSON must have this exact structure:
  {
    "variants": [
      {
        "headline": "compelling headline (1 short line)",
        "body": "body copy paragraph(s) describing the offer, social proof, benefits",
        "cta": "clear call-to-action (1 short line)",
        "complianceScore": <0-100>,
        "hookPreservation": <0-100>
      },
      ... (2 more variants, each with a different psychological angle)
    ]
  }
- "headline" is the attention-grabbing first line
- "body" is the persuasive middle (can be multiple sentences)
- "cta" is the closing action prompt
- complianceScore and hookPreservation are integers 0-100
- Every word in every field must be platform-safe`

function buildOptimizerUserPrompt(
  original: string,
  violations: Violation[],
  platforms: Platform[]
): string {
  const violationsSummary = violations
    .map(
      (v, i) =>
        `${i + 1}. Problem: "${v.text}"\n   Rule broken: ${v.reason}\n   Severity: ${v.level}`
    )
    .join("\n")

  const violationPhrases = violations.map((v) => v.text).join(", ")

  return `## Task

Rewrite this ad copy to be 100% compliant with ${platforms.join(", ")} policies. The violations below MUST be fixed, but the core marketing hook must survive.

## Original Ad Copy

"""
${original}
"""

## Compliance Violations (must fix)

${violationsSummary}

## Critical Constraint

The following phrases triggered violations and CANNOT appear in any variant. You must find alternative phrasing for each:

${violationPhrases}

## Reminder

- 3 distinct variants, each using a different psychological angle
- NO markdown, NO commentary — just the JSON
- Every word must be platform-safe`
}

export interface OptimizedVariant {
  text: string
  parts: {
    headline: string
    body: string
    cta: string
  }
  complianceScore: number
  hookPreservation: number
}

const VARIANT_KEYS = ["variants", "rewrites", "results", "alternatives", "outputs"]
const TEXT_KEYS = ["text", "copy", "variant", "content", "rewrite", "ad", "output"]

function extractVariants(parsed: unknown): unknown[] | null {
  if (Array.isArray(parsed)) {
    return parsed
  }
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>
    for (const key of VARIANT_KEYS) {
      if (Array.isArray(obj[key])) {
        return obj[key] as unknown[]
      }
    }
  }
  return null
}

function extractText(item: unknown): string | null {
  if (!item || typeof item !== "object") return null
  const obj = item as Record<string, unknown>
  for (const key of TEXT_KEYS) {
    const value = obj[key]
    if (typeof value === "string" && value.trim().length > 0) {
      return value
    }
  }
  return null
}

function readPart(obj: Record<string, unknown>, key: string): string {
  const value = obj[key]
  return typeof value === "string" ? value.trim() : ""
}

function splitCombinedText(text: string): { headline: string; body: string; cta: string } {
  const blocks = text
    .split(/\n\s*\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (blocks.length >= 3) {
    return { headline: blocks[0], body: blocks[1], cta: blocks.slice(2).join("\n\n") }
  }
  if (blocks.length === 2) {
    return { headline: "", body: blocks[0], cta: blocks[1] }
  }
  if (blocks.length === 1) {
    return { headline: "", body: blocks[0], cta: "" }
  }
  return { headline: "", body: text, cta: "" }
}

function normalizeVariant(item: unknown): OptimizedVariant | null {
  if (!item || typeof item !== "object") return null
  const obj = item as Record<string, unknown>

  let headline = readPart(obj, "headline")
  let body = readPart(obj, "body")
  let cta = readPart(obj, "cta")

  if (!headline && !body && !cta) {
    const combined = extractText(item)
    if (!combined) return null
    const split = splitCombinedText(combined)
    headline = split.headline
    body = split.body
    cta = split.cta
  } else {
    if (!body) {
      const combined = extractText(item)
      if (combined) {
        const split = splitCombinedText(combined)
        if (!headline) headline = split.headline
        if (!cta) cta = split.cta
        if (!body) body = split.body || combined
      }
    }
  }

  if (!body) return null

  const parts = { headline, body, cta }
  const text = [headline, body, cta].filter(Boolean).join("\n\n")

  return {
    text,
    parts,
    complianceScore:
      typeof obj.complianceScore === "number" ? obj.complianceScore : 85,
    hookPreservation:
      typeof obj.hookPreservation === "number" ? obj.hookPreservation : 80,
  }
}

export async function generateVariants(
  original: string,
  violations: Violation[],
  platforms: Platform[]
): Promise<OptimizedVariant[]> {
  const userPrompt = buildOptimizerUserPrompt(original, violations, platforms)

  const response = await openRouterCompletion({
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: OPTIMIZER_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.6,
    maxTokens: 1200,
    responseFormat: { type: "json_object" },
  })

  const raw = response.choices[0]?.message?.content
  if (!raw) {
    throw new Error("Empty optimizer response from LLM")
  }

  const parsed = extractJsonFromResponse(raw)
  const rawVariants = extractVariants(parsed)

  if (!rawVariants || rawVariants.length === 0) {
    throw new Error(`Invalid optimizer response: ${raw.slice(0, 300)}`)
  }

  const normalized = rawVariants
    .map((item) => normalizeVariant(item))
    .filter((v): v is OptimizedVariant => v !== null)

  if (normalized.length === 0) {
    throw new Error(
      `Optimizer returned no usable variants: ${raw.slice(0, 300)}`
    )
  }

  return normalized
}
