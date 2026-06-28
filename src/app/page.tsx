"use client"

import Link from "next/link"
import { useSession } from "@/lib/auth-client"
import {
  Sparkles,
  Shield,
  Zap,
  Globe,
  Check,
  ArrowUp,
  ArrowUpRight,
} from "lucide-react"
import { DashboardMockup } from "@/components/dashboard-mockup"
import { ScaledDashboard } from "@/components/scaled-dashboard"

const PLATFORMS = [
  { name: "Meta", color: "#1877F2" },
  { name: "Google", color: "#4285F4" },
  { name: "Taboola", color: "#6C2BD9" },
  { name: "TikTok", color: "#000000" },
  { name: "Outbrain", color: "#EE6E37" },
]

const TESTIMONIALS = [
  "Saved us $40k in account bans last quarter",
  "Caught a $5k Meta ban 10 minutes before launch",
  "Replaced our 3-person compliance team",
  "My media buyers can't live without this",
  "Pays for itself in the first banned ad it prevents",
  "We shipped 200 ads in one month — zero rejections",
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
    body: "Safe variants that keep the marketing punch — eight distinct copywriting techniques, all compliant.",
  },
  {
    icon: Globe,
    title: "Landing page audit",
    body: "Drop a URL. We scrape, parse, and flag the bait-and-switch before it costs you your account.",
  },
  {
    icon: Sparkles,
    title: "RAG over policy docs",
    body: "Embeddings search over 1,200+ policy rules. Only the relevant ones reach the LLM. Lower cost, higher accuracy.",
  },
]

