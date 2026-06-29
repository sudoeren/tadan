import { openRouterCompletion, extractJsonFromResponse } from "@/lib/openrouter"
import { META_AD_POLICIES } from "@/lib/policies/meta"
import { GOOGLE_ADS_POLICIES } from "@/lib/policies/google"
import { TABOOLA_POLICIES } from "@/lib/policies/taboola"
import { TIKTOK_POLICIES } from "@/lib/policies/tiktok"
import { retrieveRelevantPolicies } from "@/lib/rag"
import type { Platform, AnalysisResult, ViolationLevel } from "@/types"

const POLICY_MAP = {
  meta: META_AD_POLICIES,
  google: GOOGLE_ADS_POLICIES,
  taboola: TABOOLA_POLICIES,
  tiktok: TIKTOK_POLICIES,
} as const

const CRITIC_SYSTEM_PROMPT = `You are a senior ad compliance officer with deep expertise in affiliate marketing and native advertising. Your job is to scan ad copy and landing page content against platform advertising policies and identify violations that could lead to account bans or ad disapprovals.

## Review Methodology

1. **Read the entire content.** Understand the offer, hook, and conversion flow.
2. **Check every sentence, phrase, word choice, and implied claim** against the platform policies provided.
3. **Be aggressive but accurate.** Better to flag borderline content than miss a violation that gets the account banned.
4. **Context matters.** A phrase that seems harmless in one context could be a policy violation in another (e.g. "guarantee" in a financial ad vs. a product warranty).

## Risk Scoring

Assign a risk score from 0 to 100:
- **0-25 (Safe):** Fully compliant. Ships without edits.
- **26-60 (Low Risk):** Minor wording issues. Likely approved but could be flagged.
- **61-85 (High Risk):** Policy violations present. Likely rejected or account flagged.
- **86-100 (Ban Risk):** Severe violations. Will trigger account suspension or ban.

## Violation Levels

- **Red:** Direct policy violation that can cause immediate account suspension (e.g. financial promises, health cure claims, misleading information, prohibited content).
- **Yellow:** Borderline content that may cause ad disapproval (e.g. excessive caps, aggressive tone, unclear disclosures, minor landing page issues).

## Key Red Flags to Watch For

- Guaranteed income or earnings claims
- Before/after comparisons, "miracle" cures
- Negative self-perception targeting
- Clickbait or sensationalist headlines
- Misleading scarcity/urgency without basis
- Missing privacy policy or disclosures
- Bait-and-switch landing pages
- Excessive skin exposure in imagery language
- Personal attribute assertions ("Are you overweight?")

## Output Format

Respond ONLY with valid JSON — no markdown, no commentary:

{
  "risk_score": number,
  "violations": [
    {
      "text": "exact violating text from the content",
      "reason": "specific policy rule violated and why it's problematic",
      "level": "Red" | "Yellow"
    }
  ]
}

If there are no violations, return an empty violations array with risk_score 0.`

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
  useRag = true
): Promise<AnalysisResult> {
  let ragPolicies = ""

  if (useRag) {
    try {
      const relevant = await retrieveRelevantPolicies(content, platforms)
      if (relevant.length > 0) {
        ragPolicies =
          "\n## Most Relevant Policy Rules (RAG-matched)\n" +
          relevant
            .map(
              (r) =>
                `- [${r.platform}] ${r.category}: ${r.ruleText}`
            )
            .join("\n") +
          "\n"
      }
    } catch {
      // RAG unavailable, fall through to full policy docs
      useRag = false
    }
  }

  const policyContext = useRag
    ? ragPolicies + "\n## Full Policy Reference\n" + buildPolicyContext(platforms)
    : buildPolicyContext(platforms)

  const systemPrompt =
    CRITIC_SYSTEM_PROMPT + "\n\n## Platform Policies\n\n" + policyContext

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
