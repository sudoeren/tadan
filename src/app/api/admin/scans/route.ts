import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { analyses, users, variants, violations } from "@/lib/db/schema"
import { desc, eq, inArray, sql } from "drizzle-orm"
import { requireAdmin } from "@/lib/admin"

const DEFAULT_LIMIT = 30
const MAX_LIMIT = 100

export async function GET(request: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }

  const url = new URL(request.url)
  const limitParam = Number.parseInt(url.searchParams.get("limit") ?? "", 10)
  const offsetParam = Number.parseInt(url.searchParams.get("offset") ?? "", 10)
  const userId = url.searchParams.get("userId")?.trim() || null
  const limit = Math.min(
    Math.max(Number.isFinite(limitParam) ? limitParam : DEFAULT_LIMIT, 1),
    MAX_LIMIT
  )
  const offset = Math.max(Number.isFinite(offsetParam) ? offsetParam : 0, 0)

  try {
    const whereClause = userId ? eq(analyses.userId, userId) : undefined

    const [{ count: total }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(analyses)
      .where(whereClause)

    const baseQuery = db
      .select({
        id: analyses.id,
        inputType: analyses.inputType,
        rawContent: analyses.rawContent,
        platform: analyses.platform,
        riskScore: analyses.riskScore,
        status: analyses.status,
        createdAt: analyses.createdAt,
        userId: analyses.userId,
        userEmail: users.email,
        userName: users.name,
      })
      .from(analyses)
      .leftJoin(users, eq(users.id, analyses.userId))
      .orderBy(desc(analyses.createdAt))
      .limit(limit)
      .offset(offset)

    const rows = whereClause
      ? await baseQuery.where(whereClause)
      : await baseQuery

    const ids = rows.map((r) => r.id)
    let violationCountRows: { analysisId: string; count: number }[] = []
    let variantCountRows: { analysisId: string; count: number }[] = []
    if (ids.length > 0) {
      violationCountRows = await db
        .select({
          analysisId: violations.analysisId,
          count: sql<number>`count(*)::int`,
        })
        .from(violations)
        .where(inArray(violations.analysisId, ids))
        .groupBy(violations.analysisId)
      variantCountRows = await db
        .select({
          analysisId: variants.analysisId,
          count: sql<number>`count(*)::int`,
        })
        .from(variants)
        .where(inArray(variants.analysisId, ids))
        .groupBy(variants.analysisId)
    }

    const violationMap = new Map(
      violationCountRows.map((v) => [v.analysisId, v.count])
    )
    const variantMap = new Map(
      variantCountRows.map((v) => [v.analysisId, v.count])
    )

    const records = rows.map((r) => ({
      id: r.id,
      inputType: r.inputType,
      rawContent: r.rawContent,
      platform: r.platform,
      riskScore: r.riskScore,
      status: r.status,
      createdAt: r.createdAt,
      user: r.userId
        ? { id: r.userId, email: r.userEmail, name: r.userName }
        : null,
      violationCount: violationMap.get(r.id) ?? 0,
      variantCount: variantMap.get(r.id) ?? 0,
    }))

    return NextResponse.json({
      records,
      total: total ?? 0,
      hasMore: offset + records.length < (total ?? 0),
    })
  } catch (error) {
    console.error("[tadan] admin scans feed failed", error)
    return NextResponse.json(
      { error: "Failed to load scans" },
      { status: 500 }
    )
  }
}
