import { cn } from "@/lib/utils"

interface RiskGaugeProps {
  score: number
  size?: "sm" | "lg"
}

function getRiskLabel(score: number): string {
  if (score <= 25) return "Safe"
  if (score <= 60) return "Low Risk"
  if (score <= 85) return "High Risk"
  return "Ban Risk"
}

function getRiskColor(score: number): string {
  if (score <= 25) return "stroke-emerald-500 text-emerald-600"
  if (score <= 60) return "stroke-amber-500 text-amber-600"
  if (score <= 85) return "stroke-orange-500 text-orange-600"
  return "stroke-red-500 text-red-600"
}

function getRiskBg(score: number): string {
  if (score <= 25) return "bg-emerald-50 border-emerald-200"
  if (score <= 60) return "bg-amber-50 border-amber-200"
  if (score <= 85) return "bg-orange-50 border-orange-200"
  return "bg-red-50 border-red-200"
}

export function RiskGauge({ score, size = "lg" }: RiskGaugeProps) {
  const radius = size === "sm" ? 40 : 64
  const strokeWidth = size === "sm" ? 6 : 8
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference
  const dims = radius * 2

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border p-6",
        getRiskBg(score)
      )}
    >
      <div className="relative inline-flex items-center justify-center">
        <svg width={dims} height={dims} className="-rotate-90">
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            className="text-muted/20"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn(getRiskColor(score), "transition-[stroke-dashoffset] duration-1000 ease-out")}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span
          className={cn(
            "absolute font-semibold",
            getRiskColor(score),
            size === "sm" ? "text-lg" : "text-2xl"
          )}
        >
          {score}
        </span>
      </div>
      <span className={cn("text-sm font-medium", getRiskColor(score))}>
        {getRiskLabel(score)}
      </span>
    </div>
  )
}
