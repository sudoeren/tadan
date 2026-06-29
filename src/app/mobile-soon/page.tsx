import { Monitor, Smartphone } from "lucide-react"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Mobile coming soon — tadan",
  description:
    "tadan is currently desktop only. Mobile support is coming soon — please visit us on a larger screen for the full ad-compliance scanner.",
}

export default function MobileSoonPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      <NavBar variant="transparent" />

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

          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-gray-50 ring-1 ring-gray-200 px-4 py-2.5 text-[13px] font-medium text-gray-700">
            <Monitor className="h-4 w-4 text-gray-500" strokeWidth={2} />
            Visit tadan on a desktop browser
          </div>

          <div className="mt-12 text-[12px] text-gray-400 leading-relaxed">
            <p>Want a heads-up when mobile launches?</p>
            <p className="mt-1">
              Drop us a line at{" "}
              <a
                href="mailto:hello@tadan.app"
                className="text-orange-500 hover:underline underline-offset-2"
              >
                hello@tadan.app
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
