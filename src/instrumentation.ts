export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return
  if (process.env.NODE_ENV !== "production") return
  if (process.env.SKIP_MIGRATIONS === "1") return

  const { runMigrations } = await import("@/lib/db/migrate")
  try {
    await runMigrations()
    console.log("[tadan] migrations applied")
  } catch (err) {
    console.error("[tadan] migration failed:", err)
    throw err
  }
}
