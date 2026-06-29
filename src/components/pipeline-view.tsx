"use client"

import { Check, ScrollText, FileText, ScanSearch, PenLine, AlertCircle, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export type StageName = "loading" | "scraping" | "analyzing" | "optimizing" | "done" | "error"

interface PipelineViewProps {
  inputMode: "text" | "url"
  currentStage: StageName
  hasViolations: boolean
}

type StageStatus = "pending" | "active" | "complete" | "skipped" | "error"

interface Stage {
  id: "loading" | "reading" | "analyzing" | "rewriting"
  label: string
  description: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}

const STAGES: Stage[] = [
  {
    id: "loading",
    label: "Loading policies",
    description: "Reading 1,200+ platform rules",
    icon: ScrollText,
  },
  {
    id: "reading",
    label: "Reading content",
    description: "Analyzing your input",
    icon: FileText,
  },
  {
    id: "analyzing",
    label: "Analyzing policies",
    description: "Matching against Meta, Google, Taboola",
    icon: ScanSearch,
  },
  {
    id: "rewriting",
    label: "Rewriting copy",
    description: "Generating safe variants",
    icon: PenLine,
  },
]

function mapBackendToFrontendOrder(stage: StageName): number {
  if (stage === "loading") return 0
  if (stage === "scraping") return 1
  if (stage === "analyzing") return 2
  if (stage === "optimizing") return 3
  return 4
}

function getStageStatus(
  stageId: Stage["id"],
  currentStage: StageName,
  hasViolations: boolean
): StageStatus {
  if (currentStage === "error") {
    const order: Stage["id"][] = ["loading", "reading", "analyzing", "rewriting"]
    const stageOrder = order.indexOf(stageId)
    if (stageOrder === 0) return "error"
    return "pending"
  }

  const order: Stage["id"][] = ["loading", "reading", "analyzing", "rewriting"]
  const currentOrder = currentStage === "done" ? 4 : mapBackendToFrontendOrder(currentStage)
  const stageOrder = order.indexOf(stageId)

  if (stageId === "rewriting" && !hasViolations && currentStage === "done") {
    return "skipped"
  }

  if (stageOrder < currentOrder) return "complete"
  if (stageOrder === currentOrder) return "active"
  return "pending"
}

function getArrowStatus(
  toStageId: Stage["id"],
  currentStage: StageName,
  hasViolations: boolean
): "pending" | "active" | "complete" {
  const toStatus = getStageStatus(toStageId, currentStage, hasViolations)
  if (toStatus === "complete") return "complete"
  if (toStatus === "active") return "active"
  return "pending"
}

function StageCircle({ status, icon: Icon }: { status: StageStatus; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }) {
  if (status === "active") {
    return (
      <div className="relative h-16 w-16 sm:h-[72px] sm:w-[72px] flex items-center justify-center">
        <svg
          className="absolute inset-0 animate-pipeline-spin text-orange-500"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth="3"
          />
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="55 245"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-[5px] rounded-full bg-white flex items-center justify-center text-orange-500">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full transition-all duration-500 bg-white",
        status === "pending" && "ring-1 ring-gray-200 text-gray-300",
        status === "complete" && "ring-2 ring-emerald-500 text-emerald-500",
        status === "skipped" && "ring-1 ring-gray-200 text-gray-300",
        status === "error" && "ring-2 ring-red-500 text-red-500"
      )}
    >
      {status === "complete" ? (
        <Check className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={3} />
      ) : status === "error" ? (
        <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
      ) : status === "skipped" ? (
        <span className="text-[20px] leading-none">—</span>
      ) : (
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
      )}
    </div>
  )
}

function Arrow({ status }: { status: "pending" | "active" | "complete" }) {
  const colorClass =
    status === "complete"
      ? "text-emerald-500"
      : status === "active"
        ? "text-orange-500"
        : "text-gray-300"

  return (
    <div className="flex items-center justify-center w-10 sm:w-16 h-7">
      <svg
        viewBox="0 0 60 16"
        fill="none"
        className={cn("w-full h-3 transition-colors duration-500", colorClass)}
      >
        <line
          x1="2"
          y1="8"
          x2="48"
          y2="8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="5 3"
          className={cn(
            status === "active" && "animate-pipeline-flow"
          )}
        />
        <path
          d="M44 2 L56 8 L44 14"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  )
}

