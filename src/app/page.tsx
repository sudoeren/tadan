"use client"

import Link from "next/link"
import { useSession } from "@/lib/auth-client"
import { Shield, ArrowUp, ArrowUpRight } from "lucide-react"
import { DashboardMockup } from "@/components/dashboard-mockup"
import { ScaledDashboard } from "@/components/scaled-dashboard"
import { NavBar } from "@/components/nav-bar"

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

export default function HomePage() {
  const { data: session, isPending } = useSession()

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden flex flex-col">
        <NavBar variant="transparent" />

        <div className="relative z-[2] flex-1 min-h-20 sm:min-h-28 lg:min-h-36 shrink-0" />

        <div className="relative z-[2] flex flex-col items-center text-center px-5 max-w-5xl mx-auto w-full">
          <h1 className="text-gray-900 font-normal leading-[1.02] tracking-[-0.04em] text-[44px] min-[400px]:text-[48px] sm:text-[68px] lg:text-[80px] xl:text-[92px]">
            <span className="block animate-fade-up">Ship compliant ads.</span>
            <span className="block animate-fade-up [animation-delay:100ms]">
              Not banned accounts.
            </span>
          </h1>

          <p className="animate-fade-up [animation-delay:220ms] mt-5 sm:mt-6 text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl">
            Scan ad copy and landing pages against Meta, Google, and Taboola
            policies. Get safe rewrites that keep your hook.
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

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-900">
            <span className="text-sm font-semibold tracking-tight">tadan</span>
            <span className="text-[12px] text-gray-400">— Ad Compliance AI</span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-gray-500">
            <Link
              href="/how-it-works"
              className="hover:text-gray-900 transition-colors"
            >
              How it works
            </Link>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              GitHub
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
