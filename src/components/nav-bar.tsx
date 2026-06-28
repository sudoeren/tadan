"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "@/lib/auth-client"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { Logo } from "@/components/logo"

export function NavBar({ variant = "default" }: { variant?: "default" | "transparent" }) {
  const { data: session, isPending } = useSession()
  const [open, setOpen] = useState(false)
  const isTransparent = variant === "transparent"

  return (
    <header
      className={`animate-fade-down z-30 transition-colors duration-500 ${
        isTransparent
          ? "absolute top-0 left-0 right-0"
          : "relative bg-white/70 backdrop-blur-xl border-b border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 sm:py-5 max-w-5xl mx-auto">
        <Link href="/" className="text-gray-900 flex items-center gap-2 group">
          <Logo className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-lg sm:text-xl font-semibold tracking-tight">tadan</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/analyzer"
            className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-gray-900 hover:text-gray-900 transition-colors"
          >
            Analyzer
            <ArrowUpRight className="w-[15px] h-[15px] text-gray-900 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="/history"
            className="text-[14px] font-medium text-gray-900 hover:text-gray-900 transition-colors"
          >
            History
          </Link>
          <Link
            href="/how-it-works"
            className="text-[14px] font-medium text-gray-900 hover:text-gray-900 transition-colors"
          >
            How it works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />
          ) : session ? (
            <>
              <button
                onClick={() => signOut()}
                className="hidden md:inline-flex text-[14px] font-medium text-gray-900 hover:text-gray-900 transition-colors"
              >
                Sign out
              </button>
              <Link
                href="/signup"
                className="bg-gray-900 text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Get started
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden w-9 h-9 rounded-full inline-flex items-center justify-center text-gray-900 hover:bg-gray-900/10 transition-colors"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline-flex text-[14px] font-medium text-gray-900 hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-gray-900 text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Get started
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden w-9 h-9 rounded-full inline-flex items-center justify-center text-gray-900 hover:bg-gray-900/10 transition-colors"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden absolute left-4 right-4 top-full rounded-2xl bg-white/90 backdrop-blur-xl ring-1 ring-gray-200 px-5 py-3 mt-2 animate-fade-up shadow-xl shadow-black/[0.04]">
          <Link
            href="/analyzer"
            className="block text-[15px] text-gray-700 hover:text-gray-900 py-3 border-b border-gray-200"
            onClick={() => setOpen(false)}
          >
            Analyzer
          </Link>
          <Link
            href="/history"
            className="block text-[15px] text-gray-700 hover:text-gray-900 py-3 border-b border-gray-200"
            onClick={() => setOpen(false)}
          >
            History
          </Link>
          <Link
            href="/how-it-works"
            className="block text-[15px] text-gray-700 hover:text-gray-900 py-3 border-b border-gray-200"
            onClick={() => setOpen(false)}
          >
            How it works
          </Link>
          {session ? (
            <button
              onClick={() => {
                signOut()
                setOpen(false)
              }}
              className="block w-full text-left text-[15px] text-gray-700 hover:text-gray-900 py-3 border-t border-gray-200 mt-2"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="block w-full text-left text-[15px] text-gray-700 hover:text-gray-900 py-3 border-t border-gray-200 mt-2"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
