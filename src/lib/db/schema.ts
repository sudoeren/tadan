import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  providerId: text("provider_id").notNull(),
  accountId: text("account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  idToken: text("id_token"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const analyses = pgTable("analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  inputType: text("input_type").notNull(),
  rawContent: text("raw_content").notNull(),
  sourceUrl: text("source_url"),
  platform: text("platform").notNull(),
  riskScore: integer("risk_score"),
  positiveAspects: jsonb("positive_aspects").$type<
    { label: string; description: string }[]
  >(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const violations = pgTable("violations", {
  id: uuid("id").primaryKey().defaultRandom(),
  analysisId: uuid("analysis_id")
    .notNull()
    .references(() => analyses.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  reason: text("reason").notNull(),
  level: text("level").notNull(),
  ruleSource: text("rule_source"),
})

export const variants = pgTable("variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  analysisId: uuid("analysis_id")
    .notNull()
    .references(() => analyses.id, { onDelete: "cascade" }),
  variantText: text("variant_text").notNull(),
  variantIndex: integer("variant_index").notNull(),
  variantParts: jsonb("variant_parts").$type<{
    headline: string
    body: string
    cta: string
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const platformPolicies = pgTable("platform_policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  platform: text("platform").notNull(),
  category: text("category").notNull(),
  ruleText: text("rule_text").notNull(),
  embedding: text("embedding"),
})
