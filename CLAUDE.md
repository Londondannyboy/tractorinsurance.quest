# Puppy Insurance Quest

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

Single-page conversational AI puppy insurance advisor. CopilotKit Next.js runtime with Gemini adapter. Dog breed and policy data from Neon PostgreSQL.

**Pattern**: CopilotKit runtime inside Next.js API route + Pydantic AI agent on Railway for voice.

---

## Key Files

| Purpose | Location |
|---------|----------|
| Main page | `src/app/page.tsx` |
| CopilotKit provider | `src/components/providers.tsx` |
| CopilotKit runtime | `src/app/api/copilotkit/route.ts` |
| Breeds API | `src/app/api/breeds/route.ts` |
| Quote API | `src/app/api/quote/route.ts` |
| Database queries (frontend) | `src/lib/puppy-db.ts` |
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
| `show_breed_info` | Display breed information when user mentions a breed |
| `confirm_dog_details` | Confirm and save dog's name, breed, age |
| `generate_quote` | Generate insurance quote for selected plan |
| `show_plans` | Display all available insurance plans |

---

## Database (Neon)

| Table | Purpose |
|-------|---------|
| dog_breeds | 18 breeds with risk factors, health issues, premium multipliers |
| user_dogs | User's registered dogs |
| insurance_policies | Active policies |
| policy_quotes | Quote history |
| claims | Insurance claims |
| user_profiles | User account data |

---

## Neon Auth

Authentication powered by Neon Auth (`@neondatabase/auth`).

**Routes**:
- `/auth/sign-in` - Sign in page
- `/auth/sign-up` - Sign up page
- `/account/settings` - Account settings (protected)

---

## Insurance Plans

| Plan | Monthly | Annual Limit | Deductible | Key Features |
|------|---------|--------------|------------|--------------|
| Basic | $15 | $5,000 | $250 | Accident only, emergency care |
| Standard | $35 | $10,000 | $200 | + Illness, prescriptions |
| Premium | $55 | $20,000 | $100 | + Routine care, dental, hereditary |
| Comprehensive | $85 | $50,000 | $0 | Everything, alternative therapies |

---

## Breed Risk Categories

| Category | Premium Multiplier | Breeds |
|----------|-------------------|--------|
| Low | 0.75-0.9x | Chihuahua, Beagle, Poodle, Yorkshire Terrier, Mixed Breed |
| Medium | 1.0-1.2x | Labrador, German Shepherd, Golden Retriever, Boxer |
| High | 1.35-1.6x | French Bulldog, Bulldog, Cavalier King Charles, Great Dane |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind |
| AI Chat | CopilotKit (Next.js runtime + Gemini adapter) |
| Voice | Hume EVI (@humeai/voice-react) |
| Agent | Pydantic AI (FastAPI on Railway) |
| Database | Neon PostgreSQL (@neondatabase/serverless) |
| Auth | Neon Auth (@neondatabase/auth) |

---

## Environment Variables

```bash
# Database (puppyinsurance.quest)
DATABASE_URL=postgresql://neondb_owner:...@ep-xxx.neon.tech/neondb

# CopilotKit (Gemini)
GOOGLE_API_KEY=...

# Hume EVI
HUME_API_KEY=...
HUME_SECRET_KEY=...
NEXT_PUBLIC_HUME_CONFIG_ID=...

# Agent URL (Railway - set after deployment)
NEXT_PUBLIC_AGENT_URL=https://your-agent.up.railway.app

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
2. Connect GitHub repo: `Londondannyboy/puppyinsurance.quest`
3. Set root directory to `agent/`
4. Add environment variables:
   - `DATABASE_URL` (from Neon)
   - `GOOGLE_API_KEY` (for Gemini)
   - `ZEP_API_KEY` (optional)
5. Deploy will auto-detect `railway.toml`
6. Note the URL (e.g., `https://puppyinsurance-agent-xxx.up.railway.app`)
7. Update `NEXT_PUBLIC_AGENT_URL` in frontend `.env.local`

### CLM Endpoint for Hume

After Railway deployment, your Hume EVI CLM endpoint is:
```
https://your-railway-url.up.railway.app/chat/completions
```

Configure this in Hume Dashboard -> EVI Config -> Custom Language Model.

---

## Session Log

### Jan 16, 2026
- Initial puppy insurance project setup
- Created puppy insurance database schema (18 breeds)
- Built frontend with CopilotKit sidebar
- Created Pydantic AI agent "Buddy"
- Implemented breed lookup, quote generation, plan comparison
- Voice integration via Hume EVI
- Ready for Railway deployment

---

## Test Commands

Try these in the chat:
- "I have a Labrador" -> shows breed info
- "My dog Max is a 3 year old Golden Retriever" -> saves dog details
- "Show me insurance plans" -> displays plan comparison
- "Get me a quote for the premium plan" -> generates personalized quote
