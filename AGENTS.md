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
- Shadcn UI with `base-nova` style and lucide icons (see `components.json`).

## Database (Postgres + pgvector via Docker)

**Auto-managed.** `predev` hook → `scripts/dev-db.mjs` starts the `tadan-db` container, waits for `:5432`, and runs `bunx drizzle-kit generate` if `drizzle/*.sql` is empty.

`docker/initdb/00-setup.sh` runs **only on first boot of a fresh `pgdata` volume** — creates `vector` extension and applies every `drizzle/*.sql` in order.

### Schema changes

```bash
bun run db:generate   # DDL from src/lib/db/schema.ts → drizzle/*.sql
bun run db:reset      # docker compose down -v, then re-init via predev
```

`db:reset` is required because init scripts don't re-run on existing volume.

### `drizzle/*.sql` is gitignored

Generated artifacts (see `.gitignore`). The `predev` hook produces them on first run. Don't commit them.

### Drizzle error gotcha

`DrizzleQueryError` shows the SQL in console but **the real cause is in `error.cause`**. When debugging:
- `code: 'ECONNREFUSED'` → docker not running
- `relation "..." does not exist` → migrations not applied (run `bun run db:reset`)
- Permission / auth errors → check `.env.local` `DATABASE_URL`

## Auth (Better Auth)

- Server config: `src/lib/auth.ts`. Uses **email OTP** plugin (sign-in/verification/reset via 6-digit code, not traditional password reset links).
- Requires `RESEND_API_KEY` and `EMAIL_FROM_ADDRESS` for transactional emails. Without them, auth falls back to `console.warn` — email is never sent but no error is thrown.
- Client: `src/lib/auth-client.ts` with `better-auth/react` + `emailOTPClient()` plugin.
- `getSession()` requires `await headers()` (Next.js 16 — `headers()` is async).
- Auth tables in `src/lib/db/schema.ts` wired via drizzle adapter in `src/lib/auth.ts`.
- `src/lib/auth-state.ts` persists a `tadan:has-authed` localStorage flag (client-side UX hint, not security-critical).

## Testing

- Unit (Vitest, jsdom): `bun run test` or `bun run test:watch`. Use `bun run test` (not `bun test`, which uses bun's native runner and ignores vitest config). Single file: `bunx vitest run tests/unit/foo.test.ts`.
- E2E (Playwright): `bun test:e2e`. `playwright.config.ts` auto-starts `bun run dev` via `webServer`, so you don't need to launch it manually unless debugging setup.
- E2E `reuseExistingServer: !process.env.CI` — locally it reuses a running dev server.
- `tests/unit/setup.ts` imports `@testing-library/jest-dom/vitest`.

## Pipeline (`POST /api/analyze`)

Full pipeline at `src/app/api/analyze/route.ts`:

1. Auth (optional — works without session but skips DB save)
2. `await waitForEmbeddings()` — race against auto-seed; **times out after 15s**
3. Scrape (cheerio) if `inputType: "url"`
4. RAG → pgvector cosine-similarity on `platformPolicies.embedding` (1536d)
5. Critic agent → `{ riskScore, violations[], positiveAspects[] }`
6. Optimizer agent → 3 safe variants (only if violations exist)
7. DB save (skipped if unauthenticated)

Supports SSE via `stream: true` — events: `progress`, `result`, `done`, `error`.

Policy embeddings auto-seed on first analyze call (`src/lib/rag.ts`). Can also seed via `POST /api/seed` (guarded by optional `SEED_API_KEY` env var, passed as `Authorization: Bearer <key>`).

### 4 platform types

```
"meta" | "google" | "taboola" | "tiktok"
```
Types defined in `src/types/index.ts:8`. All 4 have policy files in `src/lib/policies/`.

## LLM (OpenRouter)

- Chat: `OPENROUTER_API_KEY` + `OPENROUTER_BASE_URL` (default: `https://openrouter.ai/api/v1`).
- Default chat model: `DEFAULT_OPENROUTER_MODEL` env var, falls back to `google/gemini-2.5-flash-preview`.
- Embeddings: `openai/text-embedding-3-small` (1536d) — constant in `src/lib/rag.ts:6`.
- JSON extraction: `src/lib/openrouter.ts` `extractJsonFromResponse()` strips ``` fences before parsing.
- Custom headers: `HTTP-Referer` and `X-Title` set to `BETTER_AUTH_URL` / `"tadan"`.
- Temperature defaults to `0.3`, max tokens to `4096`.

## Key env vars

`.env.local` — copy from `.env.example`. At minimum:
- `DATABASE_URL`, `OPENROUTER_API_KEY`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- `RESEND_API_KEY` + `EMAIL_FROM_ADDRESS` for auth emails (OTP, password reset)
- `SEED_API_KEY` — optional, guards `POST /api/seed`
- `NEXT_PUBLIC_BETTER_AUTH_URL` — client-side auth base URL

## Files you might not expect

- `scripts/dev-db.mjs` — predev DB lifecycle. If `bun dev` is slow or hangs, the bottleneck is usually here, not Next.js.
- `docker/initdb/00-setup.sh` — vector extension + migration runner. Edit only if adding a pre-migration step.
- `drizzle.config.ts` — **does not use `dotenv`**. Has its own `loadEnvFile` helper that reads `.env.local` then `.env` (Bun's runtime doesn't auto-load for drizzle-kit).
- `src/lib/errors.ts` — `AppError`, `LLMError` (retryable, 502), `ValidationError` (400). `withRetry()` does exponential backoff (2 retries, 1s base). `toUserFriendlyError()` maps common DB/network errors to human messages.
