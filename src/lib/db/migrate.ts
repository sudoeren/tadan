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
      await runMigrationsWithBootstrapping(pool)
    } finally {
      await pool.end()
    }
  })()

  return runOnce
}

async function runMigrationsWithBootstrapping(pool: Pool) {
  // Ensure the drizzle tracking schema/table exist. Drizzle creates these
  // lazily on the first migrate() call, but we want to inspect them
  // ourselves first to decide whether to bootstrap.
  await pool.query(`
    CREATE SCHEMA IF NOT EXISTS drizzle;
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint NOT NULL
    );
  `)

  // Heuristic: is the application schema already in place? We check for
  // the `users` table in the public schema as the most reliable signal
  // that initdb has run and the schema is fully applied.
  const schemaCheck = await pool.query<{ exists: boolean }>(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users'
    ) as exists
  `)
  const schemaExists = schemaCheck.rows[0]?.exists === true

  // Check whether the migrations tracking table already has any rows.
  const trackingCheck = await pool.query<{ count: string }>(`
    SELECT count(*)::text as count FROM drizzle.__drizzle_migrations
  `)
  const trackingEmpty = Number(trackingCheck.rows[0]?.count ?? "0") === 0

  if (schemaExists && trackingEmpty) {
    // The application schema is already in place (e.g., created by the
    // docker initdb script which applies drizzle/*.sql directly) but the
    // drizzle migrations tracking table is empty. Without intervention,
    // drizzle's migrator would try to re-apply every migration and fail
    // with "relation already exists" on the first CREATE TABLE.
    //
    // Bootstrap the tracking table with a single marker whose created_at
    // is set to a far-future value (well past any real migration
    // timestamp — drizzle's `when` values are millisecond Unix
    // timestamps, currently around 1.78e12). Drizzle's migrator compares
    // `lastDbMigration.created_at < migration.folderMillis` to decide
    // whether to apply a migration, so a marker in the year 2286+
    // effectively marks every current migration as already applied.
    // Any future migration with a smaller folderMillis will still be
    // applied normally.
    const BOOTSTRAP_TIMESTAMP = "9999999999999"
    await pool.query(
      `INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      ["bootstrap-marker", BOOTSTRAP_TIMESTAMP]
    )
    console.log(
      "[tadan] bootstrapped migrations tracking (schema already in place)"
    )
  }

  // Run drizzle's normal migrate. If we just bootstrapped, the existing
  // migrations are already marked as applied and will be skipped. Any
  // new migration added later (with a smaller folderMillis than the
  // bootstrap marker) will be applied here.
  const db = drizzle({ client: pool })
  await migrate(db, { migrationsFolder: "./drizzle" })
}
