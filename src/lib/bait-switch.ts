export interface BaitSwitchPattern {
  type: string
  severity: "high" | "medium" | "low"
  evidence: string
  weight: number
}

export interface BaitSwitchEvidence {
  detected: boolean
  promise: string
  patterns: BaitSwitchPattern[]
  mismatchScore: number
}

interface InputPageData {
  title: string
  headings: string[]
  bodyText: string
  buttonTexts: string[]
  metaDescription: string
}

const CLICKBAIT_PHRASES = [
  "you won't believe",
  "you wont believe",
  "shocking truth",
  "doctors hate",
  "what happened next",
  "the secret",
  "they don't want you to know",
  "one weird trick",
  "this is what happens",
  "number one reason",
  "you've been lied to",
  "they're not telling you",
  "what she did next",
  "he couldn't believe",
  "you'll never guess",
  "scientists are stunned",
  "experts are furious",
  "big pharma",
  "industry secret",
  "forbidden",
]

const URGENCY_PATTERNS = [
  /\bonly \d+ (left|remaining|spots|available)\b/i,
  /\bhurry\b/i,
  /\bdon't miss out\b/i,
  /\bdon't wait\b/i,
  /\bclosing soon\b/i,
  /\bends (tonight|today|soon|in \d+)\b/i,
  /\bcountdown\b/i,
  /\blimited time\b/i,
  /\blast chance\b/i,
  /\bact now\b/i,
  /\bwhile supplies last\b/i,
  /\bexclusive offer\b.*\bending\b/i,
  /\bflash sale\b/i,
]

const FREE_PROMISE = /\b(free|ücretsiz)\s+(trial|access|download|account|membership|subscription|now|today|sign\s?up|registration|get started)\b/i

const FREE_LEGITIMATE = /\b(free\s+(shipping|returns|delivery|consultation|quote|estimate|setup|installation|gift|sample|ebook|guide|newsletter|course|webinar))|(risk[-\s]?free|hassle[-\s]?free|duty[-\s]?free|sugar[-\s]?free|gluten[-\s]?free|fat[-\s]?free)\b/i

const PAYMENT_SIGNALS = [
  /\$\d+/,
  /€\d+/,
  /£\d+/,
  /\d+\s?(USD|EUR|GBP|TL|TRY)/i,
  /\b(pricing|price|checkout|payment|credit card|billing|subscription)\b/i,
  /\b(only \$|just \$|for just|starting at)\b/i,
  /\bpay now\b/i,
  /\b(buy now|purchase)\b/i,
  /\bmonthly\b.*\b(plan|fee|payment)\b/i,
  /\b(credit card|card number|payment method)\b/i,
]

const EARNING_CLAIMS = [
  /\bearn\s?\$?\d+/i,
  /\bmake\s?\$?\d+\s?(a|per)\s?(day|week|month)/i,
  /\bincome\s?(stream|opportunity)/i,
  /\bfinancial freedom\b/i,
  /\bquit your (9.?5|job)\b/i,
  /\b(get rich|become wealthy|work from home.*money|make money online)\b/i,
]

const HEALTH_CURE_CLAIMS = [
  /\b(cures?|treats?|prevent|reverses?|eliminates?)\s+(cancer|diabetes|heart disease|alzheimer|arthritis|depression|anxiety)\b/i,
  /\blose\s?\d+\s?(pounds|lbs?|kg|kilo)\s+(in|within|every)\s?\d+\s?(days?|weeks?|months?)/i,
  /\bburn\s?(belly\s?)?fat\s+(instantly|overnight|fast)\b/i,
  /\b(miracle|magic)\s+(cure|pill|supplement|treatment|solution)\b/i,
  /\bdoctor\s+(approved|recommended)\b.*\b(cure|treat|fix)\b/i,
  /\bclinical\s+(grade|strength|proven)\b.*\b(miracle|instant)\b/i,
]

const PRODUCT_SIGNALS = [
  /\b(features|specifications|ingredients|contents|components)\b/i,
  /\b(how it works|what you get|included|package includes)\b/i,
  /\b(product|service|offering|solution)\s+(description|overview|details)\b/i,
  /\b(comes with|equipped with|powered by|made with)\b/i,
]

const TESTIMONIAL_SIGNALS = [
  /\b(says|said|wrote|reviewed by|testimonial|success story|customer story|what.*say about|real.*review)\b/i,
  /\b(i was|before this|after using|changed my|transformed my|thank you|grateful)\b/i,
  /"[\w\s,.'!?]{20,}"/,
  /\b–\s?[A-Z][a-z]+/,
  /\b(verified|real)\s?(customer|user|buyer|member)\b/i,
]

const AS_SEEN_ON = [
  /\b(as seen on|as featured on|featured in|seen on|mentioned in)\b/i,
  /\b(press|media|news|coverage|publications)\b/i,
]

const INSTANT_INSTANT = [
  /\b(instant|immediate|right now|straight away)\s?(access|download|entry|join)\b/i,
  /\b(get started|start now|join now|sign up)\s+(now|today|instantly|immediately)\b/i,
  /\b(no sign.?up|no registration|no email)\b.*\brequired\b/i,
]

