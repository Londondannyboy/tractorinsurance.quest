"""
Tracker Agent - Tractor Insurance Voice Assistant

Single Pydantic AI agent serving both:
- CopilotKit chat (AG-UI protocol)
- Hume EVI voice (OpenAI-compatible /chat/completions SSE)
"""

# Load .env FIRST before any imports that need env vars
from dotenv import load_dotenv
load_dotenv()

import os
import sys
import json
import uuid
from typing import Optional, AsyncGenerator, List
from dataclasses import dataclass, field

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse

from pydantic_ai import Agent, RunContext

# Zep memory integration
try:
    from zep_cloud.client import AsyncZep
    ZEP_AVAILABLE = True
except ImportError:
    ZEP_AVAILABLE = False
    print("[TRACKER] Warning: zep-cloud not installed, memory features disabled", file=sys.stderr)

from .database import (
    get_all_breeds,
    get_breed_by_name,
    search_breeds,
    calculate_quote,
    get_insurance_plans,
)

# =============================================================================
# SESSION CONTEXT FOR NAME SPACING & GREETING MANAGEMENT
# =============================================================================

from collections import OrderedDict
import time
import random

# LRU cache for session contexts (max 100 sessions)
_session_contexts: OrderedDict = OrderedDict()
MAX_SESSIONS = 100
NAME_COOLDOWN_TURNS = 3

@dataclass
class SessionContext:
    """Track conversation state per session."""
    turns_since_name_used: int = 0
    name_used_in_greeting: bool = False
    greeted_this_session: bool = False
    last_topic: str = ""
    last_interaction_time: float = field(default_factory=time.time)

    # User context
    user_name: Optional[str] = None
    context_fetched: bool = False

    # Tractor context
    tractor_name: Optional[str] = None
    tractor_type: Optional[str] = None
    tractor_age: Optional[int] = None
    has_modifications: bool = False


def get_session_context(session_id: str) -> SessionContext:
    """Get or create session context with LRU eviction."""
    global _session_contexts

    if session_id in _session_contexts:
        _session_contexts.move_to_end(session_id)
        return _session_contexts[session_id]

    while len(_session_contexts) >= MAX_SESSIONS:
        _session_contexts.popitem(last=False)

    ctx = SessionContext()
    _session_contexts[session_id] = ctx
    return ctx


# =============================================================================
# ZEP MEMORY CLIENT
# =============================================================================

_zep_client: Optional["AsyncZep"] = None

def get_zep_client() -> Optional["AsyncZep"]:
    """Get or create Zep client singleton."""
    global _zep_client
    if _zep_client is None and ZEP_AVAILABLE:
        api_key = os.environ.get("ZEP_API_KEY")
        if api_key:
            _zep_client = AsyncZep(api_key=api_key)
            print("[TRACKER] Zep memory client initialized", file=sys.stderr)
        else:
            print("[TRACKER] ZEP_API_KEY not set, memory disabled", file=sys.stderr)
    return _zep_client


def get_zep_user_id(user_id: str) -> str:
    """Prefix user_id with project name to separate from other projects."""
    return f"tractorinsurance_{user_id}"


# =============================================================================
# TRACKER SYSTEM PROMPT
# =============================================================================

