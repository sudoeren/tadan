"use client"

import { useSession } from "@/lib/auth-client"
import Link from "next/link"

export default function HistoryPage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Sign in to view your analysis history.</p>
        <Link
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Analysis History
        </h1>
        <p className="text-muted-foreground">
          Your past ad compliance analyses will appear here.
        </p>
      </div>
      <div className="flex items-center justify-center rounded-xl border border-dashed p-12">
        <p className="text-sm text-muted-foreground">
          No analyses yet.{" "}
          <Link href="/" className="font-medium text-primary hover:underline">
            Run your first scan
          </Link>
        </p>
      </div>
    </div>
  )
}
