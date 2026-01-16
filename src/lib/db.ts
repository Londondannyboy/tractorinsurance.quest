import { neon } from '@neondatabase/serverless';

// Create a SQL query function using the Neon serverless driver
export const sql = neon(process.env.DATABASE_URL!);

// ============================================
// COMPREHENSIVE TYPE DEFINITIONS
// ============================================

export interface ClimateData {
  type: string;
  annual_sunshine_hours?: number;
  annual_rainfall_mm?: number;
  seasons?: Record<string, {
    months: string[];
    temp_avg_c: number;
    temp_min_c?: number;
    description: string;
  }>;
  best_months?: string[];
  humidity_avg_percent?: number;
  climate_rating?: number;
  note?: string;
}

export interface CrimeSafety {
  global_peace_index_rank?: number;
  safety_index?: number;
  crime_index?: number;
  violent_crime_rate?: string;
  property_crime_rate?: string;
  expat_safety_rating?: number;
  women_safety_rating?: number;
  emergency_number?: string;
  tourist_police?: string;
}

export interface Healthcare {
  system_type?: string;
  universal_coverage?: boolean;
  quality_rating?: number;
  private_healthcare?: {
    cost_consultation_eur?: number;
    cost_annual_insurance_eur?: number;
  };
  top_hospitals?: string[] | Array<{ name: string; city: string; type: string }>;
  english_speaking_doctors?: string;
  medical_tourism?: string;
}

export interface Lifestyle {
  work_life_balance_rating?: number;
  expat_community_size?: string;
  english_proficiency?: string;
  cultural_activities?: string[];
  beach_access?: string;
  child_friendly?: number;
  siesta_culture?: boolean;
  networking_opportunities?: string;
  outdoor_lifestyle?: boolean;
  multicultural?: boolean;
}

export interface Infrastructure {
  internet?: {
    avg_speed_mbps?: number;
    fiber_coverage_percent?: number;
    cost_monthly_eur?: number;
    reliability_rating?: number;
    vpn_note?: string;
  };
  transport?: {
    public_transport_rating?: number;
    car_essential?: boolean;
    uber_available?: boolean;
    taxi_app?: string;
    bike_culture?: boolean;
  };
  coworking_spaces?: Array<{
    name: string;
    city: string;
    cost_month_eur: number;
  }>;
}

export interface DiningNightlife {
  michelin_stars_total?: number;
  signature_dishes?: string[];
  avg_meal_cost_casual_eur?: number;
  avg_meal_cost_fine_eur?: number;
  avg_coffee_eur?: number;
  nightlife_rating?: number;
  best_restaurants?: Array<{
    name: string;
    city: string;
    cuisine: string;
    price: string;
    michelin?: number;
  }>;
  wine_regions?: string[];
  coffee_culture?: string;
}

export interface CapitalOverview {
  name: string;
  population?: number;
  metro_population?: number;
  area_km2?: number;
  is_divided?: boolean;
  division_note?: string;
  note?: string;
  landmarks?: string[];
  beach_distance_km?: number;
  districts?: Record<string, { description: string; vibe: string }>;
}

export interface QualityOfLife {
  overall_score?: number;
  cost_of_living_index?: number;
  purchasing_power_index?: number;
  safety_index?: number;
  climate_index?: number;
  expat_friendly_index?: number;
  healthcare_index?: number;
  pollution_index?: number;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  exchange_rate_usd?: number;
  exchange_rate_gbp?: number;
  pegged_to?: string;
  banking?: {
    major_banks?: string[];
    crypto_friendly?: string;
  };
  cash_preferred?: boolean;
}

export interface DigitalNomadInfo {
  visa_available?: boolean;
  visa_name?: string;
  min_income_monthly_eur?: number;
  duration_months?: number;
  max_stay_years?: number;
  tax_note?: string;
  coworking_scene?: string;
  nomad_community_size?: string;
  popular_areas?: string[];
  time_zone?: string;
}

export interface ComparisonHighlights {
  similar_to?: string[];
  unique_selling_points?: string[];
  vs_portugal?: { pros: string[]; cons: string[]; tax_comparison?: string };
  vs_cyprus?: { pros: string[]; cons: string[]; tax_comparison?: string };
  vs_malta?: { pros: string[]; cons: string[]; tax_comparison?: string };
  vs_spain?: { pros: string[]; cons: string[]; tax_comparison?: string };
}

export interface Images {
  hero?: string;
  capital?: string;
  beach?: string;
  food?: string;
  nature?: string;
  city?: string;
  gradient?: string;
}

export interface PropertyMarket {
  avgPricePerSqmNational?: number;
  priceGrowthYoY?: number;
  foreignOwnershipAllowed?: boolean;
  mortgageAvailable?: boolean;
  typicalDepositPercent?: number;
  cities?: Array<{
    city: string;
    properties: Array<{
      type: string;
      avgPriceEur: number;
      pricePerSqm: number;
      rentalYield?: number;
    }>;
  }>;
}

