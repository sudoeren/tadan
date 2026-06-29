"use client"

import { Fragment } from "react"
import { FileText, Search, Gauge, WandSparkles } from "lucide-react"

const STEPS = [
  {
    n: "01",
    icon: FileText,
    title: "Paste copy or URL",
    body: "Ad headlines, body copy, CTAs — or a full landing page URL. We handle text or HTML, structured or messy.",
  },
  {
    n: "02",
    icon: Search,
    title: "RAG matches policies",
    body: "Your input is embedded and matched against Meta, Google, and Taboola policies via pgvector. Top-8 most relevant rules reach the LLM.",
  },
  {
    n: "03",
    icon: Gauge,
    title: "Critic scores risk 0–100",
    body: "A critic agent reads your copy through the lens of real platform policy — flagging exact phrases, classifying severity, returning a risk score.",
  },
  {
    n: "04",
    icon: WandSparkles,
    title: "Optimizer rewrites",
    body: "8 distinct copywriting techniques. Empowerment framing, curiosity hooks, social proof. Safe — but never sterile.",
  },
]

export default function StepsSection() {
  return (
    <div className="relative z-[2] px-5 sm:px-8 pb-12 sm:pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl bg-white/85 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-6 sm:p-9">
          <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-0">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <Fragment key={step.n}>
                  <div
                    className="animate-fade-up relative flex-1 rounded-2xl bg-white ring-1 ring-gray-200 p-5 hover:ring-gray-300 transition-all"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon
                        className="w-7 h-7 text-orange-500"
                        strokeWidth={1.75}
                      />
                      <span className="text-[12px] font-mono text-gray-300">
                        {step.n}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">
                      {step.body}
                    </p>
                  </div>

                  {i < STEPS.length - 1 && (
                    <div
                      className="flex items-center justify-center py-2 lg:py-0 lg:px-2"
                      aria-hidden
                    >
                      <svg
                        className="w-16 h-6 lg:w-12 lg:h-10 text-orange-500 rotate-90 lg:rotate-0"
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
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
