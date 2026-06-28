"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { ArrowUp, AlertTriangle, Shield, Check } from "lucide-react"
import { Logo } from "@/components/logo"
import { NavBar } from "@/components/nav-bar"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    const { error } = await authClient.signUp.email({ name, email, password })
    if (error) {
      setError(error.message || "Failed to create account")
      setLoading(false)
      return
    }
    router.push("/analyzer")
    router.refresh()
  }

  return (
    <div
      className="relative min-h-screen flex flex-col bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85)`,
      }}
    >
      <NavBar variant="transparent" />
      <div className="pointer-events-none absolute inset-0 hero-overlay z-[1]" />

      {/* CENTERED CONTENT */}
      <div className="relative z-[2] flex-1 flex flex-col items-center justify-center px-5 py-20 sm:py-24">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="animate-fade-down inline-flex items-center gap-2 text-gray-900 mb-6 mx-auto w-fit"
          >
            <Logo className="w-6 h-6" />
            <span className="text-xl font-semibold tracking-tight">tadan</span>
          </Link>

          <div className="animate-fade-up rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-7 sm:p-9">
            <div className="mb-7">
              <h1 className="text-3xl sm:text-[34px] font-normal leading-[1.1] tracking-tight text-gray-900">
                Create your account.
              </h1>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                50 free scans a month. Scan copy, get a verdict, ship safe.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[12px] font-medium text-gray-700 mb-1.5 ml-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-900 focus:bg-white focus:ring-0 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                <label
                  htmlFor="password"
                  className="block text-[12px] font-medium text-gray-700 mb-1.5 ml-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  className="w-full rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-900 focus:bg-white focus:ring-0 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
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
                  {loading ? "Creating account…" : "Create account"}
                </span>
                <span className="w-9 h-9 rounded-full bg-white/10 inline-flex items-center justify-center">
                  <ArrowUp className="w-4 h-4" />
                </span>
              </button>
            </form>

            <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {[
                "50 free scans / month",
                "Meta, Google, Taboola",
                "1,200+ policy rules",
                "Hook-preserving rewrites",
              ].map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-1.5 text-[12px] text-gray-600"
                >
                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>

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
              I already have an account
              <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

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
