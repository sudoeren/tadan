import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="relative z-10 bg-white">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="mx-auto max-w-6xl rounded-2xl bg-gray-100 ring-1 ring-gray-200/70 shadow-[0_8px_30px_rgba(0,0,0,0.04)] px-5 sm:px-7 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-gray-500">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="tadan - Ad Compliance AI"
            >
              <Logo className="w-4 h-4 text-gray-900" />
              <span className="text-sm font-semibold tracking-tight text-gray-900">
                tadan
                <span className="ml-1.5 font-normal text-gray-400">
                  - Ad Compliance AI
                </span>
              </span>
            </Link>

            <nav className="flex items-center gap-5">
              <Link
                href="/how-it-works"
                className="hover:text-gray-900 transition-colors"
              >
                How it works
              </Link>
              <Link
                href="/privacy"
                className="hover:text-gray-900 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-gray-900 transition-colors"
              >
                Terms
              </Link>
            </nav>

            <p className="text-gray-400">© 2026 tadan</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
