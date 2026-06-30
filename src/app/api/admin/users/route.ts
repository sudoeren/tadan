import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { analyses, users } from "@/lib/db/schema"
import { sql, ilike, or, desc, eq, inArray } from "drizzle-orm"
import { requireAdmin } from "@/lib/admin"

const DEFAULT_LIMIT = 25
const MAX_LIMIT = 100

export async function GET(request: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }

  const url = new URL(request.url)
  const q = url.searchParams.get("q")?.trim() ?? ""
  const platform = url.searchParams.get("platform")?.trim() ?? ""
  const limitParam = Number.parseInt(url.searchParams.get("limit") ?? "", 10)
  const offsetParam = Number.parseInt(url.searchParams.get("offset") ?? "", 10)
  const limit = Math.min(
    Math.max(Number.isFinite(limitParam) ? limitParam : DEFAULT_LIMIT, 1),
    MAX_LIMIT
  )
  const offset = Math.max(Number.isFinite(offsetParam) ? offsetParam : 0, 0)

  try {
    const baseQuery = db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        emailVerified: users.emailVerified,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        analysisCount: sql<number>`count(${analyses.id})::int`,
      })
      .from(users)
      .leftJoin(analyses, eq(analyses.userId, users.id))
      .groupBy(users.id)

    const whereClause = q
      ? or(
          ilike(users.email, `%${q}%`),
          ilike(users.name, `%${q}%`)
        )
      : undefined

    const filtered = whereClause ? baseQuery.where(whereClause) : baseQuery
    const rows = await filtered
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset)

    let lastScanMap = new Map<string, Date | null>()
    if (rows.length > 0) {
      const ids = rows.map((r) => r.id)
      const lastScans = await db
        .select({
          userId: analyses.userId,
          createdAt: sql<Date>`max(${analyses.createdAt})`,
        })
        .from(analyses)
        .where(inArray(analyses.userId, ids))
        .groupBy(analyses.userId)
      lastScanMap = new Map(lastScans.map((s) => [s.userId, s.createdAt]))
    }

    let filteredTotal: number = rows.length
    if (platform) {
      const platformMatches = await db
        .select({ userId: analyses.userId })
        .from(analyses)
        .where(
          sql`${analyses.platform} ilike ${"%" + platform + "%"}`
        )
      const userIdsWithPlatform = new Set(platformMatches.map((p) => p.userId))
      filteredTotal = userIdsWithPlatform.size
    } else {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
      filteredTotal = count
    }

    const records = rows
      .map((r) => ({
        id: r.id,
        email: r.email,
        name: r.name,
        emailVerified: r.emailVerified,
        image: r.image,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        analysisCount: r.analysisCount,
        lastScanAt: lastScanMap.get(r.id) ?? null,
      }))
      .filter((r) => {
        if (!platform) return true
        return r.analysisCount > 0
      })

    return NextResponse.json({
      records,
      total: filteredTotal,
      hasMore: offset + records.length < filteredTotal,
    })
  } catch (error) {
    console.error("[tadan] admin users list failed", error)
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    )
  }
}
