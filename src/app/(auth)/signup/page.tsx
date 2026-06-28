"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }
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
    <div className="flex min-h-[80vh] items-center justify-center px-5 bg-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-gray-900">
            tadan
          </Link>
          <p className="text-sm text-gray-500 mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          {error && <p className="text-[13px] text-red-600 font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 disabled:opacity-50 transition-all"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-gray-900 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
