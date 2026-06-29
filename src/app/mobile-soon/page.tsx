import Link from "next/link"
import { Smartphone } from "lucide-react"
import { Logo } from "@/components/logo"

export const metadata = {
  title: "Mobile coming soon — tadan",
  description:
    "tadan is currently desktop only. Mobile support is coming soon — please visit us on a larger screen for the full ad-compliance scanner.",
}

export default function MobileSoonPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      <header className="px-5 sm:px-8 pt-6 sm:pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-orange-500"
        >
          <Logo className="w-6 h-6" />
          <span className="text-xl font-semibold tracking-tight">tadan</span>
        </Link>
      </header>

      <main className="relative z-[2] flex-1 flex items-center justify-center px-5 py-12 sm:py-20">
        <div className="max-w-md w-full text-center animate-fade-up">
          <Smartphone
            className="mx-auto mb-7 block h-16 w-16 text-orange-500"
            strokeWidth={1.5}
          />

          <h1 className="text-[40px] sm:text-5xl font-normal leading-[1.05] tracking-[-0.03em] text-gray-900">
            Mobile is
            <br />
            <span className="text-orange-500">coming soon.</span>
          </h1>

          <p className="mt-5 text-gray-600 text-[15px] sm:text-base leading-relaxed">
            We&apos;re polishing the tadan experience for smaller screens. The
            full ad-compliance scanner is available on desktop for now.
          </p>
        </div>
      </main>
    </div>
  )
}
