"use client"

import { Fragment } from "react"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"
import Link from "next/link"
import {
  ArrowUp,
  Zap,
  Globe,
  FileText,
  Link2,
  ShieldCheck,
  WandSparkles,
  Plus,
  Search,
  Gauge,
} from "lucide-react"

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

// (constants removed — One scan section uses inline SVGs)

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Real policy enforcement",
    body: "Rules sourced directly from Meta, Google, and Taboola. Not vibes. Not LLM guessing.",
  },
  {
    icon: Zap,
    title: "Hook-preserving rewrites",
    body: "Safe variants that keep the marketing punch — eight distinct techniques, all compliant.",
  },
  {
    icon: Globe,
    title: "Landing page audit",
    body: "Drop a URL. We scrape, parse, and flag the bait-and-switch before it costs you your account.",
  },
  {
    icon: WandSparkles,
    title: "RAG over policy docs",
    body: "Only the most relevant policy rules reach the LLM. Lower token cost, higher accuracy.",
  },
]

const FAQS = [
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

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen">
      <NavBar variant="transparent" />

      {/* HERO */}
      <div className="relative z-[2] flex flex-col items-center text-center px-5 pt-28 sm:pt-36 pb-12">
        <div className="animate-fade-down inline-flex items-center gap-1.5 rounded-full bg-white/30 backdrop-blur-xl ring-1 ring-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_4px_20px_rgba(0,0,0,0.04)] px-3.5 py-1.5 mb-7">
          <span className="text-[12px] text-gray-700 font-medium">
            How it works
          </span>
        </div>

        <h1 className="text-gray-900 font-normal leading-[1.02] tracking-[-0.04em] text-[44px] min-[400px]:text-[48px] sm:text-[64px] lg:text-[76px] xl:text-[88px] max-w-4xl">
          <span className="block animate-fade-up">From sketchy copy.</span>
          <span className="block animate-fade-up [animation-delay:100ms]">
            To safe to ship.
          </span>
        </h1>

        <p className="animate-fade-up [animation-delay:220ms] text-gray-600 text-base sm:text-lg mt-5 max-w-xl leading-relaxed">
          Two AI agents, a pgvector knowledge base, and 1,200+ policy rules —
          the full pipeline behind every tadan verdict.
        </p>
      </div>

      {/* STEPS — 4 cards with orange dashed animated arrows between them */}
      <div className="relative z-[2] px-5 sm:px-8 pb-12">
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
              )}
            )}
            </div>
          </div>
        </div>
      </div>

      {/* INPUT MODES — two ways, same orange/white flow as steps */}
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
              {/* Card 1: Ad copy */}
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
                  &ldquo;Guaranteed $500/day with this one weird trick…&rdquo;
                </div>
              </div>

              {/* OR connector */}
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

              {/* Card 2: Landing page */}
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

      {/* ONE SCAN — North-style "old way vs with us" comparison */}
      <section className="relative z-[2] py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.05] tracking-tight text-gray-900">
              One scan. Every platform.
            </h2>
            <p className="text-gray-500 text-base sm:text-lg mt-3 max-w-xl mx-auto leading-relaxed">
              Stop repeating yourself. Scan once with tadan, and we will
              check your copy against every platform policy in one pass.
            </p>

            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
              {/* Old way */}
              <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-8">
                <div className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Old way
                </div>
                <svg
                  width="320"
                  height="200"
                  viewBox="0 0 160 100"
                  fill="none"
                  className="text-gray-300"
                >
                  <rect
                    x="4"
                    y="40"
                    width="32"
                    height="20"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="white"
                  />
                  <text
                    x="20"
                    y="53"
                    textAnchor="middle"
                    className="fill-gray-400"
                    fontSize="8"
                  >
                    You
                  </text>

                  <path
                    id="oldPath1"
                    d="M36 45 Q60 25 90 20"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                    fill="none"
                  />
                  <path
                    id="oldPath2"
                    d="M36 48 Q65 40 90 40"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                    fill="none"
                  />
                  <path
                    id="oldPath3"
                    d="M36 52 Q65 60 90 60"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                    fill="none"
                  />
                  <path
                    id="oldPath4"
                    d="M36 55 Q60 75 90 80"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                    fill="none"
                  />

                  <defs>
                    <g id="docIconGray">
                      <rect
                        x="-3"
                        y="-4"
                        width="6"
                        height="8"
                        rx="0.5"
                        fill="white"
                        stroke="#a1a1aa"
                        strokeWidth="0.5"
                      />
                      <path
                        d="M-1.5 -1.5 L1.5 -1.5 M-1.5 0.5 L1.5 0.5 M-1.5 2.5 L0.5 2.5"
                        stroke="#d4d4d8"
                        strokeWidth="0.5"
                      />
                    </g>
                    <g id="metaLogo">
                      <path
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        fill="#1877F2"
                      />
                    </g>
                    <g id="googleLogo">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </g>
                    <g id="taboolaLogo">
                      <rect x="2" y="4" width="20" height="16" rx="2" fill="#6C2BD9" />
                      <path
                        d="M7 8h3l2 4-2 4H7l2-4-2-4zM14 8h3v8h-3z"
                        fill="white"
                      />
                    </g>
                    <g id="tiktokLogo">
                      <path
                        d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"
                        fill="#000"
                      />
                    </g>
                  </defs>
                  <use href="#docIconGray" opacity="0">
                    <animateMotion
                      id="oldDot1Motion"
                      dur="3s"
                      begin="0s; oldDot4Motion.end + 1.5s"
                    >
                      <mpath href="#oldPath1" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.01;0.95;1"
                      dur="3s"
                      begin="0s; oldDot4Motion.end + 1.5s"
                    />
                  </use>
                  <use href="#docIconGray" opacity="0">
                    <animateMotion
                      id="oldDot2Motion"
                      dur="3s"
                      begin="oldDot1Motion.begin + 2.5s"
                    >
                      <mpath href="#oldPath2" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.01;0.95;1"
                      dur="3s"
                      begin="oldDot1Motion.begin + 2.5s"
                    />
                  </use>
                  <use href="#docIconGray" opacity="0">
                    <animateMotion
                      id="oldDot3Motion"
                      dur="3s"
                      begin="oldDot1Motion.begin + 5s"
                    >
                      <mpath href="#oldPath3" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.01;0.95;1"
                      dur="3s"
                      begin="oldDot1Motion.begin + 5s"
                    />
                  </use>
                  <use href="#docIconGray" opacity="0">
                    <animateMotion
                      id="oldDot4Motion"
                      dur="3s"
                      begin="oldDot1Motion.begin + 7.5s"
                    >
                      <mpath href="#oldPath4" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.01;0.95;1"
                      dur="3s"
                      begin="oldDot1Motion.begin + 7.5s"
                    />
                  </use>

                  <rect
                    x="90"
                    y="12"
                    width="24"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="white"
                  />
                  <rect
                    x="90"
                    y="32"
                    width="24"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="white"
                  />
                  <rect
                    x="90"
                    y="52"
                    width="24"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="white"
                  />
                  <rect
                    x="90"
                    y="72"
                    width="24"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="white"
                  />

                  {/* Platform logos inside boxes */}
                  <use
                    href="#metaLogo"
                    transform="translate(102 20) scale(0.6) translate(-12 -12)"
                  />
                  <use
                    href="#googleLogo"
                    transform="translate(102 40) scale(0.6) translate(-12 -12)"
                  />
                  <use
                    href="#taboolaLogo"
                    transform="translate(102 60) scale(0.6) translate(-12 -12)"
                  />
                  <use
                    href="#tiktokLogo"
                    transform="translate(102 80) scale(0.6) translate(-12 -12)"
                  />

                  <text
                    x="125"
                    y="24"
                    className="fill-gray-300"
                    fontSize="10"
                  >
                    ✕
                  </text>
                  <text
                    x="125"
                    y="44"
                    className="fill-gray-300"
                    fontSize="10"
                  >
                    ?
                  </text>
                  <text
                    x="125"
                    y="64"
                    className="fill-gray-300"
                    fontSize="10"
                  >
                    ✕
                  </text>
                  <text
                    x="125"
                    y="84"
                    className="fill-gray-300"
                    fontSize="10"
                  >
                    ?
                  </text>
                </svg>
              </div>

              <div className="text-xl font-semibold text-gray-900">vs.</div>

              {/* With tadan */}
              <div className="relative flex flex-col items-center rounded-xl border border-orange-200 bg-white p-8">
                <div className="mb-3 text-xs font-medium uppercase tracking-wide text-orange-500">
                  With tadan
                </div>
                <div className="relative">
                <svg
                  width="320"
                  height="200"
                  viewBox="0 0 160 100"
                  fill="none"
                >
                  <rect
                    x="4"
                    y="40"
                    width="32"
                    height="20"
                    rx="4"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    fill="white"
                  />
                  <text
                    x="20"
                    y="53"
                    textAnchor="middle"
                    className="fill-orange-500"
                    fontSize="8"
                  >
                    You
                  </text>

                  <path
                    id="pathToTadan"
                    d="M36 50 L58 50"
                    stroke="#f97316"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    id="pathToCompany1"
                    d="M70 50 Q90 25 108 20"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    id="pathToCompany2"
                    d="M70 50 Q95 40 108 40"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    id="pathToCompany3"
                    d="M70 50 Q95 60 108 60"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    id="pathToCompany4"
                    d="M70 50 Q90 75 108 80"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  <defs>
                    <g id="docIconOrange">
                      <rect
                        x="-3"
                        y="-4"
                        width="6"
                        height="8"
                        rx="0.5"
                        fill="white"
                        stroke="#f97316"
                        strokeWidth="0.5"
                      />
                      <path
                        d="M-1.5 -1.5 L1.5 -1.5 M-1.5 0.5 L1.5 0.5 M-1.5 2.5 L0.5 2.5"
                        stroke="#fdba74"
                        strokeWidth="0.5"
                      />
                    </g>
                    <g id="metaLogoR">
                      <path
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        fill="#1877F2"
                      />
                    </g>
                    <g id="googleLogoR">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </g>
                    <g id="taboolaLogoR">
                      <rect x="2" y="4" width="20" height="16" rx="2" fill="#6C2BD9" />
                      <path
                        d="M7 8h3l2 4-2 4H7l2-4-2-4zM14 8h3v8h-3z"
                        fill="white"
                      />
                    </g>
                    <g id="tiktokLogoR">
                      <path
                        d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"
                        fill="#000"
                      />
                    </g>
                  </defs>
                  <use href="#docIconOrange" opacity="0">
                    <animateMotion
                      id="dotToTadan"
                      dur="1.5s"
                      begin="0s; dotToCompany1.end + 0.5s"
                    >
                      <mpath href="#pathToTadan" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.02;0.95;1"
                      dur="1.5s"
                      begin="0s; dotToCompany1.end + 0.5s"
                      fill="freeze"
                    />
                  </use>
                  <use href="#docIconOrange" opacity="0">
                    <animateMotion
                      id="dotToCompany1"
                      dur="3s"
                      begin="dotToTadan.end"
                    >
                      <mpath href="#pathToCompany1" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.01;0.95;1"
                      dur="3s"
                      begin="dotToTadan.end"
                      fill="freeze"
                    />
                  </use>
                  <use href="#docIconOrange" opacity="0">
                    <animateMotion
                      dur="3s"
                      begin="dotToTadan.end"
                    >
                      <mpath href="#pathToCompany2" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.01;0.95;1"
                      dur="3s"
                      begin="dotToTadan.end"
                      fill="freeze"
                    />
                  </use>
                  <use href="#docIconOrange" opacity="0">
                    <animateMotion
                      dur="3s"
                      begin="dotToTadan.end"
                    >
                      <mpath href="#pathToCompany3" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.01;0.95;1"
                      dur="3s"
                      begin="dotToTadan.end"
                      fill="freeze"
                    />
                  </use>
                  <use href="#docIconOrange" opacity="0">
                    <animateMotion
                      dur="3s"
                      begin="dotToTadan.end"
                    >
                      <mpath href="#pathToCompany4" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.01;0.95;1"
                      dur="3s"
                      begin="dotToTadan.end"
                      fill="freeze"
                    />
                  </use>

                  <circle
                    cx="70"
                    cy="50"
                    r="12"
                    fill="#fff7ed"
                    stroke="#f97316"
                    strokeWidth="1.5"
                  />

                  <rect
                    x="108"
                    y="12"
                    width="24"
                    height="16"
                    rx="2"
                    stroke="#f97316"
                    strokeWidth="1"
                    fill="white"
                  />
                  <rect
                    x="108"
                    y="32"
                    width="24"
                    height="16"
                    rx="2"
                    stroke="#f97316"
                    strokeWidth="1"
                    fill="white"
                  />
                  <rect
                    x="108"
                    y="52"
                    width="24"
                    height="16"
                    rx="2"
                    stroke="#f97316"
                    strokeWidth="1"
                    fill="white"
                  />
                  <rect
                    x="108"
                    y="72"
                    width="24"
                    height="16"
                    rx="2"
                    stroke="#f97316"
                    strokeWidth="1"
                    fill="white"
                  />

                  {/* Platform logos inside boxes */}
                  <use
                    href="#metaLogoR"
                    transform="translate(120 20) scale(0.6) translate(-12 -12)"
                  />
                  <use
                    href="#googleLogoR"
                    transform="translate(120 40) scale(0.6) translate(-12 -12)"
                  />
                  <use
                    href="#taboolaLogoR"
                    transform="translate(120 60) scale(0.6) translate(-12 -12)"
                  />
                  <use
                    href="#tiktokLogoR"
                    transform="translate(120 80) scale(0.6) translate(-12 -12)"
                  />

                  <text
                    x="143"
                    y="24"
                    className="fill-orange-500"
                    fontSize="10"
                  >
                    ✓
                  </text>
                  <text
                    x="143"
                    y="44"
                    className="fill-orange-500"
                    fontSize="10"
                  >
                    ✓
                  </text>
                  <text
                    x="143"
                    y="64"
                    className="fill-orange-500"
                    fontSize="10"
                  >
                    ✓
                  </text>
                  <text
                    x="143"
                    y="84"
                    className="fill-orange-500"
                    fontSize="10"
                  >
                    ✓
                  </text>
                </svg>
                {/* Tadan logo overlaid on hub circle (SVG hub is at viewBox 70,50 → 140px, 100px in 320x200) */}
                <Logo className="absolute left-[140px] top-[100px] -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-gray-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-[2] py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-9">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.05] tracking-tight text-gray-900">
              Why it works
            </h2>
            <p className="text-gray-500 text-base sm:text-lg mt-3 max-w-xl mx-auto leading-relaxed">
              The boring infrastructure that makes the magic reliable.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="animate-fade-up rounded-3xl bg-white/90 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    {f.body}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-[2] py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-9">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.05] tracking-tight text-gray-900">
              Common questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details
                key={f.q}
                className="animate-fade-up group rounded-2xl bg-white/90 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5 open:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-[15px] font-semibold text-gray-900">
                    {f.q}
                  </span>
                  <Plus className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-45" />
                </summary>
                <p className="text-[14px] text-gray-600 mt-3 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-[2] py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.05] tracking-tight text-gray-900">
            Ready to run your first scan?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mt-4 leading-relaxed">
            Paste copy, get a verdict, ship safe. Free to start.
          </p>
          <div className="mt-8 inline-flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium pl-6 pr-1.5 py-1.5 rounded-full hover:bg-gray-800 transition-all">
            <Link href="/signup" className="px-1.5">
              Start scanning free
            </Link>
            <span className="w-9 h-9 rounded-full bg-white/10 inline-flex items-center justify-center">
              <ArrowUp className="w-4 h-4" />
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
