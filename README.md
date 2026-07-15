<p align="center">
  <img src="./public/logo.png" alt="tadan" width="120" />
</p>

<h1 align="center">tadan: AI-first ad compliance for media buyers</h1>

<p align="center">
  <a href="https://tadan.erencakar.com">
    <img src="https://img.shields.io/badge/LIVE_DEMO-tadan.erencakar.com-F97316?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <em>Paste an ad or drop a landing page URL. Get a risk score, specific policy violations, and three safe rewrites in about 5 seconds.</em>
</p>

---



## What tadan does in detail

### The pipeline

```
User Input (ad copy or URL)
    │
    ▼
/api/analyze
    ├── stream: true → SSE (progress events)
    ├── URL? → scraper.ts (cheerio DOM parse + SSRF guard)
    ├── RAG → pgvector similarity search on platform_policies (1536d)
    ├── Critic Agent → { riskScore, violations[], positiveAspects[] }
    ├── Optimizer Agent → 3 safe variants (only if violations exist)
    └── DB save (PostgreSQL + Drizzle)
    │
    ▼
Dashboard → risk gauge, violations table, variant cards
```

### The agents

- **Critic Agent**: A senior ad compliance officer system prompt. Receives either RAG-matched policy rules (top-5 most similar) or the full policy docs (for short inputs where RAG is skipped to avoid a useless embedding round-trip). Returns structured violations and a 0–100 risk score, plus positive aspects when the ad is largely compliant.
- **Optimizer Agent**: An elite affiliate copywriter system prompt. Reframes claims as benefits, replaces direct questions with universal statements, swaps guarantees for empowerment, uses curiosity hooks and authority positioning. Each variant picks a distinct psychological angle.

### The policy database

The 4 policy files (`src/lib/policies/`) are versioned snapshots of Meta, Google, TikTok, and Taboola's ad policies, with category breakdown, source URLs, and a "last reviewed" date. They are embedded with `openai/text-embedding-3-small` (1536-dim) and stored in pgvector. On first analyze call, the embeddings are auto-seeded. Subsequent calls retrieve the top-5 most similar rules for the input text.

The policy database isn't a marketing-page summary. Each platform file has 7–8 categories, 25–40 specific rules with real-world examples (e.g. "Before/after comparison imagery is strictly prohibited for weight loss, fitness, skincare, or any transformation context"), and source URLs back to the official policy pages.

### RAG pipeline

Policy rules are embedded via `openai/text-embedding-3-small` and stored in pgvector. At scan time, the user's ad copy is embedded and the top-5 most similar policy rules are retrieved and injected into the Critic Agent's system prompt. For URL inputs, the RAG embedding runs in parallel with the page scrape (URL is a strong prior for landing page content). Total wall-clock time is the same as for text input.

For very short inputs (< 200 chars), RAG is skipped entirely. The full policy docs are small enough that the embedding round-trip doesn't add useful signal.

### The tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Package Manager | Bun |
| Language | TypeScript |
| UI | Tailwind CSS v4 + Shadcn UI (base-nova, light-only) |
| Auth | Better Auth (email/password + OTP) |
| Database | PostgreSQL 16 + pgvector (Docker, auto-init) |
| ORM | Drizzle ORM |
| LLM Chat | OpenRouter API (`google/gemini-2.5-flash-preview` default) |
| Embeddings | OpenRouter API (`text-embedding-3-small`, 1536d) |
| Scraper | Cheerio + SSRF guard |
| Tests | Vitest + Testing Library + Playwright |
| Analytics | Self-hosted Umami |

### Engineering decisions worth calling out

- **SSRF guard on the scraper**: user-controlled URLs are a server-side request forgery vector. The scraper resolves DNS, blocks private IPs (loopback, RFC 1918, link-local, IPv6 ULAs, IPv4-mapped IPv6), and enforces a 5-reply redirect cap. Tested.
- **Parallel scrape + RAG**: for URL input, the page scrape and the embedding API call run in parallel. The embedding is ready before the scrape finishes. Wall-clock time for URL mode is the same as for text mode.
- **Skip the optimizer when there's nothing to fix**: if the critic returns zero violations, the optimizer is not called. No LLM cost for safe ads.
- **Rate limit + per-IP / per-user keys**: anonymous users get a tighter bucket, authenticated users get a more generous one. Both keyed on a hashable identifier, not the raw IP, to avoid leaking client identity into logs.
- **Auto-init Postgres + pgvector**: the dev server's `predev` hook starts the Docker container, waits for it to accept connections, and applies every migration in order. The first analyze call seeds the policy embeddings. There is no manual setup.
- **Modular policies**: each platform's rules live in their own file. Adding a new platform is one new file plus a one-line addition to the `POLICY_MAP` in `critic.ts`. Outbrain is the next planned addition.

### Conscious simplifications (deliberate, scoped, easy to lift)

