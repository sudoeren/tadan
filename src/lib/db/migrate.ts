import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

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
      await runMigrationsWithBootstrapping(pool)
    } finally {
      await pool.end()
    }
  })()

  return runOnce
}

interface JournalEntry {
  tag: string
  when: number
}

interface Journal {
  entries: JournalEntry[]
}

async function runMigrationsWithBootstrapping(pool: Pool) {
  // Ensure the drizzle tracking table exists. Drizzle creates this lazily
  // the first time migrate() runs, but we want to read it ourselves first.
  await pool.query(`
    CREATE SCHEMA IF NOT EXISTS drizzle;
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint NOT NULL
    );
  `)

  // Heuristic: is the application schema already in place? Check for the
  // `users` table in the public schema, which is the most fundamental table.
  const schemaCheck = await pool.query<{ exists: boolean }>(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users'
    ) as exists
  `)
  const schemaExists = schemaCheck.rows[0]?.exists === true

  const trackingCheck = await pool.query<{ count: string }>(`
    SELECT count(*)::text as count FROM drizzle.__drizzle_migrations
  `)
  const trackingEmpty = Number(trackingCheck.rows[0]?.count ?? "0") === 0

  if (schemaExists && trackingEmpty) {
    // The application schema is already in place (e.g., created by the
    // docker initdb script from a previous deploy), but the drizzle
    // migrations tracking table is empty. This means drizzle would try
    // to re-apply migrations and fail with "relation already exists".
    // Bootstrap the tracking table by marking every current journal
    // migration as already applied, using the same hash and created_at
    // drizzle would have used. After this, drizzle's normal migrate()
    // will skip them because the latest created_at in the tracking
    // table will be >= every journal entry's folderMillis.
    const journalPath = path.join(process.cwd(), "drizzle/meta/_journal.json")
    const journal = JSON.parse(fs.readFileSync(journalPath, "utf-8")) as Journal

    for (const entry of journal.entries) {
      const sqlPath = path.join(process.cwd(), "drizzle", `${entry.tag}.sql`)
      const sqlContent = fs.readFileSync(sqlPath, "utf-8")
      const hash = crypto
        .createHash("sha256")
        .update(sqlContent)
        .digest("hex")

      await pool.query(
        `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [hash, entry.when]
      )
    }
    console.log(
      `[tadan] bootstrapped ${journal.entries.length} migration(s) (schema already in place)`
    )
  }

  // Now run drizzle's normal migrate. If bootstrap just ran, the existing
  // migrations are already marked as applied and will be skipped. Any new
  // migration added later (with a higher folderMillis) will be applied
  // normally here.
  const db = drizzle({ client: pool })
  await migrate(db, { migrationsFolder: "./drizzle" })
}
