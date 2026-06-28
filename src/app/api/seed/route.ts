import { NextRequest, NextResponse } from "next/server"
import { seedPolicyEmbeddings } from "@/lib/rag"

export async function POST(request: NextRequest) {
  try {
    const seedKey = process.env.SEED_API_KEY
    if (seedKey) {
      const auth = request.headers.get("authorization")
      if (auth !== `Bearer ${seedKey}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const result = await seedPolicyEmbeddings()
    return NextResponse.json({
      success: true,
      upserted: result.upserted,
    })
  } catch (error) {
    console.error("Seed error:", error)
    const message = error instanceof Error ? error.message : "Seed failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
