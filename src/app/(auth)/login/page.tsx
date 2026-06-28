"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { ArrowUp, ArrowUpRight, AlertTriangle, Shield } from "lucide-react"
import { Logo } from "@/components/logo"

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
    router.push("/analyzer")
    router.refresh()
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-white">
      {/* LEFT — form */}
      <div className="flex-1 flex flex-col justify-center px-5 sm:px-10 py-12 max-w-xl mx-auto w-full">
        <Link
          href="/"
          className="animate-fade-down inline-flex items-center gap-2 text-gray-900 mb-10 w-fit"
        >
          <Logo className="w-6 h-6" />
          <span className="text-xl font-semibold tracking-tight">tadan</span>
        </Link>

        <div className="animate-fade-up">
          <h1 className="text-4xl sm:text-5xl font-normal leading-[1.05] tracking-tight text-gray-900">
            Welcome back.
          </h1>
          <p className="text-gray-500 text-base mt-3 leading-relaxed">
            Sign in to scan ad copy and landing pages for compliance.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-up [animation-delay:120ms] flex flex-col gap-4 mt-8"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-[13px] font-medium text-gray-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-900 focus:ring-0 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-[13px] font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-900 focus:ring-0 transition-colors"
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

        <p className="animate-fade-up [animation-delay:240ms] mt-6 text-[13px] text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-gray-900 font-medium hover:underline underline-offset-2"
          >
            Create one
            <ArrowUpRight className="inline w-3 h-3 ml-0.5" />
          </Link>
        </p>
      </div>

      {/* RIGHT — visual */}
      <div className="hidden lg:flex flex-1 relative bg-gray-50 border-l border-gray-100 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85)`,
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-md ring-1 ring-gray-200 px-3.5 py-1.5 w-fit">
            <Shield className="w-3.5 h-3.5 text-gray-700" />
            <span className="text-[12px] text-gray-700 font-medium">
              Ad Compliance AI
            </span>
          </div>

          <div className="animate-fade-up [animation-delay:200ms] max-w-md">
            <h2 className="text-4xl font-normal leading-[1.05] tracking-tight text-gray-900">
              Ship compliant ads.{" "}
              <em className="italic">Not banned accounts.</em>
            </h2>
            <p className="text-gray-600 text-base mt-4 leading-relaxed">
              Two AI agents. 1,200+ policy rules. 6 seconds from sketchy copy
              to safe-to-ship.
            </p>
          </div>
        </div>
        <img
          src="https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png"
          alt=""
          className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none"
        />
      </div>
    </div>
  )
}
