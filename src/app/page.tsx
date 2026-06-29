"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import {
  ArrowUp,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"
import { BG_URL } from "@/components/background-layer"
import GlobeFeatureSection from "@/components/globe-feature-section"
import HowItWorksContent from "@/components/how-it-works-content"
import { CtaSection } from "@/components/cta-section"

const GRASS_FADE_RANGE = 350

function MetaLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function TaboolaLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="5" fill="#1E5BD9" />
      <ellipse cx="8.5" cy="9" rx="2.4" ry="3" fill="white" />
      <ellipse cx="15.5" cy="9" rx="2.4" ry="3" fill="white" />
      <path
        d="M 5.5 14 Q 12 20 18.5 14 L 18.5 16 Q 12 22 5.5 16 Z"
        fill="white"
      />
    </svg>
  )
}

function TikTokLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="white" />
      <g transform="translate(-1.5 0)">
        <path
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.892 2.892 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.932 2.932 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"
          fill="#25F4EE"
        />
      </g>
      <g transform="translate(1.5 0)">
        <path
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.892 2.892 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.932 2.932 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"
          fill="#FE2C55"
        />
      </g>
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.892 2.892 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.932 2.932 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"
        fill="#1A1A1A"
      />
    </svg>
  )
}

function OutbrainLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#EE6E37" />
      <circle cx="12" cy="12" r="4.5" fill="white" />
      <circle cx="12" cy="12" r="2" fill="#EE6E37" />
    </svg>
  )
}

const PLATFORM_LOGOS = [
  { name: "Meta", Logo: MetaLogo, tint: "#1877F2" },
  { name: "Google", Logo: GoogleLogo, tint: "#EA4335" },
  { name: "Taboola", Logo: TaboolaLogo, tint: "#6C2BD9" },
  { name: "TikTok", Logo: TikTokLogo, tint: "#000000" },
  { name: "Outbrain", Logo: OutbrainLogo, tint: "#EE6E37" },
] as const

export default function HomePage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const [searchCount, setSearchCount] = useState(0)
  const FREE_SEARCH_LIMIT = 1

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = window.localStorage.getItem("tadan:searchCount")
        if (stored) {
          const n = parseInt(stored, 10)
          if (!Number.isNaN(n) && n > 0) setSearchCount(n)
        }
      } catch {
        // localStorage unavailable (private mode etc.) — ignore
      }
    })
  }, [])

  useEffect(() => {
    if (session) {
      queueMicrotask(() => {
        try {
          window.localStorage.removeItem("tadan:searchCount")
        } catch {
          // ignore
        }
        setSearchCount(0)
      })
    }
  }, [session])

  useEffect(() => {
    let rafId = 0
    const update = () => {
      rafId = 0
      setScrollY(window.scrollY)
    }
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const grassProgress = Math.min(1, scrollY / GRASS_FADE_RANGE)
  const grassOpacity = 1 - grassProgress
  const grassBlur = grassProgress * 24

  return (
    <>
      {/* HERO — centered, unchanged */}
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

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const value = searchInput.trim()
              if (!value) return

              const params = `input=${encodeURIComponent(value)}&mode=auto&platforms=meta,google,tiktok,taboola`
              const next = `/analyzer?${params}`

              if (session) {
                router.push(next)
                return
              }

              if (searchCount >= FREE_SEARCH_LIMIT) {
                router.push(`/signup?next=${encodeURIComponent(next)}`)
                return
              }

              const nextCount = searchCount + 1
              setSearchCount(nextCount)
              try {
                window.localStorage.setItem(
                  "tadan:searchCount",
                  String(nextCount)
                )
              } catch {
                // ignore
              }
              router.push(next)
            }}
            className="animate-fade-up [animation-delay:340ms] mt-6 sm:mt-8 w-full max-w-xl"
          >
            <div className="flex items-center gap-2 sm:gap-3 rounded-full bg-white/70 backdrop-blur-md ring-1 ring-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] pl-3 sm:pl-4 pr-1.5 py-1.5">
              <Logo className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 shrink-0 ml-1" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Paste your ad copy or landing page URL…"
                className="flex-1 bg-transparent text-sm sm:text-[15px] text-gray-900 placeholder:text-gray-400 outline-none py-2"
                aria-label="Search ad content or URL"
              />
              <button
                type="submit"
                disabled={!searchInput.trim()}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-500 text-white hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-transform shrink-0 inline-flex items-center justify-center"
              >
                <ArrowUp className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
            {!session && !isPending && (
              <p className="mt-2.5 text-center text-[12px] text-gray-500">
                {searchCount >= FREE_SEARCH_LIMIT ? (
                  <>Sign up to keep scanning — you&apos;ve used your free search.</>
                ) : (
                  <>
                    {FREE_SEARCH_LIMIT} free search. No sign-up needed.
                  </>
                )}
              </p>
            )}
          </form>

          <div className="animate-fade-up [animation-delay:460ms] mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3">
            {isPending ? (
              <div className="h-10 w-28 animate-pulse rounded-full bg-gray-100" />
            ) : session ? (
              <>
                <Link
                  href="/analyzer"
                  className="group bg-orange-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] transition-all inline-flex items-center gap-2"
                >
                  Open analyzer
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="group bg-white text-gray-700 ring-1 ring-gray-200 text-sm font-medium px-6 py-2.5 rounded-full hover:ring-orange-500 hover:text-orange-500 transition-all inline-flex items-center gap-2"
                >
                  How it works
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                className="bg-orange-500 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-orange-600 hover:shadow-lg transition-all inline-flex items-center gap-2"
                >
                  Try it free
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  How it works
                </Link>
              </>
            )}
          </div>

          <div className="animate-fade-up [animation-delay:580ms] mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-3">
            {PLATFORM_LOGOS.map(({ name, Logo }) => (
              <div
                key={name}
                className="flex items-center gap-2 rounded-2xl bg-white/70 backdrop-blur-sm px-3.5 py-1.5 hover:bg-white transition-all"
              >
                <Logo className="w-4 h-4" />
                <span className="text-[13px] text-gray-700 font-medium">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-[2] flex-1 min-h-10 sm:min-h-12 lg:min-h-16 shrink-0" />

        {/* Soft transition — tall, very gradual fade from hero bg to white */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 z-0 h-64 sm:h-80 lg:h-96 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.55) 75%, rgba(255,255,255,0.9) 92%, rgba(255,255,255,1) 100%)",
          }}
        />

        {/* Grass — fixed, blurs & fades on scroll */}
        <img
          src="https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png"
          alt=""
          className="pointer-events-none fixed bottom-0 left-0 z-[5] w-full select-none"
          style={{
            opacity: grassOpacity,
            filter: `blur(${grassBlur}px)`,
            transition: "opacity 0.2s ease-out, filter 0.2s ease-out",
          }}
        />
      </section>

      {/* HOW IT WORKS — globe CTA */}
      <section className="relative bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <GlobeFeatureSection />
        </div>
      </section>

      {/* FULL PIPELINE — the entire how-it-works content */}
      <HowItWorksContent />

      {/* CTA — athas-style full-bleed photo with framed content */}
      <CtaSection bgUrl={BG_URL} />

      {/* White filler — pushes footer to the very bottom of the page */}
      <div aria-hidden className="bg-white flex-1" />

      <Footer />
    </>
  )
}