export default function HomePage() {
  const { data: session, isPending } = useSession()

  return (
    <>
      {/* HERO */}
      <section
        className="relative min-h-[100svh] overflow-hidden bg-cover bg-center flex flex-col"
        style={{
          backgroundImage: `url(https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85)`,
        }}
      >
        {/* gradient overlay for legibility */}
        <div className="pointer-events-none absolute inset-0 hero-overlay z-[1]" />

        <div className="relative z-[2] flex-1 min-h-8 sm:min-h-12 lg:min-h-16 shrink-0" />

        <div className="relative z-[2] flex flex-col items-center text-center px-5 max-w-5xl mx-auto w-full">
          {/* Eyebrow chip */}
          <div className="animate-fade-down mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur-md ring-1 ring-gray-200 px-3.5 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[12px] text-gray-700 font-medium">
              Built for media buyers — by media buyers
            </span>
          </div>

          <h1 className="text-gray-900 font-normal leading-[1.02] tracking-[-0.04em] text-[44px] min-[400px]:text-[48px] sm:text-[68px] lg:text-[80px] xl:text-[92px]">
            <span className="block animate-fade-up">Ship compliant ads.</span>
            <span className="block animate-fade-up [animation-delay:100ms]">
              Not banned accounts.
            </span>
          </h1>

          <p className="animate-fade-up [animation-delay:220ms] mt-5 sm:mt-6 text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl">
            Scan ad copy and landing pages against Meta, Google, and Taboola
            policies. Get safe rewrites that keep your hook
            <Sparkles className="inline w-4 h-4 -mt-1 ml-1 text-gray-700" />
          </p>

          {/* Search-style form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = session ? "/analyzer" : "/signup"
            }}
            className="animate-fade-up [animation-delay:340ms] mt-6 sm:mt-8 w-full max-w-xl"
          >
            <div className="flex items-center gap-2 sm:gap-3 rounded-full bg-white/70 backdrop-blur-md ring-1 ring-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] pl-4 sm:pl-5 pr-1.5 py-1.5">
              <Shield className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
              <input
                type="text"
                readOnly
                value="Paste your ad copy or landing page URL…"
                className="flex-1 bg-transparent text-sm sm:text-[15px] text-gray-500 placeholder-gray-500 outline-none py-2 cursor-pointer"
                aria-label="Open analyzer"
              />
              <button
                type="submit"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900 text-white hover:scale-105 active:scale-95 transition-transform shrink-0 inline-flex items-center justify-center"
              >
                <ArrowUp className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </form>

          {/* CTA buttons */}
          <div className="animate-fade-up [animation-delay:460ms] mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3">
            {isPending ? (
              <div className="h-10 w-28 animate-pulse rounded-full bg-gray-100" />
            ) : session ? (
              <Link
                href="/analyzer"
                className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                Open analyzer
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all inline-flex items-center gap-2"
                >
                  Try it free
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  Book a demo
                </a>
              </>
            )}
          </div>

          {/* Platform chips */}
          <div className="animate-fade-up [animation-delay:580ms] mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-2.5">
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/60 backdrop-blur-sm px-3.5 py-1.5"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: p.color }}
                />
                <span className="text-[12px] text-gray-700 font-medium">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-[2] flex-1 min-h-10 sm:min-h-12 lg:min-h-16 shrink-0" />

        {/* Dashboard mockup */}
        <div className="relative z-0 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0 -mb-10 sm:-mb-20 lg:-mb-32 animate-hero-rise [animation-delay:700ms]">
          <ScaledDashboard designWidth={896} className="w-full">
            <DashboardMockup />
          </ScaledDashboard>
        </div>

        {/* Grass overlay */}
        <img
          src="https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png"
          alt=""
          className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none"
        />
      </section>

      {/* LOGO MARQUEE — SOCIAL PROOF */}
      <section className="relative bg-white border-y border-gray-100 py-10 sm:py-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-center text-[12px] uppercase tracking-[0.2em] text-gray-500 mb-7">
            Trusted by media buyers shipping at scale
          </p>
        </div>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-gray-400 text-sm shrink-0"
              >
                <span className="font-mono text-gray-300">0{(i % TESTIMONIALS.length) + 1}</span>
                <span className="text-gray-700 font-medium">{t}</span>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative bg-white py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-[12px] font-medium text-gray-700 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
              How it works
            </div>
            <h2 className="text-gray-900 font-normal leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl max-w-3xl mx-auto">
              From sketchy copy to <em className="italic font-display">safe to ship</em> in 6 seconds.
            </h2>
            <p className="text-gray-500 text-base sm:text-lg mt-5 max-w-xl mx-auto leading-relaxed">
              Two AI agents, one platform-aware knowledge base, zero room for banned-account regret.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="group relative rounded-2xl bg-white ring-1 ring-gray-200 p-6 hover:ring-gray-900/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-gray-300 font-mono">
                      0{i + 1}
                    </span>
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

      {/* PIPELINE */}
      <section className="relative bg-gray-50 border-y border-gray-100 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-gray-200 px-3 py-1 text-[12px] font-medium text-gray-700 mb-5">
                <Sparkles className="w-3 h-3" />
                The pipeline
              </div>
              <h2 className="text-gray-900 font-normal leading-[1.05] tracking-tight text-4xl sm:text-5xl">
                Two agents. Eight rewrite techniques. Zero guesswork.
              </h2>
              <p className="text-gray-500 text-base sm:text-lg mt-5 leading-relaxed">
                A critic agent scores your copy. An optimizer agent rewrites
                it. A pgvector knowledge base grounds both in real platform
                policy language — not vibes.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "RAG over 1,200+ policy rules",
                  "Critic agent → risk score 0–100",
                  "Optimizer agent → 8 copywriting techniques",
                  "Streaming SSE — see progress live",
                ].map((line) => (
                  <div key={line} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gray-900 text-white inline-flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-[15px] text-gray-700">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 font-mono text-[12px] leading-relaxed">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-gray-400 text-[11px]">tadan · analyze</span>
              </div>
              <div className="space-y-1.5">
                <div className="text-gray-400">$ analyze --platforms meta,google,taboola</div>
                <div className="text-gray-700">→ Scraping landing page…</div>
                <div className="text-gray-700">→ Embedding 412 policy rules…</div>
                <div className="text-emerald-600">✓ Retrieved top-8 (cosine 0.84+)</div>
                <div className="text-gray-700">→ Critic agent scanning…</div>
                <div className="text-amber-600">⚠ 2 violations detected</div>
                <div className="text-gray-700">→ Optimizer agent running…</div>
                <div className="text-emerald-600">✓ 3 variants generated</div>
                <div className="text-gray-900 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-gray-400">risk_score</span>{" "}
                  <span className="text-gray-900">62</span>{" "}
                  <span className="text-gray-400">/ 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING / CTA */}
      <section id="pricing" className="relative bg-white py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-[12px] font-medium text-gray-700 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
            Ready when you are
          </div>
          <h2 className="text-gray-900 font-normal leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl">
            Stop gambling with your ad account.
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-5 max-w-xl mx-auto leading-relaxed">
            Free to start. 50 scans/month, no card. Scale when you ship.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="bg-gray-900 text-white text-sm font-medium px-7 py-3 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              Start scanning free
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/analyzer"
              className="text-gray-700 text-sm font-medium px-7 py-3 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors"
            >
              See it in action
            </Link>
          </div>
          <p className="text-[12px] text-gray-400 mt-6">
            No credit card · 50 free scans · Meta, Google, Taboola
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-900">
            <span className="text-sm font-semibold tracking-tight">tadan</span>
            <span className="text-[12px] text-gray-400">— Ad Compliance AI</span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Twitter
            </a>
          </div>
          <p className="text-[12px] text-gray-400">
            © 2026 tadan. Built for media buyers.
          </p>
        </div>
      </footer>
    </>
  )
}
