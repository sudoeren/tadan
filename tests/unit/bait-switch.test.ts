import { describe, it, expect } from "vitest"
import {
  detectBaitAndSwitch,
  formatBaitSwitchEvidence,
  type BaitSwitchEvidence,
} from "@/lib/bait-switch"

function makePage(overrides: {
  title?: string
  headings?: string[]
  bodyText?: string
  buttonTexts?: string[]
  metaDescription?: string
}) {
  return {
    title: overrides.title ?? "",
    headings: overrides.headings ?? [],
    bodyText: overrides.bodyText ?? "",
    buttonTexts: overrides.buttonTexts ?? [],
    metaDescription: overrides.metaDescription ?? "",
  }
}

describe("detectBaitAndSwitch", () => {
  it("returns no detection for a coherent page", () => {
    const result = detectBaitAndSwitch(
      makePage({
        title: "Buy Quality Running Shoes Online",
        headings: ["Running Shoes for Every Athlete"],
        bodyText:
          "Our running shoes feature advanced cushioning technology, breathable mesh uppers, and durable rubber outsoles. Available in sizes 6-14. Free shipping on orders over $50. Our shoes are designed for road running, trail running, and daily training. With over 10,000 five-star reviews, our customers love the comfort and durability. Each pair comes with a 30-day return guarantee.",
        buttonTexts: ["Shop Now", "View Sizes", "Learn More"],
        metaDescription: "Premium running shoes with free shipping and 30-day returns.",
      })
    )

    expect(result.detected).toBe(false)
    expect(result.patterns).toHaveLength(0)
    expect(result.mismatchScore).toBe(0)
  })

  it("detects Free Promise + Payment Requirement", () => {
    const result = detectBaitAndSwitch(
      makePage({
        title: "Free Trial - Start Today",
        headings: ["Get Your Free Access Now"],
        bodyText:
          "Join thousands of satisfied customers. Monthly plan $29.99. Enter your credit card to continue. Payment processed securely via Stripe. You will be billed after the trial period ends. Cancel anytime.",
        buttonTexts: ["Start Free Trial", "Enter Credit Card", "Subscribe Now"],
        metaDescription: "Free trial of our premium service.",
      })
    )

    expect(result.detected).toBe(true)
    expect(result.patterns.some((p) => p.type === "Free Promise + Payment Requirement")).toBe(true)
    expect(result.mismatchScore).toBeGreaterThanOrEqual(35)
  })

  it("detects Money Promise Without Product", () => {
    const result = detectBaitAndSwitch(
      makePage({
        title: "Earn $500/Day Working From Home",
        headings: ["Make Money Online Today"],
        bodyText:
          "I was skeptical at first but now I make $3,000 a week! Sarah said it changed her life. Before this program I was struggling. After using this system I quit my job. Just enter your email below to get started. Limited spots available.",
        buttonTexts: ["Join Now", "Get Started", "Sign Up Free"],
        metaDescription: "Learn how to make money online from home.",
      })
    )

    expect(result.detected).toBe(true)
    expect(result.patterns.some((p) => p.type === "Money Promise Without Product")).toBe(true)
  })

  it("detects Health Claim Without Medical Substantiation", () => {
    const result = detectBaitAndSwitch(
      makePage({
        title: "Lose 20 Pounds in 2 Weeks - Natural Cure",
        headings: ["Miracle Weight Loss Formula"],
        bodyText:
          "This amazing breakthrough will change your life. Thousands have already tried it. It works fast and you'll see results in days.",
        buttonTexts: ["Order Now", "Get Yours Today"],
        metaDescription: "Lose weight fast with our natural formula.",
      })
    )

    expect(result.detected).toBe(true)
    expect(result.patterns.some((p) => p.type === "Health Claim Without Medical Substantiation")).toBe(true)
  })

  it("detects Clickbait Headline + Unrelated Content", () => {
    const result = detectBaitAndSwitch(
      makePage({
        title: "What This Woman Did Next Will Amaze You",
        headings: ["You Won't Believe What Happened", "The Secret They Don't Want You To Know"],
        bodyText:
          "Premium cloud hosting services with 99.9% uptime guarantee. Our data centers are located worldwide. We offer competitive pricing and excellent customer support. Choose from shared hosting, VPS, or dedicated servers. All plans include free SSL certificates and daily backups.",
        buttonTexts: ["View Plans", "Pricing", "Contact Sales"],
        metaDescription: "Reliable cloud hosting for businesses of all sizes.",
      })
    )

    expect(result.patterns.some((p) => p.type === "Clickbait Headline + Unrelated Content")).toBe(true)
  })

  it("detects Fake Scarcity / Urgency", () => {
    const result = detectBaitAndSwitch(
      makePage({
        title: "Don't Miss This Opportunity",
        headings: ["Special Offer"],
        bodyText:
          "Hurry! Only 3 spots left. This exclusive offer ends tonight. Don't miss out on this incredible opportunity. Act now before it's too late. Limited time only. While supplies last. Countdown clock below.",
        buttonTexts: ["Claim My Spot", "Join Before It's Gone"],
        metaDescription: "Limited time opportunity.",
      })
    )

    expect(result.patterns.some((p) => p.type === "Fake Scarcity / Urgency")).toBe(true)
  })

  it("detects Excessive Testimonials + No Product Detail", () => {
    const result = detectBaitAndSwitch(
      makePage({
        title: "The Secret System",
        headings: ["Success Stories"],
        bodyText:
          '"I was struggling before this" – John. "Changed my life completely" – Sarah. "I never believed it could work" – Mike. "Best decision I ever made" – Lisa. "Thank you so much for this opportunity" – David. Real customer reviews. Verified buyer feedback.',
        buttonTexts: ["Join Now", "Yes, I Want This"],
        metaDescription: "Read success stories from our members.",
      })
    )

    expect(result.patterns.some((p) => p.type === "Excessive Testimonials + No Product Detail")).toBe(true)
  })

  it("detects Headline/Body Content Mismatch", () => {
    const result = detectBaitAndSwitch(
      makePage({
        title: "Advanced Cryptocurrency Trading Platform",
        headings: ["Trade Bitcoin with Institutional Grade Tools"],
        bodyText:
          "Our team provides excellent customer service. We have been in business for many years. Our customers love working with us. Contact us today for more information about our services.",
        buttonTexts: ["Contact Us", "Learn More"],
        metaDescription: "Professional trading platform for digital assets.",
      })
    )

    expect(result.patterns.some((p) => p.type === "Headline/Body Content Mismatch")).toBe(true)
  })

  it("assigns correct severity weights", () => {
    const result = detectBaitAndSwitch(
      makePage({
        title: "Free Trial - Lose 20 Pounds in 2 Weeks",
        headings: ["Get Your Free Weight Loss Trial", "Limited Spots Available"],
        bodyText:
          "Monthly plan $39.99. Enter your credit card to continue. Hurry, only 2 spots left! Don't miss out. Payment processed securely. Your subscription will auto-renew.",
        buttonTexts: ["Start Free Trial", "Enter Card Details", "Claim Now"],
        metaDescription: "Free trial weight loss program with limited spots.",
      })
    )

    const highPatterns = result.patterns.filter((p) => p.severity === "high")

    expect(highPatterns.length).toBeGreaterThanOrEqual(1)

    const healthPattern = result.patterns.find((p) => p.type === "Health Claim Without Medical Substantiation")
    const freePattern = result.patterns.find((p) => p.type === "Free Promise + Payment Requirement")
    const urgencyPattern = result.patterns.find((p) => p.type === "Fake Scarcity / Urgency")

    expect(healthPattern?.severity).toBe("high")
    expect(freePattern?.severity).toBe("high")
    if (urgencyPattern) expect(urgencyPattern.severity).toBe("medium")
  })

  it("computes mismatchScore as sum of pattern weights capped at 100", () => {
    const result = detectBaitAndSwitch(
      makePage({
        title: "Free Trial - Earn $500/Day With This Miracle Cure",
        headings: ["Lose 20 Pounds Instantly - Limited Spots"],
        bodyText:
          "Monthly pricing $49.99. Credit card required. I was amazed by the results – Sarah. It changed everything for me – John. Don't wait! Only 2 spots remaining.",
        buttonTexts: ["Start Free Trial", "Enter Payment", "Claim My Spot"],
        metaDescription: "Free trial miracle weight loss + money making opportunity.",
      })
    )

    expect(result.mismatchScore).toBeGreaterThanOrEqual(50)
    expect(result.mismatchScore).toBeLessThanOrEqual(100)
  })

  it("returns detected=false when only low-severity patterns and mismatchScore < 30", () => {
    const result = detectBaitAndSwitch(
      makePage({
        title: "Our New Blog Platform",
        headings: ["Welcome to Our Blog"],
        bodyText:
          "As seen on major publications. Our team has been working hard to bring you something completely different and unique. We hope you enjoy the experience of our new platform.",
        buttonTexts: ["Read More", "Subscribe"],
        metaDescription: "A new blog platform featuring articles on technology.",
      })
    )

    expect(result.detected).toBe(false)
    expect(result.mismatchScore).toBeLessThan(30)
  })

  it("extracts promise from title, meta, headings and CTAs", () => {
    const result = detectBaitAndSwitch(
      makePage({
        title: "Fast Weight Loss",
        headings: ["Lose Weight Naturally"],
        bodyText: "Healthy eating tips and exercise routines for sustainable weight management.",
        buttonTexts: ["Get My Plan", "Start Losing Weight"],
        metaDescription: "Natural weight loss methods that actually work.",
      })
    )

    expect(result.promise).toContain("Fast Weight Loss")
    expect(result.promise).toContain("Lose Weight Naturally")
    expect(result.promise).toContain("Get My Plan")
  })
})

