"use client"

import { cn } from "@/lib/utils"

const PLATFORM_COLORS: Record<string, string> = {
  meta: "#1877F2",
  google: "#EA4335",
  taboola: "#6C2BD9",
  tiktok: "#000000",
}

export function PlatformBadge({
  platform,
  className,
}: {
  platform: string
  className?: string
}) {
  const trimmed = platform.trim()
  const color = PLATFORM_COLORS[trimmed] || "#6b7280"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[12px] font-medium",
        className
      )}
      style={{ color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
      />
      {trimmed}
    </span>
  )
}

export function PlatformList({ platform }: { platform: string | null }) {
  if (!platform) return null
  const items = platform.split(",").map((p) => p.trim()).filter(Boolean)
  return (
    <span className="inline-flex items-center gap-2.5 flex-wrap">
      {items.map((p) => (
        <PlatformBadge key={p} platform={p} />
      ))}
    </span>
  )
}
