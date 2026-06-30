"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
  loading = false,
}: {
  label: string
  value: string | number
  hint?: string
  icon?: React.ReactNode
  tone?: "default" | "success" | "warning" | "danger"
  loading?: boolean
}) {
  const toneRing = {
    default: "ring-gray-200",
    success: "ring-emerald-200",
    warning: "ring-amber-200",
    danger: "ring-red-200",
  }[tone]

  const toneText = {
    default: "text-gray-900",
    success: "text-emerald-600",
    warning: "text-amber-600",
    danger: "text-red-600",
  }[tone]

  return (
    <div
      className={cn(
        "rounded-2xl bg-white/80 backdrop-blur-xl ring-1 p-5",
        toneRing
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-[12px] uppercase tracking-wider text-gray-500 font-medium">
          {label}
        </p>
        {icon}
      </div>
      {loading ? (
        <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />
      ) : (
        <p className={cn("text-3xl font-semibold tracking-tight", toneText)}>
          {value}
        </p>
      )}
      {hint && (
        <p className="text-[12px] text-gray-500 mt-1.5">{hint}</p>
      )}
    </div>
  )
}