function extractPromise(page: InputPageData): string {
  const parts: string[] = []

  if (page.title) parts.push(page.title)
  if (page.metaDescription) parts.push(page.metaDescription)

  const firstH1 = page.headings[0]
  if (firstH1 && firstH1 !== page.title) {
    parts.push(firstH1)
  }

  const cta = page.buttonTexts.slice(0, 3).join(" | ")
  if (cta) parts.push(`CTA: ${cta}`)

  return parts.join(" → ")
}

function detectPatterns(page: InputPageData): BaitSwitchPattern[] {
  const patterns: BaitSwitchPattern[] = []
  const titleLower = page.title.toLowerCase()
  const headingsLower = page.headings.map((h) => h.toLowerCase()).join(" ")
  const bodyLower = page.bodyText.toLowerCase()
  const buttonsLower = page.buttonTexts.map((b) => b.toLowerCase()).join(" ")
  const metaLower = page.metaDescription.toLowerCase()
  const frontMatter = `${titleLower} ${headingsLower.slice(0, 500)} ${metaLower}`

  // 1. Free promise → payment wall (HIGH)
  // Only flag when "free" is the core value proposition (title/headings),
  // not when it's a legitimate retail benefit (free shipping, free returns, etc.)
  const freeCorePromise = FREE_PROMISE.test(`${page.title} ${page.headings.slice(0, 2).join(" ")}`)
  const isLegitimateFree = FREE_LEGITIMATE.test(frontMatter) && !FREE_PROMISE.test(`${page.title} ${page.headings.slice(0, 2).join(" ")}`)
  if (freeCorePromise && !isLegitimateFree) {
    const hasPayment = PAYMENT_SIGNALS.some((re) => re.test(bodyLower) || re.test(buttonsLower))
    if (hasPayment) {
      patterns.push({
        type: "Free Promise + Payment Requirement",
        severity: "high",
        evidence: 'Page headlines promise "free" access/trial but page contains pricing elements, payment forms, or credit card requirements.',
        weight: 35,
      })
    }
  }

  // 2. Earning claims → no product (HIGH)
  const hasEarning = EARNING_CLAIMS.some((re) => re.test(frontMatter))
  if (hasEarning) {
    const hasProduct = PRODUCT_SIGNALS.some((re) => re.test(bodyLower))
    if (!hasProduct) {
      patterns.push({
        type: "Money Promise Without Product",
        severity: "high",
        evidence: "Page promises earning/income but describes no actual product, service, or verifiable mechanism. Typical of pyramid schemes, MLM recruitment, or get-rich-quick funnels.",
        weight: 30,
      })
    }
  }

  // 3. Health cure → generic content (HIGH)
  const hasHealthCure = HEALTH_CURE_CLAIMS.some((re) => re.test(frontMatter))
  if (hasHealthCure) {
    const bodyHasSubstance =
      bodyLower.includes("study") ||
      bodyLower.includes("research") ||
      bodyLower.includes("clinical") ||
      bodyLower.includes("ingredient") ||
      bodyLower.includes("doctor") ||
      bodyLower.includes("fda") ||
      PRODUCT_SIGNALS.some((re) => re.test(bodyLower))

    if (!bodyHasSubstance && bodyLower.length < 1500) {
      patterns.push({
        type: "Health Claim Without Medical Substantiation",
        severity: "high",
        evidence: "Page makes specific health/medical claims (cure, weight loss with timeframe) but body contains no clinical references, study data, ingredient lists, or expert citations.",
        weight: 30,
      })
    }
  }

  // 4. Clickbait headline → unrelated body (MEDIUM)
  const hasClickbait = CLICKBAIT_PHRASES.some((phrase) => frontMatter.includes(phrase.toLowerCase()))
  if (hasClickbait) {
    const headlineTokens = new Set(
      frontMatter
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3)
    )
    const bodyTokens = new Set(
      bodyLower
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3)
    )
    let overlap = 0
    for (const t of headlineTokens) {
      if (bodyTokens.has(t)) overlap++
    }
    const overlapRatio = headlineTokens.size > 0 ? overlap / headlineTokens.size : 0

    if (overlapRatio < 0.15 && headlineTokens.size > 5) {
      patterns.push({
        type: "Clickbait Headline + Unrelated Content",
        severity: "medium",
        evidence: `Headline uses sensational/clickbait language but only ${Math.round(overlapRatio * 100)}% keyword overlap with body content. The page delivers different content than what the headline promises.`,
        weight: 20,
      })
    }
  }

  // 5. Fake urgency/scarcity (MEDIUM)
  const hasUrgency = URGENCY_PATTERNS.some((re) => re.test(bodyLower) || re.test(headingsLower) || re.test(buttonsLower))
  if (hasUrgency) {
    const hasRealProduct = PRODUCT_SIGNALS.some((re) => re.test(bodyLower))
    const hasPricing = PAYMENT_SIGNALS.some((re) => re.test(bodyLower))
    if (!hasRealProduct && !hasPricing) {
      patterns.push({
        type: "Fake Scarcity / Urgency",
        severity: "medium",
        evidence: "Page uses urgency/scarcity language (limited spots, hurry, countdown) without describing an actual product or priced offer. This is a classic conversion-pressure tactic.",
        weight: 15,
      })
    }
  }

  // 6. Testimonial-heavy → no substance (MEDIUM)
  const testimonialMatches = TESTIMONIAL_SIGNALS.filter((re) => re.test(bodyLower))
  if (testimonialMatches.length >= 3) {
    const hasProductSubstance =
      PRODUCT_SIGNALS.some((re) => re.test(bodyLower)) ||
      bodyLower.length > 3000

    if (!hasProductSubstance) {
      patterns.push({
        type: "Excessive Testimonials + No Product Detail",
        severity: "medium",
        evidence: "Page relies heavily on testimonials/reviews/success stories but provides no product features, specifications, ingredients, or verifiable details.",
        weight: 15,
      })
    }
  }

  // 7. "Instant access" → complex form (MEDIUM)
  const hasInstant = INSTANT_INSTANT.some((re) => re.test(frontMatter))
  if (hasInstant) {
    const formFields = (page.bodyText.match(/<input|type="email"|type="text"|type="tel"|type="password"|name="email"|name="name"|placeholder=/gi) || []).length
    const ctaCount = page.buttonTexts.length

    if (formFields >= 3 || ctaCount >= 4) {
      patterns.push({
        type: "Instant Access Promise + Complex Signup",
        severity: "medium",
        evidence: "Page promises instant/immediate access or 'no registration' but contains multiple form fields or calls-to-action, signaling a multi-step funnel rather than direct access.",
        weight: 15,
      })
    }
  }

  // 8. "As Seen On" → no evidence (LOW)
  const hasAsSeenOn = AS_SEEN_ON.some((re) => re.test(bodyLower))
  if (hasAsSeenOn) {
    const hasMediaLinks =
      bodyLower.includes("https://") ||
      bodyLower.includes("http://") ||
      bodyLower.includes(".com/") ||
      bodyLower.includes(".org/")

    if (!hasMediaLinks) {
      patterns.push({
        type: "Unverified Media/Authority Claims",
        severity: "low",
        evidence: 'Page claims "as seen on" or media coverage but provides no actual links, publication names, or verifiable references.',
        weight: 10,
      })
    }
  }

  // 9. Promise mismatch: title/headlines have low keyword overlap with body (LOW)
  const promiseText = `${page.title} ${page.headings.slice(0, 2).join(" ")}`
  if (promiseText.length > 50 && page.bodyText.length > 100) {
    const promiseWords = new Set(
      promiseText
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !["this", "that", "with", "your", "from", "have", "will", "what", "when"].includes(w))
    )
    let matchCount = 0
    for (const w of promiseWords) {
      if (bodyLower.includes(w)) matchCount++
    }
    const ratio = promiseWords.size > 0 ? matchCount / promiseWords.size : 1

    if (ratio < 0.3 && promiseWords.size >= 4) {
      patterns.push({
        type: "Headline/Body Content Mismatch",
        severity: "low",
        evidence: `Title and main heading keywords have only ${Math.round(ratio * 100)}% overlap with body content. The landing page may not deliver on its core value proposition.`,
        weight: 10,
      })
    }
  }

  return patterns
}

