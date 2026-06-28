"use client"

import { useSession } from "@/lib/auth-client"
import Link from "next/link"
import { Sparkles, PanelLeft, ChevronLeft, ChevronRight, Monitor, RotateCw, Share, Plus, Copy, Grid, Compass, ListTodo, Layers } from "lucide-react"

/* ---- DASHBOARD MOCKUP ---- */
function DashboardMockup() {
  return (
    <div className="animate-hero-rise [animation-delay:620ms] relative z-0 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0 -mb-10 sm:-mb-20 lg:-mb-32">
      <div className="rounded-t-2xl overflow-hidden bg-[#1a1a1c] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10 text-left">
        {/* Title bar */}
        <div className="bg-[#242427] border-b border-white/5 px-4 py-2.5 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <PanelLeft className="w-3.5 h-3.5 text-white/40 ml-2" />
          <ChevronLeft className="w-3.5 h-3.5 text-white/25" />
          <ChevronRight className="w-3.5 h-3.5 text-white/25" />
          <div className="flex-1 flex justify-center">
            <div className="bg-[#1a1a1c] rounded-md px-6 py-1 flex items-center gap-1.5 text-[10px] text-white/60">
              <Monitor className="w-3 h-3" />
              tadan.ai
            </div>
          </div>
          <RotateCw className="w-3.5 h-3.5 text-white/40" />
          <Share className="w-3.5 h-3.5 text-white/40" />
          <Plus className="w-3.5 h-3.5 text-white/40" />
          <Copy className="w-3.5 h-3.5 text-white/40" />
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-[22%] border-r border-white/5 bg-[#1e1e21] px-3 py-3.5 flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1">
              <span className="text-sm font-semibold text-white/80">tadan</span>
              <Grid className="w-3.5 h-3.5 text-white/30 ml-auto" />
            </div>
            <div className="flex items-center gap-2 px-1">
              <span className="w-4 h-4 rounded bg-[#e8553f] flex items-center justify-center text-[9px] font-bold text-white">T</span>
              <span className="text-[10px] text-white/80">tadan</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 px-2 py-1 rounded text-[10px] text-white/80 bg-white/5">
                <Compass className="w-3 h-3 text-white/50" />
                Scan
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded text-[10px] text-white/60">
                <Layers className="w-3 h-3 text-white/30" />
                History
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded text-[10px] text-white/60">
                <ListTodo className="w-3 h-3 text-white/30" />
                Drafts
              </div>
            </div>
            <div className="mt-auto flex items-center gap-1.5 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" />
              <span className="text-[9px] text-white/50">Ready</span>
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-lg bg-[#e8553f] flex items-center justify-center text-sm font-bold text-white">T</span>
                  <div>
                    <div className="text-sm font-medium text-white">tadan</div>
                    <div className="text-[10px] text-white/45">Meta · Google · Taboola</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                <Sparkles className="w-3 h-3 text-white/70" />
                <span className="text-[10px] text-white/70">Re-scan</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 divide-x divide-white/5 rounded-xl bg-white/[0.03] ring-1 ring-white/5 mb-4">
              <div className="px-3 py-2.5">
                <div className="text-[8px] tracking-wider text-white/35 mb-1">COMPLIANT</div>
                <div className="text-xl font-medium text-[#28c840]">14</div>
                <div className="text-[8px] text-white/25">Risk score</div>
              </div>
              <div className="px-3 py-2.5">
                <div className="text-[8px] tracking-wider text-white/35 mb-1">FLAGGED</div>
                <div className="text-xl font-medium text-white">2</div>
                <div className="text-[8px] text-white/25">Violations</div>
              </div>
              <div className="px-3 py-2.5">
                <div className="text-[8px] tracking-wider text-white/35 mb-1">READY</div>
                <div className="text-xl font-medium text-white">3</div>
                <div className="text-[8px] text-white/25">Safe variants</div>
              </div>
              <div className="px-3 py-2.5">
                <div className="text-[8px] tracking-wider text-white/35 mb-1">PLATFORMS</div>
                <div className="text-xl font-medium text-white">3</div>
                <div className="text-[8px] text-white/25">All clear</div>
              </div>
            </div>

            {/* Violation cards */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 p-3">
                <div className="text-[9px] font-medium text-white/50 mb-1.5">Critical</div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f57] mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#ff5f57]/80 bg-[#ff5f57]/10 px-1.5 py-0.5 rounded">
                      &quot;Guaranteed $500/day&quot;
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 p-3">
                <div className="text-[9px] font-medium text-white/50 mb-1.5">Warning</div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#febc2e] mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#febc2e]/80 bg-[#febc2e]/10 px-1.5 py-0.5 rounded">
                      &quot;Limited time offer&quot;
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Variants table */}
            <div>
              <div className="text-[9px] font-medium text-white/40 mb-1.5 px-1">Safe variants</div>
              <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 overflow-hidden">
                <div className="grid grid-cols-[1fr_60px_60px_70px] text-[8px] font-medium text-white/30 px-3 py-2 border-b border-white/5">
                  <span>Copy</span>
                  <span>Compliance</span>
                  <span>Hook</span>
                  <span className="text-right">Action</span>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="grid grid-cols-[1fr_60px_60px_70px] text-[9px] text-white/70 px-3 py-2 border-b border-white/[0.02] last:border-b-0 hover:bg-white/[0.02]">
                    <span className="truncate pr-2">Variant {i}: Rewritten safe copy with preserved marketing hook for compliance...</span>
                    <span className="text-[#28c840]">94%</span>
                    <span className="text-[#febc2e]">88%</span>
                    <span className="text-right text-[#28c840]/70">Copy</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---- HERO ---- */
export default function HomePage() {
  const { data: session, isPending } = useSession()

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: `url(https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85)`,
      }}
    >
      <div className="flex-1 min-h-8 sm:min-h-12 lg:min-h-16 shrink-0" />

      <div className="flex-1 min-h-8 sm:min-h-12 lg:min-h-16 shrink-0" />

      <div className="flex flex-col items-center text-center px-5">
        <h1 className="text-gray-900 font-normal leading-[1.05] tracking-tight text-[40px] min-[400px]:text-[44px] sm:text-6xl lg:text-7xl xl:text-[80px]">
          <span className="block animate-fade-up">Ship compliant ads.</span>
          <span className="block animate-fade-up [animation-delay:100ms]">Not banned accounts.</span>
        </h1>

        <p className="animate-fade-up [animation-delay:220ms] mt-5 sm:mt-6 text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">
          Scan against Meta, Google, and Taboola policies.
          <br />
          Get safe alternatives that preserve your hook &mdash; and stay live
          <Sparkles className="inline w-4 h-4 -mt-1 ml-1" />
        </p>

        <div className="animate-fade-up [animation-delay:340ms] mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-3">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-gray-100" />
          ) : session ? (
            <Link
              href="/analyzer"
              className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all"
            >
              Open analyzer
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all"
              >
                Try it free
              </Link>
              <Link
                href="/login"
                className="text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        <div className="animate-fade-up [animation-delay:460ms] mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white/60 backdrop-blur-sm px-5 py-2.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span className="text-[13px] text-gray-700">Meta Ads</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white/60 backdrop-blur-sm px-5 py-2.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            <span className="text-[13px] text-gray-700">Google Ads</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white/60 backdrop-blur-sm px-5 py-2.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" fill="#6C2BD9"/><path d="M7 8h3l2 4-2 4H7l2-4-2-4zM14 8h3v8h-3z" fill="white"/></svg>
            <span className="text-[13px] text-gray-700">Taboola</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-10 sm:min-h-12 lg:min-h-16 shrink-0" />

      <DashboardMockup />

      <img
        src="https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png"
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none"
      />
    </section>
  )
}
