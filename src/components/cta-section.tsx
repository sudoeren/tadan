"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { useSession } from "@/lib/auth-client"

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
      <rect width="24" height="24" rx="5" fill="white" />
      <ellipse cx="8.5" cy="9" rx="2.4" ry="3" fill="#1E5BD9" />
      <ellipse cx="15.5" cy="9" rx="2.4" ry="3" fill="#1E5BD9" />
      <path
        d="M 5.5 14 Q 12 20 18.5 14 L 18.5 16 Q 12 22 5.5 16 Z"
        fill="#1E5BD9"
      />
    </svg>
  )
}

function TikTokLogoWhite({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
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
        fill="#fff"
      />
    </svg>
  )
}

function OutbrainLogoWhite({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="white" />
      <circle cx="12" cy="12" r="4.5" fill="#EE6E37" />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  )
}

interface CtaSectionProps {
  bgUrl: string
}

export function CtaSection({ bgUrl }: CtaSectionProps) {
  const { data: session } = useSession()
  const href = session ? "/analyzer" : "/signup"
  const label = session ? "Open analyzer" : "Start scanning free"

  return (
    <section className="relative bg-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div
          className="relative rounded-3xl overflow-hidden p-10 sm:p-16 lg:p-20 text-center"
          style={{
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center 65%",
            filter: "contrast(1.08) saturate(1.2)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/20"
          />

          {/* Soft fade at the bottom of the card — blends the image into the surrounding white */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 lg:h-40 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.85) 85%, rgba(255,255,255,1) 100%)",
            }}
          />

          <img
            src="https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png"
            alt=""
            className="pointer-events-none absolute left-0 bottom-0 h-full w-80 sm:w-96 lg:w-[28rem] object-cover object-top select-none"
          />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.1] tracking-tight text-white max-w-2xl mx-auto [text-shadow:0_2px_20px_rgba(0,0,0,0.25)]">
              Ready to ship your first safe ad?
            </h2>

            <div className="mt-8 sm:mt-10 flex flex-col items-center gap-2">
              <Link
                href={href}
                className="group inline-flex items-center justify-center gap-2 bg-white text-gray-900 text-sm font-medium pl-5 pr-1.5 py-1.5 rounded-full hover:bg-gray-100 transition-colors duration-300"
              >
                <span className="px-1.5 transition-transform duration-300 group-hover:translate-x-0.5">
                  {label}
                </span>
                <span className="w-8 h-8 rounded-full bg-orange-500 text-white inline-flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <div className="mt-2 flex items-center gap-3 text-white/80 text-[12px]">
                <MetaLogoWhite className="w-4 h-4" />
                <GoogleLogoWhite className="w-4 h-4" />
                <TaboolaLogoWhite className="w-4 h-4" />
                <TikTokLogoWhite className="w-4 h-4" />
                <OutbrainLogoWhite className="w-4 h-4" />
                <span>Meta, Google, Taboola, TikTok, and Outbrain.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
