"use client"

import { NavBar } from "@/components/nav-bar"
import Link from "next/link"
import {
  ArrowUp,
  Sparkles,
  Zap,
  Globe,
  Database,
  FileText,
  Link2,
  PenLine,
  Gauge,
  ShieldCheck,
  WandSparkles,
  Check,
  Plus,
  CircleDot,
} from "lucide-react"

const STEPS = [
  {
    icon: PenLine,
    n: "01",
    title: "Paste copy or drop a URL",
    body: "Ad headlines, body copy, CTAs — or a full landing page URL. We handle text or HTML, structured or messy.",
  },
  {
    icon: Database,
    n: "02",
    title: "RAG over 1,200+ policy rules",
    body: "Your input is embedded and matched against Meta, Google, and Taboola policies via pgvector. Top-8 most relevant rules reach the LLM.",
  },
  {
    icon: Gauge,
    n: "03",
    title: "Critic agent scores risk 0–100",
    body: "A critic agent reads your copy through the lens of real platform policy — flagging exact phrases, classifying severity, returning a risk score.",
  },
  {
    icon: WandSparkles,
    n: "04",
    title: "Optimizer agent rewrites",
    body: "8 distinct copywriting techniques. Empowerment framing, curiosity hooks, social proof. Safe — but never sterile.",
  },
]

const PIPELINE = [
  { label: "Scrape", detail: "Cheerio DOM" },
  { label: "Embed", detail: "1536-d vectors" },
  { label: "Retrieve", detail: "Top-8 cosine" },
  { label: "Critic", detail: "Gemini 2.5" },
  { label: "Optimize", detail: "8 techniques" },
  { label: "Variants", detail: "Hook-scored" },
]

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
    icon: Sparkles,
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
      <div className="pointer-events-none fixed inset-0 hero-overlay -z-[5]" />

      {/* HERO */}
      <div className="relative z-[2] flex flex-col items-center text-center px-5 pt-28 sm:pt-36 pb-12">
        <div className="animate-fade-down inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-md ring-1 ring-gray-200 px-3 py-1.5 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
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

      {/* STEPS */}
      <div className="relative z-[2] px-5 sm:px-8 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-white/85 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-6 sm:p-9">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.title}
                    className="animate-fade-up relative rounded-2xl bg-white ring-1 ring-gray-200 p-5 hover:ring-gray-300 transition-all"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-900 text-white ring-1 ring-gray-900 flex items-center justify-center">
                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <span className="text-[11px] text-gray-300 font-mono">
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
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* INPUT MODES */}
      <section className="relative z-[2] py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-9">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.05] tracking-tight text-gray-900">
              Two ways to scan
            </h2>
            <p className="text-gray-500 text-base sm:text-lg mt-3 max-w-xl mx-auto leading-relaxed">
              Paste raw copy or hand over a URL — both go through the same
              critic + optimizer pipeline.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="animate-fade-up rounded-3xl bg-white/90 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-7">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 ring-1 ring-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <FileText className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1.5">
                Ad copy
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-5">
                Paste a headline, body copy, and CTA. Get a verdict in seconds.
              </p>
              <div className="rounded-xl bg-gray-50 ring-1 ring-gray-200 p-3 font-mono text-[12px] text-gray-700 leading-relaxed">
                &ldquo;Guaranteed $500/day with this one weird trick…&rdquo;
              </div>
            </div>
            <div className="animate-fade-up [animation-delay:120ms] rounded-3xl bg-white/90 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-7">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 ring-1 ring-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <Link2 className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1.5">
                Landing page
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-5">
                Drop a URL. We scrape, parse, and flag bait-and-switch patterns.
              </p>
              <div className="rounded-xl bg-gray-50 ring-1 ring-gray-200 px-3 py-2.5 font-mono text-[12px] text-gray-700 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                https://example.com/offer
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PIPELINE — clean horizontal stepper (no terminal) */}
      <section className="relative z-[2] py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="rounded-3xl bg-white/90 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-7 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100/80 ring-1 ring-gray-200 px-2.5 py-1 mb-3">
                  <CircleDot className="w-3 h-3 text-gray-600" />
                  <span className="text-[11px] text-gray-600 font-medium">
                    The pipeline
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-normal leading-[1.1] tracking-tight text-gray-900 max-w-md">
                  Six stages. One verdict. Under six seconds.
                </h2>
              </div>
              <p className="text-sm text-gray-500 sm:max-w-xs sm:text-right">
                Streaming SSE so you see every step live. History saved to your
                private database.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {PIPELINE.map((p, i) => (
                <div
                  key={p.label}
                  className="animate-fade-up relative rounded-2xl bg-white ring-1 ring-gray-200 p-4 hover:ring-gray-900/30 transition-all"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-gray-400">
                      0{i + 1}
                    </span>
                    <Check
                      className="w-3.5 h-3.5 text-emerald-500"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="text-[14px] font-semibold text-gray-900">
                    {p.label}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {p.detail}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between rounded-2xl bg-gray-50 ring-1 ring-gray-200 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                <span className="text-[12px] text-gray-600 font-medium">
                  Stream complete
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-[11px] text-gray-400">risk_score</span>
                <span className="text-[15px] font-semibold text-gray-900">
                  62
                </span>
                <span className="text-[11px] text-gray-400">/ 100</span>
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
    </div>
  )
}
