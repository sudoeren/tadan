"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import {
  ArrowUp,
  AlertTriangle,
  Check,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { NavBar } from "@/components/nav-bar"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full rounded-2xl border border-gray-300 bg-white/90 px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-500 outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/10 transition-all"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    })
    setLoading(false)

    if (error) {
      setError(error.message || "Failed to reset password. The link may have expired.")
      return
    }

    setDone(true)
  }

  if (!token) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <NavBar variant="transparent" />
        <div className="relative z-[2] flex-1 flex flex-col items-center justify-center px-5">
          <div className="w-full max-w-md text-center">
            <h1 className="text-3xl sm:text-[34px] font-normal leading-[1.1] tracking-tight text-gray-900 mb-3">
              Invalid link
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              This password reset link is missing a token. Request a new one below.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-2 bg-orange-500 text-white text-sm font-medium pl-6 pr-1.5 py-1.5 rounded-full hover:bg-orange-600 transition-all"
            >
              <span className="px-1.5">Request reset link</span>
              <span className="w-9 h-9 rounded-full bg-white/10 inline-flex items-center justify-center">
                <ArrowUp className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <NavBar variant="transparent" />
        <div className="relative z-[2] flex-1 flex flex-col items-center justify-center px-5">
          <div className="w-full max-w-md text-center animate-fade-up">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center mx-auto mb-5">
              <Check className="w-7 h-7 text-emerald-500" strokeWidth={3} />
            </div>
            <h1 className="text-3xl sm:text-[34px] font-normal leading-[1.1] tracking-tight text-gray-900 mb-3">
              Password updated
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Your password has been reset. Sign in with your new password.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-orange-500 text-white text-sm font-medium pl-6 pr-1.5 py-1.5 rounded-full hover:bg-orange-600 transition-all"
            >
              <span className="px-1.5">Sign in</span>
              <span className="w-9 h-9 rounded-full bg-white/10 inline-flex items-center justify-center">
                <ArrowUp className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <NavBar variant="transparent" />

      <div className="relative z-[2] flex-1 flex flex-col items-center justify-center px-5 py-20 sm:py-24">
        <div className="w-full max-w-md text-center">
          <Link
            href="/"
            className="animate-fade-down inline-flex items-center gap-2 text-orange-500 mb-6 mx-auto w-fit"
          >
            <Logo className="w-6 h-6" />
            <span className="text-xl font-semibold tracking-tight">tadan</span>
          </Link>

          <div className="animate-fade-up rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-7 sm:p-9 text-left">
            <div className="mb-7">
              <h1 className="text-3xl sm:text-[34px] font-normal leading-[1.1] tracking-tight text-gray-900">
                Set a new password
              </h1>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                Must be at least 8 characters. Make it strong — use uppercase,
                lowercase, numbers, and symbols.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <label
                  htmlFor="password"
                  className="block text-[12px] font-medium text-gray-700 mb-1.5 ml-1"
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    className={cn(inputClass, "pr-11")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-[12px] font-medium text-gray-700 mb-1.5 ml-1"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter your new password"
                    className={cn(
                      inputClass,
                      "pr-11",
                      passwordsMatch
                        ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                        : passwordsMismatch
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                          : ""
                    )}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    {passwordsMatch && (
                      <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />
                    )}
                    {passwordsMismatch && (
                      <AlertTriangle className="w-4 h-4 text-red-500" strokeWidth={2.5} />
                    )}
                  </div>
                </div>
                {passwordsMismatch && (
                  <p className="mt-1 text-[11px] text-red-600 ml-1 animate-fade-up">
                    Passwords do not match
                  </p>
                )}
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
                className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 text-white text-sm font-medium pl-6 pr-1.5 py-1.5 rounded-full hover:bg-orange-600 disabled:opacity-50 transition-all"
              >
                <span className="px-1.5">
                  {loading ? "Resetting…" : "Reset password"}
                </span>
                <span className="w-9 h-9 rounded-full bg-white/10 inline-flex items-center justify-center">
                  <ArrowUp className="w-4 h-4" />
                </span>
              </button>
            </form>
          </div>

          <p className="animate-fade-up [animation-delay:240ms] mt-6 text-center text-[12px] text-gray-600">
            <Shield className="inline w-3 h-3 -mt-0.5 mr-1 text-gray-500" />
            Protected by Better Auth ·{" "}
            <Link href="/privacy" className="text-gray-900 hover:underline underline-offset-2">
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href="/terms" className="text-gray-900 hover:underline underline-offset-2">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
