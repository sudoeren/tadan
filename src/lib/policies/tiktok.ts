export const TIKTOK_POLICIES = {
  platform: "tiktok",
  version: "2024-07",
  categories: [
    {
      category: "Prohibited Content",
      rules: [
        "Adult, sexual, or sexually suggestive content including suggestive dancing or imagery.",
        "Weapons, firearms, ammunition, explosives, or instructions for their manufacture.",
        "Illegal drugs, drug paraphernalia, or content promoting substance abuse.",
        "Tobacco, vape, and related products including paraphernalia.",
        "Sensational, misleading, or clickbait content that grossly exaggerates claims.",
        "Hate speech, discrimination, or content targeting protected groups.",
      ],
    },
    {
      category: "Health & Wellness",
      rules: [
        "Weight loss claims must not promise rapid or unrealistic results ('Lose 30 pounds in 7 days' is banned).",
        "Before/after comparison imagery is strictly prohibited.",
        "Health products cannot claim to cure, treat, diagnose, or prevent any disease.",
        "Negative body image or self-perception targeting ('Tired of being overweight?') is prohibited.",
        "Mental health services require pre-approval and cannot target vulnerable groups.",
      ],
    },
    {
      category: "Finance & Crypto",
      rules: [
        "Cryptocurrency, NFT, and DeFi promotions require prior authorization.",
        "Guaranteed income or earnings claims are strictly prohibited ('Earn $500/day guaranteed').",
        "Cryptocurrency trading signals and price predictions are restricted.",
        "Investment opportunities must include clear risk disclosures.",
        "Work-from-home and MLM schemes are heavily restricted.",
      ],
    },
    {
      category: "Health Products & Pharma",
      rules: [
        "Prescription pharmaceuticals cannot be advertised directly to consumers.",
        "Over-the-counter medications must comply with local regulations.",
        "Supplements cannot make disease treatment or prevention claims.",
        "Cosmetic procedures must include before/after disclaimers and risk warnings.",
        "Medical devices require regulatory approval documentation.",
      ],
    },
    {
      category: "Disclosures & Landing Pages",
      rules: [
        "All paid promotions must be clearly disclosed with branded content tags.",
        "Landing pages must be functional, load quickly, and match ad content.",
        "Auto-download or forced redirect to app stores is prohibited.",
        "Misleading UI patterns (fake close buttons, hidden subscription terms) are banned.",
        "Privacy policy and terms must be accessible from any landing page.",
      ],
    },
  ],
}
