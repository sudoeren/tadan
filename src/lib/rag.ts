import { openRouterEmbedding } from "@/lib/openrouter"
import { db } from "@/lib/db"
import { platformPolicies } from "@/lib/db/schema"
import { inArray, sql } from "drizzle-orm"

const EMBEDDING_MODEL = "openai/text-embedding-3-small"
const TOP_K = 5
const SIMILARITY_THRESHOLD = 0.3

interface PolicyRule {
  id: string
  platform: string
  category: string
  ruleText: string
  similarity: number
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

function parseEmbedding(raw: string | null): number[] {
  if (!raw) return []
  try {
    return JSON.parse(raw) as number[]
  } catch {
    return []
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  const embeddings = await openRouterEmbedding({
    model: EMBEDDING_MODEL,
    input: text,
  })
  return embeddings[0]
}

export async function retrieveRelevantPolicies(
  query: string,
  platforms?: string[],
  opts?: { topK?: number; threshold?: number }
): Promise<PolicyRule[]> {
  const queryEmb = await generateEmbedding(query)
  const topK = opts?.topK ?? TOP_K
  const threshold = opts?.threshold ?? SIMILARITY_THRESHOLD

  const conditions = platforms?.length
    ? inArray(platformPolicies.platform, platforms)
    : sql`true`

  const allPolicies = await db
    .select({
      id: platformPolicies.id,
      platform: platformPolicies.platform,
      category: platformPolicies.category,
      ruleText: platformPolicies.ruleText,
      embedding: platformPolicies.embedding,
    })
    .from(platformPolicies)
    .where(conditions)

  const scored = allPolicies
    .map((p) => {
      const similarity = cosineSimilarity(queryEmb, parseEmbedding(p.embedding))
      return { id: p.id, platform: p.platform, category: p.category, ruleText: p.ruleText, similarity }
    })
    .filter((r) => r.similarity > threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)

  return scored
}

let embeddingsVerified = false

export async function ensurePolicyEmbeddings(): Promise<void> {
  if (embeddingsVerified) return

  const existing = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(platformPolicies)
  if ((existing[0]?.count ?? 0) > 0) {
    embeddingsVerified = true
    return
  }

  console.log("[tadan] Seeding policy embeddings...")
  await seedPolicyEmbeddings()
  console.log("[tadan] Embeddings seeded.")
  embeddingsVerified = true
}

export async function seedPolicyEmbeddings(): Promise<{
  upserted: number
}> {
  const { META_AD_POLICIES } = await import("@/lib/policies/meta")
  const { GOOGLE_ADS_POLICIES } = await import("@/lib/policies/google")
  const { TABOOLA_POLICIES } = await import("@/lib/policies/taboola")
  const { TIKTOK_POLICIES } = await import("@/lib/policies/tiktok")

  const rules: { platform: string; category: string; ruleText: string; embedding: string }[] = []

  for (const policy of [
    META_AD_POLICIES,
    GOOGLE_ADS_POLICIES,
    TABOOLA_POLICIES,
    TIKTOK_POLICIES,
  ]) {
    for (const cat of policy.categories) {
      for (const rule of cat.rules) {
        rules.push({
          platform: policy.platform,
          category: cat.category,
          ruleText: rule,
          embedding: "",
        })
      }
    }
  }

  const texts = rules.map((r) => r.ruleText)

  const embeddings = await openRouterEmbedding({
    model: EMBEDDING_MODEL,
    input: texts,
  })

  for (let i = 0; i < rules.length; i++) {
    rules[i].embedding = JSON.stringify(embeddings[i])
  }

  await db.delete(platformPolicies)

  for (const rule of rules) {
    await db.insert(platformPolicies).values({
      platform: rule.platform,
      category: rule.category,
      ruleText: rule.ruleText,
      embedding: rule.embedding,
    })
  }

  return { upserted: rules.length }
}

export { type PolicyRule }
