import { Badge } from "@/components/ui/badge"
import type { Violation } from "@/types"

const LEVEL_STYLES: Record<string, { badge: "destructive" | "secondary"; label: string }> = {
  Red: { badge: "destructive", label: "Critical" },
  Yellow: { badge: "secondary", label: "Warning" },
}

interface ViolationsTableProps {
  violations: Violation[]
}

export function ViolationsTable({ violations }: ViolationsTableProps) {
  if (violations.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-sm text-emerald-700">
        No violations found — this ad looks clean.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Violating Text</th>
            <th className="px-4 py-3 text-left font-medium">Reason</th>
            <th className="px-4 py-3 text-right font-medium">Severity</th>
          </tr>
        </thead>
        <tbody>
          {violations.map((v, i) => (
            <tr key={i} className="border-b last:border-b-0">
              <td className="px-4 py-3 font-mono text-xs text-destructive">
                &ldquo;{v.text}&rdquo;
              </td>
              <td className="px-4 py-3 text-muted-foreground">{v.reason}</td>
              <td className="px-4 py-3 text-right">
                <Badge variant={LEVEL_STYLES[v.level]?.badge || "secondary"}>
                  {LEVEL_STYLES[v.level]?.label || v.level}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
