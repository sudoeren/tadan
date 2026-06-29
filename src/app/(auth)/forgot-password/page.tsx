"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUp, Check } from "lucide-react"
import { Logo } from "@/components/logo"
import { NavBar } from "@/components/nav-bar"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <NavBar variant="transparent" />

      <div className="relative z-[2] flex-1 flex flex-col items-center justify-center px-5 py-20 sm:py-24">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="animate-fade-down inline-flex items-center gap-2 text-orange-500 mb-6 mx-auto w-fit"
          >
            <Logo className="w-6 h-6" />
            <span className="text-xl font-semibold tracking-tight">tadan</span>
          </Link>

          <div className="animate-fade-up rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-7 sm:p-9">
            <div className="mb-7">
              <h1 className="text-3xl sm:text-[34px] font-normal leading-[1.1] tracking-tight text-gray-900">
                Forgot your password?
              </h1>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                No worries. Enter the email you signed up with and we&apos;ll
                send you a reset link.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl bg-emerald-50 ring-1 ring-emerald-200/70 p-5 text-center animate-fade-up">
                <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-3">
                  <Check
                    className="h-5 w-5 text-white"
                    strokeWidth={3}
                  />
                </div>
                <p className="text-[14px] font-semibold text-gray-900">
                  Check your inbox
                </p>
                <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">
                  If an account exists for{" "}
                  <span className="font-medium text-gray-900">{email}</span>,
                  we sent a reset link.
                </p>
              </div>
            ) : (
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
                    className="w-full rounded-2xl border border-gray-300 bg-white/90 px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-500 outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/10 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex items-center justify-center gap-2 bg-orange-500 text-white text-sm font-medium pl-6 pr-1.5 py-1.5 rounded-full hover:bg-orange-600 disabled:opacity-50 transition-all"
                >
                  <span className="px-1.5">
                    {loading ? "Sending link…" : "Send reset link"}
                  </span>
                  <span className="w-9 h-9 rounded-full bg-white/10 inline-flex items-center justify-center">
                    <ArrowUp className="w-4 h-4" />
                  </span>
                </button>
              </form>
            )}

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] uppercase tracking-wider text-gray-400">
                or
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <Link
              href="/login"
              className="group inline-flex w-full items-center justify-center gap-2 bg-white text-gray-900 text-sm font-medium ring-1 ring-gray-200 hover:ring-gray-900 px-5 py-3 rounded-full transition-all"
            >
              Back to sign in
              <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
