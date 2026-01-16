"""
Database queries for Puppy Insurance Agent
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
# DOG BREED QUERIES
# =============================================================================

async def get_all_breeds() -> List[Dict[str, Any]]:
    """Get all dog breeds from database."""
    try:
        async with get_connection() as conn:
            rows = await conn.fetch("""
                SELECT id, name, size, risk_category, avg_lifespan_years,
                       common_health_issues, base_premium_multiplier,
                       temperament, exercise_needs, grooming_needs
                FROM dog_breeds
                ORDER BY name
            """)
            print(f"[BUDDY DB] Retrieved {len(rows)} breeds", file=sys.stderr)
            return [dict(row) for row in rows]
    except Exception as e:
        print(f"[BUDDY DB] Error fetching breeds: {e}", file=sys.stderr)
        return []


async def get_breed_by_name(name: str) -> Optional[Dict[str, Any]]:
    """Get breed by name (fuzzy match)."""
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
                print(f"[BUDDY DB] Found exact breed match: {row['name']}", file=sys.stderr)
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
                print(f"[BUDDY DB] Found fuzzy breed match: {row['name']}", file=sys.stderr)
                return dict(row)

            print(f"[BUDDY DB] No breed found for: {name}", file=sys.stderr)
            return None
    except Exception as e:
        print(f"[BUDDY DB] Error fetching breed by name: {e}", file=sys.stderr)
        return None


async def search_breeds(query: str) -> List[Dict[str, Any]]:
    """Search breeds by name."""
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
        print(f"[BUDDY DB] Error searching breeds: {e}", file=sys.stderr)
        return []


# =============================================================================
# INSURANCE PLANS
# =============================================================================

INSURANCE_PLANS = [
    {
        "type": "basic",
        "name": "Puppy Basic",
        "base_monthly_premium": 15,
        "annual_coverage_limit": 5000,
        "deductible": 250,
        "features": [
            "Accident coverage up to $5,000/year",
            "Emergency vet visits",
            "24/7 Pet Helpline",
        ],
    },
    {
        "type": "standard",
        "name": "Puppy Standard",
        "base_monthly_premium": 35,
        "annual_coverage_limit": 10000,
        "deductible": 200,
        "features": [
            "Accident & illness coverage up to $10,000/year",
            "Prescription medications",
            "Specialist consultations",
            "Emergency vet visits",
            "24/7 Pet Helpline",
        ],
    },
    {
        "type": "premium",
        "name": "Puppy Premium",
        "base_monthly_premium": 55,
        "annual_coverage_limit": 20000,
        "deductible": 100,
        "features": [
            "Accident & illness coverage up to $20,000/year",
            "Routine care & wellness visits",
            "Dental care included",
            "Hereditary condition coverage",
            "Prescription medications",
            "Specialist consultations",
            "Low $100 deductible",
            "24/7 Pet Helpline",
        ],
    },
    {
        "type": "comprehensive",
        "name": "Puppy Comprehensive",
        "base_monthly_premium": 85,
        "annual_coverage_limit": 50000,
        "deductible": 0,
        "features": [
            "Unlimited accident & illness coverage (up to $50,000/year)",
            "ZERO deductible",
            "All routine & wellness care",
            "Full dental coverage",
            "Hereditary & chronic conditions",
            "Alternative therapies (acupuncture, hydrotherapy)",
            "Behavioral therapy",
            "Lost pet advertising & reward",
            "Travel coverage",
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
    breed: Dict[str, Any],
    age_years: int,
    plan_type: str = "standard",
    has_preexisting_conditions: bool = False
) -> Dict[str, Any]:
    """Calculate insurance quote based on breed, age, and plan."""
    plan = get_plan_by_type(plan_type)
    if not plan:
        plan = INSURANCE_PLANS[1]  # Default to standard

    premium = plan["base_monthly_premium"]

    # Apply breed risk multiplier
    breed_multiplier = float(breed.get("base_premium_multiplier", 1.0))
    premium *= breed_multiplier

    # Age adjustments
    if age_years < 1:
        premium *= 1.1  # Puppies have more accidents
    elif age_years >= 10:
        premium *= 1.5  # Very senior
    elif age_years >= 7:
        premium *= 1.3  # Senior dogs

    # Preexisting conditions surcharge
    if has_preexisting_conditions and plan_type in ["premium", "comprehensive"]:
        premium *= 1.25

    monthly_premium = round(premium, 2)
    annual_premium = round(monthly_premium * 12, 2)

    return {
        "monthly_premium": monthly_premium,
        "annual_premium": annual_premium,
        "plan": plan,
        "factors": {
            "breed_multiplier": breed_multiplier,
            "age_adjustment": "senior" if age_years >= 7 else "puppy" if age_years < 1 else "adult",
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
        print(f"[BUDDY DB] Error fetching user profile: {e}", file=sys.stderr)
        return None


async def get_user_dogs(user_id: str) -> List[Dict[str, Any]]:
    """Get all dogs registered by a user."""
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
        print(f"[BUDDY DB] Error fetching user dogs: {e}", file=sys.stderr)
        return []


async def save_user_dog(
    user_id: str,
    dog_name: str,
    breed_name: str,
    age_years: int,
    has_preexisting_conditions: bool = False,
    preexisting_conditions: List[str] = None
) -> Optional[int]:
    """Save a dog to the database."""
    try:
        # Look up breed
        breed = await get_breed_by_name(breed_name)
        breed_id = breed.get("id") if breed else None

        async with get_connection() as conn:
            result = await conn.fetchrow("""
                INSERT INTO user_dogs (user_id, name, breed_id, breed_name, age_years,
                                       has_preexisting_conditions, preexisting_conditions)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            """, user_id, dog_name, breed_id, breed_name, age_years,
                has_preexisting_conditions, preexisting_conditions or [])

            print(f"[BUDDY DB] Saved dog {dog_name} for user {user_id}", file=sys.stderr)
            return result["id"] if result else None
    except Exception as e:
        print(f"[BUDDY DB] Error saving user dog: {e}", file=sys.stderr)
        return None


async def get_user_policies(user_id: str) -> List[Dict[str, Any]]:
    """Get all policies for a user."""
    try:
        async with get_connection() as conn:
            rows = await conn.fetch("""
                SELECT p.*, d.name as dog_name, d.breed_name
                FROM insurance_policies p
                LEFT JOIN user_dogs d ON p.dog_id = d.id
                WHERE p.user_id = $1
                ORDER BY p.created_at DESC
            """, user_id)
            return [dict(row) for row in rows]
    except Exception as e:
        print(f"[BUDDY DB] Error fetching user policies: {e}", file=sys.stderr)
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

            print(f"[BUDDY DB] Saved quote for session {session_id}", file=sys.stderr)
            return result["id"] if result else None
    except Exception as e:
        print(f"[BUDDY DB] Error saving quote: {e}", file=sys.stderr)
        return None
