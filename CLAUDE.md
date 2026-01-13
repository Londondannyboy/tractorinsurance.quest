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

---

## CopilotKit Actions (useCopilotAction)

| Action | Purpose |
|--------|---------|
| `show_destination` | Display single destination card from Neon |
| `save_preferences` | Save user budget/climate/purpose |
| `generate_custom_view` | **NEW**: AI-composed MDX layouts (comparison, cost breakdown, pros/cons) |

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

---

## Implementation Status

- [x] Next.js 15 project setup
- [x] CopilotKit Next.js runtime (Gemini adapter)
- [x] useCopilotAction for show_destination, save_preferences
- [x] Neon database connection (17 destinations)
- [x] MDX component library
- [x] generate_custom_view action for dynamic compositions
- [ ] Visual demo of MDX capability (test "Compare Portugal vs Spain")
- [ ] Neon Auth (@stackframe/stack)
- [ ] Hume voice widget
- [ ] Deploy to Vercel

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
| Voice | Hume EVI (pending) |
| Auth | Neon Auth/@stackframe/stack (pending) |

---

## Environment Variables

```bash
DATABASE_URL=postgresql://neondb_owner:...@ep-wandering-leaf-ab17v6rr-pooler.eu-west-2.aws.neon.tech/neondb
GOOGLE_API_KEY=...  # For Gemini via CopilotKit
```

---

## Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/prime` | Load project context | Start of session |
| `/plan {feature}` | Create implementation plan | Before coding features |
| `/execute {plan}` | Build from plan (fresh context) | After plan approval |
| `/evolve` | Improve system after bugs | After fixing issues |