// Main Destination interface
export interface Destination {
  slug: string;
  country_name: string;
  flag: string;
  region: string;
  language: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  quick_facts: Record<string, string>;
  highlights: string[];
  visas: Array<{
    name: string;
    description: string;
    requirements?: string[];
    cost?: string;
    duration?: string;
  }>;
  cost_of_living: {
    monthly_total?: string;
    breakdown?: Record<string, string>;
    comparison?: string;
  };
  job_market?: Record<string, unknown>;
  faqs?: Array<{ question: string; answer: string }>;
  education_stats?: Record<string, unknown>;
  company_incorporation?: Record<string, unknown>;
  property_info?: Record<string, unknown>;
  expatriate_scheme?: Record<string, unknown>;
  residency_requirements?: Record<string, unknown>;
  // New comprehensive fields
  climate_data?: ClimateData;
  crime_safety?: CrimeSafety;
  healthcare?: Healthcare;
  lifestyle?: Lifestyle;
  infrastructure?: Infrastructure;
  dining_nightlife?: DiningNightlife;
  capital_overview?: CapitalOverview;
  quality_of_life?: QualityOfLife;
  currency_info?: CurrencyInfo;
  digital_nomad_info?: DigitalNomadInfo;
  comparison_highlights?: ComparisonHighlights;
  images?: Images;
  property_market?: PropertyMarket;
}

// ============================================
// DATABASE QUERIES
// ============================================

// Get a single destination with ALL data
export async function getDestination(slug: string): Promise<Destination | null> {
  try {
    const result = await sql`
      SELECT
        slug, country_name, flag, region, language,
        hero_title, hero_subtitle, hero_image_url,
        quick_facts, highlights, visas, cost_of_living,
        job_market, faqs,
        COALESCE(education_stats, '{}'::jsonb) as education_stats,
        COALESCE(company_incorporation, '{}'::jsonb) as company_incorporation,
        COALESCE(property_info, '{}'::jsonb) as property_info,
        COALESCE(expatriate_scheme, '{}'::jsonb) as expatriate_scheme,
        COALESCE(residency_requirements, '{}'::jsonb) as residency_requirements,
        COALESCE(climate_data, '{}'::jsonb) as climate_data,
        COALESCE(crime_safety, '{}'::jsonb) as crime_safety,
        COALESCE(healthcare, '{}'::jsonb) as healthcare,
        COALESCE(lifestyle, '{}'::jsonb) as lifestyle,
        COALESCE(infrastructure, '{}'::jsonb) as infrastructure,
        COALESCE(dining_nightlife, '{}'::jsonb) as dining_nightlife,
        COALESCE(capital_overview, '{}'::jsonb) as capital_overview,
        COALESCE(quality_of_life, '{}'::jsonb) as quality_of_life,
        COALESCE(currency_info, '{}'::jsonb) as currency_info,
        COALESCE(digital_nomad_info, '{}'::jsonb) as digital_nomad_info,
        COALESCE(comparison_highlights, '{}'::jsonb) as comparison_highlights,
        COALESCE(images, '{}'::jsonb) as images,
        COALESCE(property_market, '{}'::jsonb) as property_market
      FROM destinations
      WHERE slug = ${slug.toLowerCase()} AND enabled = true
    `;

    return result[0] as Destination || null;
  } catch (error) {
    console.error('Error fetching destination:', error);
    return null;
  }
}

// Get all destinations (summary for list views)
export async function getAllDestinations(): Promise<Destination[]> {
  try {
    const result = await sql`
      SELECT
        slug, country_name, flag, region, language,
        hero_title, hero_subtitle, hero_image_url,
        quick_facts, highlights, visas, cost_of_living,
        COALESCE(quality_of_life, '{}'::jsonb) as quality_of_life,
        COALESCE(digital_nomad_info, '{}'::jsonb) as digital_nomad_info,
        COALESCE(images, '{}'::jsonb) as images
      FROM destinations
      WHERE enabled = true
      ORDER BY country_name
    `;

    return result as Destination[];
  } catch (error) {
    console.error('Error fetching all destinations:', error);
    return [];
  }
}

// Search destinations by name
export async function searchDestinations(query: string): Promise<Destination[]> {
  try {
    const result = await sql`
      SELECT
        slug, country_name, flag, region, language,
        hero_title, hero_subtitle, hero_image_url,
        quick_facts, highlights, visas, cost_of_living,
        COALESCE(quality_of_life, '{}'::jsonb) as quality_of_life,
        COALESCE(images, '{}'::jsonb) as images
      FROM destinations
      WHERE enabled = true
        AND (
          country_name ILIKE ${'%' + query + '%'}
          OR region ILIKE ${'%' + query + '%'}
        )
      ORDER BY country_name
      LIMIT 5
    `;

    return result as Destination[];
  } catch (error) {
    console.error('Error searching destinations:', error);
    return [];
  }
}

// Get full comparison data for two destinations
export async function getComparison(slug1: string, slug2: string): Promise<{
  country1: Destination | null;
  country2: Destination | null;
}> {
  const [country1, country2] = await Promise.all([
    getDestination(slug1),
    getDestination(slug2)
  ]);
  return { country1, country2 };
}

// Get destinations for comparison picker (lightweight)
export async function getDestinationsForPicker(): Promise<Array<{ slug: string; country_name: string; flag: string; region: string }>> {
  try {
    const result = await sql`
      SELECT slug, country_name, flag, region
      FROM destinations
      WHERE enabled = true
      ORDER BY country_name
    `;
    return result as Array<{ slug: string; country_name: string; flag: string; region: string }>;
  } catch (error) {
    console.error('Error fetching destinations for picker:', error);
    return [];
  }
}
