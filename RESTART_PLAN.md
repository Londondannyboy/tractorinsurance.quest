# Relocation Quest - Phase 10 Restart Plan

> **Date**: January 16, 2026
> **Goal**: Pydantic AI-powered conversational onboarding with HITL confirmation

---

## Project Context

**Working Directory**: `/Users/dankeegan/relocation.quest`
**Live URL**: https://relocation-quest-v3.vercel.app
**Reference Projects**:
- `fractional.quest` - Working Pydantic AI + HITL pattern
- `lost.london-v2` - Zep memory integration

---

## What's Working ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Neon Auth | ✅ Working | `authClient.useSession()` returns user |
| Hume Voice | ✅ Working | HumeWidget + VoiceChatSync with auth |
| Zep Memory | ✅ Working | `/api/zep-context` + `/api/zep/user` routes |
| Dashboard | ✅ Working | 7 personas, onboarding wizard, CopilotKit sidebar |
| Destination Pages | ✅ Working | Cyprus page with hero images, cost data |
| Navigation | ✅ Working | Global nav with Dashboard link |

---

## Known Bugs to Fix 🐛

### 1. Comparison Button Stuck
- **Location**: Destination pages, comparison modal
- **Issue**: Button can't be closed, looks weird
- **Action**: Find and fix modal close logic

### 2. Hero Image Debug Logs
- **Issue**: Console spam with hero debug logs
- **Action**: Remove or disable debug logging in production

---

## Phase 10: Pydantic AI Conversational Onboarding

### Core Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   User speaks or types                                                   │
│         │                                                                │
│         ▼                                                                │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    PYDANTIC AI AGENT                             │   │
│   │                                                                   │   │
│   │  1. Receives message                                             │   │
│   │  2. Fetches context from Neon + Zep                             │   │
│   │  3. Determines intent (onboarding, query, etc.)                 │   │
│   │  4. Calls appropriate tool                                       │   │
│   │  5. Returns HITL confirmation if needed                         │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│         │                                                                │
│         ▼                                                                │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    HITL CONFIRMATION                             │   │
│   │                                                                   │   │
│   │  "You said you're relocating your company to Cyprus.            │   │
│   │   Is that correct?"                                              │   │
│   │                                                                   │   │
│   │   [Confirm] [Edit]                                               │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│         │                                                                │
│         ▼                                                                │
│   Dashboard updates LIVE as confirmations happen                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Dashboard Modes

**Primary: Voice Onboarding**
- User speaks to ATLAS
- AI asks questions conversationally
- Each answer requires Pydantic HITL confirmation
- Dashboard updates live as confirmations happen

**Secondary: Written Onboarding**
- Toggle to switch from voice to text
- Same HITL confirmation flow
- Same live dashboard updates

**NO DROPDOWNS** - All input through conversation with Pydantic confirmation

---

## Pydantic AI Tools to Implement

### 1. Context Tools (Fetch from Neon + Zep)

```python
@agent.tool
async def get_user_context(ctx) -> dict:
    """Fetch everything we know about the user from Neon + Zep"""
    user_id = get_effective_user_id(ctx)

    # From Neon: user_profiles table
    neon_profile = await fetch_neon_profile(user_id)

    # From Zep: memory graph
    zep_facts = await fetch_zep_facts(user_id)

    return {
        "profile": neon_profile,
        "memory": zep_facts,
        "is_new_user": neon_profile is None
    }
```

### 2. HITL Confirmation Tools

```python
@agent.tool
def confirm_persona(ctx, persona: str, description: str) -> dict:
    """HITL: Confirm user's relocation type

    Personas: company, hnw, digital_nomad, lifestyle, family, retiree, medical
    """
    return {
        "type": "hitl_confirmation",
        "field": "persona",
        "value": persona,
        "display": description,
        "prompt": f"You're relocating as: {description}. Is that correct?"
    }

@agent.tool
def confirm_current_location(ctx, country: str) -> dict:
    """HITL: Confirm where user is currently based"""
    return {
        "type": "hitl_confirmation",
        "field": "current_country",
        "value": country,
        "prompt": f"You're currently based in {country}. Correct?"
    }

@agent.tool
def confirm_destination(ctx, destination: str, is_primary: bool = True) -> dict:
    """HITL: Confirm target destination"""
    return {
        "type": "hitl_confirmation",
        "field": "target_destination" if is_primary else "secondary_destination",
        "value": destination,
        "prompt": f"You're interested in moving to {destination}. Confirm?"
    }

@agent.tool
def confirm_timeline(ctx, timeline: str) -> dict:
    """HITL: Confirm relocation timeline"""
    return {
        "type": "hitl_confirmation",
        "field": "timeline",
        "value": timeline,
        "prompt": f"Your timeline is: {timeline}. Is that right?"
    }

@agent.tool
def confirm_budget(ctx, monthly_budget: int, currency: str = "EUR") -> dict:
    """HITL: Confirm monthly budget"""
    return {
        "type": "hitl_confirmation",
        "field": "budget_monthly",
        "value": monthly_budget,
        "prompt": f"Your monthly budget is {currency} {monthly_budget:,}. Correct?"
    }
```

