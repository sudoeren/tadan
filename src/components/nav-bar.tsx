"use client"

import { useState, useEffect, useSyncExternalStore } from "react"
import Link from "next/link"
import { useSession, signOut } from "@/lib/auth-client"
import { hasAuthed, markHasAuthed } from "@/lib/auth-state"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"

const SCROLL_THRESHOLD = 8

const subscribeNoop = () => () => {}
const getServerHasAuthed = () => false

export function NavBar({
  variant = "default",
}: {
  variant?: "default" | "transparent"
}) {
  const { data: session, isPending } = useSession()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const hasAuthedBefore = useSyncExternalStore(
    subscribeNoop,
    hasAuthed,
    getServerHasAuthed
  )
  const isTransparent = variant === "transparent"

  useEffect(() => {
    if (session) {
      markHasAuthed()
    }
  }, [session])

  useEffect(() => {
    if (!isTransparent) return

    let rafId = 0
    const update = () => {
      rafId = 0
      setScrolled(window.scrollY > SCROLL_THRESHOLD)
    }
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isTransparent])

  const headerClasses = isTransparent
    ? [
        "fixed left-0 right-0 z-50 transition-all duration-300 ease-out",
        scrolled ? "top-3 px-3 sm:top-4 sm:px-4" : "top-0 px-0",
      ].join(" ")
    : "relative"

  const innerClasses = isTransparent
    ? [
        "flex items-center justify-between mx-auto transition-all duration-300 ease-out",
        scrolled
          ? "h-12 max-w-2xl bg-white backdrop-blur-xl rounded-full ring-1 ring-black/5 shadow-lg shadow-black/5 px-4"
          : "h-20 sm:h-24 max-w-5xl px-5 sm:px-8 lg:px-10",
      ].join(" ")
    : "flex items-center justify-between h-20 sm:h-24 max-w-5xl mx-auto px-5 sm:px-8 lg:px-10"

  const ctaHref = hasAuthedBefore ? "/login" : "/signup"

  return (
    <header className={`animate-fade-down ${headerClasses}`}>
      <div className={innerClasses}>
        <Link href="/" className="text-orange-500 flex items-center gap-2 group">
          <Logo className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-lg sm:text-xl font-semibold tracking-tight">
            tadan
          </span>
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
            href="#how-it-works"
            className="text-[14px] font-medium text-gray-900 hover:text-gray-900 transition-colors"
          >
            How it works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />
          ) : session ? (
            <button
              onClick={() => signOut()}
              className="bg-orange-500 text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              Sign out
            </button>
          ) : (
            <Link
              href={ctaHref}
              className="bg-orange-500 text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              Get started
            </Link>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 rounded-full inline-flex items-center justify-center text-orange-500 hover:bg-orange-500/10 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
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
            href="#how-it-works"
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
          ) : null}
        </div>
      )}
    </header>
  )
}
