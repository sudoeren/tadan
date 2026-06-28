export const GOOGLE_ADS_POLICIES = {
  platform: "google",
  version: "2024-07",
  categories: [
    {
      category: "Prohibited Content",
      rules: [
        "Counterfeit goods, dangerous products, and enabling dishonest behavior.",
        "Inappropriate content: hate speech, violence, explicit imagery.",
        "Misrepresentation: false claims about identity, qualifications, or affiliation.",
      ],
    },
    {
      category: "Prohibited Practices",
      rules: [
        "Abusing the ad network: malware, cloaking, misleading site navigation.",
        "Irresponsible data collection: unclear privacy policies, selling user data without consent.",
        "Dishonest pricing: hidden fees, misleading discounts, fake countdown timers.",
      ],
    },
    {
      category: "Restricted Content",
      rules: [
        "Financial services: must include license disclosures, APR, fees. No guaranteed returns or risk-free claims without evidence.",
        "Healthcare and medicines: must comply with local regulations. Unsubstantiated health claims ('miracle cure', 'lose weight fast') are prohibited.",
        "Gambling and games: must be licensed, targeted to 18+, and include responsible gambling messaging.",
        "Political content: must disclose sponsor identity.",
      ],
    },
    {
      category: "Editorial & Technical",
      rules: [
        "Grammar and spelling: ads must use clear, professional language. Excessive capitalization and exclamation marks are penalized.",
        "Destination mismatch: landing page URL domain must match the final URL domain.",
        "Landing page experience: must provide useful, original content. Pop-up ads, affiliate-only bridge pages not allowed.",
      ],
    },
  ],
}
