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
    try {
      const db = drizzle({ client: pool })
      // The migration SQL uses `IF NOT EXISTS` for tables and DO blocks for
      // foreign-key constraints, so re-running on a database that was
      // initialized out-of-band (e.g., the docker initdb script applying
      // drizzle/*.sql directly) is a safe no-op rather than a hard error.
      await migrate(db, { migrationsFolder: "./drizzle" })
    } finally {
      await pool.end()
    }
  })()

  return runOnce
}
