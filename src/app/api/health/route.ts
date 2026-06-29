import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET() {
  let dbOk = false
  try {
    await db.execute(sql`select 1`)
    dbOk = true
  } catch {}

  const status = dbOk ? 200 : 503
  return NextResponse.json(
    {
      ok: dbOk,
      service: "tadan",
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}
