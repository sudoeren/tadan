<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (16.2.9) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack & conventions

- **Bun** is the primary package manager. Use `bun`, `bunx`, `bun install` — not `npm`/`npx`.
- Path alias: `@/*` → `./src/*` (see `tsconfig.json`, mirrored in `vitest.config.ts`).
- Next.js 16 with Turbopack. Run with `bun dev` (not `bunx next dev` — see "Database" below).
- No `typecheck` script. Run ad-hoc: `bunx tsc --noEmit`.
- ESLint: `bun run lint`.

## Database (Postgres + pgvector via Docker)

**Auto-managed.** `package.json` defines a `predev` hook → `scripts/dev-db.mjs` that:
1. Starts `tadan-db` container if not running.
2. Waits for `:5432` to be ready.
3. Runs `bunx drizzle-kit generate` if `drizzle/*.sql` is empty.

The `docker/initdb/00-setup.sh` init script runs **only on first boot of a fresh `pgdata` volume** — it `CREATE EXTENSION vector` and applies every `drizzle/*.sql` in order. Mounted read-only via `docker-compose.yml`.

### Schema changes

```bash
bun run db:generate   # regenerate SQL files in drizzle/
bun run db:reset      # docker compose down -v, then re-init via predev
```

`db:reset` is required because init scripts don't re-run on an existing volume.

### `drizzle/*.sql` is gitignored

Generated artifacts. The `predev` hook produces them on first run. Don't commit them.

### Drizzle error gotcha

`DrizzleQueryError` shows the SQL in console but **the real cause is in `error.cause`**. When debugging "Failed query":
- `code: 'ECONNREFUSED'` → docker not running
- `relation "..." does not exist` → migrations not applied (run `bun run db:reset`)
- Permission / auth errors → check `.env.local` `DATABASE_URL`

## Auth (Better Auth)

- Server config: `src/lib/auth.ts`. Required env: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
- Mounted at `src/app/api/auth/[...all]/route.ts` via `toNextJsHandler`.
- `getSession()` requires `await headers()` (Next.js 16 — `headers()` is async).
- Tables (`users`, `accounts`, `sessions`) live in `src/lib/db/schema.ts` and are wired to Better Auth's drizzle adapter in `src/lib/auth.ts`.

## Testing

- Unit (Vitest, jsdom): `bun test` or `bun test:watch`. Single file: `bunx vitest run tests/unit/foo.test.ts`.
- E2E (Playwright): `bun test:e2e`. `playwright.config.ts` auto-starts `bun run dev` via `webServer`, so you don't need to launch it manually unless debugging setup.
- E2E `reuseExistingServer: !process.env.CI` — locally it reuses a running dev server.

## Pipeline entrypoints

- `POST /api/analyze` (`src/app/api/analyze/route.ts`) — full pipeline: auth → scrape (if URL) → RAG (pgvector) → critic agent → optimizer agent → DB save. Supports SSE via `stream: true`.
- Policy RAG: embeddings in `platformPolicies.embedding` (vector(1536)). Auto-seeded on first analyze call via `src/lib/rag.ts`.

## Files you might not expect

- `scripts/dev-db.mjs` — predev DB lifecycle. If `bun dev` is slow or hangs, the bottleneck is usually here, not Next.js.
- `docker/initdb/00-setup.sh` — vector extension + migration runner. Edit only if adding a pre-migration step.
- `drizzle.config.ts` — **does not use `dotenv`**. Has its own `loadEnvFile` helper that reads `.env.local` then `.env` (Bun's runtime doesn't auto-load for drizzle-kit).
