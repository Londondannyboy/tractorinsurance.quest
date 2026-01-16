# Relocation Quest V3

> **Cole Medin Methodology**: PRD-first, modular rules, command-ify, context reset, system evolution.

## Quick Start

```bash
# Frontend (port 4000 to avoid conflicts)
npm run dev -- -p 4000              # → localhost:4000
```

## Current Architecture

Single-page conversational AI relocation advisor. CopilotKit Next.js runtime with Gemini adapter. All destination data from Neon PostgreSQL.

**Pattern**: GTM-quest-v3 style - CopilotKit runtime inside Next.js API route, not separate Python backend.

---

## Key Files

| Purpose | Location |
|---------|----------|
| Main page | `src/app/page.tsx` |
| CopilotKit provider | `src/components/providers.tsx` |
| CopilotKit runtime | `src/app/api/copilotkit/route.ts` |
| Destinations API | `src/app/api/destinations/route.ts` |
| Database queries | `src/lib/db.ts` |
| MDX components | `src/components/mdx/` |
| Dynamic view renderer | `src/components/DynamicView.tsx` |
| Hume voice widget | `src/components/HumeWidget.tsx` |
| Hume token API | `src/app/api/hume-token/route.ts` |
| Neon Auth client | `src/lib/auth/client.ts` |
| Neon Auth server | `src/lib/auth/server.ts` |
| Auth API handler | `src/app/api/auth/[...path]/route.ts` |
| Auth pages | `src/app/auth/[path]/page.tsx` |
| Account pages | `src/app/account/[path]/page.tsx` |
| Auth middleware | `middleware.ts` |
| **Pydantic AI Agent (Railway)** | |
| Agent entry point | `agent/src/agent.py` |
| Database queries | `agent/src/database.py` |
| Destination Expert sub-agent | `agent/src/destination_expert.py` |
| Railway config | `agent/railway.toml` |
| Railway URL | `https://relocation-quest-v3-agent-production.up.railway.app` |
| CLM endpoint (for Hume) | `https://relocation-quest-v3-agent-production.up.railway.app/chat/completions` |

---

## CopilotKit Actions (useCopilotAction)

| Action | Purpose |
|--------|---------|
| `show_destination` | Display single destination card from Neon |
| `save_preferences` | Save user budget/climate/purpose |
| `generate_custom_view` | AI-composed MDX layouts (comparison, cost breakdown, pros/cons) |

---

## MDX Components (AI-composable)

| Component | Purpose |
|-----------|---------|
| `ComparisonTable` | Side-by-side country comparison with flags |
| `CostChart` | Visual cost breakdown with animated bars |
| `ProsCons` | Pros and cons two-column layout |
| `InfoCard` | Info cards with variants (default, highlight, warning, success) |

---

## Database (Neon)

| Table | Records | Purpose |
|-------|---------|---------|
| destinations | 17 | Full structured data (visa, cost, education, company, property, tax, residency) |
| articles | 210 | Relocation guides |
| jobs | 217 | Job listings |
| topic_images | 22 | Background images |
| **topic_clusters** | - | Content organization into SEO clusters |
| **page_contexts** | - | Page context for voice agent awareness |

---

## Neon Auth

Authentication powered by Neon Auth (`@neondatabase/auth`).

**Docs**:
- https://neon.com/docs/auth/quick-start/nextjs
- https://neon.com/docs/auth/quick-start/nextjs-api-only

**Setup**:
1. Enable Auth in Neon Console → Project → Branch → Auth
2. Copy `NEON_AUTH_BASE_URL` from Configuration
3. Add to `.env.local`

**Routes**:
- `/auth/sign-in` - Sign in page
- `/auth/sign-up` - Sign up page
- `/account/settings` - Account settings (protected)

**Components**:
- `NeonAuthUIProvider` - Wraps app with auth context
- `UserButton` - User avatar/menu component
- `AuthView` - Auth form component
- `AccountView` - Account settings component

---

## Implementation Status

