# tadan - AI-First Ad Compliance Platform

Scan ad copy and landing pages against Meta Ads, Google Ads, and Taboola policies. Get instant risk scores, policy violations, and safe alternatives that preserve your marketing hook, before your ad account gets banned.

## Architecture

```
User Input (ad copy or URL)
    │
    ▼
/api/analyze
    ├── stream: true → SSE (progress events)
    ├── URL? → scraper.ts (cheerio DOM parse)
    ├── RAG → pgvector similarity search on platform_policies
    ├── Critic Agent → { risk_score, violations[] }
    ├── Optimizer Agent → 3 safe variants
    └── DB save (PostgreSQL + Drizzle)
    │
    ▼
Dashboard → risk gauge, violations table, variant cards
```

### Dual-Agent System

- **Critic Agent**: Scans content against platform policies via LLM. Optionally uses RAG (pgvector similarity search) to retrieve only the most relevant policy rules for lower token cost and higher accuracy. Returns structured violations and a 0-100 risk score.
- **Optimizer Agent**: Takes violations and original copy, generates 3 compliant variants using 8 distinct copywriting techniques (curiosity hooks, empowerment framing, social proof, etc.) without killing the marketing hook.

### RAG Pipeline

Policy rules are embedded via `openai/text-embedding-3-small` (1536-dim) and stored in pgvector. At scan time, the user's ad copy is embedded and the top-8 most similar policy rules are retrieved and injected into the Critic Agent's system prompt.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Package Manager | Bun |
| Language | TypeScript |
| UI | Tailwind CSS v4 + Shadcn UI (base-nova, light-only) |
| Auth | Better Auth (email/password) |
| Database | PostgreSQL 16 + pgvector (Docker, auto-init) |
| ORM | Drizzle ORM |
| LLM Chat | OpenRouter API (gemini-2.5-flash-preview) |
| Embeddings | OpenRouter API (text-embedding-3-small, 1536d) |
| Scraper | Cheerio |
| Tests | Vitest + Testing Library + Playwright |

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url> tadan
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

That's it. The `predev` hook automatically:
- Starts the PostgreSQL container (`docker compose up -d`) if not running
- Waits for Postgres to be ready
- Runs the `docker/initdb/00-setup.sh` script on first boot: creates the `vector` extension and applies every SQL file in `drizzle/`
- Generates migrations with `drizzle-kit generate` if the `drizzle/` folder is empty

Open [http://localhost:3000](http://localhost:3000), sign up, paste ad copy, analyze.

Policy embeddings are auto-seeded on the first analysis request (no manual step needed).

### When you change the schema

```bash
bun run db:generate   # regenerate SQL files in drizzle/
bun run db:reset      # drop the volume, re-init container, re-apply migrations
```

`db:reset` is only needed when schema changes; normal `bun dev` runs use the existing volume.

## How the auto-init works

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
│   │   ├── page.tsx           # Dashboard / analyzer (SSE streaming)
│   │   ├── globals.css        # Tailwind + Shadcn theme
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── history/page.tsx
│   │   └── api/
│   │       ├── analyze/route.ts   # POST: full pipeline + SSE stream
│   │       ├── scrape/route.ts    # POST: URL preview
│   │       ├── seed/route.ts      # POST: seed policy embeddings
│   │       └── auth/[...all]/route.ts
│   ├── components/
│   │   ├── ui/                # Shadcn components
│   │   ├── nav-bar.tsx
│   │   ├── ad-input.tsx       # Platform selector + input (text/URL)
│   │   ├── risk-gauge.tsx     # Circular score indicator (0-100)
│   │   ├── violations-table.tsx
│   │   └── variant-card.tsx   # Copy-to-clipboard variant card
│   ├── lib/
│   │   ├── auth.ts            # Better Auth server config
│   │   ├── auth-client.ts     # Better Auth client
│   │   ├── db/
│   │   │   ├── index.ts       # Drizzle + pg connection
│   │   │   └── schema.ts      # Table definitions (7 tables)
│   │   ├── agents/
│   │   │   ├── critic.ts      # Compliance analysis (RAG-integrated)
│   │   │   └── optimizer.ts   # Safe variant generator (8 techniques)
│   │   ├── policies/
│   │   │   ├── meta.ts        # Meta Ad policies
│   │   │   ├── google.ts      # Google Ads policies
│   │   │   └── taboola.ts     # Taboola / Outbrain policies
│   │   ├── openrouter.ts      # OpenRouter API (chat + embeddings)
│   │   ├── rag.ts             # pgvector similarity search + seed
│   │   ├── scraper.ts         # Cheerio landing page scraper
│   │   ├── errors.ts          # AppError, LLMError, withRetry()
│   │   └── utils.ts           # cn() helper
│   └── types/
│       └── index.ts
├── tests/
│   ├── unit/
│   │   ├── setup.ts
│   │   ├── utils.test.ts      # cn() + utility tests
│   │   └── agents.test.ts     # JSON extraction + retry logic
│   └── e2e/
│       └── home.spec.ts
└── drizzle/
    └── *.sql                  # SQL migration files (committed; consumed by init script)
```

## API

### POST /api/analyze

Analyze ad copy or landing page for policy compliance. Supports streaming via SSE.

```json
// Request
{
  "inputType": "text",          // "text" | "url"
  "content": "Your ad copy...", // required when inputType is "text"
  "url": "https://...",         // required when inputType is "url"
  "platforms": ["meta", "google", "taboola"],
  "stream": true                // optional, enables SSE streaming
}

// Response (non-streaming)
{
  "id": "uuid",
  "riskScore": 75,
  "violations": [
    {
      "text": "guaranteed earnings",
      "reason": "Financial promise without evidence: Google Evrak dışı financial vaat yasağı",
      "level": "Red"
    }
  ],
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

## Supported Platforms

- **Meta Ads** (Facebook/Instagram)
- **Google Ads**
- **Taboola** / Outbrain

## License

MIT
