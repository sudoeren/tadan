// Source: https://support.google.com/adspolicy/answer/6008942 (Policy overview)
// Source: https://support.google.com/adspolicy/answer/6020954 (Prohibited content)
// Source: https://support.google.com/adspolicy/answer/176389 (Editorial & professional)
// Source: https://support.google.com/adspolicy/answer/6153390 (Restricted content)
// Source: https://support.google.com/adspolicy/answer/6368611 (Destination requirements)
// Last reviewed: 2025-01
export const GOOGLE_ADS_POLICIES = {
  platform: "google",
  version: "2025-01",
  source: "https://support.google.com/adspolicy/answer/6008942",
  categories: [
    {
      category: "Prohibited Content",
      rules: [
        "Counterfeit goods: replicas of branded products that mislead users about authenticity.",
        "Dangerous products or services: weapons, explosives, recreational drugs, drug paraphernalia, tobacco, vape products, and any product that facilitates self-harm.",
        "Inappropriate content: hate speech, violence, explicit sexual content, harassment, bullying.",
        "Misrepresentation: false claims about identity, qualifications, certifications, or affiliation with public figures, media outlets, or government agencies.",
        "Unreliable claims: health, financial, or efficacy claims that lack substantiation. Phrases like '100% guaranteed', 'miracle cure', 'lose weight without effort' are rejected.",
        "Adult, sexual, or dating content: services promoting casual encounters, adult entertainment, or sexually explicit material are restricted to certified platforms.",
      ],
    },
    {
      category: "Prohibited Practices",
      rules: [
        "Abusing the ad network: phishing, malware distribution, cloaking (showing different content to crawlers vs. users), misleading site navigation, hidden redirects.",
        "Irresponsible data collection: forms that collect data without clear consent, missing privacy policies, hidden third-party trackers, or data sale without opt-in.",
        "Dishonest pricing: hidden fees, fake countdown timers, misleading 'original price' strikethroughs, false currency claims, deceptive discount framing.",
        "Clickbait that doesn't deliver: headlines and descriptions that sensationalize or misrepresent what the user will find on the landing page.",
        "Misleading structured snippets: claiming features, awards, or ratings that the business does not actually have.",
        "Unfair advantages: scraping competitor content, manipulating reviews, or running ads that impersonate another brand without authorization.",
      ],
    },
    {
      category: "Restricted Content — Financial",
      rules: [
        "Financial products and services must include required disclosures: APR, fees, term, lender name, license number where applicable.",
        "No guaranteed returns: 'risk-free', 'guaranteed profit', 'no way to lose' language is rejected without a verifiable product backing.",
        "Cryptocurrency exchanges, wallets, and DeFi products must be registered with FinCEN (or local equivalent) and may require pre-certification.",
        "Loan products must disclose representative examples including total cost of credit. 'Bad credit welcome' alone is insufficient; APR ranges are required.",
        "Cryptocurrency price predictions, signal services, and leveraged trading promotions are restricted to certified advertisers.",
        "Affiliate links to financial offers are subject to additional scrutiny; landing pages must match the offer's full disclosure.",
      ],
    },
    {
      category: "Restricted Content — Healthcare & Pharma",
      rules: [
        "Prescription pharmaceuticals: only certified pharmacies and telemed platforms in permitted regions can advertise. Brand-name drug promotion has separate rules.",
        "Over-the-counter medications must comply with local regulations and cannot make unsubstantiated health claims.",
        "Health claims like 'miracle cure', 'lose 20 pounds in 10 days', 'eliminate belly fat' are rejected as misleading health claims.",
        "Cosmetic procedures (liposuction, BBL, hair transplants) face geographic restrictions; some procedures are not promotable via Google Ads at all in certain regions.",
        "Medical devices require regulatory clearance (FDA 510(k), CE mark) and corresponding documentation.",
        "Telehealth and online pharmacy: must hold proper certifications (LegitScript, NABP VIPPS, etc.) and comply with regional health authority rules.",
      ],
    },
    {
      category: "Restricted Content — Gambling & Games",
      rules: [
        "Online gambling is restricted in most regions; where allowed, advertisers must hold a valid license and target users 18+ (or local age of majority).",
        "Social casino and sweepstakes: subject to gambling policy. Free-to-play social casino games are restricted in many regions.",
        "Ads for gambling must include responsible gambling messaging and links to support resources where required by local law.",
        "Sports betting: requires certification, age gating, and disclosure of licensing jurisdiction.",
        "Cryptocurrency and NFT-based games with gambling mechanics (loot boxes, chance-based rewards with monetary value) may be treated as gambling.",
      ],
    },
    {
      category: "Restricted Content — Political",
      rules: [
        "Political advertising must include a 'Paid for by' disclosure with the sponsor's name.",
        "Election ads in the US, EU, and other regulated regions require pre-certification and inclusion in transparency libraries.",
        "Ads cannot contain demonstrably false claims about candidates, election procedures, or results (this is enforced more strictly in regulated regions).",
        "Issue advocacy (non-candidate political content) is also subject to disclosure requirements in many regions.",
      ],
    },
    {
      category: "Editorial & Professional Standards",
      rules: [
        "Grammar and spelling: ads must use clear, correct language. Excessive capitalization, repeated punctuation (!!!), and emojis-as-substitute-for-words degrade quality score.",
        "Symbol usage: phone numbers, prices, and percentages are allowed in headlines; symbol-only headlines are rejected.",
        "Word count limits: responsive search ads allow up to 30 characters per headline, 90 per description. Excess is auto-truncated.",
        "Trademarks: ads cannot use trademarked terms in ad text if the advertiser lacks authorization (though bidding on trademark keywords may be allowed in some regions).",
        "Call-to-action clarity: vague CTAs ('Click here for more') are low quality; specific CTAs ('Get a free quote') score better.",
        "Consistent capitalization: Title Case only on proper nouns; ALL CAPS is restricted and reduces quality score.",
      ],
    },
    {
      category: "Destination & Landing Page Experience",
      rules: [
        "Domain consistency: the display URL's root domain must match the final landing page domain. Tracking subdomains (link.tracker.com → final.com) are allowed when disclosed but can be flagged.",
        "Landing page must be mobile-friendly, fast-loading, and provide original, useful content related to the ad's offer.",
        "Affiliate bridge pages (pages whose only purpose is to redirect users to another offer) are not allowed. The page must add substantive value.",
        "Excessive pop-ups, interstitials that block content, or auto-playing audio degrade Landing Page Experience score and reduce rank.",
        "SSL required: all destination URLs must use HTTPS. Mixed content (HTTP images on HTTPS pages) can trigger soft flags.",
        "Currency, language, and pricing on the landing page must match the ad's targeted locale.",
        "Privacy policy: pages collecting personal data must include a working privacy policy and provide opt-out for non-essential cookies (especially in EU under GDPR / ePrivacy).",
      ],
    },
    {
      category: "Ad Format & Technical",
      rules: [
        "Trademarks in display URLs: the display URL must accurately reflect the destination domain. Showing 'nike.com' for a non-Nike site is misrepresentation.",
        "Phone numbers and click-to-call: must be the advertiser's actual number. Shared or spoofed numbers can be rejected.",
        "Image extension formats must meet Google's creative specs (correct aspect ratios, file sizes). Auto-decline on format errors.",
        "App extension ads: must link to the actual app store listing; deep links must be functional.",
        "Lead form extensions: must include the advertiser's actual identity and not collect data outside the form's stated purpose.",
      ],
    },
  ],
}
