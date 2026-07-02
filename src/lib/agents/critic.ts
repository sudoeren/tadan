import { openRouterCompletion, extractJsonFromResponse, DEFAULT_MODEL } from "@/lib/openrouter"
import { META_AD_POLICIES } from "@/lib/policies/meta"
import { GOOGLE_ADS_POLICIES } from "@/lib/policies/google"
import { TABOOLA_POLICIES } from "@/lib/policies/taboola"
import { TIKTOK_POLICIES } from "@/lib/policies/tiktok"
import { retrieveRelevantPolicies, type PolicyRule } from "@/lib/rag"
import type { Platform, AnalysisResult, Violation, ViolationLevel } from "@/types"

// For very short content, the full policy docs are small enough that RAG
// doesn't add useful signal — it just adds an embedding API call (~500ms).
// Below this length we skip RAG and use the full docs directly.
const SHORT_CONTENT_RAG_SKIP = 200

const POLICY_MAP = {
  meta: META_AD_POLICIES,
  google: GOOGLE_ADS_POLICIES,
  taboola: TABOOLA_POLICIES,
  tiktok: TIKTOK_POLICIES,
} as const

const CRITIC_SYSTEM_PROMPT = [
  "You are a senior ad compliance officer with deep expertise in affiliate marketing and native advertising. Your job is to scan ad copy and landing page content against platform advertising policies and identify violations that could lead to account bans or ad disapprovals.",
  "",
  "## Review Methodology",
  "",
  "1. Read the entire content. Understand the offer, hook, and conversion flow.",
  "2. Check every sentence, phrase, word choice, and implied claim against the platform policies provided.",
  "3. Be aggressive but accurate. Better to flag borderline content than miss a violation that gets the account banned.",
  "4. Context matters. A phrase that seems harmless in one context could be a policy violation in another (e.g. guarantee in a financial ad vs. a product warranty).",
  "",
  "## Bait-and-Switch Detection (CRITICAL)",
  "",
  "The input may include a BAIT-AND-SWITCH section with a MISMATCH SCORE and DETECTED PATTERNS. This is an automated heuristic — you must independently evaluate it.",
  "",
  "1. Compare the extracted PROMISE against the actual PAGE BODY content. Does the page deliver what the title, meta description, and CTAs promise?",
  "2. If the page headline makes a specific claim (free trial, earn money, health cure, instant access) but the body content is generic, unrelated, or gates the promise behind forms/payments, flag it as a RED-level violation.",
  "3. If the MISMATCH SCORE is >= 30 and you confirm the page doesn't deliver on its core proposition, this is a HIGH-SEVERITY violation under all platform landing page policies.",
  "4. Even if the heuristic says 'No', if you notice the page promise doesn't match content, flag it. The heuristic is a signal, not a verdict.",
  "5. Specific bait-and-switch violations to watch for:",
  "   - Free/trial headline + pricing page = Red violation (Meta/Taboola suspension risk)",
  "   - Earn money/financial freedom headline + no product = Red violation",
  "   - Health/weight loss cure claim + generic blog content = Red violation",
  "   - Instant access/download headline + multi-step form funnel = Yellow violation",
  "   - Clickbait/sensationalist headline + unrelated body content = Yellow violation",
  "   - Urgency/scarcity language with no verifiable offer = Yellow violation",
  "",
  "## Risk Scoring (0-100)",
  "",
  "- 0-25 (Safe): Fully compliant. Ships without edits.",
  "- 26-60 (Low Risk): Minor wording issues. Likely approved but could be flagged.",
  "- 61-85 (High Risk): Policy violations present. Likely rejected or account flagged.",
  "- 86-100 (Ban Risk): Severe violations. Will trigger account suspension or ban.",
  "",
  "## Violation Levels",
  "",
  "- Red: Direct policy violation that can cause immediate account suspension (financial promises, health cure claims, misleading info, prohibited content, confirmed bait-and-switch, landing page doesn't deliver on ad promise).",
  "- Yellow: Borderline content that may cause ad disapproval (excessive caps, aggressive tone, unclear disclosures, minor landing page issues, suspected misalignment between headline and content).",
  "",
  "## Red Flags",
  "",
  "Guaranteed income/earnings, before/after, miracle cures, negative self-perception targeting, clickbait, false scarcity/urgency, missing privacy policy or disclosures, bait-and-switch landing pages, excessive skin exposure in imagery language, personal attribute questions ('Are you overweight?').",
  "",
  "## Output Format",
  "",
  "Respond ONLY with valid JSON. No markdown, no commentary.",
  "",
  '{"risk_score": number, "violations": [{"text": "exact violating text", "reason": "specific policy rule violated and why it is problematic", "level": "Red" | "Yellow"}], "positiveAspects": [{"label": "short title (2-4 words)", "description": "one sentence referencing actual content from the ad"}]}',
  "",
  "## Positive Aspects",
  "",
  "When the ad is largely compliant (risk_score <= 25), populate positiveAspects with 3-5 specific things this ad does well. Each must reference the actual content of the ad - no generic platitudes. If risk_score > 25 or no violations, positiveAspects is an empty array.",
].join("\n")

