import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { analyses, violations as violationsTable, variants as variantsTable } from "@/lib/db/schema"
import { scrapeLandingPage, formatScrapedContent } from "@/lib/scraper"
import { analyzeContent } from "@/lib/agents/critic"
import { generateVariants } from "@/lib/agents/optimizer"
import type { Platform } from "@/types"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { inputType, content, url, platforms } = body

    if (!inputType || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: inputType, platforms" },
        { status: 400 }
      )
    }

    let rawContent: string

    if (inputType === "url") {
      if (!url) {
        return NextResponse.json({ error: "URL is required for url input type" }, { status: 400 })
      }

      const scraped = await scrapeLandingPage(url)
      rawContent = formatScrapedContent(scraped)
    } else if (inputType === "text") {
      if (!content || content.trim().length === 0) {
        return NextResponse.json({ error: "Content is required for text input type" }, { status: 400 })
      }
      rawContent = content.trim()
    } else {
      return NextResponse.json(
        { error: "Invalid inputType. Must be 'text' or 'url'" },
        { status: 400 }
      )
    }

    const analysisResult = await analyzeContent(
      rawContent,
      platforms as Platform[]
    )

    const [saved] = await db
      .insert(analyses)
      .values({
        userId: session.user.id,
        inputType,
        rawContent: rawContent.slice(0, 10000),
        platform: platforms.join(","),
        riskScore: analysisResult.riskScore,
        status: "completed",
      })
      .returning()

    if (analysisResult.violations.length > 0) {
      await db.insert(violationsTable).values(
        analysisResult.violations.map((v) => ({
          analysisId: saved.id,
          text: v.text,
          reason: v.reason,
          level: v.level,
          ruleSource: platforms.join(","),
        }))
      )
    }

    let variants: { text: string; complianceScore: number; hookPreservation: number }[] = []

    if (analysisResult.violations.length > 0) {
      variants = await generateVariants(
        rawContent,
        analysisResult.violations.map((v) => ({
          text: v.text,
          reason: v.reason,
          level: v.level,
        })),
        platforms as Platform[]
      )

      if (variants.length > 0) {
        await db.insert(variantsTable).values(
          variants.map((v, i) => ({
            analysisId: saved.id,
            variantText: v.text,
            variantIndex: i,
          }))
        )
      }
    }

    return NextResponse.json({
      id: saved.id,
      riskScore: analysisResult.riskScore,
      violations: analysisResult.violations,
      variants: variants.map((v) => ({
        text: v.text,
        complianceScore: v.complianceScore,
        hookPreservation: v.hookPreservation,
      })),
    })
  } catch (error) {
    console.error("Analysis error:", error)
    const message =
      error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
