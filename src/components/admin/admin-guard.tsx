"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { SignInRequired } from "@/components/sign-in-required"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const isAdmin = !!session?.user && session.user.isAdmin

  useEffect(() => {
    if (isPending) return
    if (session && !isAdmin) {
      router.replace("/")
    }
  }, [isPending, session, isAdmin, router])

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Checking access…
      </div>
    )
  }

  if (!session) {
    return <SignInRequired message="Admin access requires you to sign in." />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Redirecting…
      </div>
    )
  }

  return <>{children}</>
}
