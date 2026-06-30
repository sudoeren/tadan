import type { Violation } from "@/types"

const LEVEL_STYLES: Record<string, string> = {
  Red: "border-red-200 bg-red-50 text-red-700",
  Yellow: "border-amber-200 bg-amber-50 text-amber-700",
}

interface ViolationsTableProps {
  violations: Violation[]
}

export function ViolationsTable({ violations }: ViolationsTableProps) {
  if (violations.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50/50 p-10">
        <p className="text-sm text-emerald-700 font-medium">
          No violations found — this ad is clean.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-secondary/50">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Flagged Content
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Policy Violation
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Severity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {violations.map((v, i) => (
              <tr key={i} className="group hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-4">
                  <span className="font-mono text-sm text-destructive bg-destructive/5 px-2 py-0.5 rounded">
                    &ldquo;{v.text}&rdquo;
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground leading-relaxed">
                  {v.reason}
                </td>
                <td className="px-5 py-4 text-right">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${LEVEL_STYLES[v.level] || "border-border text-muted-foreground"}`}
                  >
                    {v.level === "Red" ? "Critical" : "Warning"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
