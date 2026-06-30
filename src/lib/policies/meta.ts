// Source: https://www.facebook.com/policies/ads
// Source: https://transparency.meta.com/policies/ad-standards/
// Source: https://www.facebook.com/business/help/430291176997542 (Prohibited content)
// Source: https://www.facebook.com/business/help/262 heterogeneity (Restricted content)
// Last reviewed: 2025-01
export const META_AD_POLICIES = {
  platform: "meta",
  version: "2025-01",
  source: "https://www.facebook.com/policies/ads",
  categories: [
    {
      category: "Prohibited Content",
      rules: [
        "Illegal products or services: drugs not approved by regulators, recreational drugs, drug paraphernalia, weapons, explosives, recalled products, counterfeit goods, tobacco and vape products, adult content, body parts or fluids.",
        "Discriminatory practices: ads that exclude, discourage, or discriminate based on race, ethnicity, national origin, religion, caste, sex, gender identity, sexual orientation, disability, medical condition, or any other protected class.",
        "Sensational or shocking content: explicit gore, violence toward people or animals (except in news/documentary context), bodily functions.",
        "Misinformation about civic processes: claims about voting procedures, eligibility, or outcomes that are demonstrably false and could suppress participation.",
        "Contested or false claims about vaccines, health authorities, or public health institutions.",
      ],
    },
    {
      category: "Restricted Content — Financial",
      rules: [
        "Cryptocurrency, NFT, and DeFi products require prior written authorization and disclosure of licensing status.",
        "Guaranteed income, 'risk-free' investment claims, or specific earning figures without substantiation ('Earn $500/day', 'Make $10K this week') are prohibited.",
        "Get-rich-quick schemes, pyramid / MLM programs, deceptive work-from-home offers, and 'matrix' style income systems are prohibited.",
        "Loan ads must disclose APR, fees, term length, and the licensed lender. 'No credit check' claims cannot be used as a primary hook.",
        "Cryptocurrency price predictions, trading signal services, and leveraged trading promotions are restricted and require authorization.",
      ],
    },
    {
      category: "Restricted Content — Health & Wellness",
      rules: [
        "Weight loss products cannot claim specific pound or kilogram loss in a specific timeframe ('Lose 30 pounds in 7 days').",
        "Before/after comparison imagery is prohibited for weight loss, fitness, or cosmetic procedures.",
        "Health products cannot claim to cure, treat, diagnose, or prevent any specific disease. Phrases like 'cures cancer', 'treats diabetes', 'prevents COVID' are banned.",
        "Personal health attribute targeting ('Are you overweight?', 'Do you have back pain?') violates Personal Attributes policy.",
        "Cosmetic procedures must target users 18+, avoid idealization, and include risk disclosure. Liposuction, Botox, Brazilian Butt Lift (BBL) are restricted.",
        'Phrases implying effortless transformation, "lazy fix", "one weird trick", or "doctors hate this" trigger Health & Wellness restrictions.',
      ],
    },
    {
      category: "Personal Attributes & Targeting",
      rules: [
        "Ads must not assert or imply personal attributes of the viewer, including: name, race, ethnicity, religious belief, age, gender identity, sexual orientation, financial status, medical condition, physical or mental disability.",
        "Negative self-perception targeting is prohibited: 'Are you tired of being single?', 'Do you feel overweight?', 'Struggling with debt?' all trigger violations.",
        "Custom audiences built from sensitive personal data (health conditions, financial distress, religious identity) cannot be used.",
        "Lookalike audiences sourced from data that violates the Personal Attributes policy are also restricted.",
        "Profiling based on offline behaviors that imply sensitive attributes (e.g. debt status, mental health) is prohibited.",
      ],
    },
    {
      category: "Misrepresentation & Clickbait",
      rules: [
        "Headlines must accurately represent the destination content. 'You won't believe what happened next' style clickbait is rejected when the landing page does not deliver on the promise.",
        "Fabricated claims about endorsement by public figures, media outlets, or government agencies are prohibited.",
        "Misleading UI patterns: fake close buttons, hidden subscription terms, deceptive 'X' icons are banned.",
        "False scarcity: 'Only 2 left!', 'Last chance today' is allowed only when the claim is true and verifiable.",
        "Misleading health, financial, or efficacy claims must be substantiated. Generic 'scientifically proven' without citation is rejected.",
      ],
    },
    {
      category: "Landing Page & Destination",
      rules: [
        "Landing page content must substantially match the ad's offer. Bait-and-switch (ad promises one thing, page delivers another) is a top enforcement trigger.",
        "Pages collecting personal data must include a working privacy policy link that discloses data collection, use, and sharing.",
        "Landing pages must be functional on mobile, load quickly (<5s on 3G), and not require unusual permissions.",
        "Interstitials, pop-ups, or app-install prompts that block content access or make it difficult to navigate away are restricted.",
        "Auto-downloads, auto-redirects to app stores, or unexpected file downloads are prohibited.",
        "Pages must not include malware, phishing forms, or deceptive input fields. Currency, language, and pricing must match the ad's targeted locale.",
      ],
    },
    {
      category: "Creative & Technical Requirements",
      rules: [
        "Image ads: text overlay should not exceed 20% of image area. Excessive text triggers reduced reach (not always a hard ban, but always reach-killing).",
        "Video ads: must not include flashing content faster than 3 flashes/second (epilepsy-safe).",
        "Audio in video ads: must be optional (muted default) where possible. Auto-play with sound is restricted on most placements.",
        "Before/after images, shocking transformations, and idealized body imagery face additional review.",
        "User-generated content used in ads requires documented rights (UGC rights form, influencer contract).",
        "Branded content must be disclosed with the 'Paid Partnership' tag. Failing to disclose sponsorship is a transparency violation.",
        "Landing page buttons that mimic system UI (fake 'Close', fake 'X', OS-style alerts) are misleading UI and banned.",
      ],
    },
    {
      category: "Targeting & Audience",
      rules: [
        "Detailed targeting categories relating to health conditions, mental health, financial distress, sexual orientation, or religious identity are restricted.",
        "Special Ad Categories (housing, employment, credit, political/ social issues) require compliance with the special audience restrictions — no lookalikes, no broad targeting.",
        "Custom audiences uploaded with insufficient consent signals (e.g. hashed emails without a documented opt-in) can be rejected.",
        "Retargeting windows: audiences from Pixel events are subject to platform retention limits (typically 180 days).",
      ],
    },
  ],
}
