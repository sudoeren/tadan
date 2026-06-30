"use client"

import { Loader2, ShieldAlert } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { isAdminEmail } from "@/lib/admin-shared"
import { SignInRequired } from "@/components/sign-in-required"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()

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

  if (!isAdminEmail(session.user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-red-50 ring-1 ring-red-200 flex items-center justify-center mb-5">
            <ShieldAlert className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Access denied
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your account is not on the admin list. Ask the project owner to add
            your email to <code className="text-[12px] bg-gray-100 px-1.5 py-0.5 rounded">ADMIN_EMAILS</code> in
            <code className="text-[12px] bg-gray-100 px-1.5 py-0.5 rounded ml-1">.env.local</code>.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
