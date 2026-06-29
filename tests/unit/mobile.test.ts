import { describe, it, expect } from "vitest"
import { isMobileUserAgent } from "@/lib/mobile"

describe("isMobileUserAgent", () => {
  it("detects iPhone as mobile", () => {
    expect(
      isMobileUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15"
      )
    ).toBe(true)
  })

  it("detects Android phone as mobile", () => {
    expect(
      isMobileUserAgent(
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
      )
    ).toBe(true)
  })

  it("detects generic Android phone", () => {
    expect(
      isMobileUserAgent(
        "Mozilla/5.0 (Linux; Android 13; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
      )
    ).toBe(true)
  })

  it("treats iPad as NOT mobile (tablet)", () => {
    expect(
      isMobileUserAgent(
        "Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15"
      )
    ).toBe(false)
  })

  it("treats Android tablet as NOT mobile", () => {
    expect(
      isMobileUserAgent(
        "Mozilla/5.0 (Linux; Android 13; SM-X810) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      )
    ).toBe(false)
  })

  it("treats desktop Chrome as NOT mobile", () => {
    expect(
      isMobileUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      )
    ).toBe(false)
  })

  it("treats macOS Safari as NOT mobile", () => {
    expect(
      isMobileUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15"
      )
    ).toBe(false)
  })

  it("treats Windows desktop as NOT mobile", () => {
    expect(
      isMobileUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0"
      )
    ).toBe(false)
  })

  it("treats null/empty as NOT mobile", () => {
    expect(isMobileUserAgent(null)).toBe(false)
    expect(isMobileUserAgent("")).toBe(false)
    expect(isMobileUserAgent(undefined)).toBe(false)
  })

  it("detects iPod Touch as mobile", () => {
    expect(
      isMobileUserAgent(
        "Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/604.1.34"
      )
    ).toBe(true)
  })

  it("detects Windows Phone as mobile", () => {
    expect(
      isMobileUserAgent(
        "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch)"
      )
    ).toBe(true)
  })

  it("detects bot/crawler as NOT mobile (deserves desktop)", () => {
    expect(
      isMobileUserAgent("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")
    ).toBe(false)
  })

  it("treats iPadOS masquerading as Mac as NOT mobile", () => {
    expect(
      isMobileUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
      )
    ).toBe(false)
  })
})
