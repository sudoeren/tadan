import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { analyses, users, violations } from "@/lib/db/schema"
import { sql, gt, lte, gte } from "drizzle-orm"
import { requireAdmin } from "@/lib/admin"
import {
  aggregatePlatformUsage,
  averageRiskScore,
  startOfToday,
  topViolationReasons,
} from "@/lib/admin-stats"

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }

  try {
    const [userCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)

    const [analysisCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(analyses)

    const [flaggedCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(analyses)
      .where(gt(analyses.riskScore, 60))

    const [cleanCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(analyses)
      .where(lte(analyses.riskScore, 60))

    const [todayCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(analyses)
      .where(gte(analyses.createdAt, startOfToday()))

    const allAnalyses = await db
      .select({ platform: analyses.platform, riskScore: analyses.riskScore })
      .from(analyses)

    const allViolations = await db
      .select({ reason: violations.reason })
      .from(violations)

    return NextResponse.json({
      totals: {
        users: userCount?.count ?? 0,
        analyses: analysisCount?.count ?? 0,
        flagged: flaggedCount?.count ?? 0,
        clean: cleanCount?.count ?? 0,
        today: todayCount?.count ?? 0,
        avgRiskScore: averageRiskScore(allAnalyses),
      },
      platformUsage: aggregatePlatformUsage(allAnalyses),
      topViolationReasons: topViolationReasons(allViolations, 5),
    })
  } catch (error) {
    console.error("[tadan] admin stats failed", error)
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    )
  }
}
