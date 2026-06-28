export interface AnalysisInput {
  inputType: "text" | "url"
  content?: string
  url?: string
  platforms: Platform[]
}

export type Platform = "meta" | "google" | "taboola"

export type ViolationLevel = "Red" | "Yellow" | "Green"

export interface Violation {
  text: string
  reason: string
  level: ViolationLevel
}

export interface AnalysisResult {
  riskScore: number
  violations: Violation[]
}

export interface Variant {
  text: string
  complianceScore: number
  hookPreservation: number
}

export interface OptimizationResult {
  original: string
  variants: Variant[]
}

export interface AnalysisRecord {
  id: string
  inputType: string
  rawContent: string
  platform: string
  riskScore: number | null
  status: string
  createdAt: Date
  violations?: ViolationRecord[]
  variants?: VariantRecord[]
}

export interface ViolationRecord {
  id: string
  text: string
  reason: string
  level: string
  ruleSource: string | null
}

export interface VariantRecord {
  id: string
  variantText: string
  variantIndex: number
}
