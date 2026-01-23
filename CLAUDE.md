# Tractor Insurance Quest

> **Cole Medin Methodology**: PRD-first, modular rules, command-ify, context reset, system evolution.

## Quick Start

```bash
# Frontend (port 4000 to avoid conflicts)
npm run dev -- -p 4000              # -> localhost:4000

# Agent (Pydantic AI on Railway)
cd agent && source .venv/bin/activate
uvicorn src.agent:app --reload --port 8000
```

## Current Architecture

Single-page conversational AI tractor insurance advisor. CopilotKit Next.js runtime with Gemini adapter. Tractor type and policy data from Neon PostgreSQL. Page content stored as MDX in Neon DB `page_content` table.

**Pattern**: CopilotKit runtime inside Next.js API route + Pydantic AI agent "Tracker" on Railway for voice.

---

## Key Files

| Purpose | Location |
|---------|----------|
| Main page | `src/app/page.tsx` |
| CopilotKit provider | `src/components/providers.tsx` |
| CopilotKit runtime | `src/app/api/copilotkit/route.ts` |
| Tractor types API | `src/app/api/tractor-types/route.ts` |
| Quote API | `src/app/api/quote/route.ts` |
| Content API (MDX from DB) | `src/app/api/content/route.ts` |
| Database queries (frontend) | `src/lib/tractor-db.ts` |
| Page content renderer | `src/components/PageContent.tsx` |
| Hume voice widget | `src/components/HumeWidget.tsx` |
| Hume token API | `src/app/api/hume-token/route.ts` |
| Neon Auth client | `src/lib/auth/client.ts` |
| Neon Auth server | `src/lib/auth/server.ts` |
| **Pydantic AI Agent (Railway)** | |
| Agent entry point | `agent/src/agent.py` |
| Database queries (agent) | `agent/src/database.py` |
| Railway config | `agent/railway.toml` |
| CLM endpoint (for Hume) | `{RAILWAY_URL}/chat/completions` |

---

## CopilotKit Actions (useCopilotAction)

| Action | Purpose |
|--------|---------|
| `show_tractor_info` | Display tractor type information |
| `confirm_tractor_details` | Confirm and save tractor name, type, age |
| `generate_quote` | Generate insurance quote for selected plan |
| `show_plans` | Display all available insurance plans |

---

## Database (Neon)

Project: `delicate-shadow-96964693`
Connection: `postgresql://neondb_owner:npg_UKZmNVDO74Rw@ep-shy-flower-abtsg4ue-pooler.eu-west-2.aws.neon.tech/neondb`

| Table (legacy name) | Code name | Purpose |
|---------------------|-----------|---------|
| dog_breeds | tractor_types | Tractor types with risk factors, common issues, premium multipliers |
| user_dogs | user_tractors | User's registered tractors (columns: breed_id→type_id, breed_name→type_name) |
| insurance_policies | — | Active policies (column: dog_id→tractor_id) |
| policy_quotes | — | Quote history (column: dog_details→tractor_details) |
| page_content | — | MDX content for sub-pages (slug, title, content, meta_description) |

> **Note:** DB tables/columns use legacy puppy-insurance names. Code uses SQL aliases to map to tractor terminology.

---

## Neon Auth

Authentication powered by Neon Auth (`@neondatabase/auth`).

**Routes**:
- `/auth/sign-in` - Sign in page
- `/auth/sign-up` - Sign up page
- `/account/settings` - Account settings (protected)

---

## Insurance Plans (GBP)

| Plan | Monthly | Annual Limit | Excess | Key Features |
|------|---------|--------------|--------|--------------|
| Basic | £25 | £10,000 | £500 | Accidental damage, breakdown assist |
| Standard | £75 | £25,000 | £350 | + Mechanical, parts, liability |
| Premium | £150 | £50,000 | £200 | + Maintenance, tyres, modifications |
| Comprehensive | £250 | £100,000 | £0 | Everything, theft, business interruption |

---

