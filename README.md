<p align="center">
  <img src="./public/logo.png" alt="tadan" width="96" />
</p>

# tadan: AI-first ad compliance for media buyers

> **Live demo:** [tadan.erencakar.com](https://tadan.erencakar.com). Paste an ad or drop a URL, get a risk score + violations + safe rewrites in ~5 seconds.

---

## Built for the It's Today Media $5K Build Challenge

The contest brief asked three things. Here are the answers.

### 1. What does this tool do?

**tadan** scans ad copy and landing pages against the actual advertising policies of Meta, Google, TikTok, and Taboola, then gives the buyer three things:

1. **A 0–100 risk score** with a traffic-light breakdown of *why* it scored that way.
2. **Specific, citable violations**: the exact phrase in the ad, the policy rule it breaks, and the severity (Red = account-ban risk, Yellow = ad-disapproval risk).
3. **Three compliant rewrites** of the original ad, each using a different copywriting angle (curiosity / empowerment / social proof), with the marketing hook preserved.

It accepts two input modes:

- **Text mode**: paste raw ad copy.
- **URL mode**: point it at a landing page. tadan scrapes the page, runs RAG over the policy database, and reports the issues with the page itself (bait-and-switch signals, missing privacy policy, misleading UI).

The full pipeline runs in ~4–6 seconds end-to-end on a 4-platform scan, with SSE streaming so the UI can show each stage as it completes.

### 2. Why did you build THIS one?

I built this because I kept watching the same scenario play out, and there is no good tool for it.

A media buyer spends an afternoon crafting a 12-variant creative test for a financial offer. Three of the variants use language patterns that have been red-flagged on every platform for years: *"guaranteed $500/day"*, *"Are you struggling with debt?"*, *"limited spots remaining"*. The buyer's account gets flagged within 48 hours, sometimes within 6. They lose the ad account, the pixel data, the lookalike audiences built on top of it, and the offer flow that was driving 6× ROAS last week.

The existing solutions all miss the actual pain:

- **Meta's / Google's official policy docs** are 200-page PDFs that don't match how a buyer reads a hook.
- **Generic "AI copywriting" tools** rewrite the ad into something safe, but kill the hook. Compliance teams reject it, performance teams ignore it.
- **Policy compliance SaaS** (the few that exist) charge $500+/mo and are designed for legal teams, not for a media buyer running 30 creatives a day who needs an answer in 10 seconds.

The pain I wanted to fix is specifically: **"I just wrote this ad, and I have 30 seconds to know if it's going to get me banned before I push it live."** Not "let me read 200 pages of Meta policy." Not "let me wait 24 hours for the legal team to get back to me." Just *give me the call, with reasons, right now.*

The other thing I wanted: the rewrites shouldn't be neutered. Most compliance tools produce output that reads like a CYA memo. A real media buyer will throw that away and run the original. So tadan explicitly uses 8 distinct copywriting techniques (curiosity hooks, authority positioning, social proof, empowerment framing, etc.) and asks the optimizer to preserve the hook while changing the language patterns that trip the policy. The output is something a buyer will *actually use*, not something they have to ignore.

### 3. What would you build next if this were your full-time job?

In order of how much pain they remove and how fast I could ship them:

**A. Creative iteration engine**: Today tadan scans *one* ad. The actual buyer workflow is: write 5 variants, scan all 5, find the 2 with the best hook-preservation / compliance trade-off, iterate. I would build a batch mode that scans an entire creative batch, ranks them, and suggests merges: "these two variants share 80% of the same hook. Here's a single variant that combines the best of both while staying compliant."

**B. Account-level pre-flight check**: Before pushing a campaign live, tadan would scan the *entire* campaign (all creatives, all landing pages, all targeting parameters) and produce a single risk report. Right now we're at the ad level. The natural next unit is the campaign.

**C. Live platform integration**: Connect to Meta Marketing API and Google Ads API. After a tadan scan, push the compliant variants directly into the ad account as drafts. This closes the loop: media buyer writes, tadan scores and rewrites, tadan pushes the safe version into the account ready for review. The buyer never has to leave the tool to act on the result.

**D. Auto-monitor**: The buyer's job doesn't end at "this ad passed review." Platforms change policies. A phrase that was Yellow last month can become Red this month. A watchdog that re-scans the buyer's active ads on a schedule and alerts when something needs attention would save accounts that get retroactively banned.

**E. A policy database that's not a static file**: Right now the policy rules are in `src/lib/policies/*.ts`, versioned with the code. I would back this with a real database table that can be updated without redeploying, sourced from a feed of official policy changes, and versioned per platform with a "last changed" date visible in the UI.

Items A and B are 1–2 weeks of work each. C is a 1-month build. D is a 2-week build on top of C. E is 1 week of work plus ongoing maintenance.

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

### Engineering decisions worth calling out

- **SSRF guard on the scraper**: user-controlled URLs are a server-side request forgery vector. The scraper resolves DNS, blocks private IPs (loopback, RFC 1918, link-local, IPv6 ULAs, IPv4-mapped IPv6), and enforces a 5-reply redirect cap. Tested.
- **Parallel scrape + RAG**: for URL input, the page scrape and the embedding API call run in parallel. The embedding is ready before the scrape finishes. Wall-clock time for URL mode is the same as for text mode.
- **Skip the optimizer when there's nothing to fix**: if the critic returns zero violations, the optimizer is not called. No LLM cost for safe ads.
- **Rate limit + per-IP / per-user keys**: anonymous users get a tighter bucket, authenticated users get a more generous one. Both keyed on a hashable identifier, not the raw IP, to avoid leaking client identity into logs.
- **Auto-init Postgres + pgvector**: the dev server's `predev` hook starts the Docker container, waits for it to accept connections, and applies every migration in order. The first analyze call seeds the policy embeddings. There is no manual setup.
- **Modular policies**: each platform's rules live in their own file. Adding a new platform is one new file plus a one-line addition to the `POLICY_MAP` in `critic.ts`.

---

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
│   │   │   ├── taboola.ts     # Taboola / Outbrain policies
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

Trigger policy embedding seeding. Optional `SEED_API_KEY` env var guards the endpoint.

---

## Supported Platforms

- **Meta Ads** (Facebook / Instagram): 8 categories, ~40 specific rules
- **Google Ads**: 9 categories, ~40 specific rules
- **Taboola** / Outbrain: 7 categories, ~30 specific rules
- **TikTok Ads**: 8 categories, ~35 specific rules

Each policy file is sourced from the platform's official ad policy page and includes a `source` URL plus a "last reviewed" date.

---

## License

[MIT](./LICENSE)