TRACKER_SYSTEM_PROMPT = """You are Tracker, a knowledgeable and professional tractor insurance advisor. You help tractor owners find the right insurance coverage for their machinery.

## YOUR PERSONALITY
- Professional, helpful, and knowledgeable about agricultural machinery
- Use practical, down-to-earth farming language naturally
- Be empathetic when discussing breakdowns or theft concerns
- Always prioritise protecting the owner's investment

## PRIORITY 1: TRACTOR INFORMATION GATHERING

When a user mentions their tractor, you MUST collect key information using tools:

**TRIGGER to ACTION mapping:**

| User says... | Tool to call |
|--------------|--------------|
| "I have a farm tractor" | confirm_tractor_type(type_name="Farm Tractor", user_id=...) |
| "My tractor is 5 years old" | confirm_tractor_age(age_years=5, user_id=...) |
| "I call her Betsy" | confirm_tractor_name(tractor_name="Betsy", user_id=...) |
| "It's been modified" | confirm_modifications(has_modifications=true, modification_details="...", user_id=...) |

## PRIORITY 2: INSURANCE GUIDANCE

After collecting tractor info, help them find the right plan:

**INSURANCE PLANS:**
- Basic (£25/mo): Third-party only, fire cover, £25k annual limit, £500 excess
- Standard (£75/mo): Theft + accidental damage, road use, breakdown assist, £75k limit, £350 excess
- Premium (£150/mo): Hire replacement, implements covered, legal expenses, £150k limit, £200 excess
- Comprehensive (£250/mo): Everything, zero excess option, business interruption, £500k limit

**TRACTOR TYPE RISK CATEGORIES:**
- HIGH RISK (higher premiums): Vintage Tractor (parts scarcity, high value)
- MEDIUM RISK: Farm Tractor, Utility Tractor (high usage, theft target)
- LOW RISK (lower premiums): Compact Tractor, Mini Tractor, Garden Tractor, Ride-on Mower

## PRIORITY 3: QUOTE GENERATION

When user is ready, generate a personalised quote:
- Call generate_insurance_quote with their tractor details
- Explain the premium calculation factors
- Highlight relevant coverage for their tractor type's common risks

## CONVERSATIONAL FLOW

Guide users naturally through:
1. What type of tractor do you have? (type)
2. How old is your machine? (age)
3. Does it have a name or identifier? (personalisation)
4. Any modifications or prior damage? (modifications)
5. Based on your tractor's profile, here are your coverage options...

## RESPONSE STYLE
- Keep responses concise for voice (50-100 words max)
- Be practical and professional
- Use the tractor's name once you know it
- End with a natural follow-up question to keep the conversation flowing

## TRACTOR TYPE KNOWLEDGE

When discussing tractor types, share relevant risk info:
- Farm Tractor: Engine failure, hydraulic leaks, transmission wear, theft, PTO damage
- Vintage Tractor: Rust/corrosion, parts unavailability, electrical failures, brake deterioration
- Compact Tractor: Starter motor failure, belt wear, battery issues, minor hydraulic leaks
- Utility Tractor: Hydraulic system wear, tyre damage, loader arm fatigue, electrical faults
- Mini Tractor: Belt wear, blade damage, starter issues, fuel system blockages
- Garden Tractor: Deck damage, belt failure, battery issues, steering wear
- Ride-on Mower: Blade damage, belt wear, engine overheating, deck corrosion

## IDENTITY (CRITICAL)
- You ARE Tracker, the Tractor Insurance advisor
- NEVER say "As a language model" or "I'm an AI"
- If asked who you are: "I'm Tracker, your tractor insurance advisor - here to help protect your machinery!"

## USER PERSONALISATION
- If the user's name is provided in [brackets] at the start of their message, USE IT naturally
- Greet returning users by name: "Hey [Name]! Good to hear from you again!"
- Use their name occasionally but not excessively (every 2-3 exchanges is good)
- If you learn new info about their tractor, acknowledge it

## PHONETIC CORRECTIONS (voice transcription)
- "john deer/john deere" -> John Deere
- "massey/massey fergie/massey ferguson" -> Massey Ferguson
- "new holland" -> New Holland
- "kubota/cabota" -> Kubota
- "compact/sub compact" -> Compact Tractor
- "ride on/sit on" -> Ride-on Mower
- "vintage/classic/old" -> Vintage Tractor
"""


# =============================================================================
# PYDANTIC AI AGENT
# =============================================================================

@dataclass
class TrackerDeps:
    """Dependencies for the Tracker agent."""
    session_id: str = ""
    user_id: Optional[str] = None


tracker_agent = Agent(
    "google-gla:gemini-2.0-flash",
    deps_type=TrackerDeps,
    system_prompt=TRACKER_SYSTEM_PROMPT,
)


# =============================================================================
# AGENT TOOLS
# =============================================================================