## Tractor Type Risk Categories

| Category | Premium Multiplier | Types |
|----------|-------------------|-------|
| Low | 0.75-0.9x | Garden Tractor, Ride-on Mower, Mini Tractor |
| Medium | 1.0-1.2x | Farm Tractor, Compact Tractor, Utility Tractor |
| High | 1.35-1.6x | Vintage Tractor |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind |
| AI Chat | CopilotKit (Next.js runtime + Gemini adapter) |
| Voice | Hume EVI (@humeai/voice-react) |
| Agent | Pydantic AI (FastAPI on Railway) |
| Database | Neon PostgreSQL (@neondatabase/serverless) |
| Auth | Neon Auth (@neondatabase/auth) |
| Content | MDX stored in Neon DB, rendered via PageContent component |

---

## Environment Variables

```bash
# Database (tractorinsurance.quest)
DATABASE_URL=postgresql://neondb_owner:...@ep-xxx.neon.tech/neondb

# CopilotKit (Gemini)
GOOGLE_API_KEY=...

# Hume EVI
HUME_API_KEY=...
HUME_SECRET_KEY=...
NEXT_PUBLIC_HUME_CONFIG_ID=...

# Agent URL (Railway)
NEXT_PUBLIC_AGENT_URL=https://tractorinsurance-agent-production.up.railway.app

# Neon Auth
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.region.aws.neon.tech/neondb/auth

# Zep Memory (optional)
ZEP_API_KEY=...
```

---

## Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/prime` | Load project context | Start of session |
| `/plan {feature}` | Create implementation plan | Before coding features |
| `/execute {plan}` | Build from plan (fresh context) | After plan approval |
| `/evolve` | Improve system after bugs | After fixing issues |

---

## Railway Deployment (Agent)

1. Create new Railway project
2. Connect GitHub repo: `Londondannyboy/tractorinsurance.quest`
3. Set root directory to `agent/`
4. Add environment variables:
   - `DATABASE_URL` (from Neon)
   - `GOOGLE_API_KEY` (for Gemini)
   - `ZEP_API_KEY` (optional)
5. Deploy will auto-detect `railway.toml`
6. Note the URL (e.g., `https://tractorinsurance-agent-production.up.railway.app`)
7. Update `NEXT_PUBLIC_AGENT_URL` in frontend `.env.local`

### CLM Endpoint for Hume

After Railway deployment, your Hume EVI CLM endpoint is:
```
https://your-railway-url.up.railway.app/chat/completions
```

Configure this in Hume Dashboard -> EVI Config -> Custom Language Model.

---

## Sub-pages (DB-driven MDX)

All sub-pages fetch content from `page_content` table via `/api/content?slug=X`:

| Route | Slug |
|-------|------|
| `/tractor-insurance` | `tractor-insurance` |
| `/farm-tractor` | `farm-tractor` |
| `/vintage-tractor` | `vintage-tractor` |
| `/compact-tractor` | `compact-tractor` |
| `/utility-tractor` | `utility-tractor` |
| `/garden-tractor` | `garden-tractor` |
| `/ride-on-mower` | `ride-on-mower` |
| `/mini-tractor` | `mini-tractor` |
| `/best-tractor-insurance` | `best-tractor-insurance` |
| `/cheap-tractor-insurance` | `cheap-tractor-insurance` |
| `/tractor-insurance-cost` | `tractor-insurance-cost` |
| `/compare-tractor-insurance` | `compare-tractor-insurance` |

---

## Git

Repository: `https://github.com/Londondannyboy/tractorinsurance.quest`
Domain: `tractorinsurance.quest`

---

## Session Log

### Jan 23, 2026
- Complete rebranding from Puppy Insurance to Tractor Insurance Quest
- Rewrote all frontend pages, components, APIs
- Created Neon DB schema with tractor types
- Populated page_content table with MDX for all sub-pages
- Rewrote Pydantic AI agent "Tracker" (agent.py + database.py)
- Updated CLAUDE.md and all config files
