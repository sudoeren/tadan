// Source: https://www.taboola.com/policies/ad-quality
// Source: https://www.taboola.com/policies/advertiser-policies
// Source: https://www.taboola.com/guidelines/creative
// Note: Taboola is a native advertising network serving content recommendations on
// publisher sites. Their quality bar is high because ads appear alongside editorial
// content. The network is known to aggressively reject clickbait.
// Last reviewed: 2025-01
export const TABOOLA_POLICIES = {
  platform: "taboola",
  version: "2025-01",
  source: "https://www.taboola.com/policies/ad-quality",
  categories: [
    {
      category: "Prohibited Content",
      rules: [
        "Adult and sexually suggestive content: dating ads with suggestive imagery, lingerie-only imagery, or sexually explicit thumbnails are banned. Swimsuit imagery is only acceptable in clearly contextual settings (travel, swimwear product).",
        "Sensationalist, misleading, or clickbait headlines: 'Doctors hate him', 'This one weird trick', 'You won't believe', 'What happened next will shock you' are all rejected.",
        "Weapons, explosives, or dangerous products: firearms, ammunition, instructions for weapon assembly or use.",
        "Illegal substances, drug paraphernalia, prescription drug promotion, or content promoting recreational drug use.",
        "Counterfeit goods, pirated media, or content facilitating copyright infringement.",
        "Hate speech, content targeting protected groups, or content that promotes violence against individuals.",
      ],
    },
    {
      category: "Clickbait & Sensationalism (Taboola-Specific)",
      rules: [
        "Headlines must reflect the actual content of the landing page. Taboola enforces this strictly because of its native placement reputation.",
        "Curiosity gap clickbait: 'What [X] did next will amaze you' is rejected. The headline must tell users what they will get.",
        "Misleading thumbnail/headline mismatch: the thumbnail must visually support the headline's claim, not be a stock image of a shocked face.",
        "Numbered list clickbait ('17 reasons why...') must be substantiated. Generic padded listicles with no actual value are rejected.",
        "Fake news or fabricated news-style content is prohibited. Ads must not be designed to look like editorial news content unless the advertiser is a legitimate news publisher.",
        "Outbrain equivalent 'promoted content' disclosures: native ads must clearly differentiate from editorial content on the landing page.",
      ],
    },
    {
      category: "Health & Wellness",
      rules: [
        "Before/after comparison images, weight loss progress photos, or any 'transformation' imagery is strictly prohibited.",
        "Specific weight loss claims with timeframes are banned: 'Lose 10 pounds in a week', 'Drop 2 dress sizes in 7 days'.",
        "Health supplements cannot claim to cure, treat, or prevent diseases. Phrases like 'cures diabetes', 'treats cancer', 'prevents Alzheimer's' are prohibited.",
        "Negative body image targeting ('Tired of being fat?', 'Embarrassed by your skin?') is prohibited.",
        "Cosmetic procedure ads (Botox, liposuction, BBL) require pre-approval and cannot use before/after imagery.",
        "Mental health and addiction services face additional review. Targeting based on mental health status or addiction is prohibited.",
      ],
    },
    {
      category: "Finance & Affiliate Offers",
      rules: [
        "Work-from-home schemes, MLM, and 'make money fast' programs are highly restricted and frequently rejected outright.",
        "Cryptocurrency, NFT, and DeFi promotions require pre-approval. Unsolicited crypto offers are rejected.",
        "Vague income promises ('earn $1000/day', 'six figures in your sleep') are banned. Any specific earning claim must be substantiated by a real product, with a clear risk disclosure.",
        "Free trial offers must clearly disclose recurring billing terms, the post-trial price, and the cancellation process upfront — not buried in fine print.",
        'Affiliate links to financial products (loans, credit cards, insurance) must lead to a page that provides substantive content, not just a redirect to the lender.',
        "High-cost short-term loan offers (payday loans) are heavily restricted in many regions and frequently rejected on Taboola.",
      ],
    },
    {
      category: "Image & Creative Requirements",
      rules: [
        "Images must be high resolution (minimum 1200x627 for most placements), properly cropped, and not pixelated.",
        "No excessive skin exposure: lingerie, suggestive poses, or partially nude imagery is rejected. Swimsuit acceptable only in context.",
        "Buttons or UI elements that mimic operating system dialogs (fake 'Close', fake 'OK', fake alerts) are misleading and banned.",
        "No flashing or strobing animations that could trigger photosensitive seizures (max 3 flashes/second).",
        "Text overlay: limited to roughly 20% of image area; excessive text on thumbnails reduces performance and may be rejected.",
        "No overlay text that mimics news tickers, breaking news banners, or stock tickers unless the advertiser is a legitimate news/finance publisher.",
        "Cropped faces or exaggerated facial expressions (shocked face stock photos) are flagged as clickbait.",
      ],
    },
    {
      category: "Disclosure & Landing Pages",
      rules: [
        "Landing pages must clearly identify the advertiser and the product being promoted. Anonymity is not allowed.",
        "Privacy policy must be present, accessible from any page collecting user data, and disclose data sharing with third parties (especially Taboola's tracking).",
        "Landing page content must match the ad's promise. Bait-and-switch (ad promises A, page delivers B) is a top reason for account suspension.",
        "Pages must not contain auto-redirects, auto-downloads, or pop-ups that block content access.",
        "Slow-loading pages (over 5s on standard mobile connections) are penalized and may be rejected.",
        "Currency, language, and pricing must match the geo-targeting of the campaign.",
        "Multiple successive redirects (ad → tracker → intermediate page → final offer) are flagged as low quality.",
      ],
    },
    {
      category: "Targeting & Audience",
      rules: [
        "Audience segments based on health conditions, financial distress, sexual orientation, religious identity, or other sensitive attributes are restricted.",
        "Contextual targeting (placing ads next to relevant editorial content) is preferred over behavioral targeting for sensitive verticals.",
        "Lookalike audiences from sensitive data sources are restricted.",
        "Retargeting windows follow Taboola's platform limits and cannot exceed the documented data retention period.",
      ],
    },
  ],
}
