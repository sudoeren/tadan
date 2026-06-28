import {
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Monitor,
  RotateCw,
  Share,
  Plus,
  Copy,
  Grid,
  Compass,
  ListTodo,
  Layers,
  Shield,
  AlertTriangle,
} from "lucide-react"

export function DashboardMockup() {
  return (
    <div className="rounded-t-2xl overflow-hidden bg-[#1a1a1c] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10 text-left">
      {/* Title bar */}
      <div className="bg-[#242427] border-b border-white/5 px-4 py-2.5 flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <PanelLeft className="w-3.5 h-3.5 text-white/40 ml-2" />
        <ChevronLeft className="w-3.5 h-3.5 text-white/25" />
        <ChevronRight className="w-3.5 h-3.5 text-white/25" />
        <div className="flex-1 flex justify-center">
          <div className="bg-[#1a1a1c] rounded-md px-6 py-1 flex items-center gap-1.5 text-[10px] text-white/60">
            <Monitor className="w-3 h-3" />
            tadan.ai/analyzer
          </div>
        </div>
        <RotateCw className="w-3.5 h-3.5 text-white/40" />
        <Share className="w-3.5 h-3.5 text-white/40" />
        <Plus className="w-3.5 h-3.5 text-white/40" />
        <Copy className="w-3.5 h-3.5 text-white/40" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-[22%] border-r border-white/5 bg-[#1e1e21] px-3 py-3.5 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <span className="text-sm font-semibold text-white/80">tadan</span>
            <Grid className="w-3.5 h-3.5 text-white/30 ml-auto" />
          </div>
          <div className="flex items-center gap-2 px-1">
            <span className="w-4 h-4 rounded bg-[#e8553f] flex items-center justify-center text-[9px] font-bold text-white">
              T
            </span>
            <span className="text-[10px] text-white/80">Acme · Performance</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 px-2 py-1 rounded text-[10px] text-white/80 bg-white/5">
              <Compass className="w-3 h-3 text-white/50" />
              Scan
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded text-[10px] text-white/60">
              <Layers className="w-3 h-3 text-white/30" />
              History
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded text-[10px] text-white/60">
              <ListTodo className="w-3 h-3 text-white/30" />
              Drafts
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-1 px-1">
            <div className="text-[8px] uppercase tracking-wider text-white/30 mb-1">
              Recent
            </div>
            {[
              "Meta · Black Friday",
              "Google · Lead Gen v3",
              "Taboola · Crypto Flow",
            ].map((label) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-[9px] text-white/45 truncate"
              >
                <span className="w-1 h-1 rounded-full bg-[#28c840]/70 shrink-0" />
                {label}
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-1.5 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#28c840] animate-pulse-dot" />
            <span className="text-[9px] text-white/50">All systems ready</span>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-lg bg-[#e8553f] flex items-center justify-center text-sm font-bold text-white">
                A
              </span>
              <div>
                <div className="text-sm font-medium text-white">
                  Acme · Performance
                </div>
                <div className="text-[10px] text-white/45">
                  Meta · Google · Taboola
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
              <span className="text-[10px] text-white/70">Re-scan</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 divide-x divide-white/5 rounded-xl bg-white/[0.03] ring-1 ring-white/5 mb-4">
            <div className="px-3 py-2.5">
              <div className="text-[8px] tracking-wider text-white/35 mb-1">
                COMPLIANT
              </div>
              <div className="text-xl font-medium text-[#28c840]">14</div>
              <div className="text-[8px] text-white/25">Safe to ship</div>
            </div>
            <div className="px-3 py-2.5">
              <div className="text-[8px] tracking-wider text-white/35 mb-1">
                FLAGGED
              </div>
              <div className="text-xl font-medium text-white">2</div>
              <div className="text-[8px] text-white/25">Violations</div>
            </div>
            <div className="px-3 py-2.5">
              <div className="text-[8px] tracking-wider text-white/35 mb-1">
                VARIANTS
              </div>
              <div className="text-xl font-medium text-white">3</div>
              <div className="text-[8px] text-white/25">Generated</div>
            </div>
            <div className="px-3 py-2.5">
              <div className="text-[8px] tracking-wider text-white/35 mb-1">
                SCORE
              </div>
              <div className="text-xl font-medium text-white">62</div>
              <div className="text-[8px] text-white/25">Risk · medium</div>
            </div>
          </div>

          {/* Violation cards */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-[#ff5f57]" />
                  <span className="text-[9px] font-medium text-[#ff5f57]">
                    Critical
                  </span>
                </div>
                <span className="text-[8px] text-white/25">Meta · Google</span>
              </div>
              <span className="text-[10px] text-[#ff5f57]/80 bg-[#ff5f57]/10 px-1.5 py-0.5 rounded inline-block">
                &ldquo;Guaranteed $500/day&rdquo;
              </span>
              <p className="text-[8px] text-white/40 mt-1.5 leading-snug">
                Earnings claim without substantiation
              </p>
            </div>
            <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-[#febc2e]" />
                  <span className="text-[9px] font-medium text-[#febc2e]">
                    Warning
                  </span>
                </div>
                <span className="text-[8px] text-white/25">Taboola</span>
              </div>
              <span className="text-[10px] text-[#febc2e]/80 bg-[#febc2e]/10 px-1.5 py-0.5 rounded inline-block">
                &ldquo;Limited time offer&rdquo;
              </span>
              <p className="text-[8px] text-white/40 mt-1.5 leading-snug">
                Urgency language lacks specifics
              </p>
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[9px] font-medium text-white/40">
                Safe variants
              </span>
              <span className="text-[8px] text-white/25">3 generated</span>
            </div>
            <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 overflow-hidden">
              <div className="grid grid-cols-[1fr_70px_60px_60px] text-[8px] font-medium text-white/30 px-3 py-2 border-b border-white/5">
                <span>Copy</span>
                <span className="text-right">Compliance</span>
                <span className="text-right">Hook</span>
                <span className="text-right">Action</span>
              </div>
              {[
                { compliance: 96, hook: 92 },
                { compliance: 94, hook: 88 },
                { compliance: 92, hook: 85 },
              ].map((v, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_70px_60px_60px] text-[9px] text-white/70 px-3 py-2 border-b border-white/[0.02] last:border-b-0 hover:bg-white/[0.02]"
                >
                  <span className="truncate pr-2">
                    Variant {i + 1}: {["Empowerment framing", "Curiosity hook", "Social proof"][i]}
                    ...
                  </span>
                  <span className="text-right text-[#28c840] font-mono">
                    {v.compliance}%
                  </span>
                  <span className="text-right text-white/70 font-mono">
                    {v.hook}%
                  </span>
                  <span className="text-right text-[#28c840]/70">Copy</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