### 3. Company Relocation Special Tools

When persona = "company", show compelling data:

```python
@agent.tool
async def get_company_relocation_data(ctx, jurisdiction: str) -> dict:
    """Fetch company relocation insights for a jurisdiction

    Returns data that financial directors find compelling:
    - Types of companies that have relocated
    - Actual companies that relocated
    - Types of incorporation available
    - Industries that favor this jurisdiction
    """
    return {
        "jurisdiction": jurisdiction,
        "relocated_company_types": [
            "Tech startups",
            "Holding companies",
            "IP licensing entities",
            "Trading companies"
        ],
        "notable_relocations": [
            {"company": "Wargaming", "from": "Belarus", "year": 2022},
            {"company": "Various hedge funds", "from": "UK/EU", "year": "2021-2023"}
        ],
        "incorporation_types": [
            {"type": "Private Limited (Ltd)", "min_capital": "€1,000"},
            {"type": "Public Limited (PLC)", "min_capital": "€25,629"},
            {"type": "Branch Office", "min_capital": "None"}
        ],
        "popular_industries": [
            "Fintech",
            "Gaming",
            "Shipping",
            "Professional Services",
            "IP Holding"
        ],
        "tax_benefits": {
            "corporate_rate": "12.5%",
            "ip_box": "2.5% effective",
            "notional_interest_deduction": "Yes",
            "no_withholding_tax": "On dividends to non-residents"
        }
    }
```

---

## Frontend HITL Handler

```typescript
// In dashboard or page component
import { useHumanInTheLoop } from '@copilotkit/react-core';

useHumanInTheLoop({
  name: 'confirm_persona',
  handler: async ({ persona, description }) => {
    // Show confirmation UI
    const confirmed = await showConfirmationModal({
      title: 'Confirm Your Profile',
      message: `You're relocating as: ${description}`,
      confirmText: 'Yes, that\'s correct',
      editText: 'Let me clarify'
    });

    if (confirmed) {
      // Save to Neon
      await fetch('/api/user-profile', {
        method: 'POST',
        body: JSON.stringify({ persona })
      });

      // Update dashboard live
      setProfile(prev => ({ ...prev, persona }));

      return { confirmed: true, persona };
    }

    return { confirmed: false, edit_requested: true };
  }
});
```

---

## Database Schema Reference

### Neon: user_profiles
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  full_name TEXT,
  persona TEXT, -- company, hnw, digital_nomad, lifestyle, family, retiree, medical
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,
  current_country TEXT,
  target_destinations TEXT[], -- array of country slugs
  secondary_destinations TEXT[],
  timeline TEXT, -- "3_months", "6_months", "1_year", "exploring"
  budget_monthly INTEGER,
  priority_tax_benefits INTEGER DEFAULT 3, -- 1-5 scale
  priority_cost_of_living INTEGER DEFAULT 3,
  priority_climate INTEGER DEFAULT 3,
  priority_healthcare INTEGER DEFAULT 3,
  priority_education INTEGER DEFAULT 3, -- for family persona
  recommended_destinations JSONB,
  ai_insights JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Zep: Memory Graph
Facts extracted automatically:
- "User is interested in Cyprus"
- "User is relocating a fintech company"
- "User visited Limassol"
- "User budget is approximately €5000/month"

---

## Data Sources Clarification

### Cyprus Restaurants Question
**Q**: When testing Cyprus, actual restaurants were mentioned. Source?

**A**: The destination data in Neon database (`destinations` table) contains structured data including:
- `cost_of_living` - with dining costs per city
- The LLM (Gemini) may also have general knowledge of popular restaurants

**To verify**: Check `destinations` table for `cost_of_living` JSON structure.

**If hallucinating**: Add a tool to fetch real restaurant data from:
- Google Places API
- TripAdvisor API
- Or curate a `restaurants` table in Neon

---

## Files to Modify/Create

### Agent (Railway)
| File | Action |
|------|--------|
| `agent/src/agent.py` | Add HITL tools, context fetching |
| `agent/src/database.py` | Add user_profiles queries |
| `agent/src/hitl_tools.py` | NEW: HITL tool definitions |
| `agent/src/company_data.py` | NEW: Company relocation data |

### Frontend (Vercel)
| File | Action |
|------|--------|
| `src/app/dashboard/DashboardClient.tsx` | Add HITL handlers, live updates |
| `src/components/HITLConfirmation.tsx` | NEW: Confirmation modal component |
| `src/components/voice/VoiceChatSync.tsx` | Ensure HITL works with voice |

### API Routes
| Route | Action |
|-------|--------|
| `/api/user-profile` | Enhance for all profile fields |
| `/api/company-data` | NEW: Company relocation insights |

---

## Onboarding Flow (Voice-First)

```
1. User opens dashboard
   ↓
