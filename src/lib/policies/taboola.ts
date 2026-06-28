export const TABOOLA_POLICIES = {
  platform: "taboola",
  version: "2024-07",
  categories: [
    {
      category: "Prohibited Content",
      rules: [
        "Adult and sexually suggestive content including dating ads with suggestive imagery or text.",
        "Sensationalist, misleading, or clickbait headlines that grossly exaggerate or fabricate claims.",
        "Ads promoting weapons, explosives, or dangerous products.",
        "Illegal substances, drug paraphernalia, or content promoting drug use.",
      ],
    },
    {
      category: "Health & Wellness",
      rules: [
        "Before/after comparison images are strictly prohibited.",
        "Weight loss claims must be realistic and substantiated. 'Lose 10 pounds in a week' type claims are banned.",
        "Health supplements cannot claim to cure, treat, or prevent diseases.",
        "Negative body image targeting ('Tired of being fat?') is prohibited.",
      ],
    },
    {
      category: "Finance & Affiliate",
      rules: [
        'Work-from-home schemes, MLM, and "make money fast" programs are highly restricted.',
        "Cryptocurrency and NFT promotions require express approval.",
        "Financial claims must be specific and verifiable. Vague income promises ('earn $1000/day') are banned.",
        "Free trial offers must clearly disclose recurring billing terms.",
      ],
    },
    {
      category: "Image & Creative Requirements",
      rules: [
        "Images must be high resolution and not misleadingly edited.",
        "No excessive skin exposure — swimsuit is acceptable only in context, lingerie is prohibited.",
        "Buttons and UI elements that mimic system/OS interfaces are considered misleading.",
        "No flashing or strobing animations that may cause seizures.",
      ],
    },
  ],
}