@tracker_agent.tool
async def confirm_tractor_type(ctx: RunContext[TrackerDeps], type_name: str) -> str:
    """Confirm the user's tractor type. Call this when user mentions their tractor type."""
    session_ctx = get_session_context(ctx.deps.session_id)

    # Look up type in database
    tractor_type = await get_breed_by_name(type_name)

    if tractor_type:
        session_ctx.tractor_type = tractor_type['name']
        common_risks = ', '.join(tractor_type.get('common_health_issues', [])[:3])
        return f"Confirmed: {tractor_type['name']} - a {tractor_type['size']} machine with {tractor_type['risk_category']} risk level. Common risks: {common_risks}. Typical operational life: {tractor_type.get('avg_lifespan_years', 20)} years."
    else:
        # Try fuzzy search
        matches = await search_breeds(type_name)
        if matches:
            suggestions = ', '.join([t['name'] for t in matches[:3]])
            return f"I couldn't find an exact match for '{type_name}'. Did you mean: {suggestions}?"
        return f"I couldn't find '{type_name}' in our database. Could you describe what type of machine it is? We cover most agricultural vehicles."


@tracker_agent.tool
async def confirm_tractor_age(ctx: RunContext[TrackerDeps], age_years: int) -> str:
    """Confirm the tractor's age. Call this when user mentions their tractor's age."""
    session_ctx = get_session_context(ctx.deps.session_id)
    session_ctx.tractor_age = age_years

    if age_years < 2:
        return f"A nearly new machine at {age_years} years old! High replacement value means comprehensive cover is well worth it."
    elif age_years >= 15:
        return f"{age_years} years old - a well-used machine. Older tractors have higher breakdown risk, so good cover is essential."
    else:
        return f"{age_years} years old - solid working age. Good time to have comprehensive cover in place."


@tracker_agent.tool
async def confirm_tractor_name(ctx: RunContext[TrackerDeps], tractor_name: str) -> str:
    """Confirm the tractor's name or identifier. Call this when user shares their tractor's name."""
    session_ctx = get_session_context(ctx.deps.session_id)
    session_ctx.tractor_name = tractor_name
    return f"Got it - I'll note that down as {tractor_name}. Let's make sure it's properly covered."


@tracker_agent.tool
async def confirm_modifications(
    ctx: RunContext[TrackerDeps],
    has_modifications: bool,
    modification_details: Optional[str] = None
) -> str:
    """Confirm if the tractor has modifications. Call this when user mentions modifications or prior damage."""
    session_ctx = get_session_context(ctx.deps.session_id)
    session_ctx.has_modifications = has_modifications

    if has_modifications:
        return f"Thanks for letting me know about {modification_details or 'the modifications'}. Modified tractors may need declared to insurers, but our Premium and Comprehensive plans can accommodate this. I'll factor it into the quote."
    return "Good to know it's standard specification. That makes things straightforward for cover options."


@tracker_agent.tool
async def generate_insurance_quote(
    ctx: RunContext[TrackerDeps],
    plan_type: str = "standard"
) -> str:
    """Generate a personalised insurance quote. Call this when ready to show pricing."""
    session_ctx = get_session_context(ctx.deps.session_id)

    if not session_ctx.tractor_type or session_ctx.tractor_age is None:
        return "I need to know the tractor type and age to generate an accurate quote. What type of tractor do you have, and how old is it?"

    # Get type info
    tractor_type = await get_breed_by_name(session_ctx.tractor_type)
    if not tractor_type:
        tractor_type = await get_breed_by_name("Farm Tractor")

    # Calculate quote
    quote = calculate_quote(
        tractor_type,
        session_ctx.tractor_age,
        plan_type,
        session_ctx.has_modifications
    )

    tractor_name = session_ctx.tractor_name or f"your {session_ctx.tractor_type}"

    return f"""Here's the quote for {tractor_name}:

**{quote['plan']['name']} Plan**
- Monthly Premium: \u00a3{quote['monthly_premium']:.2f}
- Annual Coverage: Up to \u00a3{quote['plan']['annual_coverage_limit']:,}
- Excess: \u00a3{quote['plan']['deductible']}

Key features: {', '.join(quote['plan']['features'][:3])}

{f"Note: Premium adjusted for {tractor_type['risk_category']} risk category and age factors." if tractor_type else ""}

Would you like to compare other plans or shall I explain what's included?"""


