import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { analyses, violations, variants } from "@/lib/db/schema"
import { eq, desc, inArray } from "drizzle-orm"

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const records = await db
      .select()
      .from(analyses)
      .where(eq(analyses.userId, session.user.id))
      .orderBy(desc(analyses.createdAt))
      .limit(100)

    const ids = records.map((r) => r.id)

    let violationRows: typeof violations.$inferSelect[] = []
    let variantRows: typeof variants.$inferSelect[] = []

    if (ids.length > 0) {
      violationRows = await db.select().from(violations).where(inArray(violations.analysisId, ids))
      variantRows = await db.select().from(variants).where(inArray(variants.analysisId, ids))
    }

    const enriched = records.map((r) => ({
      ...r,
      violations: violationRows.filter((v) => v.analysisId === r.id),
      variants: variantRows.filter((v) => v.analysisId === r.id),
    }))

    return NextResponse.json({ records: enriched })
  } catch (error) {
    console.error("[tadan] history fetch failed", error)
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 })
  }
}
