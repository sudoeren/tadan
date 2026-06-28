"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "@/lib/auth-client"
import { Menu, X } from "lucide-react"

export function NavBar() {
  const { data: session, isPending } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <header className="animate-fade-down relative z-20">
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 sm:py-5 max-w-6xl mx-auto">
        <Link href="/" className="text-gray-900">
          <span className="text-lg sm:text-xl font-semibold tracking-tight">tadan</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {session && (
            <>
              <Link href="/analyzer" className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors">
                Analyzer
              </Link>
              <Link href="/history" className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors">
                History
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />
          ) : session ? (
            <>
              <button
                onClick={() => signOut()}
                className="hidden md:inline-flex text-[13px] text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign out
              </button>
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden w-9 h-9 rounded-full text-gray-900 hover:bg-gray-900/10 inline-flex items-center justify-center transition-colors"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden md:inline-flex text-[13px] text-gray-700 hover:text-gray-900 transition-colors">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-gray-900 text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>

      {open && session && (
        <div className="md:hidden absolute left-4 right-4 top-full rounded-2xl bg-white/90 backdrop-blur-xl ring-1 ring-gray-200 px-5 py-3 mt-2 animate-fade-up">
          <Link href="/analyzer" className="block text-[15px] text-gray-700 hover:text-gray-900 py-3 border-b border-gray-200" onClick={() => setOpen(false)}>Analyzer</Link>
          <Link href="/history" className="block text-[15px] text-gray-700 hover:text-gray-900 py-3 border-b border-gray-200" onClick={() => setOpen(false)}>History</Link>
          <button onClick={() => { signOut(); setOpen(false) }} className="block w-full text-left text-[15px] text-gray-700 hover:text-gray-900 py-3">Sign out</button>
        </div>
      )}
    </header>
  )
}