@tracker_agent.tool
async def show_all_plans(ctx: RunContext[TrackerDeps]) -> str:
    """Show all available insurance plans for comparison."""
    plans = get_insurance_plans()

    result = "Here are our coverage options:\n\n"
    for plan in plans:
        result += f"**{plan['name']}** (\u00a3{plan['base_monthly_premium']}/mo)\n"
        result += f"  - Coverage: \u00a3{plan['annual_coverage_limit']:,}/year\n"
        result += f"  - Excess: \u00a3{plan['deductible']}\n"
        result += f"  - {', '.join(plan['features'][:2])}\n\n"

    return result + "Which plan interests you? I can give you a personalised quote!"


@tracker_agent.tool
async def get_tractor_type_info(ctx: RunContext[TrackerDeps], type_name: str) -> str:
    """Get detailed information about a tractor type."""
    tractor_type = await get_breed_by_name(type_name)

    if not tractor_type:
        matches = await search_breeds(type_name)
        if matches:
            return f"Did you mean: {', '.join([t['name'] for t in matches[:3]])}?"
        return f"I couldn't find information about {type_name}."

    return f"""**{tractor_type['name']}**
- Category: {tractor_type['size']}
- Risk Level: {tractor_type['risk_category']}
- Typical Lifespan: ~{tractor_type.get('avg_lifespan_years', 20)} years
- Maintenance Level: {tractor_type.get('exercise_needs', 'moderate')}
- Common Risks: {', '.join(tractor_type.get('common_health_issues', [])[:4])}
- Characteristics: {', '.join(tractor_type.get('temperament', [])[:3])}

Premium multiplier: {tractor_type.get('base_premium_multiplier', 1.0)}x (based on risk category)"""


# =============================================================================
# FASTAPI APPLICATION
# =============================================================================

