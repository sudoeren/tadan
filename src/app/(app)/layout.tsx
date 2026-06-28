import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { ArrowUpRight, Shield } from "lucide-react"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-6 px-4 bg-white">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="h-14 w-14 rounded-2xl bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center mb-5">
            <Shield className="w-7 h-7 text-gray-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal leading-[1.05] tracking-tight text-gray-900">
            Sign in required
          </h1>
          <p className="text-gray-500 text-sm mt-3 mb-6 leading-relaxed">
            This page is part of the analyzer. Sign in to scan ad copy and view
            your compliance history.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
          >
            Sign in
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  return <div className="bg-white">{children}</div>
}