- [x] Next.js 15 project setup
- [x] CopilotKit Next.js runtime (Gemini adapter)
- [x] useCopilotAction for show_destination, save_preferences
- [x] Neon database connection (17 destinations)
- [x] MDX component library
- [x] generate_custom_view action for dynamic compositions
- [x] Visual demo of MDX capability
- [x] Neon Auth (@neondatabase/auth)
- [x] Hume voice widget
- [x] Deploy to Vercel - https://relocation-quest-v3.vercel.app
- [x] Pydantic AI agent deployed to Railway - https://relocation-quest-v3-agent-production.up.railway.app
- [x] Chat uses built-in CopilotKit Next.js runtime (AG-UI compatibility issue with pydantic-ai)
- [x] Voice uses Railway CLM endpoint (/chat/completions)

---

## Test Commands

Try these in the chat:
- "Tell me about Portugal" → shows DestinationCard
- "Compare Portugal vs Spain" → shows ComparisonTable
- "Show me cost breakdown for Lisbon" → shows CostChart
- "Pros and cons of moving to Thailand" → shows ProsCons

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind |
| AI Chat | CopilotKit (Next.js runtime + Gemini adapter) |
| Database | Neon PostgreSQL (@neondatabase/serverless) |
| Animation | Framer Motion |
| Voice | Hume EVI (@humeai/voice-react) |
| Auth | Neon Auth (@neondatabase/auth) |

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:...@ep-xxx.neon.tech/neondb

# CopilotKit (Gemini)
GOOGLE_API_KEY=...

# Hume EVI
HUME_API_KEY=...
HUME_SECRET_KEY=...
NEXT_PUBLIC_HUME_CONFIG_ID=...

# Neon Auth (from Neon Console → Project → Branch → Auth → Configuration)
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
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

## Phase 6: Content Migration

**Goal**: Port all content from legacy project with voice agent page awareness.

### New Components

| Component | Path | Purpose |
|-----------|------|---------|
| `PageContextProvider` | `src/components/voice/PageContextProvider.tsx` | Provides page context to voice agent |
| `HeroBanner` | `src/components/layout/HeroBanner.tsx` | Reusable hero with 4 variants |

### New API Routes

| Route | Purpose |
|-------|---------|
| `GET /api/page-context?slug=...` | Fetch page context by slug |
| `POST /api/page-context` | List pages by cluster or type |

### Scripts

| Script | Usage |
|--------|-------|
| `node scripts/create-mdx-tables.js` | Create database tables |
| `node scripts/populate-destination.js cyprus` | Populate country from data file |

### Data Files

Country content in `scripts/data/<country>.js`. Cyprus is the template.

---

## Important Directories

| Directory | Purpose |
|-----------|---------|
| `/Users/dankeegan/relocation.quest` | **LIVE working directory** |
| `/Users/dankeegan/legacy-ignore-relocation.quest` | Legacy V1 content reference |
| `/Users/dankeegan/believed-legacy-relocation.quest` | Old V2 (ignore) |

---

## Phase 7: Dashboard & User Profiles

**Goal**: Personalized dashboard with onboarding wizard based on user persona.

### New Database Tables

| Table | Purpose |
|-------|---------|
| `user_profiles` | User relocation preferences, persona, priorities |
| `user_conversations` | AI conversation history for memory |
| `user_saved_items` | Saved destinations/guides |

### User Personas

| Persona | Description |
|---------|-------------|
| `company` | Corporate relocation |
| `hnw` | High net worth individual |
| `digital_nomad` | Remote worker |
| `lifestyle` | Quality of life seeker |
| `family` | Family with children |
| `retiree` | Retirement relocation |
| `medical` | Medical/healthcare relocation |

### New Routes

| Route | Purpose |
|-------|---------|
| `/dashboard` | User dashboard with onboarding |
| `/api/user-profile` | GET/POST user profile data |

### New Components

