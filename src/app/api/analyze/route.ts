import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { analyses, violations as violationsTable, variants as variantsTable } from "@/lib/db/schema"
import { scrapeLandingPage, formatScrapedContent } from "@/lib/scraper"
import { analyzeContent } from "@/lib/agents/critic"
import { generateVariants } from "@/lib/agents/optimizer"
import { ensurePolicyEmbeddings } from "@/lib/rag"
import { withRetry, AppError, ValidationError, toUserFriendlyError } from "@/lib/errors"
import type { Platform } from "@/types"

// Start seeding on module load so it's already in progress when first request arrives
const embeddingsReady = ensurePolicyEmbeddings().catch((err) => {
  console.error("[tadan] Embedding seed failed:", err)
})

function waitForEmbeddings(timeoutMs = 15_000): Promise<void> {
  return Promise.race([
    embeddingsReady,
    new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error(`Embeddings not ready after ${timeoutMs}ms`)), timeoutMs)
    ),
  ])
}

function sse(data: Record<string, unknown>) {
  return `data: ${JSON.stringify(data)}\n\n`
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const userId = session?.user?.id ?? null

  const body = await request.json()
  const { inputType, content, url, platforms, stream = false } = body

  if (!inputType || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
    return NextResponse.json(
      { error: "Missing required fields: inputType, platforms" },
      { status: 400 }
    )
  }

  const validatedPlatforms = platforms.filter(
    (p: string) => ["meta", "google", "taboola", "tiktok"].includes(p)
  ) as Platform[]

  if (validatedPlatforms.length === 0) {
    return NextResponse.json(
      { error: "No valid platforms provided" },
      { status: 400 }
    )
  }

  if (inputType === "url" && !url) {
    return NextResponse.json(
      { error: "URL is required for url input type" },
      { status: 400 }
    )
  }

  if (inputType === "text" && (!content || content.trim().length === 0)) {
    return NextResponse.json(
      { error: "Content is required for text input type" },
      { status: 400 }
    )
  }

  if (stream) {
    return handleStream(request, userId, {
      inputType,
      content,
      url,
      platforms: validatedPlatforms,
    })
  }

  try {
    console.log("[tadan] Starting analysis...")
    await waitForEmbeddings()

    const result = await runPipeline(
      userId,
      inputType,
      content,
      url,
      validatedPlatforms
    )
    return NextResponse.json(result)
  } catch (error) {
    const code = error instanceof AppError ? error.code : "INTERNAL_ERROR"
    console.error(`[tadan] Analysis failed: ${code}`, error)
    const message = toUserFriendlyError(error)
    const status = error instanceof ValidationError ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

async function handleStream(
  request: NextRequest,
  userId: string | null,
  params: {
    inputType: string
    content?: string
    url?: string
    platforms: Platform[]
  }
): Promise<Response> {
  const { inputType, content, url, platforms } = params

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\n${sse(data as Record<string, unknown>)}`))
      }

      try {
        const t0 = Date.now()
        const log = (label: string, ms: number) =>
          console.log(`[tadan] ${label} ${ms}ms`)

        send("progress", { stage: "loading", message: "Loading policy database..." })
        const tEmbed = Date.now()
        await waitForEmbeddings()
        log("embeddings", Date.now() - tEmbed)

        let rawContent: string

        if (inputType === "url") {
          send("progress", { stage: "scraping", message: "Fetching landing page..." })
          const tScrape = Date.now()
          const scraped = await withRetry(() => scrapeLandingPage(url!))
          rawContent = formatScrapedContent(scraped)
          log("scrape", Date.now() - tScrape)
        } else {
          rawContent = content!.trim()
        }

        send("progress", { stage: "analyzing", message: "Analyzing against platform policies..." })
        const tCritic = Date.now()
        const analysisResult = await withRetry(() =>
          analyzeContent(rawContent, platforms)
        )
        log("critic", Date.now() - tCritic)

        let variants: {
          text: string
          parts: { headline: string; body: string; cta: string }
          complianceScore: number
          hookPreservation: number
        }[] = []

        if (analysisResult.violations.length > 0) {
          send("progress", { stage: "optimizing", message: "Generating safe variants..." })
          const tOpt = Date.now()
          variants = await withRetry(() =>
            generateVariants(
              rawContent,
              analysisResult.violations.map((v) => ({
                text: v.text,
                reason: v.reason,
                level: v.level,
              })),
              platforms
            )
          )
          log("optimizer", Date.now() - tOpt)
        }

        let analysisId: string | null = null
        if (userId) {
          const tSave = Date.now()
          const [saved] = await db
            .insert(analyses)
            .values({
              userId,
              inputType,
              rawContent: rawContent.slice(0, 10000),
              platform: platforms.join(","),
              riskScore: analysisResult.riskScore,
              positiveAspects: analysisResult.positiveAspects,
              status: "completed",
            })
            .returning()
          analysisId = saved.id

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

          if (variants.length > 0) {
            const tVar = Date.now()
            await db.insert(variantsTable).values(
              variants.map((v, i) => ({
                analysisId: saved.id,
                variantText: v.text,
                variantIndex: i,
                variantParts: v.parts,
              }))
            )
            log("db.save.variants", Date.now() - tVar)
          }
          log("db.save.analysis+violations", Date.now() - tSave)
        } else {
          console.log("[tadan] db.save.skipped (no user)")
        }

        log("TOTAL", Date.now() - t0)

        send("result", {
          id: analysisId,
          riskScore: analysisResult.riskScore,
          violations: analysisResult.violations,
          positiveAspects: analysisResult.positiveAspects,
          variants: variants.map((v) => ({
            text: v.text,
            parts: v.parts,
            complianceScore: v.complianceScore,
            hookPreservation: v.hookPreservation,
          })),
        })

        send("done", {})
      } catch (error) {
        console.error("[tadan] Stream error:", error)
        send("error", {
          error: toUserFriendlyError(error),
        })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

async function runPipeline(
  userId: string | null,
  inputType: string,
  content: string | undefined,
  url: string | undefined,
  platforms: Platform[]
) {
  const t0 = Date.now()
  const log = (label: string, ms: number) =>
    console.log(`[tadan] ${label} ${ms}ms`)

  let rawContent: string

  if (inputType === "url") {
    const tScrape = Date.now()
    const scraped = await withRetry(() => scrapeLandingPage(url!))
    rawContent = formatScrapedContent(scraped)
    log("scrape", Date.now() - tScrape)
  } else {
    rawContent = content!.trim()
  }

  const tCritic = Date.now()
  const analysisResult = await withRetry(() =>
    analyzeContent(rawContent, platforms)
  )
  log("critic", Date.now() - tCritic)

  let variants: {
    text: string
    parts: { headline: string; body: string; cta: string }
    complianceScore: number
    hookPreservation: number
  }[] = []

  if (analysisResult.violations.length > 0) {
    const tOpt = Date.now()
    variants = await withRetry(() =>
      generateVariants(
        rawContent,
        analysisResult.violations.map((v) => ({
          text: v.text,
          reason: v.reason,
          level: v.level,
        })),
        platforms
      )
    )
    log("optimizer", Date.now() - tOpt)
  }

  let analysisId: string | null = null
  if (userId) {
    const tSave = Date.now()
    const [saved] = await db
      .insert(analyses)
      .values({
        userId,
        inputType,
        rawContent: rawContent.slice(0, 10000),
        platform: platforms.join(","),
        riskScore: analysisResult.riskScore,
        positiveAspects: analysisResult.positiveAspects,
        status: "completed",
      })
      .returning()
    analysisId = saved.id

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

    if (variants.length > 0) {
      const tVar = Date.now()
      await db.insert(variantsTable).values(
        variants.map((v, i) => ({
          analysisId: saved.id,
          variantText: v.text,
          variantIndex: i,
          variantParts: v.parts,
        }))
      )
      log("db.save.variants", Date.now() - tVar)
    }
    log("db.save.analysis+violations", Date.now() - tSave)
  } else {
    console.log("[tadan] db.save.skipped (no user)")
  }

  log("TOTAL", Date.now() - t0)

  return {
    id: analysisId,
    riskScore: analysisResult.riskScore,
    violations: analysisResult.violations,
    positiveAspects: analysisResult.positiveAspects,
    variants: variants.map((v) => ({
      text: v.text,
      parts: v.parts,
      complianceScore: v.complianceScore,
      hookPreservation: v.hookPreservation,
    })),
  }
}