A few things in the codebase are simpler than they would be in a production SaaS. Calling them out so the trade-offs are explicit:

- **In-memory rate limiter** (`src/lib/rate-limit.ts`): a `Map` keyed on hashed IP / user-id, with TTL eviction. Fast, no infra, zero setup. Single-process only. If tadan ever runs across multiple instances, this becomes a per-instance cap (effectively a 2× or 3× raise in the limit) and would need to move to Redis or a similar shared store. Lifting it is a small refactor, not a redesign.
- **Module-level `embeddingsVerified` flag** (`src/lib/rag.ts`): the seed-once check uses a boolean cached at module load. This avoids a `count(*)` query on every first request per process. Like the rate limiter, it's per-process. Multi-instance deploys would seed each instance independently. The seed is idempotent and cheap, so worst case is a few redundant queries on cold start, not a correctness issue.
- **Desktop-only**: tadan is currently optimized for desktop. Mobile visitors get a `/mobile-soon` page served by a `proxy.ts` UA-rewrite rather than a broken layout. A full mobile-responsive UI is on the near-term roadmap. The desktop-first product is the right scope for the build challenge, and the mobile path is a known follow-up, not a gap.
- **Client-side free-search quota**: the `1 free search` limit on the landing page is enforced in `localStorage` and is trivially bypassable (incognito, clear storage, etc.). It's a UX hint to drive sign-ups, not a security boundary. The server-side rate limiter is the real guard.

---

## Getting Started

> **Requirement:** Docker (or any local Postgres 16 + pgvector instance) is required for local development. The `predev` script auto-starts a `tadan-db` container via `docker compose`, so Docker Desktop / Docker Engine must be installed and running. If you already have a Postgres+pgvector instance reachable at `DATABASE_URL`, Docker is optional — just set the URL in `.env.local` and run `bun run db:generate && bun run db:migrate` once.

### 1. Clone and install

```bash
git clone https://github.com/sudoeren/tadan
cd tadan
bun install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```env
DATABASE_URL=postgresql://tadan:tadan_dev@localhost:5432/tadan
OPENROUTER_API_KEY=sk-or-your-key
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Start dev server

```bash
bun dev
```

`bun dev` automatically:
- Starts the PostgreSQL container (`docker compose up -d`) if not running
- Waits for Postgres to be ready
- Runs `docker/initdb/00-setup.sh` on first boot: creates the `vector` extension and applies every SQL file in `drizzle/`
- Generates migrations with `drizzle-kit generate` if the `drizzle/` folder is empty

