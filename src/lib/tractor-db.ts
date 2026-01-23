import { neon } from '@neondatabase/serverless';

// Lazy database connection - only created when needed at runtime
// This prevents the connection from being created during Next.js build
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _sqlClient: any = null;

export function getSql() {
  if (!_sqlClient) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _sqlClient = neon(databaseUrl);
  }
  return _sqlClient;
}

// ============================================
// TRACTOR INSURANCE TYPE DEFINITIONS
// ============================================

export interface TractorType {
  id: number;
  name: string;
  size: 'compact' | 'utility' | 'standard' | 'large';
  risk_category: 'low' | 'medium' | 'high';
  avg_lifespan_years: number;
  common_health_issues: string[];
  base_premium_multiplier: number;
  image_url?: string;
  description?: string;
  temperament: string[];
  exercise_needs: 'low' | 'moderate' | 'high';
  grooming_needs: 'low' | 'moderate' | 'high';
}

export interface UserTractor {
  id: number;
  user_id: string;
  name: string;
  type_id?: number;       // DB column: breed_id
  type_name: string;      // DB column: breed_name
  date_of_birth?: Date;
  age_years: number;
  weight_kg?: number;
  gender?: string;
  is_neutered: boolean;
  microchip_number?: string;
  has_preexisting_conditions: boolean;
  preexisting_conditions?: string[];
  photo_url?: string;
}

export interface InsurancePolicy {
  id: number;
  policy_number: string;
  user_id: string;
  tractor_id: number;    // DB column: dog_id
  plan_type: 'basic' | 'standard' | 'premium' | 'comprehensive';
  monthly_premium: number;
  annual_coverage_limit: number;
  deductible: number;
  coverage_details: CoverageDetails;
  start_date: Date;
  end_date?: Date;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
}

export interface CoverageDetails {
  accident_coverage: boolean;
  illness_coverage: boolean;
  routine_care: boolean;
  dental_coverage: boolean;
  hereditary_conditions: boolean;
  prescription_meds: boolean;
  emergency_care: boolean;
  specialist_visits: boolean;
  alternative_therapies: boolean;
}

export interface PolicyQuote {
  id: number;
  user_id?: string;
  session_id?: string;
  tractor_details: {         // DB column: dog_details
    tractorType: string;
    age: number;
    weight?: number;
    modifications?: string[];
  };
  plan_type: string;
  quoted_premium: number;
  coverage_details: CoverageDetails;
  valid_until: Date;
}

export interface InsurancePlan {
  type: 'basic' | 'standard' | 'premium' | 'comprehensive';
  name: string;
  base_monthly_premium: number;
  annual_coverage_limit: number;
  deductible: number;
  coverage: CoverageDetails;
  features: string[];
}

// ============================================
// INSURANCE PLANS
// ============================================

