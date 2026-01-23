"""
Database queries for Tractor Insurance Agent (Tracker)
"""

import os
import sys
import asyncpg
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Optional, List, Dict, Any

DATABASE_URL = os.environ.get("DATABASE_URL", "")


class Database:
    """Async database connection manager for Neon PostgreSQL."""

    _pool: Optional[asyncpg.Pool] = None

    @classmethod
    async def get_pool(cls) -> asyncpg.Pool:
        """Get or create connection pool."""
        if cls._pool is None:
            cls._pool = await asyncpg.create_pool(
                DATABASE_URL,
                min_size=1,
                max_size=5,
                command_timeout=30,
            )
        return cls._pool

    @classmethod
    async def close(cls) -> None:
        """Close the connection pool."""
        if cls._pool:
            await cls._pool.close()
            cls._pool = None


@asynccontextmanager
async def get_connection() -> AsyncGenerator[asyncpg.Connection, None]:
    """Get a database connection from the pool."""
    pool = await Database.get_pool()
    async with pool.acquire() as conn:
        yield conn


# =============================================================================
# TRACTOR TYPE QUERIES
# =============================================================================

async def get_all_tractor_types() -> List[Dict[str, Any]]:
    """Get all tractor types from database."""
    try:
        async with get_connection() as conn:
            rows = await conn.fetch("""
                SELECT id, name, size, risk_category, avg_lifespan_years,
                       common_health_issues, base_premium_multiplier,
                       temperament, exercise_needs, grooming_needs
                FROM dog_breeds
                ORDER BY name
            """)
            print(f"[TRACKER DB] Retrieved {len(rows)} tractor types", file=sys.stderr)
            return [dict(row) for row in rows]
    except Exception as e:
        print(f"[TRACKER DB] Error fetching tractor types: {e}", file=sys.stderr)
        return []


async def get_tractor_type_by_name(name: str) -> Optional[Dict[str, Any]]:
    """Get tractor type by name (fuzzy match)."""
    try:
        async with get_connection() as conn:
            # Try exact match first
            row = await conn.fetchrow("""
                SELECT id, name, size, risk_category, avg_lifespan_years,
                       common_health_issues, base_premium_multiplier,
                       temperament, exercise_needs, grooming_needs
                FROM dog_breeds
                WHERE LOWER(name) = LOWER($1)
            """, name)

            if row:
                print(f"[TRACKER DB] Found exact tractor type match: {row['name']}", file=sys.stderr)
                return dict(row)

            # Try fuzzy match
            row = await conn.fetchrow("""
                SELECT id, name, size, risk_category, avg_lifespan_years,
                       common_health_issues, base_premium_multiplier,
                       temperament, exercise_needs, grooming_needs
                FROM dog_breeds
                WHERE LOWER(name) LIKE LOWER($1)
                ORDER BY
                    CASE WHEN LOWER(name) = LOWER($2) THEN 0 ELSE 1 END
                LIMIT 1
            """, f"%{name}%", name)

            if row:
                print(f"[TRACKER DB] Found fuzzy tractor type match: {row['name']}", file=sys.stderr)
                return dict(row)

            print(f"[TRACKER DB] No tractor type found for: {name}", file=sys.stderr)
            return None
    except Exception as e:
        print(f"[TRACKER DB] Error fetching tractor type by name: {e}", file=sys.stderr)
        return None


async def search_tractor_types(query: str) -> List[Dict[str, Any]]:
    """Search tractor types by name."""
    try:
        async with get_connection() as conn:
            rows = await conn.fetch("""
                SELECT id, name, size, risk_category, avg_lifespan_years,
                       common_health_issues, base_premium_multiplier
                FROM dog_breeds
                WHERE LOWER(name) LIKE LOWER($1)
                ORDER BY name
                LIMIT 5
            """, f"%{query}%")
            return [dict(row) for row in rows]
    except Exception as e:
        print(f"[TRACKER DB] Error searching tractor types: {e}", file=sys.stderr)
        return []


# =============================================================================
# INSURANCE PLANS
# =============================================================================

INSURANCE_PLANS = [
    {
        "type": "basic",
        "name": "Tractor Basic",
        "base_monthly_premium": 25,
        "annual_coverage_limit": 10000,
        "deductible": 500,
        "features": [
            "Accidental damage coverage up to £10,000/year",
            "Emergency breakdown assistance",
            "24/7 Agricultural Helpline",
        ],
    },
    {
        "type": "standard",
        "name": "Tractor Standard",
        "base_monthly_premium": 75,
        "annual_coverage_limit": 25000,
        "deductible": 350,
        "features": [
            "Accidental damage & mechanical breakdown up to £25,000/year",
            "Replacement parts coverage",
            "Third-party liability",
            "Emergency breakdown assistance",
            "24/7 Agricultural Helpline",
        ],
    },
    {
        "type": "premium",
        "name": "Tractor Premium",
        "base_monthly_premium": 150,
        "annual_coverage_limit": 50000,
        "deductible": 200,
        "features": [
            "Comprehensive coverage up to £50,000/year",
            "Routine maintenance & servicing",
            "Tyre and track replacement",
            "Modification coverage",
            "Replacement parts coverage",
            "Third-party liability",
            "Low £200 excess",
            "24/7 Agricultural Helpline",
        ],
    },
    {
        "type": "comprehensive",
        "name": "Tractor Comprehensive",
        "base_monthly_premium": 250,
        "annual_coverage_limit": 100000,
        "deductible": 0,
        "features": [
            "Unlimited comprehensive coverage (up to £100,000/year)",
            "ZERO excess",
            "All routine maintenance & servicing",
            "Full tyre, track & hydraulics coverage",
            "Modification & attachment coverage",
            "Theft & vandalism protection",
            "Business interruption cover",
            "Hire vehicle while yours is repaired",
            "Seasonal storage coverage",
            "Priority claims processing",
        ],
    },
]