function buildPolicyContext(platforms: Platform[]): string {
  return platforms
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
}

export async function analyzeContent(
  content: string,
  platforms: Platform[],
  useRag = true,
  precomputedRag?: PolicyRule[]
): Promise<AnalysisResult> {
  let ragPolicies = ""
  let ragSucceeded = false

  if (useRag) {
    if (precomputedRag && precomputedRag.length > 0) {
      // RAG was pre-fetched by the caller (e.g. in parallel with scraping
      // a landing page). Use it directly without making another
      // embedding API call.
      ragSucceeded = true
    } else if (content.length >= SHORT_CONTENT_RAG_SKIP) {
      // For very short content, the full policy docs are sufficient and
      // RAG doesn't add useful signal — skip the embedding round-trip.
      try {
        const relevant = await retrieveRelevantPolicies(content, platforms)
        if (relevant.length > 0) {
          precomputedRag = relevant
          ragSucceeded = true
        } else {
          const fallback = await retrieveRelevantPolicies(content, platforms, {
            topK: 15,
            threshold: 0,
          })
          if (fallback.length > 0) {
            precomputedRag = fallback
            ragSucceeded = true
          }
        }
      } catch {
        // RAG unavailable, fall through to full policy docs
      }
    }
  }

  if (ragSucceeded) {
    const relevant = precomputedRag ?? []
    ragPolicies =
      "## Most Relevant Policy Rules (RAG-matched)\n" +
      relevant
        .map((r) => `- [${r.platform}] ${r.category}: ${r.ruleText}`)
        .join("\n") +
      "\n"
  }

  // Only include the full policy reference if RAG didn't yield results.
  // When RAG succeeds, the top-K matched rules are the ones the LLM needs
  // to evaluate the ad — sending every category of every platform
  // duplicates the same information and dramatically inflates the prompt.
  const policyContext = ragSucceeded
    ? ragPolicies
    : buildPolicyContext(platforms)

  const systemPrompt =
    CRITIC_SYSTEM_PROMPT + "\n\n## Platform Policies\n\n" + policyContext

  const model = DEFAULT_MODEL

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
    maxTokens: 1500,
    responseFormat: { type: "json_object" },
  })

  const raw = response.choices[0]?.message?.content
  if (!raw) {
    throw new Error("Empty response from LLM")
  }

  const parsed = extractJsonFromResponse(raw) as {
    risk_score: number
    violations: { text: string; reason: string; level: string }[]
    positiveAspects?: { label?: string; description?: string }[]
  }

  if (
    typeof parsed.risk_score !== "number" ||
    !Array.isArray(parsed.violations)
  ) {
    throw new Error(`Invalid response structure: ${raw.slice(0, 200)}`)
  }

  const positiveAspects = (parsed.positiveAspects ?? [])
    .filter(
      (p): p is { label: string; description: string } =>
        typeof p?.label === "string" &&
        p.label.trim().length > 0 &&
        typeof p?.description === "string" &&
        p.description.trim().length > 0
    )
    .map((p) => ({
      label: p.label.trim(),
      description: p.description.trim(),
    }))

  const violations: Violation[] = parsed.violations.map((v) => ({
    text: v.text,
    reason: v.reason,
    level: v.level as ViolationLevel,
  }))

  return {
    riskScore: finalizeRiskScore(violations, parsed.risk_score),
    violations,
    positiveAspects,
  }
}

export const RED_WEIGHT = 20
export const YELLOW_WEIGHT = 5
export const RISK_SCORE_MAX = 100

export function computeDeterministicRiskScore(violations: Violation[]): number {
  let score = 0
  for (const v of violations) {
    if (v.level === "Red") score += RED_WEIGHT
    else if (v.level === "Yellow") score += YELLOW_WEIGHT
  }
  return Math.min(RISK_SCORE_MAX, score)
}

export function finalizeRiskScore(
  violations: Violation[],
  llmScore: number
): number {
  const deterministic = computeDeterministicRiskScore(violations)
  if (typeof llmScore !== "number" || Number.isNaN(llmScore)) {
    return deterministic
  }
  const clampedLlm = Math.max(
    0,
    Math.min(RISK_SCORE_MAX, Math.round(llmScore))
  )
  return Math.max(deterministic, clampedLlm)
}