export const INSURANCE_PLANS: InsurancePlan[] = [
  {
    type: 'basic',
    name: 'Tractor Basic',
    base_monthly_premium: 25,
    annual_coverage_limit: 25000,
    deductible: 500,
    coverage: {
      accident_coverage: true,
      illness_coverage: false,
      routine_care: false,
      dental_coverage: false,
      hereditary_conditions: false,
      prescription_meds: false,
      emergency_care: true,
      specialist_visits: false,
      alternative_therapies: false,
    },
    features: [
      'Third-party liability cover',
      'Fire damage protection',
      '24/7 emergency helpline',
    ],
  },
  {
    type: 'standard',
    name: 'Tractor Standard',
    base_monthly_premium: 75,
    annual_coverage_limit: 75000,
    deductible: 350,
    coverage: {
      accident_coverage: true,
      illness_coverage: true,
      routine_care: false,
      dental_coverage: false,
      hereditary_conditions: false,
      prescription_meds: true,
      emergency_care: true,
      specialist_visits: true,
      alternative_therapies: false,
    },
    features: [
      'Theft & accidental damage cover up to \u00a375,000/year',
      'Road use cover included',
      'Breakdown assistance',
      '24/7 emergency helpline',
      'Windscreen & glass cover',
    ],
  },
  {
    type: 'premium',
    name: 'Tractor Premium',
    base_monthly_premium: 150,
    annual_coverage_limit: 150000,
    deductible: 200,
    coverage: {
      accident_coverage: true,
      illness_coverage: true,
      routine_care: true,
      dental_coverage: true,
      hereditary_conditions: true,
      prescription_meds: true,
      emergency_care: true,
      specialist_visits: true,
      alternative_therapies: false,
    },
    features: [
      'Full comprehensive cover up to \u00a3150,000/year',
      'Hire replacement tractor during repairs',
      'Attached implements covered',
      'Road use & field use',
      'Breakdown & recovery assistance',
      'Legal expenses cover',
      'Low \u00a3200 excess',
      '24/7 emergency helpline',
    ],
  },
  {
    type: 'comprehensive',
    name: 'Tractor Comprehensive',
    base_monthly_premium: 250,
    annual_coverage_limit: 500000,
    deductible: 0,
    coverage: {
      accident_coverage: true,
      illness_coverage: true,
      routine_care: true,
      dental_coverage: true,
      hereditary_conditions: true,
      prescription_meds: true,
      emergency_care: true,
      specialist_visits: true,
      alternative_therapies: true,
    },
    features: [
      'Full comprehensive cover up to \u00a3500,000/year',
      'ZERO excess option',
      'All implements & attachments covered',
      'Hire replacement machinery',
      'Business interruption cover',
      'Multi-vehicle fleet discount',
      'Agreed value guarantee',
      'Worldwide cover for shows & events',
      'GPS tracker contribution',
      'Priority claims processing',
    ],
  },
];

// ============================================
// DATABASE QUERIES
// ============================================

// Get all tractor types
export async function getAllTractorTypes(): Promise<TractorType[]> {
  try {
    const result = await getSql()`
      SELECT * FROM dog_breeds ORDER BY name
    `;
    return result as TractorType[];
  } catch (error) {
    console.error('Error fetching tractor types:', error);
    return [];
  }
}

// Get tractor type by name (fuzzy match)
export async function getTractorTypeByName(name: string): Promise<TractorType | null> {
  try {
    const result = await getSql()`
      SELECT * FROM dog_breeds
      WHERE LOWER(name) = LOWER(${name})
      OR LOWER(name) LIKE LOWER(${'%' + name + '%'})
      ORDER BY
        CASE WHEN LOWER(name) = LOWER(${name}) THEN 0 ELSE 1 END
      LIMIT 1
    `;
    return result[0] as TractorType || null;
  } catch (error) {
    console.error('Error fetching tractor type:', error);
    return null;
  }
}

// Search tractor types
export async function searchTractorTypes(query: string): Promise<TractorType[]> {
  try {
    const result = await getSql()`
      SELECT * FROM dog_breeds
      WHERE LOWER(name) LIKE LOWER(${'%' + query + '%'})
      ORDER BY name
      LIMIT 5
    `;
    return result as TractorType[];
  } catch (error) {
    console.error('Error searching tractor types:', error);
    return [];
  }
}

// Get tractor type by ID
export async function getTractorTypeById(id: number): Promise<TractorType | null> {
  try {
    const result = await getSql()`
      SELECT * FROM dog_breeds WHERE id = ${id}
    `;
    return result[0] as TractorType || null;
  } catch (error) {
    console.error('Error fetching tractor type by ID:', error);
    return null;
  }
}

// Calculate insurance quote
export function calculateQuote(
  tractorType: TractorType,
  ageYears: number,
  planType: InsurancePlan['type'],
  hasModifications: boolean = false
): { monthlyPremium: number; annualPremium: number; plan: InsurancePlan } {
  const plan = INSURANCE_PLANS.find(p => p.type === planType) || INSURANCE_PLANS[1];

  let premium = plan.base_monthly_premium;

  // Apply tractor type risk multiplier
  premium *= tractorType.base_premium_multiplier;

  // Age adjustments (tractors depreciate but older ones need more repairs)
  if (ageYears < 2) {
    premium *= 1.15; // New tractors - higher replacement value
  } else if (ageYears >= 15) {
    premium *= 1.4; // Older tractors - more breakdown risk
  } else if (ageYears >= 10) {
    premium *= 1.25;
  }

  // Modifications surcharge
  if (hasModifications && (planType === 'premium' || planType === 'comprehensive')) {
    premium *= 1.2;
  }

  const monthlyPremium = Math.round(premium * 100) / 100;
  const annualPremium = Math.round(monthlyPremium * 12 * 100) / 100;

  return { monthlyPremium, annualPremium, plan };
}