function StageDescription({ status, defaultText }: { status: StageStatus; defaultText: string }) {
  if (status === "active") return <>Working...</>
  if (status === "complete") return <>Done</>
  if (status === "skipped") return <>Skipped</>
  if (status === "error") return <>Failed</>
  return <>{defaultText}</>
}

export default function PipelineView({
  inputMode,
  currentStage,
  hasViolations,
}: PipelineViewProps) {
  return (
    <div className="py-4 sm:py-6">
      <div className="hidden sm:flex items-start justify-between gap-2">
        {STAGES.map((stage, i) => {
          const status = getStageStatus(stage.id, currentStage, hasViolations)
          const Icon = stage.icon
          const showUrlHint = stage.id === "reading" && inputMode === "url"
          const IconToShow = showUrlHint ? Globe : Icon
          const isLast = i === STAGES.length - 1
          const arrowStatus = isLast
            ? "pending"
            : getArrowStatus(STAGES[i + 1].id, currentStage, hasViolations)

          return (
            <div key={stage.id} className="flex items-start gap-2 flex-1 last:flex-none">
              <div className="flex flex-col items-center text-center flex-1 min-w-0">
                <StageCircle status={status} icon={IconToShow} />
                <p
                  className={cn(
                    "mt-3 text-[13px] sm:text-[14px] font-semibold leading-tight transition-colors duration-300",
                    status === "pending" && "text-gray-400",
                    status === "active" && "text-gray-900",
                    status === "complete" && "text-emerald-700",
                    status === "skipped" && "text-gray-400",
                    status === "error" && "text-red-600"
                  )}
                >
                  {stage.label}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[11px] sm:text-[12px] leading-snug transition-colors duration-300",
                    status === "pending" && "text-gray-300",
                    status === "active" && "text-gray-500",
                    status === "complete" && "text-emerald-600/70",
                    status === "skipped" && "text-gray-300",
                    status === "error" && "text-red-500/80"
                  )}
                >
                  <StageDescription status={status} defaultText={stage.description} />
                </p>
              </div>
              {!isLast && (
                <div className="pt-7 sm:pt-8 shrink-0">
                  <Arrow status={arrowStatus} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex sm:hidden flex-col gap-4">
        {STAGES.map((stage, i) => {
          const status = getStageStatus(stage.id, currentStage, hasViolations)
          const Icon = stage.icon
          const showUrlHint = stage.id === "reading" && inputMode === "url"
          const IconToShow = showUrlHint ? Globe : Icon
          const isLast = i === STAGES.length - 1
          const arrowStatus = isLast
            ? "pending"
            : getArrowStatus(STAGES[i + 1].id, currentStage, hasViolations)

          return (
            <div key={stage.id}>
              <div className="flex items-center gap-4">
                <StageCircle status={status} icon={IconToShow} />
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-[14px] font-semibold transition-colors duration-300",
                      status === "pending" && "text-gray-400",
                      status === "active" && "text-gray-900",
                      status === "complete" && "text-emerald-700",
                      status === "skipped" && "text-gray-400",
                      status === "error" && "text-red-600"
                    )}
                  >
                    {stage.label}
                  </p>
                  <p
                    className={cn(
                      "text-[12px] transition-colors duration-300",
                      status === "pending" && "text-gray-300",
                      status === "active" && "text-gray-500",
                      status === "complete" && "text-emerald-600/70",
                      status === "skipped" && "text-gray-300",
                      status === "error" && "text-red-500/80"
                    )}
                  >
                    <StageDescription status={status} defaultText={stage.description} />
                  </p>
                </div>
              </div>
              {!isLast && (
                <div className="ml-7 mt-2 mb-2 h-4 flex items-center">
                  <svg
                    width="2"
                    height="16"
                    className={cn(
                      "transition-colors duration-500",
                      arrowStatus === "pending" && "text-gray-300",
                      arrowStatus === "active" && "text-orange-500 animate-pipeline-flow-vertical",
                      arrowStatus === "complete" && "text-emerald-500"
                    )}
                  >
                    <line
                      x1="1"
                      y1="0"
                      x2="1"
                      y2="16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="3 3"
                    />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
