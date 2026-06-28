"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import {
  Shield,
  ArrowUp,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { BG_URL } from "@/components/background-layer"

const GRASS_FADE_RANGE = 350

const TESTIMONIALS = [
  {
    quote:
      "Caught a $5k Meta ban 10 minutes before launch. The optimizer rewrote our hook in a way that still converted — same ROAS, zero policy risk.",
    name: "Maya Chen",
    role: "Head of Paid, Linnea & Co.",
  },
  {
    quote:
      "Replaced our 3-person compliance review queue. What used to take a day of back-and-forth now takes six seconds and a click.",
    name: "Jordan Park",
    role: "Media Director, Northbeam",
  },
  {
    quote:
      "The risk score is the only number I check before pushing a campaign live. It's caught more landmines in three months than our QA process did in three years.",
    name: "Sasha Iyer",
    role: "Founder, Pivot Growth",
  },
] as const

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
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#6C2BD9" />
      <path d="M7 8h3l2 4-2 4H7l2-4-2-4zM14 8h3v8h-3z" fill="white" />
    </svg>
  )
}

function TikTokLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#000">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
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

function MetaLogoWhite({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="white">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function GoogleLogoWhite({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="white" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white" />
    </svg>
  )
}

function TaboolaLogoWhite({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="white" />
      <path d="M7 8h3l2 4-2 4H7l2-4-2-4zM14 8h3v8h-3z" fill="#6C2BD9" />
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

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
}

export default function HomePage() {
  const { data: session, isPending } = useSession()
  const [scrollY, setScrollY] = useState(0)

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
                <Link
                  href="/how-it-works"
                  className="text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  How it works
                </Link>
              </>
            )}
          </div>

          <div className="animate-fade-up [animation-delay:580ms] mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-3">
            {PLATFORM_LOGOS.map(({ name, Logo, tint }) => (
              <div
                key={name}
                className="flex items-center gap-2.5 rounded-2xl bg-white/70 backdrop-blur-sm pl-1.5 pr-3.5 py-1.5 hover:bg-white transition-all"
              >
                <span
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${tint}1f` }}
                >
                  <Logo className="w-4 h-4" />
                </span>
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

        <div className="relative z-[1] w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0 -mb-10 sm:-mb-20 lg:-mb-32 animate-hero-rise [animation-delay:700ms]">
          <Image
            src="/image.png"
            alt="tadan compliance dashboard"
            width={1200}
            height={800}
            className="w-full h-auto rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.12)] ring-1 ring-black/5"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
            }}
            priority
          />
        </div>

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

      {/* TESTIMONIALS */}
      <section className="relative bg-white py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-14 sm:mb-20">
            <p className="text-[12px] uppercase tracking-[0.2em] text-gray-400 font-medium">
              From the field
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.05] tracking-tight text-gray-900">
              The compliance layer performance marketers reach for first.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl bg-gray-50 ring-1 ring-gray-200/70 p-6 sm:p-7 flex flex-col"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 32 32"
                  className="w-7 h-7 text-gray-300 mb-4 shrink-0"
                  fill="currentColor"
                >
                  <path d="M9.5 8C5.36 8 2 11.36 2 15.5V24h8v-8H6.5C6.5 13.6 8.6 11.5 11 11.5V8h-1.5zm15 0c-4.14 0-7.5 3.36-7.5 7.5V24h8v-8h-3.5c0-2.4 2.1-4.5 4.5-4.5V8h-1.5z" />
                </svg>
                <blockquote className="text-[15px] leading-relaxed text-gray-700 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-gray-200/70">
                  <span className="w-9 h-9 rounded-full bg-gray-900 text-white text-[12px] font-medium flex items-center justify-center shrink-0">
                    {initials(t.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-gray-900 leading-tight">
                      {t.name}
                    </div>
                    <div className="text-[12px] text-gray-500 leading-tight mt-0.5 truncate">
                      {t.role}
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — athas-style full-bleed photo with framed content */}
      <section className="relative bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div
            className="relative rounded-3xl overflow-hidden p-10 sm:p-16 lg:p-20 text-center"
            style={{
              backgroundImage: `url(${BG_URL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Very light scrim — keeps photo visible, text-shadow handles readability */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/15"
            />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.1] tracking-tight text-white max-w-2xl mx-auto [text-shadow:0_2px_20px_rgba(0,0,0,0.25)]">
                Ready to ship your first safe ad?
              </h2>

              <div className="mt-8 sm:mt-10 flex flex-col items-center gap-2">
                {session ? (
                  <Link
                    href="/analyzer"
                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 text-sm font-medium pl-5 pr-1.5 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <span className="px-1.5">Open analyzer</span>
                    <span className="w-8 h-8 rounded-full bg-gray-900 text-white inline-flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 text-sm font-medium pl-5 pr-1.5 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <span className="px-1.5">Start scanning free</span>
                    <span className="w-8 h-8 rounded-full bg-gray-900 text-white inline-flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                )}

                <div className="mt-2 flex items-center gap-3 text-white/80 text-[12px]">
                  <MetaLogoWhite className="w-4 h-4" />
                  <GoogleLogoWhite className="w-4 h-4" />
                  <TaboolaLogoWhite className="w-4 h-4" />
                  <span>Meta, Google, and Taboola.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* White filler — pushes footer to the very bottom of the page */}
      <div aria-hidden className="bg-white flex-1" />

      <Footer />
    </>
  )
}
