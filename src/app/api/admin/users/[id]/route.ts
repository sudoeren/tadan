import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { analyses, users, variants, violations } from "@/lib/db/schema"
import { eq, desc, inArray } from "drizzle-orm"
import { requireAdmin, isAdminEmail } from "@/lib/admin"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }

  const { id } = await params

  try {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const records = await db
      .select()
      .from(analyses)
      .where(eq(analyses.userId, id))
      .orderBy(desc(analyses.createdAt))
      .limit(200)

    const ids = records.map((r) => r.id)
    let violationRows: typeof violations.$inferSelect[] = []
    let variantRows: typeof variants.$inferSelect[] = []
    if (ids.length > 0) {
      violationRows = await db
        .select()
        .from(violations)
        .where(inArray(violations.analysisId, ids))
      variantRows = await db
        .select()
        .from(variants)
        .where(inArray(variants.analysisId, ids))
    }

    const enriched = records.map((r) => ({
      ...r,
      positiveAspects: r.positiveAspects ?? [],
      violations: violationRows.filter((v) => v.analysisId === r.id),
      variants: variantRows.filter((v) => v.analysisId === r.id).map((v) => ({
        id: v.id,
        analysisId: v.analysisId,
        variantIndex: v.variantIndex,
        variantText: v.variantText,
        variantParts: v.variantParts,
        createdAt: v.createdAt,
      })),
    }))

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isAdmin: isAdminEmail(user.email),
      },
      records: enriched,
    })
  } catch (error) {
    console.error("[tadan] admin user detail failed", error)
    return NextResponse.json(
      { error: "Failed to load user" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }

  const { id } = await params

  if (id === guard.userId) {
    return NextResponse.json(
      { error: "You cannot delete your own account from the admin panel." },
      { status: 400 }
    )
  }

  try {
    const [target] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (isAdminEmail(target.email)) {
      return NextResponse.json(
        { error: "Cannot delete another admin." },
        { status: 400 }
      )
    }

    await db.delete(users).where(eq(users.id, id))

    return NextResponse.json({ success: true, deleted: target.id })
  } catch (error) {
    console.error("[tadan] admin user delete failed", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
