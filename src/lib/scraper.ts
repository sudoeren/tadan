import * as cheerio from "cheerio"
import { lookup } from "node:dns/promises"
import {
  detectBaitAndSwitch,
  formatBaitSwitchEvidence,
  type BaitSwitchEvidence,
} from "@/lib/bait-switch"

interface ScrapedPage {
  title: string
  headings: string[]
  bodyText: string
  buttonTexts: string[]
  links: { text: string; href: string }[]
  metaDescription: string
  privacyPolicyUrl: string | null
  baitSwitchEvidence: BaitSwitchEvidence
}

const MAX_RESPONSE_BYTES = 5 * 1024 * 1024
const FETCH_TIMEOUT_MS = 10_000
const MAX_REDIRECTS = 5
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

class SsrfError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SsrfError"
  }
}

function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split(".").map(Number)
  if (parts.length !== 4 || parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) {
    return true
  }
  const [a, b] = parts
  if (a === 0 || a === 127) return true
  if (a === 10) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 100 && b >= 64 && b <= 127) return true
  if (a >= 224) return true
  return false
}

function isPrivateIpv6(ip: string): boolean {
  const lower = ip.toLowerCase().split("%")[0]
  if (lower === "::" || lower === "::1") return true
  if (lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) return true
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true
  if (lower.startsWith("ff")) return true
  const v4Mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (v4Mapped) return isPrivateIpv4(v4Mapped[1])
  return false
}

function isPrivateIp(ip: string): boolean {
  return ip.includes(":") ? isPrivateIpv6(ip) : isPrivateIpv4(ip)
}

async function assertSafeUrl(url: string): Promise<void> {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new SsrfError("Invalid URL")
  }
  if (parsed.protocol !== "https:") {
    throw new SsrfError("Only HTTPS URLs are allowed")
  }
  const hostname = parsed.hostname
  if (!hostname) throw new SsrfError("Invalid URL hostname")
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
    throw new SsrfError("Local hostnames are not allowed")
  }
  let addresses: { address: string }[]
  try {
    addresses = await lookup(hostname, { all: true })
  } catch {
    throw new SsrfError("Could not resolve hostname")
  }
  if (addresses.length === 0) {
    throw new SsrfError("Hostname did not resolve to any address")
  }
  for (const { address } of addresses) {
    if (isPrivateIp(address)) {
      throw new SsrfError("URL resolves to a private or internal address")
    }
  }
}

async function safeFetch(url: string): Promise<string> {
  let current = url
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    await assertSafeUrl(current)

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    let response: Response
    try {
      response = await fetch(current, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        redirect: "manual",
        signal: controller.signal,
      })
    } catch (err) {
      clearTimeout(timer)
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`Request timed out after ${FETCH_TIMEOUT_MS}ms`)
      }
      throw err
    }
    clearTimeout(timer)

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location")
      if (!location) {
        throw new Error(`Redirect (${response.status}) without Location header`)
      }
      try {
        const next = new URL(location, current).toString()
        current = next
      } catch {
        throw new Error("Invalid redirect target")
      }
      continue
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch URL (${response.status}): ${response.statusText}`
      )
    }

    const contentLength = response.headers.get("content-length")
    if (contentLength && Number(contentLength) > MAX_RESPONSE_BYTES) {
      throw new Error("Response too large")
    }

    if (!response.body) {
      throw new Error("Empty response body")
    }

    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []
    let received = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      received += value.length
      if (received > MAX_RESPONSE_BYTES) {
        try { await reader.cancel() } catch {}
        throw new Error("Response too large")
      }
      chunks.push(value)
    }

    const buffer = new Uint8Array(received)
    let offset = 0
    for (const chunk of chunks) {
      buffer.set(chunk, offset)
      offset += chunk.length
    }
    return new TextDecoder("utf-8", { fatal: false }).decode(buffer)
  }

  throw new Error(`Too many redirects (max ${MAX_REDIRECTS})`)
}

export async function scrapeLandingPage(url: string): Promise<ScrapedPage> {
  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`

  const html = await safeFetch(normalizedUrl)
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

  const baitSwitchEvidence = detectBaitAndSwitch({
    title,
    headings,
    bodyText,
    buttonTexts,
    metaDescription,
  })

  return {
    title,
    headings,
    bodyText,
    buttonTexts,
    links,
    metaDescription,
    privacyPolicyUrl,
    baitSwitchEvidence,
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
    formatBaitSwitchEvidence(page.baitSwitchEvidence)
  )
  sections.push(`\nPAGE BODY (first 8K chars):\n${page.bodyText}`)

  return sections.join("\n")
}
