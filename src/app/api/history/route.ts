import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { analyses, violations, variants } from "@/lib/db/schema"
import { and, eq, desc, inArray } from "drizzle-orm"

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
      positiveAspects: r.positiveAspects ?? [],
      violations: violationRows.filter((v) => v.analysisId === r.id),
      variants: variantRows
        .filter((v) => v.analysisId === r.id)
        .map((v) => ({
          id: v.id,
          analysisId: v.analysisId,
          variantIndex: v.variantIndex,
          variantText: v.variantText,
          variantParts: v.variantParts,
          createdAt: v.createdAt,
        })),
    }))

    return NextResponse.json({ records: enriched })
  } catch (error) {
    console.error("[tadan] history fetch failed", error)
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const idsParam = url.searchParams.get("ids")

  if (!idsParam) {
    return NextResponse.json(
      { error: "ids query parameter required" },
      { status: 400 }
    )
  }

  const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean)
  if (ids.length === 0) {
    return NextResponse.json({ error: "No valid ids" }, { status: 400 })
  }

  try {
    const deleted = await db
      .delete(analyses)
      .where(
        and(
          eq(analyses.userId, session.user.id),
          inArray(analyses.id, ids)
        )
      )
      .returning({ id: analyses.id })

    return NextResponse.json({ deleted: deleted.length })
  } catch (error) {
    console.error("[tadan] history delete failed", error)
    return NextResponse.json(
      { error: "Failed to delete history" },
      { status: 500 }
    )
  }
}