// Save a quote
export async function saveQuote(
  quote: Omit<PolicyQuote, 'id'>
): Promise<number | null> {
  try {
    const result = await getSql()`
      INSERT INTO policy_quotes (user_id, session_id, dog_details, plan_type, quoted_premium, coverage_details, valid_until)
      VALUES (${quote.user_id || null}, ${quote.session_id || null}, ${JSON.stringify(quote.tractor_details)}, ${quote.plan_type}, ${quote.quoted_premium}, ${JSON.stringify(quote.coverage_details)}, ${quote.valid_until.toISOString()})
      RETURNING id
    `;
    return result[0]?.id || null;
  } catch (error) {
    console.error('Error saving quote:', error);
    return null;
  }
}

// Get user's tractors
export async function getUserTractors(userId: string): Promise<UserTractor[]> {
  try {
    const result = await getSql()`
      SELECT * FROM user_dogs WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    return result as UserTractor[];
  } catch (error) {
    console.error('Error fetching user tractors:', error);
    return [];
  }
}

// Add a tractor for user
export async function addUserTractor(tractor: Omit<UserTractor, 'id'>): Promise<number | null> {
  try {
    const result = await getSql()`
      INSERT INTO user_dogs (user_id, name, breed_id, breed_name, date_of_birth, age_years, weight_kg, gender, is_neutered, microchip_number, has_preexisting_conditions, preexisting_conditions, photo_url)
      VALUES (${tractor.user_id}, ${tractor.name}, ${tractor.type_id || null}, ${tractor.type_name}, ${tractor.date_of_birth?.toISOString() || null}, ${tractor.age_years}, ${tractor.weight_kg || null}, ${tractor.gender || null}, ${tractor.is_neutered}, ${tractor.microchip_number || null}, ${tractor.has_preexisting_conditions}, ${tractor.preexisting_conditions || []}, ${tractor.photo_url || null})
      RETURNING id
    `;
    return result[0]?.id || null;
  } catch (error) {
    console.error('Error adding user tractor:', error);
    return null;
  }
}

// Get user's policies
export async function getUserPolicies(userId: string): Promise<InsurancePolicy[]> {
  try {
    const result = await getSql()`
      SELECT p.*, d.name as tractor_name, d.breed_name as type_name
      FROM insurance_policies p
      LEFT JOIN user_dogs d ON p.dog_id = d.id
      WHERE p.user_id = ${userId}
      ORDER BY p.created_at DESC
    `;
    return result as InsurancePolicy[];
  } catch (error) {
    console.error('Error fetching user policies:', error);
    return [];
  }
}

// Create a policy from a quote
export async function createPolicy(
  userId: string,
  tractorId: number,
  quoteId: number,
  planType: InsurancePlan['type']
): Promise<string | null> {
  try {
    const plan = INSURANCE_PLANS.find(p => p.type === planType);
    if (!plan) return null;

    const policyNumber = `TRC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    await getSql()`
      INSERT INTO insurance_policies (policy_number, user_id, dog_id, plan_type, monthly_premium, annual_coverage_limit, deductible, coverage_details, start_date, end_date, status)
      VALUES (${policyNumber}, ${userId}, ${tractorId}, ${planType}, ${plan.base_monthly_premium}, ${plan.annual_coverage_limit}, ${plan.deductible}, ${JSON.stringify(plan.coverage)}, ${startDate.toISOString()}, ${endDate.toISOString()}, 'active')
    `;

    // Mark quote as converted
    await getSql()`
      UPDATE policy_quotes SET converted_to_policy_id = (SELECT id FROM insurance_policies WHERE policy_number = ${policyNumber})
      WHERE id = ${quoteId}
    `;

    return policyNumber;
  } catch (error) {
    console.error('Error creating policy:', error);
    return null;
  }
}