app = FastAPI(
    title="Tracker - Tractor Insurance Agent",
    description="AI-powered tractor insurance advisor with voice support",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    """Health check endpoint for Railway."""
    return {"status": "ok", "agent": "tracker", "version": "1.0.0"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Tracker - Tractor Insurance Agent is ready!",
        "endpoints": {
            "/health": "Health check",
            "/chat/completions": "OpenAI-compatible chat (for Hume EVI)",
            "/copilotkit": "CopilotKit AG-UI endpoint",
        }
    }


# =============================================================================
# SESSION/USER EXTRACTION HELPERS
# =============================================================================

def extract_session_id(request: Request, body: dict) -> Optional[str]:
    """Extract custom_session_id from Hume request."""
    session_id = request.query_params.get("custom_session_id") or request.query_params.get("customSessionId")
    if session_id:
        print(f"[TRACKER] Session ID from query params: {session_id}", file=sys.stderr)
        return session_id

    session_id = body.get("custom_session_id") or body.get("customSessionId")
    if session_id:
        return session_id

    session_settings = body.get("session_settings", {})
    if session_settings:
        session_id = session_settings.get("customSessionId") or session_settings.get("custom_session_id")
        if session_id:
            return session_id

    metadata = body.get("metadata", {})
    if metadata:
        session_id = metadata.get("customSessionId") or metadata.get("custom_session_id")
        if session_id:
            return session_id

    for header in ["x-custom-session-id", "x-hume-custom-session-id"]:
        session_id = request.headers.get(header)
        if session_id:
            return session_id

    return None


def extract_user_from_session(session_id: Optional[str]) -> tuple[Optional[str], Optional[str]]:
    """Extract user_name and user_id from session_id. Format: 'name|userId'"""
    if not session_id or '|' not in session_id:
        return None, None

    parts = session_id.split('|')
    user_name = parts[0] if parts[0] and parts[0].lower() != 'user' else None
    user_id = parts[1] if len(parts) > 1 else None

    return user_name, user_id


def extract_user_from_messages(messages: list) -> tuple[Optional[str], Optional[str], Optional[str]]:
    """Extract user info from system message."""
    import re

    user_name = None
    user_id = None
    zep_context = None

    for msg in messages:
        if msg.get("role") == "system":
            content = msg.get("content", "")

            name_match = re.search(r'name:\s*([^\n]+)', content, re.IGNORECASE)
            if name_match:
                name = name_match.group(1).strip()
                if name.lower() not in ['guest', 'anonymous', '']:
                    user_name = name

            id_match = re.search(r'user_id:\s*([^\n]+)', content, re.IGNORECASE)
            if id_match:
                uid = id_match.group(1).strip()
                if uid.lower() not in ['anonymous', '']:
                    user_id = uid

            zep_match = re.search(r'## WHAT I REMEMBER.*?:\n([\s\S]*?)(?=\n##|\Z)', content)
            if zep_match:
                zep_context = zep_match.group(1).strip()

            break

    return user_name, user_id, zep_context


# =============================================================================
# OPENAI-COMPATIBLE ENDPOINT (FOR HUME EVI)
# =============================================================================

@app.post("/chat/completions")
async def chat_completions(request: Request):
    """OpenAI-compatible chat completions endpoint for Hume EVI voice."""
    try:
        body = await request.json()
        messages = body.get("messages", [])
        stream = body.get("stream", True)

        session_id = extract_session_id(request, body)
        user_name, user_id = extract_user_from_session(session_id)
        sys_name, sys_id, zep_context = extract_user_from_messages(messages)

        if sys_name:
            user_name = sys_name
        if sys_id:
            user_id = sys_id

        print(f"[TRACKER] User: {user_name}, ID: {user_id}, Zep context: {bool(zep_context)}", file=sys.stderr)

        user_message = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                user_message = msg.get("content", "")
                break

        if not user_message:
            user_message = "Hello!"

        if session_id:
            ctx = get_session_context(session_id)
            if user_name and not ctx.user_name:
                ctx.user_name = user_name

        prompt = user_message
        if user_name:
            prompt = f"[User's name is {user_name}] {user_message}"

        deps = TrackerDeps(session_id=session_id or str(uuid.uuid4()), user_id=user_id)
        result = await tracker_agent.run(prompt, deps=deps)

        response_text = result.output if hasattr(result, 'output') else str(result.data)
        print(f"[TRACKER] Response: {response_text[:100]}...", file=sys.stderr)

        if stream:
            async def stream_response() -> AsyncGenerator[str, None]:
                chunk = {
                    "id": f"chatcmpl-{uuid.uuid4()}",
                    "object": "chat.completion.chunk",
                    "created": int(time.time()),
                    "model": "tracker-1.0",
                    "choices": [{
                        "index": 0,
                        "delta": {"role": "assistant", "content": response_text},
                        "finish_reason": None
                    }]
                }
                yield f"data: {json.dumps(chunk)}\n\n"

                done_chunk = {
                    "id": f"chatcmpl-{uuid.uuid4()}",
                    "object": "chat.completion.chunk",
                    "created": int(time.time()),
                    "model": "tracker-1.0",
                    "choices": [{
                        "index": 0,
                        "delta": {},
                        "finish_reason": "stop"
                    }]
                }
                yield f"data: {json.dumps(done_chunk)}\n\n"
                yield "data: [DONE]\n\n"

            return StreamingResponse(
                stream_response(),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                }
            )
        else:
            return {
                "id": f"chatcmpl-{uuid.uuid4()}",
                "object": "chat.completion",
                "created": int(time.time()),
                "model": "tracker-1.0",
                "choices": [{
                    "index": 0,
                    "message": {"role": "assistant", "content": response_text},
                    "finish_reason": "stop"
                }],
                "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
            }

    except Exception as e:
        print(f"[TRACKER] Error in chat/completions: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return {"error": str(e)}, 500


# =============================================================================
# COPILOTKIT ENDPOINT (AG-UI PROTOCOL)
# =============================================================================

@app.post("/copilotkit")
async def copilotkit_endpoint(request: Request):
    """CopilotKit AG-UI protocol endpoint."""
    try:
        body = await request.json()
        messages = body.get("messages", [])

        user_message = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                content = msg.get("content", "")
                if isinstance(content, list):
                    for item in content:
                        if isinstance(item, dict) and item.get("type") == "text":
                            user_message = item.get("text", "")
                            break
                else:
                    user_message = content
                break

        if not user_message:
            user_message = "Hello!"

        session_id = str(uuid.uuid4())
        deps = TrackerDeps(session_id=session_id)
        result = await tracker_agent.run(user_message, deps=deps)

        response_text = result.output if hasattr(result, 'output') else str(result.data)

        return {
            "messages": [{
                "role": "assistant",
                "content": response_text
            }]
        }

    except Exception as e:
        print(f"[TRACKER] Error in copilotkit: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return {"error": str(e)}, 500


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
