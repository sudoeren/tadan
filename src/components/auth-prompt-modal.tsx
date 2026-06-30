"use client"

import { useEffect, useReducer, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { ArrowRight, Info, X } from "lucide-react"

const STORAGE_KEY = "tadan:authPromptDismissed"

interface AuthPromptModalProps {
  open: boolean
  onDismiss: () => void
  scanId: string | null
}

function readDismissed(): boolean {
  if (typeof window === "undefined") return false
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

function markDismissed() {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1")
  } catch {
    // ignore
  }
}

const subscribeNoop = () => () => {}
const getServerDismissed = () => false

export default function AuthPromptModal({
  open,
  onDismiss,
  scanId,
}: AuthPromptModalProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const sessionDismissed = useSyncExternalStore(
    subscribeNoop,
    readDismissed,
    getServerDismissed
  )
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  const shouldRender = open && !session && !sessionDismissed

  useEffect(() => {
    if (open && session) onDismiss()
  }, [open, session, onDismiss])

  function handleDismiss() {
    markDismissed()
    forceUpdate()
  }

  function signupHref() {
    const next = scanId ? `/history?scan=${scanId}` : "/history"
    return `/signup?next=${encodeURIComponent(next)}`
  }

  function signinHref() {
    const next = scanId ? `/history?scan=${scanId}` : "/history"
    return `/login?next=${encodeURIComponent(next)}`
  }

  if (!shouldRender) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-3 sm:px-5 pb-3 sm:pb-5 pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto mx-auto max-w-xl rounded-2xl bg-orange-50/95 ring-1 ring-orange-200/70 backdrop-blur-md p-3.5 sm:p-4 flex items-start gap-3 text-left shadow-[0_20px_50px_-20px_rgba(249,115,22,0.45)] animate-slide-up"
      >
        <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-900 leading-snug">
            Save this scan
          </p>
          <p className="text-[12px] text-gray-600 leading-snug mt-0.5">
            Create a free account to keep your scan history and come back to
            it later.
          </p>
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => router.push(signupHref())}
              className="group inline-flex items-center gap-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-1.5 text-[12px] font-semibold transition-colors"
            >
              Create free account
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => router.push(signinHref())}
              className="text-[12px] font-medium text-gray-500 hover:text-gray-900 px-3 py-1.5 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="text-gray-400 hover:text-gray-700 shrink-0 p-1 -m-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
