import Link from "next/link"
import { Monitor, Smartphone, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Mobile coming soon — tadan",
  description:
    "tadan is currently desktop only. Mobile support is coming soon — please visit us on a larger screen for the full ad-compliance scanner.",
}

export default function MobileSoonPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      <main className="relative z-[2] flex-1 flex items-center justify-center px-5 py-20 sm:py-28">
        <div className="max-w-md w-full text-center animate-fade-up">
          <div className="mx-auto mb-7 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 ring-1 ring-orange-200/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]">
            <Smartphone className="h-9 w-9 text-orange-500" strokeWidth={1.75} />
          </div>

          <h1 className="text-[40px] sm:text-5xl font-normal leading-[1.05] tracking-[-0.03em] text-gray-900">
            Mobile is
            <br />
            <span className="text-orange-500">coming soon.</span>
          </h1>

          <p className="mt-5 text-gray-600 text-[15px] sm:text-base leading-relaxed">
            We&apos;re polishing the tadan experience for smaller screens. The
            full ad-compliance scanner is available on desktop for now.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] pl-4 pr-1.5 py-1.5 text-[14px] font-semibold text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-500/20 transition-all"
          >
            <Monitor className="h-4 w-4" strokeWidth={2.25} />
            <span className="px-1.5">Open on desktop</span>
            <span className="w-8 h-8 rounded-full bg-white/15 inline-flex items-center justify-center">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </main>
    </div>
  )
}
