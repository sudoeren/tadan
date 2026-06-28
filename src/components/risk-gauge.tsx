import { cn } from "@/lib/utils"

interface RiskGaugeProps {
  score: number
  size?: "sm" | "lg"
}

function getRiskLabel(score: number): string {
  if (score <= 25) return "Safe to ship"
  if (score <= 60) return "Needs review"
  if (score <= 85) return "High risk"
  return "Do not ship"
}

function getRiskEmoji(score: number): string {
  if (score <= 25) return "●"
  if (score <= 60) return "●"
  if (score <= 85) return "●"
  return "●"
}

function getRiskTrack(score: number): string {
  if (score <= 25) return "stroke-emerald-200"
  if (score <= 60) return "stroke-amber-200"
  if (score <= 85) return "stroke-orange-200"
  return "stroke-red-200"
}

function getRiskFill(score: number): string {
  if (score <= 25) return "stroke-emerald-500"
  if (score <= 60) return "stroke-amber-500"
  if (score <= 85) return "stroke-orange-500"
  return "stroke-red-500"
}

function getRiskBg(score: number): string {
  if (score <= 25) return "bg-emerald-50 border-emerald-200"
  if (score <= 60) return "bg-amber-50 border-amber-200"
  if (score <= 85) return "bg-orange-50 border-orange-200"
  return "bg-red-50 border-red-200"
}

function getRiskText(score: number): string {
  if (score <= 25) return "text-emerald-700"
  if (score <= 60) return "text-amber-700"
  if (score <= 85) return "text-orange-700"
  return "text-red-700"
}

export function RiskGauge({ score, size = "lg" }: RiskGaugeProps) {
  const radius = size === "sm" ? 36 : 64
  const strokeWidth = size === "sm" ? 5 : 7
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const dashoffset = circumference - (score / 100) * circumference
  const dims = radius * 2

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-2xl border p-6",
        getRiskBg(score)
      )}
    >
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dims}
          height={dims}
          className="-rotate-90 drop-shadow-sm"
        >
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            className={getRiskTrack(score)}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            className={cn(
              getRiskFill(score),
              "transition-[stroke-dashoffset] duration-1000 ease-out"
            )}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span
          className={cn(
            "absolute font-display font-bold tracking-tight",
            getRiskText(score),
            size === "sm" ? "text-xl" : "text-3xl"
          )}
        >
          {score}
        </span>
      </div>
      <div className="text-center">
        <p className={cn("text-sm font-semibold", getRiskText(score))}>
          {getRiskLabel(score)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">risk score</p>
      </div>
    </div>
  )
}
