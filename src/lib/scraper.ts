import * as cheerio from "cheerio"

interface ScrapedPage {
  title: string
  headings: string[]
  bodyText: string
  buttonTexts: string[]
  links: { text: string; href: string }[]
  metaDescription: string
  privacyPolicyUrl: string | null
  hasBaitAndSwitch: boolean
}

export async function scrapeLandingPage(url: string): Promise<ScrapedPage> {
  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`

  const response = await fetch(normalizedUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    redirect: "follow",
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch URL (${response.status}): ${response.statusText}`
    )
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  const title = $("title").text().trim() || $("h1").first().text().trim()

  const headings = $("h1, h2, h3")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((t) => t.length > 0)

  const bodyText = $("body")
    .clone()
    .find("script, style, noscript, iframe, nav, footer, header")
    .remove()
    .end()
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000)

  const buttonTexts = $("button, a.btn, a[role='button'], input[type='submit'], .cta, [class*='button']")
    .map((_, el) => $(el).text().trim() || $(el).attr("aria-label") || "")
    .get()
    .filter((t) => t.length > 0 && t.length < 200)

  const links = $("a[href]")
    .map((_, el) => ({
      text: $(el).text().trim().slice(0, 100),
      href: $(el).attr("href") || "",
    }))
    .get()
    .filter((l) => l.text.length > 0 && !l.href.startsWith("#"))

  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() || ""

  const privacyLink = links.find(
    (l) =>
      l.text.toLowerCase().includes("privacy") ||
      l.text.toLowerCase().includes("gizlilik") ||
      l.href.toLowerCase().includes("privacy") ||
      l.href.toLowerCase().includes("gizlilik")
  )
  const privacyPolicyUrl = privacyLink?.href || null

  const hasBaitAndSwitch = title && bodyText
    ? !bodyText.toLowerCase().includes(title.toLowerCase().slice(0, 30))
    : false

  return {
    title,
    headings,
    bodyText,
    buttonTexts,
    links,
    metaDescription,
    privacyPolicyUrl,
    hasBaitAndSwitch,
  }
}

export function formatScrapedContent(page: ScrapedPage): string {
  const sections: string[] = []

  sections.push(`PAGE TITLE: ${page.title}`)
  sections.push(`META DESCRIPTION: ${page.metaDescription}`)
  sections.push(`\nHEADINGS:`)
  page.headings.forEach((h) => sections.push(`- ${h}`))
  sections.push(`\nBUTTON TEXTS:`)
  page.buttonTexts.forEach((b) => sections.push(`- "${b}"`))
  sections.push(`\nPRIVACY POLICY URL: ${page.privacyPolicyUrl || "NOT FOUND"}`)
  sections.push(
    `BAIT-AND-SWITCH DETECTED: ${page.hasBaitAndSwitch ? "YES" : "No"}`
  )
  sections.push(`\nPAGE BODY (first 8K chars):\n${page.bodyText}`)

  return sections.join("\n")
}
