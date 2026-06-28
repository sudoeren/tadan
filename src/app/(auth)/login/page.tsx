"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { markHasAuthed } from "@/lib/auth-state"
import { ArrowUp, AlertTriangle, Shield } from "lucide-react"
import { Logo } from "@/components/logo"
import { NavBar } from "@/components/nav-bar"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error } = await authClient.signIn.email({ email, password })
    if (error) {
      setError(error.message || "Invalid credentials")
      setLoading(false)
      return
    }
    markHasAuthed()
    router.push("/analyzer")
    router.refresh()
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <NavBar variant="transparent" />

      {/* CENTERED CONTENT */}
      <div className="relative z-[2] flex-1 flex flex-col items-center justify-center px-5 py-20 sm:py-24">
        <div className="w-full max-w-md">
          {/* Brand mark on top of card */}
          <Link
            href="/"
            className="animate-fade-down inline-flex items-center gap-2 text-gray-900 mb-6 mx-auto w-fit"
          >
            <Logo className="w-6 h-6" />
            <span className="text-xl font-semibold tracking-tight">tadan</span>
          </Link>

          {/* Card */}
          <div className="animate-fade-up rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-7 sm:p-9">
            <div className="mb-7">
              <h1 className="text-3xl sm:text-[34px] font-normal leading-[1.1] tracking-tight text-gray-900">
                Sign in to tadan.
              </h1>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                Pick up where you left off — your scans, variants, and history
                are waiting.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[12px] font-medium text-gray-700 mb-1.5 ml-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-900 focus:bg-white focus:ring-0 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label
                    htmlFor="password"
                    className="block text-[12px] font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    Forgot?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  className="w-full rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-900 focus:bg-white focus:ring-0 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium pl-6 pr-1.5 py-1.5 rounded-full hover:bg-gray-800 disabled:opacity-50 transition-all"
              >
                <span className="px-1.5">
                  {loading ? "Signing in…" : "Sign in"}
                </span>
                <span className="w-9 h-9 rounded-full bg-white/10 inline-flex items-center justify-center">
                  <ArrowUp className="w-4 h-4" />
                </span>
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] uppercase tracking-wider text-gray-400">
                or
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <Link
              href="/signup"
              className="group inline-flex w-full items-center justify-center gap-2 bg-white text-gray-900 text-sm font-medium ring-1 ring-gray-200 hover:ring-gray-900 px-5 py-3 rounded-full transition-all"
            >
              Create a new account
              <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Footer microcopy */}
          <p className="animate-fade-up [animation-delay:240ms] mt-6 text-center text-[12px] text-gray-600">
            <Shield className="inline w-3 h-3 -mt-0.5 mr-1 text-gray-500" />
            Protected by Better Auth ·{" "}
            <a
              href="#"
              className="text-gray-900 hover:underline underline-offset-2"
            >
              Privacy
            </a>{" "}
            ·{" "}
            <a
              href="#"
              className="text-gray-900 hover:underline underline-offset-2"
            >
              Terms
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
