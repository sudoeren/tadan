import { openRouterEmbedding } from "@/lib/openrouter"
import { db } from "@/lib/db"
import { platformPolicies } from "@/lib/db/schema"
import { cosineDistance, sql } from "drizzle-orm"

const EMBEDDING_MODEL = "openai/text-embedding-3-small"
const EMBEDDING_DIMENSIONS = 1536
const TOP_K = 8
const SIMILARITY_THRESHOLD = 0.3

interface PolicyRule {
  id: string
  platform: string
  category: string
  ruleText: string
  similarity: number
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
  platforms?: string[]
): Promise<PolicyRule[]> {
  const embedding = await generateEmbedding(query)

  const embeddingStr = `[${embedding.join(",")}]`

  const conditions = [sql`1=1`]
  if (platforms && platforms.length > 0) {
    const platformList = platforms.map((p) => `'${p}'`).join(",")
    conditions.push(sql.raw(`platform IN (${platformList})`))
  }

  const results = await db
    .select({
      id: platformPolicies.id,
      platform: platformPolicies.platform,
      category: platformPolicies.category,
      ruleText: platformPolicies.ruleText,
      similarity: sql<number>`1 - (${cosineDistance(platformPolicies.embedding, embeddingStr)})`,
    })
    .from(platformPolicies)
    .where(
      sql`${cosineDistance(platformPolicies.embedding, embeddingStr)} > ${SIMILARITY_THRESHOLD}`
    )
    .orderBy(
      sql`${cosineDistance(platformPolicies.embedding, embeddingStr)} ASC`
    )
    .limit(TOP_K)

  return results
}

export async function ensurePolicyEmbeddings(): Promise<void> {
  const existing = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(platformPolicies)
  if ((existing[0]?.count ?? 0) > 0) return

  console.log("[tadan] Seeding policy embeddings...")
  await seedPolicyEmbeddings()
  console.log("[tadan] Embeddings seeded.")
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
    rules[i].embedding = `[${embeddings[i].join(",")}]`
  }

  await db.delete(platformPolicies)

  for (const rule of rules) {
    await db.insert(platformPolicies).values({
      platform: rule.platform,
      category: rule.category,
      ruleText: rule.ruleText,
      embedding: sql`${rule.embedding}::vector(${EMBEDDING_DIMENSIONS})`,
    })
  }

  return { upserted: rules.length }
}

export { type PolicyRule }