| Component | Path | Purpose |
|-----------|------|---------|
| `DashboardClient` | `src/app/dashboard/DashboardClient.tsx` | Onboarding wizard + dashboard |
| `VoiceChatSync` | `src/components/voice/VoiceChatSync.tsx` | Syncs Hume voice to CopilotKit chat |
| `SyncedVoiceButton` | `src/components/voice/VoiceChatSync.tsx` | Voice button with chat sync |

---

## Known Issues / TODO

### Completed ✅
- [x] **No Unsplash API key** - Added `UNSPLASH_ACCESS_KEY` to .env.local
- [x] **CopilotKit sidebar needs interactive updates** - Added useRenderToolCall hooks for visualizations
- [x] **Agent doesn't know user name** - Added Zep memory + user context in instructions
- [x] **No Zep integration** - Created /api/zep/user route and useZepMemory hook
- [x] **Improve visualizations** - Added 4 visualization tools (fractional.quest pattern)
- [x] **Auth not working (Guest, auth=false)** - Fixed auth package imports to use `@neondatabase/auth` consistently
- [x] **HumeWidget hardcoded auth=false** - Now uses `authClient.useSession()` for real auth
- [x] **No Zep context in voice** - VoiceChatSync now fetches `/api/zep-context` before Hume connect
- [x] **Navigation missing Dashboard link** - Added global nav bar with logo, Destinations, Dashboard links
- [x] **Hero image not loading** - Fixed to start with fallback, added onError handler

### High Priority (Next Phase)
- [ ] **Pydantic AI agent not deployed** - Railway agent needs setup for this project
- [ ] **CopilotKit instructions pattern** - Pass full user context (name, persona, destinations) via instructions prop like fractional.quest
- [ ] **AI should ask persona on first visit** - Onboarding prompt in chat to classify user

### Medium Priority
- [ ] Port full legacy Cyprus content
- [ ] Add more destination fallback images
- [ ] Add more destinations to database (currently 17)
- [ ] Implement destination comparison tool
- [ ] Add saved destinations feature to dashboard

---

## Reference Projects

| Project | Pattern |
|---------|---------|
| `fractional.quest` | useRenderToolCall for sidebar visualizations |
| `lost.london-v2` | Zep memory integration, personalized instructions |

---

## Phase 8: Sidebar Visualizations & Zep Memory

**Goal**: Interactive sidebar that updates with charts when user chats + persistent memory.

### New Files

| File | Purpose |
|------|---------|
| `/api/zep/user` | Zep memory CRUD - users, threads, facts |
| `/hooks/useZepMemory.ts` | React hook for Zep memory state |

### useRenderToolCall Hooks (DestinationClient)

| Tool Name | Visualization |
|-----------|---------------|
| `show_cost_breakdown` | CostChart with animated bars |
| `show_quality_of_life` | QualityOfLifeRadar metrics |
| `show_comparison` | ComparisonTable side-by-side |
| `show_pros_cons` | ProsCons two-column layout |

### Personalized Instructions

CopilotSidebar now includes:
- User name from Zep memory
- Returning user detection
- User facts/preferences from graph
- Instructions to use visualization tools

---

## Session Log

### Jan 16, 2026
- Fixed directory confusion (V2 vs V3)
- Applied Phase 6 to correct V3 codebase
- Created page_contexts and topic_clusters tables
- Cyprus template populated as first example

### Jan 16, 2026 (Session 2)
- Redesigned destination pages: chat on RIGHT, voice bottom-left
- Added nav bar with white font (fixed visibility)
- Added dashboard with 6-step onboarding wizard
- Created user_profiles, user_conversations, user_saved_items tables
- Added VoiceChatSync for voice-chat integration
- Added static fallback images for Cyprus (no Unsplash key)
- Fixed navbar visibility (solid dark background)

### Jan 16, 2026 (Session 3)
- **Zep Integration**: Created /api/zep/user route with Zep Cloud SDK v3
- **Memory Hook**: Added useZepMemory hook for user context
- **Visualization Tools**: Added 4 useRenderToolCall hooks:
  - show_cost_breakdown → CostChart
  - show_quality_of_life → QualityOfLifeRadar
  - show_comparison → ComparisonTable
  - show_pros_cons → ProsCons