2. ATLAS greets: "Hi [Name]! I'm ATLAS, your relocation advisor.
   Let me help you plan your move. First, what type of relocation
   is this - are you moving with a company, as a digital nomad,
   seeking lifestyle change, or something else?"
   ↓
3. User speaks: "I'm relocating my fintech company"
   ↓
4. Pydantic extracts: persona="company", industry="fintech"
   ↓
5. HITL confirmation appears:
   "You're relocating a fintech company. Is that correct?"
   [Confirm] [Edit]
   ↓
6. User confirms → Dashboard updates live (persona card appears)
   ↓
7. ATLAS continues: "Great! Where is your company currently based?"
   ↓
8. User: "London"
   ↓
9. HITL: "Currently based in London, UK. Correct?"
   [Confirm] [Edit]
   ↓
10. Continue for: destination, timeline, budget, priorities
   ↓
11. When company persona: Show company relocation data
    - "Many fintech companies have moved to Cyprus..."
    - Types of incorporation
    - Tax benefits
    - Notable relocations
```

---

## Quick Start Commands

```bash
# Frontend
cd /Users/dankeegan/relocation.quest
npm run dev -- -p 4000

# Agent (when deployed)
cd /Users/dankeegan/relocation.quest/agent
uv run uvicorn src.agent:app --reload --port 8000

# Deploy to Railway
railway up
```

---

## Environment Variables Needed

```bash
# Already set
DATABASE_URL=postgresql://...
GOOGLE_API_KEY=...
HUME_API_KEY=...
HUME_SECRET_KEY=...
NEXT_PUBLIC_HUME_CONFIG_ID=...
NEXT_PUBLIC_NEON_AUTH_URL=...
ZEP_API_KEY=...

# May need for company data
GOOGLE_PLACES_API_KEY=... # Optional: for restaurant/POI data
```

---

## Success Criteria

- [ ] Voice onboarding works end-to-end
- [x] Every input confirmed via Pydantic HITL (no dropdowns) - **IMPLEMENTED**
- [x] Dashboard updates live as user confirms - **IMPLEMENTED**
- [ ] Toggle between voice and written mode
- [x] Company persona shows relocation data - **IMPLEMENTED in system prompt**
- [ ] Context pulled from both Neon and Zep
- [x] Comparison modal closes properly - **FIXED: Added X close button**
- [x] All data persisted to Neon user_profiles - **IMPLEMENTED in HITL handlers**

## Implementation Complete (Phase 10 Session)

### Bugs Fixed
1. **Comparison button stuck** - Added close (X) button to ComparisonPicker modal
2. **Hero debug logs** - Removed all console.log statements from DestinationClient

### HITL Tools Implemented
Five HITL confirmation tools added to agent system prompt and frontend handlers:
- `confirm_persona` - Confirm user relocation type (company, hnw, digital_nomad, etc.)
- `confirm_current_location` - Confirm where user is based
- `confirm_destination` - Confirm target destination
- `confirm_timeline` - Confirm relocation timeline
- `confirm_budget` - Confirm monthly budget

### Frontend Changes
- `DashboardClient.tsx`: Added 5 `useHumanInTheLoop` hooks with confirmation UI
- Dashboard updates live when user confirms each piece of data
- CopilotSidebar now has onboarding-aware instructions

### Agent Changes
- `agent/src/agent.py`: Added HITL tool instructions to ATLAS_SYSTEM_PROMPT
- Includes company relocation data (Wargaming, Cyprus tax benefits, etc.)
- Instructions for conversational onboarding flow

---

## Reference Code (fractional.quest pattern)

### Agent HITL Tool
```python
@agent.tool
def confirm_company(ctx, company_name: str, company_url: str) -> dict:
    """HITL: Confirm a company the user mentioned working at"""
    return {
        "company": company_name,
        "url": company_url,
        "needs_confirmation": True
    }
```

### Frontend HITL Handler
```typescript
useHumanInTheLoop({
  name: 'confirm_company',
  handler: async ({ company, url }) => {
    // Render custom confirmation UI
    return new Promise((resolve) => {
      setConfirmationState({
        show: true,
        company,
        url,
        onConfirm: () => resolve({ confirmed: true }),
        onReject: () => resolve({ confirmed: false })
      });
    });
  }
});
```

---

## Notes

1. **Pydantic AI is the source of truth** - All logic flows through the agent
2. **HITL = Trust but verify** - User always confirms AI's understanding
3. **Live updates** - Dashboard reflects state as confirmations happen
4. **Voice-first, text-second** - Primary UX is conversational
5. **Company persona is special** - Shows compelling business data

---

*This plan should be loaded at start of next session with `/prime` or by reading this file.*
