import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { scrapeLandingPage, formatScrapedContent } from "@/lib/scraper"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
    console.error("Scrape error:", error)
    const message =
      error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
