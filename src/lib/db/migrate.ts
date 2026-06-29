import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"

let runOnce: Promise<void> | null = null

export function runMigrations(): Promise<void> {
  if (runOnce) return runOnce

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    return Promise.reject(new Error("DATABASE_URL is not set"))
  }

  runOnce = (async () => {
    const pool = new Pool({ connectionString })
    const db = drizzle({ client: pool })
    try {
      await migrate(db, { migrationsFolder: "./drizzle" })
    } finally {
      await pool.end()
    }
  })()

  return runOnce
}