describe("formatBaitSwitchEvidence", () => {
  it("formats no-detection cleanly", () => {
    const evidence: BaitSwitchEvidence = {
      detected: false,
      promise: "Buy Shoes Online → Premium running shoes with free shipping.",
      patterns: [],
      mismatchScore: 0,
    }

    const formatted = formatBaitSwitchEvidence(evidence)

    expect(formatted).toContain("BAIT-AND-SWITCH DETECTED: No")
    expect(formatted).toContain("MISMATCH SCORE: 0/100")
  })

  it("formats detected patterns with severity labels", () => {
    const evidence: BaitSwitchEvidence = {
      detected: true,
      promise: "Free Trial → Monthly Plan $29.99",
      patterns: [
        {
          type: "Free Promise + Payment Requirement",
          severity: "high",
          evidence: "Page promises free but has pricing.",
          weight: 35,
        },
      ],
      mismatchScore: 35,
    }

    const formatted = formatBaitSwitchEvidence(evidence)

    expect(formatted).toContain("BAIT-AND-SWITCH DETECTED: YES")
    expect(formatted).toContain("MISMATCH SCORE: 35/100")
    expect(formatted).toContain("[HIGH]")
    expect(formatted).toContain("Free Promise + Payment Requirement")
    expect(formatted).toContain("HIGH-SEVERITY MISMATCH")
  })

  it("shows SUSPECT when patterns exist but no high severity", () => {
    const evidence: BaitSwitchEvidence = {
      detected: false,
      promise: "Something → Something Else",
      patterns: [
        {
          type: "Headline/Body Content Mismatch",
          severity: "low",
          evidence: "Low keyword overlap.",
          weight: 10,
        },
      ],
      mismatchScore: 10,
    }

    const formatted = formatBaitSwitchEvidence(evidence)

    expect(formatted).toContain("BAIT-AND-SWITCH DETECTED: SUSPECT")
    expect(formatted).not.toContain("HIGH-SEVERITY MISMATCH")
  })
})