Open [http://localhost:3000](http://localhost:3000), sign up, paste ad copy, analyze.

Policy embeddings are auto-seeded on the first analysis request (no manual step needed).

### When you change the schema

```bash
bun run db:generate   # regenerate SQL files in drizzle/
bun run db:reset      # drop the volume, re-init container, re-apply migrations
```

`db:reset` is only needed when schema changes; normal `bun dev` runs use the existing volume.

### How the auto-init works

```
bun dev
  └─ predev: bun scripts/dev-db.mjs
        ├─ docker ps → running?  no → docker compose up -d db
        ├─ wait for :5432 to accept connections
        └─ drizzle/*.sql exists?  no → bunx drizzle-kit generate

docker compose up (first boot only)
  └─ entrypoint runs files in /docker-entrypoint-initdb.d
        └─ 00-setup.sh
              ├─ CREATE EXTENSION vector
              └─ apply every /migrations/*.sql in order
```

`00-setup.sh` runs only on the **first** boot of a fresh `pgdata` volume. Schema changes after that require `bun run db:reset` (which drops the volume, so init runs again).

---

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start dev server (runs `predev` first) |
| `bun run build` | Production build |
| `bun start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:up` | Start Postgres + wait for ready (no dev server) |
| `bun run db:reset` | Drop Postgres volume and re-init from scratch |
| `bun run db:generate` | Generate Drizzle SQL from `src/lib/db/schema.ts` |
| `bun run db:migrate` | Apply migrations via Drizzle Kit (alternative to init script) |
| `bun run db:studio` | Open Drizzle Studio (DB GUI) |
| `bun run test` | Run unit tests (Vitest) |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:e2e` | Run Playwright e2e tests |

---

## Project Structure

```
tadan/
├── docker-compose.yml         # PostgreSQL 16 + pgvector + auto-init mounts
├── docker/
│   └── initdb/
│       └── 00-setup.sh        # vector extension + apply drizzle/*.sql on first boot
├── drizzle.config.ts          # Drizzle Kit config
├── scripts/
│   └── dev-db.mjs             # predev: ensure Postgres is up + migrations exist
├── vitest.config.ts           # Vitest config
├── playwright.config.ts       # Playwright e2e config
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with NavBar
│   │   ├── page.tsx           # Landing page
│   │   ├── globals.css        # Tailwind + Shadcn theme
│   │   ├── (auth)/            # login / signup / password reset
│   │   ├── (app)/             # /analyzer, /history
│   │   ├── admin/             # admin panel (scans, users, stats)
│   │   ├── about/             # about page
│   │   ├── privacy/           # privacy policy
│   │   ├── terms/             # terms
│   │   └── api/
│   │       ├── analyze/route.ts   # POST: full pipeline + SSE stream
│   │       ├── scrape/route.ts    # POST: URL preview
│   │       ├── seed/route.ts      # POST: seed policy embeddings
│   │       ├── history/route.ts   # GET: scan history for current user
│   │       └── auth/[...all]/route.ts
│   ├── components/
│   │   ├── ui/                # Shadcn components
│   │   ├── nav-bar.tsx
│   │   ├── analyzer-form.tsx
│   │   ├── pipeline-view.tsx
│   │   ├── scan-result.tsx
│   │   ├── risk-gauge.tsx
│   │   ├── violations-table.tsx
│   │   ├── variant-card.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── auth.ts            # Better Auth server config
│   │   ├── auth-client.ts     # Better Auth client
│   │   ├── db/
│   │   │   ├── index.ts       # Drizzle + pg connection
│   │   │   └── schema.ts      # Table definitions
│   │   ├── agents/
│   │   │   ├── critic.ts      # Compliance analysis (RAG-integrated)
│   │   │   └── optimizer.ts   # Safe variant generator
│   │   ├── policies/
│   │   │   ├── meta.ts        # Meta Ad policies (with source URLs)
│   │   │   ├── google.ts      # Google Ads policies
│   │   │   ├── taboola.ts     # Taboola policies (with Outbrain-equivalent notes)
│   │   │   └── tiktok.ts      # TikTok Ads policies
│   │   ├── openrouter.ts      # OpenRouter API (chat + embeddings)
│   │   ├── rag.ts             # pgvector similarity search + seed
│   │   ├── scraper.ts         # Cheerio landing page scraper + SSRF guard
│   │   ├── rate-limit.ts      # Per-key rate limiter
│   │   ├── errors.ts          # AppError, LLMError, withRetry()
│   │   └── utils.ts           # cn() helper
│   └── types/
│       └── index.ts
├── tests/
│   ├── unit/                  # Vitest (utils, agents, scraper, rate limit)
│   └── e2e/                   # Playwright
└── drizzle/
    └── *.sql                  # SQL migration files
```

---

## API

### POST /api/analyze

Analyze ad copy or landing page for policy compliance. Supports streaming via SSE.

```json
// Request
{
  "inputType": "text",          // "text" | "url"
  "content": "Your ad copy...", // required when inputType is "text"
  "url": "https://...",         // required when inputType is "url"
  "platforms": ["meta", "google", "taboola", "tiktok"],
  "stream": true                // optional, enables SSE streaming
}

// Response (non-streaming)
{
  "id": "uuid",
  "riskScore": 75,
  "violations": [
    {
      "text": "guaranteed earnings",
      "reason": "Financial promise without evidence: Meta policy prohibits guaranteed income claims.",
      "level": "Red"
    }
  ],
  "positiveAspects": [],
  "variants": [
    {
      "text": "Safe rewritten copy...",
      "complianceScore": 95,
      "hookPreservation": 88
    }
  ]
}

// Streaming events (when stream: true)
// event: progress  data: {"stage":"scraping","message":"Fetching landing page..."}
// event: progress  data: {"stage":"analyzing","message":"Analyzing against platform policies..."}
// event: progress  data: {"stage":"optimizing","message":"Generating safe variants..."}
// event: result    data: {"id":"...","riskScore":75,"violations":[...],"variants":[...]}
// event: done      data: {}
```

### POST /api/scrape

Preview scraped content from a URL.

```json
// Request
{ "url": "https://example.com/landing" }

// Response
{
  "scraped": "PAGE TITLE: ...",
  "metadata": {
    "title": "...",
    "hasPrivacyPolicy": true,
    "hasBaitAndSwitch": false
  }
}
```

### POST /api/seed

Trigger policy embedding seeding. Requires `SEED_API_KEY` env var (passed as `Authorization: Bearer <key>`).

---

## Supported Platforms

- **Meta Ads** (Facebook / Instagram): 8 categories, ~40 specific rules
- **Google Ads**: 9 categories, ~40 specific rules
- **Taboola**: 7 categories, ~30 specific rules (includes notes on Outbrain-equivalent native ad disclosures)
- **TikTok Ads**: 8 categories, ~35 specific rules

Each policy file is sourced from the platform's official ad policy page and includes a `source` URL plus a "last reviewed" date.

**Roadmap:** Outbrain, X Ads, and LinkedIn are next on the list. The policy database is modular. Adding a new network is one new file in `src/lib/policies/` plus a one-line addition to `POLICY_MAP` in `src/lib/agents/critic.ts`.

---

## License

[GNU AGPL-3.0](./LICENSE) — copyleft, network-use disclosure required.