export function detectBaitAndSwitch(page: InputPageData): BaitSwitchEvidence {
  const promise = extractPromise(page)
  const patterns = detectPatterns(page)

  if (patterns.length === 0) {
    return {
      detected: false,
      promise,
      patterns: [],
      mismatchScore: 0,
    }
  }

  const totalWeight = patterns.reduce((sum, p) => sum + p.weight, 0)
  const mismatchScore = Math.min(100, totalWeight)

  return {
    detected: patterns.some((p) => p.severity === "high") || mismatchScore >= 30,
    promise,
    patterns,
    mismatchScore,
  }
}

export function formatBaitSwitchEvidence(evidence: BaitSwitchEvidence): string {
  if (!evidence.detected && evidence.patterns.length === 0) {
    return `BAIT-AND-SWITCH DETECTED: No
PROMISE: ${evidence.promise}
MISMATCH SCORE: 0/100
The page appears to deliver on its stated value proposition.`
  }

  const lines: string[] = []
  lines.push(`BAIT-AND-SWITCH DETECTED: ${evidence.detected ? "YES" : "SUSPECT"}`)
  lines.push(`PROMISE (extracted from title, meta, headlines, CTAs): ${evidence.promise}`)
  lines.push(`MISMATCH SCORE: ${evidence.mismatchScore}/100`)
  lines.push(`\nDETECTED PATTERNS (${evidence.patterns.length}):`)

  for (const p of evidence.patterns) {
    lines.push(`\n[${p.severity.toUpperCase()}] ${p.type} (weight: ${p.weight})`)
    lines.push(`  Evidence: ${p.evidence}`)
  }

  if (evidence.patterns.some((p) => p.severity === "high")) {
    lines.push(`\n⚠️  HIGH-SEVERITY MISMATCH: The landing page likely does NOT deliver on its core value proposition. This is a classic bait-and-switch pattern that can trigger account suspension.`)
  }

  return lines.join("\n")
}
