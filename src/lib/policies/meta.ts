export const META_AD_POLICIES = {
  platform: "meta",
  version: "2024-07",
  categories: [
    {
      category: "Prohibited Content",
      rules: [
        "Ads must not promote illegal products, services, or activities.",
        "Ads must not discriminate against or exploit protected characteristics.",
        "Ads must not contain adult content, nudity, or sexually suggestive imagery unless it meets educational/documentary exceptions.",
      ],
    },
    {
      category: "Restricted Content",
      rules: [
        'Alcohol ads must comply with local laws and target users 18+. Phrases like "drink more" or glamorizing excessive consumption are prohibited.',
        "Weight loss and health claims must be substantiated. Before/after photos are restricted. Personal health attributes (weight, BMI, medical conditions) cannot be targeted.",
        "Financial product ads must include clear disclosures. Get-rich-quick schemes, pyramid schemes, and promises of guaranteed returns are prohibited.",
        "Dating services must be pre-approved. Ads implying casual encounters or using sexually suggestive language are prohibited.",
      ],
    },
    {
      category: "Personal Attributes & Targeting",
      rules: [
        "Ads must not assert or imply personal attributes of the viewer (e.g., 'Are you overweight?', 'Do you have depression?').",
        "Cannot use language that evokes negative self-perception ('Are you tired of being single?').",
        "No targeting based on sensitive categories like health conditions, sexual orientation, religious beliefs.",
      ],
    },
    {
      category: "Landing Page Requirements",
      rules: [
        "Landing page must match the ad's offer — no bait-and-switch.",
        "Must have a functional, non-disruptive user experience — no excessive pop-ups that block content.",
        "Privacy policy link must be present on pages collecting user data.",
        "No automatic downloads or malware.",
      ],
    },
  ],
}
