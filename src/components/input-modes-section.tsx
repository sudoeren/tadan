"use client"

import { FileText, Link2, Globe } from "lucide-react"

export default function InputModesSection() {
  return (
    <section className="relative z-[2] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-9">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.05] tracking-tight text-gray-900">
            Two ways to scan
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-3 max-w-xl mx-auto leading-relaxed">
            Paste raw copy or hand over a URL — both flow through the same
            critic + optimizer pipeline.
          </p>
        </div>

        <div className="rounded-3xl bg-white/85 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-0">
            <div
              className="animate-fade-up flex-1 rounded-2xl bg-white ring-1 ring-gray-200 p-6 hover:ring-orange-300 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <FileText
                  className="w-7 h-7 text-orange-500"
                  strokeWidth={1.75}
                />
                <span className="text-[12px] font-mono text-gray-300">01</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                Ad copy
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                Paste your headline, body, and CTA. We score it against
                every platform policy in seconds.
              </p>
              <div className="rounded-xl bg-orange-50/60 ring-1 ring-orange-200/50 p-3 font-mono text-[12px] text-gray-700 leading-relaxed">
                &ldquo;Guaranteed $500/day with this one weird trick&hellip;&rdquo;
              </div>
            </div>

            <div
              className="flex items-center justify-center gap-3 py-2 lg:py-0 lg:px-3"
              aria-hidden
            >
              <svg
                className="w-16 h-6 lg:w-14 lg:h-10 text-orange-500 -rotate-90 lg:rotate-0"
                viewBox="0 0 60 16"
                fill="none"
              >
                <line
                  x1="12"
                  y1="8"
                  x2="58"
                  y2="8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="flow-dash"
                />
                <path
                  d="M16 2 L4 8 L16 14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <span className="text-[11px] uppercase tracking-[0.2em] text-orange-500 font-semibold">
                or
              </span>
              <svg
                className="w-16 h-6 lg:w-14 lg:h-10 text-orange-500 rotate-90 lg:rotate-0"
                viewBox="0 0 60 16"
                fill="none"
              >
                <line
                  x1="2"
                  y1="8"
                  x2="48"
                  y2="8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="flow-dash"
                />
                <path
                  d="M44 2 L56 8 L44 14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>

            <div
              className="animate-fade-up [animation-delay:120ms] flex-1 rounded-2xl bg-white ring-1 ring-gray-200 p-6 hover:ring-orange-300 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <Link2
                  className="w-7 h-7 text-orange-500"
                  strokeWidth={1.75}
                />
                <span className="text-[12px] font-mono text-gray-300">02</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                Landing page
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                Drop a URL. We scrape the page, parse the content, and flag
                bait-and-switch patterns automatically.
              </p>
              <div className="rounded-xl bg-orange-50/60 ring-1 ring-orange-200/50 px-3 py-2.5 font-mono text-[12px] text-gray-700 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-orange-500" />
                https://example.com/offer
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