def get_insurance_plans() -> List[Dict[str, Any]]:
    """Get all insurance plans."""
    return INSURANCE_PLANS


def get_plan_by_type(plan_type: str) -> Optional[Dict[str, Any]]:
    """Get a specific insurance plan by type."""
    for plan in INSURANCE_PLANS:
        if plan["type"] == plan_type:
            return plan
    return None


def calculate_quote(
    tractor_type: Dict[str, Any],
    age_years: int,
    plan_type: str = "standard",
    has_preexisting_conditions: bool = False
) -> Dict[str, Any]:
    """Calculate insurance quote based on tractor type, age, and plan."""
    plan = get_plan_by_type(plan_type)
    if not plan:
        plan = INSURANCE_PLANS[1]  # Default to standard

    premium = plan["base_monthly_premium"]

    # Apply tractor type risk multiplier
    type_multiplier = float(tractor_type.get("base_premium_multiplier", 1.0))
    premium *= type_multiplier

    # Age adjustments for tractors
    if age_years <= 2:
        premium *= 0.9  # New tractors - lower risk
    elif age_years >= 15:
        premium *= 1.6  # Very old tractors - high risk
    elif age_years >= 10:
        premium *= 1.4  # Older tractors - increased risk
    elif age_years >= 5:
        premium *= 1.15  # Mid-life - moderate increase

    # Pre-existing conditions (known mechanical issues) surcharge
    if has_preexisting_conditions and plan_type in ["premium", "comprehensive"]:
        premium *= 1.3

    monthly_premium = round(premium, 2)
    annual_premium = round(monthly_premium * 12, 2)

    return {
        "monthly_premium": monthly_premium,
        "annual_premium": annual_premium,
        "plan": plan,
        "factors": {
            "type_multiplier": type_multiplier,
            "age_adjustment": "veteran" if age_years >= 10 else "new" if age_years <= 2 else "standard",
            "preexisting_adjustment": has_preexisting_conditions,
        }
    }


# =============================================================================
# USER & POLICY QUERIES
# =============================================================================

async def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user profile from database."""
    try:
        async with get_connection() as conn:
            row = await conn.fetchrow("""
                SELECT * FROM user_profiles WHERE user_id = $1
            """, user_id)
            return dict(row) if row else None
    except Exception as e:
        print(f"[TRACKER DB] Error fetching user profile: {e}", file=sys.stderr)
        return None


async def get_user_tractors(user_id: str) -> List[Dict[str, Any]]:
    """Get all tractors registered by a user."""
    try:
        async with get_connection() as conn:
            rows = await conn.fetch("""
                SELECT d.*, b.name as breed_name_full, b.size, b.risk_category
                FROM user_dogs d
                LEFT JOIN dog_breeds b ON d.breed_id = b.id
                WHERE d.user_id = $1
                ORDER BY d.created_at DESC
            """, user_id)
            return [dict(row) for row in rows]
    except Exception as e:
        print(f"[TRACKER DB] Error fetching user tractors: {e}", file=sys.stderr)
        return []


async def save_user_tractor(
    user_id: str,
    tractor_name: str,
    type_name: str,
    age_years: int,
    has_preexisting_conditions: bool = False,
    preexisting_conditions: List[str] = None
) -> Optional[int]:
    """Save a tractor to the database."""
    try:
        # Look up tractor type
        tractor_type = await get_tractor_type_by_name(type_name)
        type_id = tractor_type.get("id") if tractor_type else None

        async with get_connection() as conn:
            result = await conn.fetchrow("""
                INSERT INTO user_dogs (user_id, name, breed_id, breed_name, age_years,
                                       has_preexisting_conditions, preexisting_conditions)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            """, user_id, tractor_name, type_id, type_name, age_years,
                has_preexisting_conditions, preexisting_conditions or [])

            print(f"[TRACKER DB] Saved tractor {tractor_name} for user {user_id}", file=sys.stderr)
            return result["id"] if result else None
    except Exception as e:
        print(f"[TRACKER DB] Error saving user tractor: {e}", file=sys.stderr)
        return None


async def get_user_policies(user_id: str) -> List[Dict[str, Any]]:
    """Get all policies for a user."""
    try:
        async with get_connection() as conn:
            rows = await conn.fetch("""
                SELECT p.*, d.name as tractor_name, d.breed_name as type_name
                FROM insurance_policies p
                LEFT JOIN user_dogs d ON p.dog_id = d.id
                WHERE p.user_id = $1
                ORDER BY p.created_at DESC
            """, user_id)
            return [dict(row) for row in rows]
    except Exception as e:
        print(f"[TRACKER DB] Error fetching user policies: {e}", file=sys.stderr)
        return []


async def save_quote(
    user_id: Optional[str],
    session_id: str,
    dog_details: Dict[str, Any],
    plan_type: str,
    quoted_premium: float,
    coverage_details: Dict[str, Any]
) -> Optional[int]:
    """Save a quote to the database."""
    try:
        import json
        from datetime import datetime, timedelta

        valid_until = datetime.now() + timedelta(days=30)

        async with get_connection() as conn:
            result = await conn.fetchrow("""
                INSERT INTO policy_quotes (user_id, session_id, dog_details, plan_type,
                                          quoted_premium, coverage_details, valid_until)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            """, user_id, session_id, json.dumps(dog_details), plan_type,
                quoted_premium, json.dumps(coverage_details), valid_until)

            print(f"[TRACKER DB] Saved quote for session {session_id}", file=sys.stderr)
            return result["id"] if result else None
    except Exception as e:
        print(f"[TRACKER DB] Error saving quote: {e}", file=sys.stderr)
        return None
