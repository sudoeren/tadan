"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { markHasAuthed } from "@/lib/auth-state"
import {
  ArrowUp,
  AlertTriangle,
  Shield,
  Check,
  X,
  Eye,
  EyeOff,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { NavBar } from "@/components/nav-bar"
import { cn } from "@/lib/utils"

type Strength = {
  score: number
  label: string
  barColor: string
  textColor: string
  requirements: { label: string; met: boolean }[]
}

function evaluatePassword(pwd: string): Strength {
  const requirements = [
    { label: "8+ characters", met: pwd.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(pwd) },
    { label: "Lowercase letter", met: /[a-z]/.test(pwd) },
    { label: "Number", met: /[0-9]/.test(pwd) },
    { label: "Special character", met: /[^A-Za-z0-9]/.test(pwd) },
  ]
  const score = requirements.filter((r) => r.met).length

  let label = ""
  let barColor = ""
  let textColor = ""
  if (score === 0) {
    label = ""
    barColor = "bg-gray-200"
    textColor = "text-gray-400"
  } else if (score === 1) {
    label = "Very weak"
    barColor = "bg-red-500"
    textColor = "text-red-600"
  } else if (score === 2) {
    label = "Weak"
    barColor = "bg-orange-500"
    textColor = "text-orange-600"
  } else if (score === 3) {
    label = "Good"
    barColor = "bg-amber-500"
    textColor = "text-amber-600"
  } else if (score === 4) {
    label = "Strong"
    barColor = "bg-emerald-500"
    textColor = "text-emerald-600"
  } else {
    label = "Very strong"
    barColor = "bg-emerald-600"
    textColor = "text-emerald-700"
  }

  return { score, label, barColor, textColor, requirements }
}

function generateStrongPassword(): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lower = "abcdefghijklmnopqrstuvwxyz"
  const numbers = "0123456789"
  const special = "!@#$%^&*"
  const all = upper + lower + numbers + special

  const chars: string[] = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    special[Math.floor(Math.random() * special.length)],
  ]
  for (let i = 0; i < 12; i++) {
    chars.push(all[Math.floor(Math.random() * all.length)])
  }
  return chars.sort(() => Math.random() - 0.5).join("")
}

const inputClass =
  "w-full rounded-2xl border border-gray-300 bg-white/90 px-4 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-500 outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/10 transition-all"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const strength = useMemo(() => evaluatePassword(password), [password])
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword

  function handleGenerate() {
    const generated = generateStrongPassword()
    setPassword(generated)
    setConfirmPassword(generated)
  }

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
    const { error } = await authClient.signUp.email({ name, email, password })
    if (error) {
      setError(error.message || "Failed to create account")
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

      <div className="relative z-[2] flex-1 flex flex-col items-center justify-center px-5 py-10 sm:py-14">
        <div className="w-full max-w-lg">
          <Link
            href="/"
            className="animate-fade-down inline-flex items-center gap-2 text-orange-500 mb-5 mx-auto w-fit"
          >
            <Logo className="w-6 h-6" />
            <span className="text-xl font-semibold tracking-tight">tadan</span>
          </Link>

          <div className="animate-fade-up rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-6 sm:p-8">
            <div className="mb-5">
              <h1 className="text-3xl sm:text-[34px] font-normal leading-[1.1] tracking-tight text-gray-900">
                Create your account.
              </h1>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                50 free scans a month. Scan copy, get a verdict, ship safe.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2.5"
            >
              <div className="sm:col-span-1">
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
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-1">
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
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label
                    htmlFor="password"
                    className="block text-[12px] font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="inline-flex items-center rounded-full bg-white ring-1 ring-orange-300 hover:ring-orange-500 hover:bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700 transition-all"
                  >
                    Generate password for me
                  </button>
                </div>
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

                {password.length > 0 && (
                  <div className="mt-3 animate-fade-up">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-1 gap-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-colors duration-500",
                              i < strength.score
                                ? strength.barColor
                                : "bg-gray-200"
                            )}
                          />
                        ))}
                      </div>
                      <span
                        className={cn(
                          "text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 min-w-[80px] text-right",
                          strength.textColor
                        )}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <ul className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-x-2 gap-y-2">
                      {strength.requirements.map((r) => (
                        <li
                          key={r.label}
                          className={cn(
                            "flex items-start gap-1.5 text-[10.5px] leading-tight transition-colors duration-300",
                            r.met ? "text-emerald-600" : "text-gray-400"
                          )}
                        >
                          {r.met ? (
                            <Check
                              className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5"
                              strokeWidth={3}
                            />
                          ) : (
                            <X className="w-3 h-3 text-gray-300 shrink-0 mt-0.5" />
                          )}
                          <span className="leading-tight">{r.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-[12px] font-medium text-gray-700 mb-1.5 ml-1"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
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
                      <Check
                        className="w-4 h-4 text-emerald-500"
                        strokeWidth={3}
                      />
                    )}
                    {passwordsMismatch && (
                      <X className="w-4 h-4 text-red-500" strokeWidth={3} />
                    )}
                  </div>
                </div>
                {passwordsMismatch && (
                  <p className="mt-1 text-[10px] text-red-600 ml-1 animate-fade-up">
                    Passwords do not match
                  </p>
                )}
              </div>

              {error && (
                <div className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 text-white text-sm font-medium pl-6 pr-1.5 py-1.5 rounded-full hover:bg-orange-600 disabled:opacity-50 transition-all"
                >
                  <span className="px-1.5">
                    {loading ? "Creating account…" : "Create account"}
                  </span>
                  <span className="w-9 h-9 rounded-full bg-white/10 inline-flex items-center justify-center">
                    <ArrowUp className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </form>

            <div className="my-5 flex items-center gap-3">
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

          <p className="animate-fade-up [animation-delay:240ms] mt-5 text-center text-[12px] text-gray-600">
            <Shield className="inline w-3 h-3 -mt-0.5 mr-1 text-gray-500" />
            Protected by Better Auth ·{" "}
            <Link
              href="/privacy"
              className="text-gray-900 hover:underline underline-offset-2"
            >
              Privacy
            </Link>{" "}
            ·{" "}
            <Link
              href="/terms"
              className="text-gray-900 hover:underline underline-offset-2"
            >
              Terms
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
