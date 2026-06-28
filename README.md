# tadan — AI-First Ad Compliance Platform

Scan ad copy and landing pages against Meta Ads, Google Ads, and Taboola policies. Get instant risk scores, policy violations, and safe alternatives that preserve your marketing hook — before your ad account gets banned.

## Architecture

```
User Input (ad copy or URL)
    │
    ▼
/api/analyze
    ├── URL? → scraper.ts (cheerio DOM parse)
    ├── Critic Agent → { risk_score, violations[] }
    ├── Optimizer Agent → 3 safe variants
    └── DB save (PostgreSQL + Drizzle)
    │
    ▼
Dashboard → risk gauge, violations table, variant cards
```

### Dual-Agent System

- **Critic Agent** — Scans content against live platform policy documents via LLM. Returns structured violations and a 0-100 risk score.
- **Optimizer Agent** — Takes violations and original copy, generates 3 compliant variants using psychological angles that bypass algorithm detection without killing the marketing hook.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Package Manager | Bun |
| Language | TypeScript |
| UI | Tailwind CSS v4 + Shadcn UI (base-nova) |
| Auth | Better Auth (email/password) |
| Database | PostgreSQL 16 + pgvector (Docker) |
| ORM | Drizzle ORM |
| LLM | OpenRouter API |
| Scraper | Cheerio |
| Tests | Vitest + Testing Library + Playwright |

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url> tadan
cd tadan
bun install
```

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```env
DATABASE_URL=postgresql://tadan:tadan_dev@localhost:5432/tadan
OPENROUTER_API_KEY=sk-or-your-key
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
```

### 4. Run database migrations

```bash
bun run db:generate
bun run db:migrate
```

### 5. Start the dev server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start dev server with Turbopack |
| `bun run build` | Production build |
| `bun start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Apply migrations to database |
| `bun run db:studio` | Open Drizzle Studio (DB GUI) |
| `bun run test` | Run unit tests (Vitest) |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:e2e` | Run Playwright e2e tests |

## Project Structure

```
tadan/
├── docker-compose.yml         # PostgreSQL 16 + pgvector
├── drizzle.config.ts          # Drizzle Kit config
├── vite.config.ts             # Vitest config
├── playwright.config.ts       # Playwright e2e config
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with NavBar
│   │   ├── page.tsx           # Dashboard / analyzer
│   │   ├── globals.css        # Tailwind + Shadcn theme
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── history/page.tsx
│   │   └── api/
│   │       ├── analyze/route.ts   # POST — full pipeline
│   │       ├── scrape/route.ts    # POST — URL preview
│   │       └── auth/[...all]/route.ts
│   ├── components/
│   │   ├── ui/                # Shadcn components
│   │   ├── nav-bar.tsx
│   │   ├── ad-input.tsx       # Platform selector + input
│   │   ├── risk-gauge.tsx     # Circular score indicator
│   │   ├── violations-table.tsx
│   │   └── variant-card.tsx
│   ├── lib/
│   │   ├── auth.ts            # Better Auth server config
│   │   ├── auth-client.ts     # Better Auth client
│   │   ├── db/
│   │   │   ├── index.ts       # Drizzle + pg connection
│   │   │   └── schema.ts      # Table definitions
│   │   ├── agents/
│   │   │   ├── critic.ts      # Compliance analysis agent
│   │   │   └── optimizer.ts   # Safe variant generator
│   │   ├── policies/
│   │   │   ├── meta.ts        # Meta Ad policies
│   │   │   ├── google.ts      # Google Ads policies
│   │   │   └── taboola.ts     # Taboola policies
│   │   ├── openrouter.ts      # OpenRouter API client
│   │   ├── scraper.ts         # Landing page scraper
│   │   └── utils.ts           # cn() helper
│   └── types/
│       └── index.ts
├── tests/
│   ├── unit/
│   │   ├── setup.ts
│   │   └── utils.test.ts
│   └── e2e/
│       └── home.spec.ts
└── drizzle/
    └── migrations/
```

## API

### POST /api/analyze

Analyze ad copy or landing page for policy compliance.

```json
// Request
{
  "inputType": "text",          // "text" | "url"
  "content": "Your ad copy...", // required when inputType is "text"
  "url": "https://...",         // required when inputType is "url"
  "platforms": ["meta", "google", "taboola"]
}

// Response
{
  "id": "uuid",
  "riskScore": 75,
  "violations": [
    {
      "text": "guaranteed earnings",
      "reason": "Financial promise without evidence",
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
