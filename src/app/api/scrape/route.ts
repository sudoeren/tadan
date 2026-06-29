import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { scrapeLandingPage, formatScrapedContent } from "@/lib/scraper"
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ip = await getClientIp()
    const userId = session.user.id
    const limitResult = rateLimit(`scrape:u:${userId}:ip:${ip}`, RATE_LIMITS.scrape.authenticated)
    if (!limitResult.ok) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${limitResult.retryAfterSec}s.` },
        {
          status: 429,
          headers: { "Retry-After": String(limitResult.retryAfterSec) },
        }
      )
    }

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      )
    }

    const result = await scrapeLandingPage(url)
    const formatted = formatScrapedContent(result)

    return NextResponse.json({
      scraped: formatted,
      metadata: {
        title: result.title,
        metaDescription: result.metaDescription,
        headingCount: result.headings.length,
        buttonCount: result.buttonTexts.length,
        hasPrivacyPolicy: result.privacyPolicyUrl !== null,
        hasBaitAndSwitch: result.hasBaitAndSwitch,
      },
    })
  } catch (error) {
    console.error("[tadan] Scrape failed")
    const message =
      error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
