// Source: https://ads.tiktok.com/help/article/tiktok-ads-policy
// Source: https://ads.tiktok.com/help/article/ads-policy-prohibited-content
// Source: https://ads.tiktok.com/help/article/ads-policy-restricted-content
// Source: https://ads.tiktok.com/help/article/ads-policy-landing-page
// Source: https://ads.tiktok.com/help/article/tiktok-ads-creative-guidelines
// Note: TikTok's policy is heavily focused on user safety (younger demographic),
// and on creative authenticity (the platform rejects anything that feels like
// an 'old-school direct response' ad).
// Last reviewed: 2025-01
export const TIKTOK_POLICIES = {
  platform: "tiktok",
  version: "2025-01",
  source: "https://ads.tiktok.com/help/article/tiktok-ads-policy",
  categories: [
    {
      category: "Prohibited Content",
      rules: [
        "Adult, sexual, or sexually suggestive content including suggestive dancing, partial nudity, or imagery designed to sexualize the body.",
        "Weapons, firearms, ammunition, explosives, or instructions for their manufacture or use.",
        "Illegal drugs, drug paraphernalia, or content promoting substance abuse (including alcohol abuse).",
        "Tobacco, vape, and related products including accessories and paraphernalia.",
        "Sensational, misleading, or clickbait content that grossly exaggerates claims ('This will change your life forever' with no substantiation).",
        "Hate speech, discrimination, or content targeting protected groups. Slurs and demeaning language are banned even in casual context.",
        "Violent or graphic content: explicit gore, animal cruelty, violent acts against people.",
      ],
    },
    {
      category: "Health & Wellness",
      rules: [
        "Weight loss claims must not promise rapid or unrealistic results. 'Lose 30 pounds in 7 days' is banned. 'Lose 1-2 pounds per week with diet and exercise' is acceptable.",
        "Before/after comparison imagery is strictly prohibited for weight loss, fitness, skincare, or any transformation context.",
        "Health products cannot claim to cure, treat, diagnose, or prevent any disease. Phrases like 'cures', 'eliminates', 'treats' trigger health claims review.",
        "Negative body image or self-perception targeting ('Tired of being overweight?', 'Embarrassed by your acne?') is prohibited.",
        "Mental health services require pre-approval and cannot target vulnerable groups (e.g. based on mental health interests).",
        "Skincare products cannot claim to 'cure' conditions like acne, eczema, or rosacea. They may support, help, or improve but not cure.",
        "Specific body-part targeting ('belly fat', 'thigh fat') with a weight loss product is heavily restricted.",
      ],
    },
    {
      category: "Finance & Crypto",
      rules: [
        "Cryptocurrency, NFT, and DeFi promotions require prior authorization. Advertisers must be registered financial entities or licensed platforms.",
        "Guaranteed income or earnings claims are strictly prohibited: 'Earn $500/day guaranteed', 'Make $10K this week'.",
        "Cryptocurrency trading signals, price prediction services, and leveraged trading promotions are restricted to certified advertisers.",
        "Investment opportunities must include clear risk disclosures. Omission of risk language is grounds for rejection.",
        "Work-from-home and MLM schemes are heavily restricted. Pyramid-style compensation structures are prohibited.",
        'Loan offers must disclose APR, fees, term, and the licensed lender. "No credit check" as a primary hook is restricted.',
      ],
    },
    {
      category: "Health Products & Pharma",
      rules: [
        "Prescription pharmaceuticals cannot be advertised directly to consumers in most regions.",
        "Over-the-counter medications must comply with local regulations and include required disclaimers.",
        "Supplements cannot make disease treatment or prevention claims. 'Supports immune health' is acceptable; 'prevents colds' is not.",
        "Cosmetic procedures must include risk warnings, before/after disclaimers, and proper licensing information.",
        "Medical devices require regulatory approval documentation (FDA 510(k), CE mark, or local equivalent).",
        "Hormone-related products (testosterone boosters, HGH, 'anti-aging' hormone products) are heavily restricted.",
      ],
    },
    {
      category: "Disclosures & Landing Pages",
      rules: [
        "All paid promotions must be clearly disclosed with branded content tags. Failing to disclose sponsorship is a transparency violation.",
        "Landing pages must be functional, load quickly (under 3s recommended), and match ad content.",
        "Auto-download or forced redirect to app stores is prohibited. App-install interstitials that block content are restricted.",
        "Misleading UI patterns: fake close buttons, hidden subscription terms, deceptive countdown timers are banned.",
        "Privacy policy and terms must be accessible from any landing page. Cookie consent must comply with regional laws (GDPR, CCPA).",
        "Currency, language, and pricing must match the ad's targeted locale.",
        "Pages must not include phishing forms, fake login prompts, or deceptive input fields.",
      ],
    },
    {
      category: "Creative & Community Guidelines",
      rules: [
        "Video ads must not include flashing content faster than 3 flashes/second (epilepsy safety).",
        "Audio in video ads: must support muted playback. Auto-play with sound is restricted.",
        "Content that mimics organic user-generated content without proper disclosure (the 'native' look) is restricted on TikTok specifically — they want ads to look like ads.",
        "Hashtag usage: ads cannot use unrelated trending hashtags to gain distribution. Hashtags must relate to the ad's actual content.",
        "Faces, body parts, and recognizable features: must be authentic. Stock footage masquerading as UGC is rejected.",
        "Voice-over or on-screen text must match the ad's claims. Misleading narration is grounds for rejection.",
        "Loud, abrupt, or distressing audio is restricted. The platform's 'Surprise & Delight' aesthetic is the bar.",
        "Branded content must be clearly disclosed; using UGC creators without proper branded content tagging is a violation.",
      ],
    },
    {
      category: "Targeting & Audience",
      rules: [
        "Detailed targeting categories relating to health conditions, mental health, financial distress, sexual orientation, or religious identity are restricted.",
        "Age targeting: certain verticals (alcohol, gambling, financial) are restricted from audiences under the local age of majority.",
        "Custom audiences uploaded with insufficient consent signals (e.g. hashed emails without a documented opt-in) can be rejected.",
        "Retargeting windows: subject to platform retention limits (typically 90-180 days depending on data source).",
        "Lookalike audiences sourced from data that violates TikTok's Sensitive Category policy are restricted.",
      ],
    },
  ],
}
