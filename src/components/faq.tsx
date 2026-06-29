"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const ITEMS = [
  {
    q: "Which platforms do you support?",
    a: "Meta Ads (Facebook + Instagram), Google Ads, and Taboola. TikTok and Outbrain coming next.",
  },
  {
    q: "What does the risk score mean?",
    a: "A 0–100 score where 0–25 is clean, 26–60 needs review, 61–85 is risky, and 86+ is bannable. The score is the maximum across all selected platforms.",
  },
  {
    q: "How are safe variants generated?",
    a: "Our optimizer agent uses 8 distinct copywriting techniques — empowerment framing, curiosity hooks, social proof, specificity, and more. Each variant keeps the marketing hook while staying compliant.",
  },
  {
    q: "Does it work on landing pages?",
    a: "Yes. Drop a URL, we scrape with Cheerio, format the content, and run the same pipeline. We also flag metadata issues like missing privacy policies and bait-and-switch headlines.",
  },
  {
    q: "Is my data used to train models?",
    a: "No. Your ad copy, landing pages, and scan history are never used for training. Embeddings live in your database.",
  },
]

export function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-start">
      {/* Questions list */}
      <div className="flex flex-col">
        {ITEMS.map((item, i) => {
          const isOpen = open === i
          return (
            <button
              key={item.q}
              onClick={() => setOpen(i)}
              className={cn(
                "group flex items-start gap-4 sm:gap-5 text-left py-5 sm:py-6 border-t border-gray-200 transition-colors",
                i === ITEMS.length - 1 && "border-b",
                isOpen ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <span
                className={cn(
                  "font-mono text-[12px] mt-1 tracking-tight transition-colors",
                  isOpen ? "text-orange-500" : "text-gray-300"
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "text-[15px] sm:text-[17px] leading-snug font-medium",
                  isOpen && "text-gray-900"
                )}
              >
                {item.q}
              </span>
            </button>
          )
        })}
      </div>

      {/* Answer panel */}
      <div className="md:sticky md:top-28">
        <div className="rounded-2xl bg-gray-50 p-6 sm:p-8 min-h-[180px]">
          <span className="font-mono text-[11px] tracking-wider text-orange-500 uppercase">
            {String(open + 1).padStart(2, "0")} / {String(ITEMS.length).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-[20px] sm:text-[22px] font-medium text-gray-900 leading-snug">
            {ITEMS[open].q}
          </h3>
          <p className="mt-4 text-[14px] sm:text-[15px] text-gray-600 leading-relaxed">
            {ITEMS[open].a}
          </p>
        </div>
      </div>
    </div>
  )
}
