"use client"

import { NavBar } from "@/components/nav-bar"
import Link from "next/link"
import {
  ArrowUp,
  Shield,
  Sparkles,
  Zap,
  Globe,
  Database,
  Brain,
  FileText,
  Link2,
  ScanSearch,
  Wand2,
  Workflow,
} from "lucide-react"

const STEPS = [
  {
    icon: ScanSearch,
    title: "Paste copy or drop a URL",
    body: "Ad headlines, body copy, CTAs — or a full landing page URL. We handle text or HTML, structured or messy.",
  },
  {
    icon: Database,
    title: "RAG over 1,200+ policy rules",
    body: "Your input is embedded and matched against Meta, Google, and Taboola policy rules via pgvector. Top-8 most relevant rules reach the LLM.",
  },
  {
    icon: Brain,
    title: "Critic agent scores risk 0–100",
    body: "A critic agent reads your copy through the lens of real platform policy — flagging exact phrases, classifying severity, returning a risk score.",
  },
  {
    icon: Wand2,
    title: "Optimizer agent rewrites",
    body: "8 distinct copywriting techniques. Empowerment framing, curiosity hooks, social proof. Safe — but never sterile.",
  },
]

const PIPELINE = [
  { stage: "scrape", label: "Scraping landing page", detail: "Cheerio DOM parse" },
  { stage: "embed", label: "Embedding 412 policy rules", detail: "text-embedding-3-small" },
  { stage: "retrieve", label: "Top-8 relevant rules", detail: "pgvector cosine similarity" },
  { stage: "critic", label: "Critic agent scanning", detail: "Gemini 2.5 Flash" },
  { stage: "violations", label: "2 violations detected", detail: "Critical + Warning" },
  { stage: "optimize", label: "Optimizer agent running", detail: "8 techniques in parallel" },
  { stage: "variants", label: "3 variants generated", detail: "Hook preservation scored" },
]

const FEATURES = [
  {
    icon: Shield,
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
    <div
      className="relative min-h-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85)`,
      }}
    >
      <NavBar variant="transparent" />
      <div className="pointer-events-none absolute inset-0 hero-overlay z-[1]" />

      {/* HERO */}
      <div className="relative z-[2] flex flex-col items-center text-center px-5 pt-32 sm:pt-44 pb-12">
        <div className="animate-fade-down inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-md ring-1 ring-gray-200 px-3 py-1.5 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
          <span className="text-[12px] text-gray-700 font-medium">
            How it works
          </span>
        </div>

        <h1 className="text-gray-900 font-normal leading-[1.02] tracking-[-0.04em] text-[44px] min-[400px]:text-[48px] sm:text-[68px] lg:text-[80px] xl:text-[92px] max-w-4xl">
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

      {/* STEPS — glass card on top of background */}
      <div className="relative z-[2] px-5 sm:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-white/85 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-6 sm:p-10">
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
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] text-gray-300 font-mono">
                        0{i + 1}
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

      {/* INPUT MODES — Ad copy vs Landing page */}
      <section className="relative z-[2] py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
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
                <FileText className="w-6 h-6" />
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
            <div
              className="animate-fade-up [animation-delay:120ms] rounded-3xl bg-white/90 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-7"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 ring-1 ring-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <Link2 className="w-6 h-6" />
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

      {/* PIPELINE — terminal-styled */}
      <section className="relative z-[2] py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md ring-1 ring-gray-200 px-3 py-1.5 text-[12px] font-medium text-gray-700 mb-5">
                <Workflow className="w-3 h-3" />
                The pipeline
              </div>
              <h2 className="text-gray-900 font-normal leading-[1.05] tracking-tight text-3xl sm:text-4xl lg:text-5xl">
                Eight stages. Six seconds. One verdict.
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mt-5 leading-relaxed">
                Streaming SSE so you see every step live. The full pipeline
                runs server-side, then writes to your private history.
              </p>
            </div>
            <div className="rounded-3xl bg-[#0f0f11] ring-1 ring-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.18)] overflow-hidden">
              <div className="bg-[#1a1a1c] border-b border-white/5 px-4 py-2.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-white/40 text-[11px] font-mono">
                  tadan · analyze --stream
                </span>
              </div>
              <div className="p-5 font-mono text-[12.5px] leading-relaxed">
                {PIPELINE.map((p) => {
                  const isViolation =
                    p.stage === "violations" || p.stage === "variants"
                  const isComplete = !isViolation
                  return (
                    <div
                      key={p.stage}
                      className="flex items-start gap-2 py-0.5 animate-fade-in"
                    >
                      <span
                        className={
                          isComplete ? "text-emerald-400" : "text-amber-400"
                        }
                      >
                        {isComplete ? "✓" : "⚠"}
                      </span>
                      <span className="text-white/85">{p.label}</span>
                      <span className="text-white/30 ml-auto pl-3">
                        {p.detail}
                      </span>
                    </div>
                  )
                })}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-3">
                  <span className="text-white/40">risk_score</span>
                  <span className="text-white">62</span>
                  <span className="text-white/40">/ 100</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                    done
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-[2] py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
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
                    <Icon className="w-5 h-5" />
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
      <section className="relative z-[2] py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
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
                  <ArrowUp className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" />
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
      <section className="relative z-[2] py-20 sm:py-28">
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