- **Personalized AI**: CopilotSidebar now passes user context to instructions
- **Pattern Reference**: Following fractional.quest + lost.london-v2 patterns

### Jan 16, 2026 (Session 4) - Auth & Voice Integration
- **Root Cause Found**: HumeWidget had `isAuthenticated = false` hardcoded (mock never replaced)
- **Auth Package Mismatch Fixed**: All imports now use `@neondatabase/auth` consistently:
  - `src/lib/auth/client.ts` - UI from `@neondatabase/auth/react/ui`
  - `src/lib/auth/server.ts` - `createAuthServer` from `@neondatabase/auth/next/server`
  - `src/app/api/auth/[...path]/route.ts` - `authApiHandler` from `@neondatabase/auth/next/server`
- **HumeWidget Fixed**: Now uses `authClient.useSession()` for real auth
- **Zep Context API**: Created `/api/zep-context` route (matches fractional.quest pattern)
- **VoiceChatSync Updated**: Fetches Zep context before Hume connect, includes in system prompt
- **Global Navigation**: Added nav bar with logo, Destinations link, Dashboard link (white font)
- **Hero Image Fix**: Starts with fallback immediately, onError handler for failed loads
- **Medical Persona Added**: 7th persona option in dashboard onboarding
- **Auth Redirect**: Changed from `/account/settings` to `/dashboard`

#### Key Pattern from fractional.quest (for reference)
```typescript
// Frontend builds instructions with ALL user context
const agentInstructions = user
  ? `CRITICAL USER CONTEXT:
- User Name: ${firstName || user.name}
- User ID: ${user.id}
- User Email: ${user.email}
- Location: ${profileItems.location || 'Not set'}
- Target Role: ${profileItems.role || 'Not set'}
...`
  : undefined;

// CopilotSidebar receives instructions
<CopilotSidebar instructions={agentInstructions}>
```

---

## Phase 9: Next Steps (TODO)

**Goal**: Complete the CopilotKit + Zep + Neon integration for fully personalized AI advisor.

### High Priority Tasks

1. **CopilotKit Instructions Pattern**
   - Pass full user context via `instructions` prop (like fractional.quest)
   - Include: name, persona, current country, target destinations, priorities
   - Fetch profile items and include in instructions string

2. **AI Onboarding in Chat**
   - On first visit, AI should ask: "Are you a digital nomad, relocating company, HNW, lifestyle seeker, family, retiree, or medical relocation?"
   - Save persona to user_profiles via API
   - Remember and use persona in subsequent conversations

3. **Deploy Pydantic AI Agent**
   - Set up Railway deployment for `/agent` folder
   - Configure CLM endpoint for Hume voice
   - Connect to Neon database for destination queries

### API Routes Summary

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/[...path]` | GET/POST | Neon Auth handler |
| `/api/copilotkit` | POST | CopilotKit runtime |
| `/api/destinations` | GET | List all destinations |
| `/api/hume-token` | GET | Hume access token |
| `/api/page-context` | GET/POST | Page context for voice |
| `/api/unsplash` | GET | Unsplash images |
| `/api/user-profile` | GET/POST | User profile CRUD |
| `/api/zep-context` | GET | Zep memory for voice (formatted) |
| `/api/zep/user` | GET/POST/DELETE | Zep user/thread CRUD |

### Dashboard Features (Already Built)

- 6-step onboarding wizard
- 7 personas with visual cards
- Current country selection
- Timeline preference
- Monthly budget slider
- Priority sliders (tax, cost of living, climate)
- Target destinations multi-select
- CopilotKit sidebar integration
- Profile editing

### Voice Integration (Already Built)

- HumeWidget with real auth
- VoiceChatSync with Zep context
- SyncedVoiceButton component
- System prompt with user context
- Auto-greeting with user name
