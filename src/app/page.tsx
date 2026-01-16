'use client';

import { useState, useCallback, useEffect } from 'react';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { useCopilotAction, useCopilotReadable, useCopilotChat } from '@copilotkit/react-core';
import { Role, TextMessage } from '@copilotkit/runtime-client-gql';
import { motion } from 'framer-motion';
import { DynamicView, GeneratedView, ViewBlock } from '@/components/DynamicView';
import { HumeWidget } from '@/components/HumeWidget';
import { ComparisonPicker } from '@/components/ComparisonPicker';
import { CountryForceGraph } from '@/components/CountryForceGraph';

// Types matching database schema (comprehensive)
interface Destination {
  slug: string;
  country_name: string;
  flag: string;
  region: string;
  language: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url?: string;
  quick_facts?: Array<{ icon: string; label: string; value: string }>;
  highlights?: Array<{ icon: string; text: string } | string>;
  visas?: Array<{
    name: string;
    description?: string;
    requirements?: string[];
    cost?: string;
    duration?: string;
  }>;
  cost_of_living?: Array<{
    cityName: string;
    currency: string;
    costIndex?: number;
    rent1BRCenter?: number;
    rent1BROutside?: number;
    rent3BRCenter?: number;
    groceries?: number;
    dining?: number;
    transportation?: number;
    utilities?: number;
  }>;
  // New comprehensive fields
  climate_data?: {
    type: string;
    annual_sunshine_hours?: number;
    seasons?: Record<string, { months: string[]; temp_avg_c: number; temp_min_c?: number; description: string }>;
    best_months?: string[];
    climate_rating?: number;
    humidity_avg_percent?: number;
  };
  crime_safety?: {
    safety_index?: number;
    expat_safety_rating?: number;
    emergency_number?: string;
  };
  healthcare?: {
    system_type?: string;
    quality_rating?: number;
    english_speaking_doctors?: string;
  };
  lifestyle?: {
    work_life_balance_rating?: number;
    expat_community_size?: string;
    english_proficiency?: string;
    cultural_activities?: string[];
  };
  dining_nightlife?: {
    michelin_stars_total?: number;
    signature_dishes?: string[];
    avg_meal_cost_casual_eur?: number;
    avg_meal_cost_fine_eur?: number;
    nightlife_rating?: number;
    best_restaurants?: Array<{ name: string; city: string; cuisine: string; price: string; michelin?: number }>;
  };
  capital_overview?: {
    name: string;
    population?: number;
    landmarks?: string[];
  };
  quality_of_life?: {
    overall_score?: number;
    cost_of_living_index?: number;
    safety_index?: number;
    climate_index?: number;
    expat_friendly_index?: number;
  };
  digital_nomad_info?: {
    visa_available?: boolean;
    visa_name?: string;
    min_income_monthly_eur?: number;
    coworking_scene?: string;
    nomad_community_size?: string;
  };
  comparison_highlights?: {
    similar_to?: string[];
    unique_selling_points?: string[];
  };
  images?: {
    hero?: string;
    capital?: string;
    gradient?: string;
  };
  property_market?: {
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
  };
}

interface RelocationState {
  currentDestination?: Destination;
  availableDestinations: Destination[];
  customView?: GeneratedView; // AI-generated dynamic views
  userPreferences?: {
    budget?: string;
    climate?: string;
    purpose?: string;
  };
  // Dynamic background based on selected country
  backgroundImage?: string;
  backgroundGradient?: string;
  currentCountry?: string;
}

// Destination Card Component
function DestinationCard({ destination }: { destination: Destination }) {
  const costData = destination.cost_of_living || [];
  const visas = destination.visas || [];
  const highlights = destination.highlights || [];
  const quickFacts = destination.quick_facts || [];
  const primaryCity = costData[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black/20 backdrop-blur-lg rounded-3xl border border-white/10 shadow-xl overflow-hidden"
    >
      {/* Header with Hero Image */}
      <div
        className="h-60 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${destination.hero_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-center gap-4">
          <span className="text-6xl drop-shadow-lg">{destination.flag}</span>
          <div>
            <h2 className="text-4xl font-extrabold text-white" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>{destination.country_name}</h2>
            <p className="text-amber-300 text-lg">{destination.region}</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Hero Text */}
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold text-white leading-tight">{destination.hero_title}</h3>
          <p className="text-white/60 text-md mt-2 max-w-2xl mx-auto">{destination.hero_subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Cost & Visas */}
          <div className="space-y-8">
            {/* Cost of Living */}
            {primaryCity && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-sm font-semibold text-white/50 mb-3">Cost of Living - {primaryCity.cityName}</h3>
                {primaryCity.rent1BRCenter && (
                  <div className="text-3xl font-bold text-emerald-400 mb-4">
                    {primaryCity.currency} {primaryCity.rent1BRCenter.toLocaleString()}<span className="text-lg text-white/50">/mo (1BR center)</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {primaryCity.groceries && <div><span className="text-white/50">Groceries:</span> <span className="text-white/80">{primaryCity.currency} {primaryCity.groceries}</span></div>}
                  {primaryCity.dining && <div><span className="text-white/50">Dining:</span> <span className="text-white/80">{primaryCity.currency} {primaryCity.dining}</span></div>}
                  {primaryCity.transportation && <div><span className="text-white/50">Transport:</span> <span className="text-white/80">{primaryCity.currency} {primaryCity.transportation}</span></div>}
                  {primaryCity.utilities && <div><span className="text-white/50">Utilities:</span> <span className="text-white/80">{primaryCity.currency} {primaryCity.utilities}</span></div>}
                </div>
              </div>
            )}

            {/* Visa Options */}
            {visas.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-sm font-semibold text-white/50 mb-3">Visa Options</h3>
                <div className="flex flex-wrap gap-2">
                  {visas.map((visa) => (
                    <span key={visa.name} className="px-3 py-1 bg-amber-500/20 text-amber-300 text-sm rounded-full">
                      {visa.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Highlights & Facts */}
          <div className="space-y-8">
            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-sm font-semibold text-white/50 mb-3">Highlights</h3>
                <ul className="space-y-2">
                  {highlights.map((highlight, index) => {
                    const text = typeof highlight === 'string' ? highlight : highlight.text;
                    const icon = typeof highlight === 'string' ? '✨' : (highlight.icon || '✨');
                    return (
                      <li key={index} className="flex items-start gap-3 text-white/80">
                        <span className="text-amber-400 mt-1">{icon}</span>
                        {text}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Quick Facts */}
            {quickFacts.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-sm font-semibold text-white/50 mb-3">Quick Facts</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                {quickFacts.map((fact, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-lg">{fact.icon}</span>
                    <div>
                      <div className="text-white/50">{fact.label}</div>
                      <div className="font-semibold text-white/80">{fact.value}</div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Empty state
function EmptyState() {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center shadow-lg">
      <div className="text-7xl mb-6 animate-pulse">🗺️</div>
      <h3 className="text-3xl font-bold text-white mb-4">Your Next Chapter Awaits</h3>
      <p className="text-white/70 max-w-lg mx-auto">
        Where in the world will your story unfold? Chat with ATLAS to explore destinations, or select a country to begin your journey.
      </p>
    </div>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-3xl border border-white/10 shadow-xl overflow-hidden animate-pulse">
      <div className="h-60 bg-white/10" />
      <div className="p-8">
        <div className="h-8 bg-white/10 rounded w-2/3 mx-auto mb-4" />
        <div className="h-4 bg-white/10 rounded w-1/2 mx-auto mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="h-40 bg-white/10 rounded-xl" />
            <div className="h-24 bg-white/10 rounded-xl" />
          </div>
          <div className="space-y-8">
            <div className="h-32 bg-white/10 rounded-xl" />
            <div className="h-32 bg-white/10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Chat Input Component
function ChatInput() {
  const [message, setMessage] = useState('');
  const { appendMessage } = useCopilotChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    appendMessage(new TextMessage({ content: message, role: Role.User }));
    setMessage('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/20 backdrop-blur-md border border-white/10 rounded-full p-2 flex items-center shadow-lg"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask ATLAS anything... e.g., 'Compare Portugal vs. Spain'"
        className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none px-4"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-amber-500 rounded-full text-stone-900 font-semibold hover:bg-amber-400 transition-colors"
      >
        Send
      </button>
    </form>
  );
}

// Helper to create a comprehensive dashboard view from destination data
function createDashboardView(destination: Destination): GeneratedView {
  const primaryCity = destination.cost_of_living?.[0];
  const blocks: ViewBlock[] = [];

  // === TOP KPIS ===
  blocks.push({
    type: 'kpi',
    props: {
      label: 'Safety Index',
      value: destination.quality_of_life?.safety_index?.toFixed(1) || destination.crime_safety?.safety_index?.toFixed(1) || 'N/A',
      icon: '🛡️',
    },
  });

  if (destination.quality_of_life?.overall_score) {
    blocks.push({
      type: 'kpi',
      props: {
        label: 'Quality of Life',
        value: `${destination.quality_of_life.overall_score.toFixed(1)}/10`,
        icon: '⭐',
      },
    });
  }

  if (destination.digital_nomad_info?.min_income_monthly_eur) {
    blocks.push({
      type: 'kpi',
      props: {
        label: 'Nomad Visa Income',
        value: `€${destination.digital_nomad_info.min_income_monthly_eur.toLocaleString()}/mo`,
        icon: '💻',
      },
    });
  }

  // === TIMELINE ===
  blocks.push({
    type: 'timeline',
    props: {
      country: destination.country_name,
      flag: destination.flag,
      relocationType: 'digital_nomad',
      familyStatus: 'single',
    },
  });

  // === QUALITY OF LIFE RADAR ===
  if (destination.quality_of_life) {
    const qol = destination.quality_of_life;
    blocks.push({
      type: 'quality_of_life',
      props: {
        title: 'Quality of Life Metrics',
        country: destination.country_name,
        flag: destination.flag,
        overallScore: qol.overall_score,
        metrics: [
          { label: 'Safety', value: qol.safety_index || 0, icon: '🛡️' },
          { label: 'Cost of Living', value: 100 - (qol.cost_of_living_index || 50), icon: '💰' },
          { label: 'Climate', value: qol.climate_index || 0, icon: '☀️' },
          { label: 'Expat Friendly', value: (qol.expat_friendly_index || 0) * 10, icon: '🌍' },
        ].filter(m => m.value > 0),
      },
    });
  }

  // === CLIMATE ===
  if (destination.climate_data && Object.keys(destination.climate_data).length > 0) {
    blocks.push({
      type: 'climate',
      props: {
        type: destination.climate_data.type || 'Mediterranean',
        annualSunshineHours: destination.climate_data.annual_sunshine_hours,
        seasons: destination.climate_data.seasons,
        bestMonths: destination.climate_data.best_months,
        rating: destination.climate_data.climate_rating,
        humidity: destination.climate_data.humidity_avg_percent,
      },
    });
  }

  // === COST OF LIVING ===
  if (primaryCity) {
    blocks.push({
      type: 'cost_chart',
      props: {
        title: `Monthly Expenses in ${primaryCity.cityName}`,
        currency: primaryCity.currency,
        items: [
          { label: 'Rent (1BR Center)', amount: primaryCity.rent1BRCenter || 0 },
          { label: 'Groceries', amount: primaryCity.groceries || 0 },
          { label: 'Dining Out', amount: primaryCity.dining || 0 },
          { label: 'Transportation', amount: primaryCity.transportation || 0 },
          { label: 'Utilities', amount: primaryCity.utilities || 0 },
        ].filter(i => i.amount > 0),
      },
    });
  }

  // === DINING GUIDE ===
  if (destination.dining_nightlife && Object.keys(destination.dining_nightlife).length > 0) {
    const dining = destination.dining_nightlife;
    blocks.push({
      type: 'restaurant',
      props: {
        country: destination.country_name,
        flag: destination.flag,
        restaurants: dining.best_restaurants || [],
        signatureDishes: dining.signature_dishes,
        michelinTotal: dining.michelin_stars_total,
        avgCasual: dining.avg_meal_cost_casual_eur,
        avgFine: dining.avg_meal_cost_fine_eur,
        currency: '€',
      },
    });
  }

  // === PROS & CONS ===
  const usp = destination.comparison_highlights?.unique_selling_points || [];
  const highlights = destination.highlights?.slice(0, 3).map(h => typeof h === 'string' ? h : h.text) || [];
  const pros = [...usp, ...highlights].slice(0, 5);

  if (pros.length > 0) {
    blocks.push({
      type: 'pros_cons',
      props: {
        title: `Why ${destination.country_name}?`,
        country: destination.country_name,
        flag: destination.flag,
        pros,
        cons: [
          destination.lifestyle?.english_proficiency === 'Low-Moderate' ? 'Language barrier may exist' : null,
          'Bureaucracy can vary',
          'Cultural adjustment period',
          'Research healthcare options',
        ].filter(Boolean) as string[],
      },
    });
  }

  // === PROPERTY MARKET ===
  if (destination.property_market && destination.property_market.cities && destination.property_market.cities.length > 0) {
    blocks.push({
      type: 'property',
      props: {
        country: destination.country_name,
        flag: destination.flag,
        currency: 'EUR',
        cities: destination.property_market.cities,
        avgPricePerSqmNational: destination.property_market.avgPricePerSqmNational,
        priceGrowthYoY: destination.property_market.priceGrowthYoY,
        foreignOwnershipAllowed: destination.property_market.foreignOwnershipAllowed,
        mortgageAvailable: destination.property_market.mortgageAvailable,
        typicalDepositPercent: destination.property_market.typicalDepositPercent,
      },
    });
  }

  // === INFO CARDS ===
  if (destination.digital_nomad_info?.visa_available) {
    blocks.push({
      type: 'info_card',
      props: {
        title: destination.digital_nomad_info.visa_name || 'Digital Nomad Visa',
        icon: '💻',
        variant: 'highlight',
        content: `Min income: €${destination.digital_nomad_info.min_income_monthly_eur?.toLocaleString()}/mo. ${destination.digital_nomad_info.coworking_scene || ''}`,
        items: [
          { label: 'Nomad Community', value: destination.digital_nomad_info.nomad_community_size || 'Growing' },
        ],
      },
    });
  }

  if (destination.capital_overview) {
    blocks.push({
      type: 'info_card',
      props: {
        title: `Capital: ${destination.capital_overview.name}`,
        icon: '🏛️',
        variant: 'info',
        content: destination.capital_overview.population
          ? `Population: ${(destination.capital_overview.population / 1000000).toFixed(1)}M`
          : destination.capital_overview.name,
        items: destination.capital_overview.landmarks?.slice(0, 3).map(l => ({ label: '📍', value: l })),
      },
    });
  }

  return {
    title: `${destination.flag} ${destination.country_name}`,
    subtitle: destination.hero_title,
    blocks,
  };
}

export default function Home() {
  const [state, setState] = useState<RelocationState>({
    availableDestinations: [],
  });
  const [loading, setLoading] = useState(true);
  const [comparingLoading, setComparingLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const { appendMessage } = useCopilotChat();

  // Fetch available destinations on mount
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch('/api/destinations');
        if (res.ok) {
          const destinations = await res.json();
          setState(prev => ({ ...prev, availableDestinations: destinations }));
        }
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, []);

  // Make state readable to the AI
  useCopilotReadable({
    description: 'Current relocation exploration state',
    value: state,
  });

  // Action: Show destination
  useCopilotAction({
    name: "show_destination",
    description: "REQUIRED: Show destination details when user asks about a country. Call this whenever a country is mentioned.",
    parameters: [
      { name: "country", type: "string" as const, description: "Country name or slug (e.g., 'Portugal', 'portugal', 'Spain')" },
    ],
    handler: async ({ country }) => {
      console.log('🌍 show_destination called for:', country);

      try {
        const slug = country.toLowerCase().replace(/\s+/g, '-');
        const res = await fetch(`/api/destinations?slug=${slug}`);

        if (!res.ok) {
          const searchRes = await fetch(`/api/destinations?search=${encodeURIComponent(country)}`);
          if (searchRes.ok) {
            const results = await searchRes.json();
            if (results.length > 0) {
              const firstResult = results[0];
              const fullRes = await fetch(`/api/destinations?slug=${firstResult.slug}`);
              if (fullRes.ok) {
                const destination = await fullRes.json();
                const view = createDashboardView(destination);
                setState(prev => ({ ...prev, currentDestination: undefined, customView: view }));
                return `Showing dashboard for ${destination.country_name}.`;
              }
            }
          }
          return `I couldn't find detailed data for "${country}". Try one of our featured destinations!`;
        }

        const destination = await res.json();
        const view = createDashboardView(destination);
        // Set dynamic background from destination images
        const bgImage = destination.images?.hero || destination.hero_image_url;
        const bgGradient = destination.images?.gradient || 'from-black/70 to-black/50';
        setState(prev => ({
          ...prev,
          currentDestination: undefined,
          customView: view,
          backgroundImage: bgImage,
          backgroundGradient: bgGradient,
          currentCountry: destination.country_name,
        }));
        return `Showing comprehensive dashboard for ${destination.country_name}.`;
      } catch (error) {
        console.error('Error fetching destination:', error);
        return `Error loading destination data. Please try again.`;
      }
    },
    render: ({ status }) => {
      if (status === 'executing') {
        return <div className="text-amber-400 text-sm p-2 bg-amber-500/10 rounded">Loading destination from database...</div>;
      }
      if (status === 'complete') {
        return <div className="text-amber-400 text-sm p-2 bg-amber-500/10 rounded">✓ Destination loaded!</div>;
      }
      return <></>;
    },
  });

  // Action: Save user preferences
  useCopilotAction({
    name: "save_preferences",
    description: "Save user's relocation preferences when they mention budget, climate, or purpose.",
    parameters: [
      { name: "budget", type: "string" as const, description: "Monthly budget range" },
      { name: "climate", type: "string" as const, description: "Climate preference" },
      { name: "purpose", type: "string" as const, description: "Purpose of relocation" },
    ],
    handler: async (prefs) => {
      console.log('💾 Saving preferences:', prefs);
      setState(prev => ({
        ...prev,
        userPreferences: {
          ...prev.userPreferences,
          ...Object.fromEntries(
            Object.entries(prefs).filter(([, v]) => v !== undefined && v !== null)
          ),
        },
      }));
      return `Noted! I'll tailor recommendations based on your preferences.`;
    },
    render: ({ status }) => {
      if (status === 'complete') {
        return <div className="text-emerald-400 text-sm p-2 bg-emerald-500/10 rounded">✓ Preferences saved!</div>;
      }
      return <></>;
    },
  });

  // Action: Generate custom view (MDX-powered dynamic UI composition)
  useCopilotAction({
    name: "generate_custom_view",
    description: `Generate a custom visual comparison or analysis. Use this when users ask to:
- Compare two countries ("Compare Portugal vs Spain")
- See a cost breakdown ("Show me cost of living breakdown for Lisbon")
- Analyze pros and cons ("What are the pros and cons of moving to Thailand?")
- Create custom analysis ("Compare visa options for digital nomads")

This creates dynamic, tailored visualizations based on the user's specific question.`,
    parameters: [
      { name: "title", type: "string" as const, description: "Title for the view" },
      { name: "subtitle", type: "string" as const, description: "Optional subtitle" },
      { name: "view_type", type: "string" as const, description: "Type: 'comparison', 'cost_breakdown', 'pros_cons', 'analysis'" },
      { name: "countries", type: "string" as const, description: "Comma-separated country names involved" },
      { name: "focus", type: "string" as const, description: "What aspect to focus on: 'visa', 'cost', 'lifestyle', 'all'" },
    ],
    handler: async ({ title, subtitle, view_type, countries, focus }) => {
      console.log('🎨 generate_custom_view called:', { title, view_type, countries, focus });

      const countryList = countries?.split(',').map(c => c.trim()) || [];

      // Fetch data for involved countries
      const destinationData: Destination[] = [];
      for (const country of countryList) {
        const slug = country.toLowerCase().replace(/\s+/g, '-');
        try {
          const res = await fetch(`/api/destinations?slug=${slug}`);
          if (res.ok) {
            destinationData.push(await res.json());
          }
        } catch (e) {
          console.error(`Failed to fetch ${country}:`, e);
        }
      }

      // Generate view based on type
      let generatedView: GeneratedView;

      if (view_type === 'comparison' && destinationData.length >= 2) {
        const d1 = destinationData[0];
        const d2 = destinationData[1];

        generatedView = {
          title: title || `${d1.country_name} vs ${d2.country_name}`,
          subtitle: subtitle || 'Side-by-side comparison',
          blocks: [
            {
              type: 'comparison',
              props: {
                countries: [d1.country_name, d2.country_name],
                flags: [d1.flag, d2.flag],
                items: [
                  { label: 'Region', values: [d1.region, d2.region] },
                  { label: 'Language', values: [d1.language, d2.language] },
                  { label: 'Rent (1BR Center)', values: [
                    d1.cost_of_living?.[0] ? `${d1.cost_of_living[0].currency} ${d1.cost_of_living[0].rent1BRCenter?.toLocaleString()}` : 'N/A',
                    d2.cost_of_living?.[0] ? `${d2.cost_of_living[0].currency} ${d2.cost_of_living[0].rent1BRCenter?.toLocaleString()}` : 'N/A'
                  ]},
                  { label: 'Top Visa', values: [
                    d1.visas?.[0]?.name || 'N/A',
                    d2.visas?.[0]?.name || 'N/A'
                  ]},
                  { label: 'Visa Count', values: [
                    `${d1.visas?.length || 0} options`,
                    `${d2.visas?.length || 0} options`
                  ]},
                ],
                highlight: focus === 'cost' ? 'Rent (1BR Center)' : focus === 'visa' ? 'Top Visa' : undefined,
              }
            }
          ]
        };

        // Add pros/cons if focus is lifestyle or all
        if (focus === 'lifestyle' || focus === 'all') {
          const getHighlightTexts = (d: Destination) =>
            d.highlights?.slice(0, 3).map(h => typeof h === 'string' ? h : h.text) || [];

          generatedView.blocks.push({
            type: 'pros_cons',
            props: {
              title: `${d1.country_name} Highlights`,
              pros: getHighlightTexts(d1),
              cons: ['Research visa requirements', 'Consider language barrier', 'Visit before committing']
            }
          });
        }

      } else if (view_type === 'cost_breakdown' && destinationData.length >= 1) {
        const d = destinationData[0];
        const city = d.cost_of_living?.[0];

        if (city) {
          generatedView = {
            title: title || `Cost of Living in ${city.cityName}`,
            subtitle: subtitle || d.country_name,
            blocks: [
              {
                type: 'cost_chart',
                props: {
                  title: `Monthly Expenses in ${city.cityName}`,
                  currency: city.currency,
                  items: [
                    { label: 'Rent (1BR Center)', amount: city.rent1BRCenter || 0, currency: city.currency },
                    { label: 'Groceries', amount: city.groceries || 0, currency: city.currency },
                    { label: 'Dining Out', amount: city.dining || 0, currency: city.currency },
                    { label: 'Transportation', amount: city.transportation || 0, currency: city.currency },
                    { label: 'Utilities', amount: city.utilities || 0, currency: city.currency },
                  ].filter(i => i.amount > 0)
                }
              }
            ]
          };
        } else {
          generatedView = {
            title: 'Cost data not available',
            blocks: [{ type: 'text', props: { content: 'Cost of living data not found for this destination.' }}]
          };
        }

      } else if (view_type === 'pros_cons' && destinationData.length >= 1) {
        const d = destinationData[0];
        const pros = d.highlights?.slice(0, 5).map(h => typeof h === 'string' ? h : h.text) || [];

        generatedView = {
          title: title || `${d.country_name}: Pros & Cons`,
          subtitle: subtitle || 'Things to consider',
          blocks: [
            {
              type: 'pros_cons',
              props: {
                pros,
                cons: [
                  'Bureaucracy can be slow',
                  'Language learning may be needed',
                  'Healthcare system differs from home',
                  'Cultural adjustment period',
                ]
              }
            }
          ]
        };

      } else {
        // Default analysis view
        generatedView = {
          title: title || 'Analysis',
          subtitle,
          blocks: [
            {
              type: 'text',
              props: { content: `Analysis for: ${countries}. Focus: ${focus || 'general'}` }
            }
          ]
        };
      }

      // Clear destination card and show custom view
      setState(prev => ({
        ...prev,
        currentDestination: undefined,
        customView: generatedView
      }));

      return `Generated custom ${view_type} view for ${countries}. The visualization is now displayed.`;
    },
    render: ({ status }) => {
      if (status === 'executing') {
        return <div className="text-purple-400 text-sm p-2 bg-purple-500/10 rounded">Generating custom view...</div>;
      }
      if (status === 'complete') {
        return <div className="text-purple-400 text-sm p-2 bg-purple-500/10 rounded">✓ Custom view generated!</div>;
      }
      return <></>;
    },
  });

  const handleTopicClick = useCallback((country: string) => {
    appendMessage(new TextMessage({ content: `Tell me about ${country}`, role: Role.User }));
  }, [appendMessage]);

  // Handle comparison picker
  const handleCompare = useCallback(async (country1: string, country2: string) => {
    setComparingLoading(true);
    try {
      const slug1 = country1.toLowerCase().replace(/\s+/g, '-');
      const slug2 = country2.toLowerCase().replace(/\s+/g, '-');

      const [res1, res2] = await Promise.all([
        fetch(`/api/destinations?slug=${slug1}`),
        fetch(`/api/destinations?slug=${slug2}`)
      ]);

      if (res1.ok && res2.ok) {
        const d1 = await res1.json();
        const d2 = await res2.json();

        const comparisonView: GeneratedView = {
          title: `${d1.flag} ${d1.country_name} vs ${d2.flag} ${d2.country_name}`,
          subtitle: 'Side-by-side comparison',
          blocks: [
            {
              type: 'comparison',
              props: {
                countries: [d1.country_name, d2.country_name],
                flags: [d1.flag, d2.flag],
                items: [
                  { label: 'Region', values: [d1.region, d2.region] },
                  { label: 'Language', values: [d1.language, d2.language] },
                  { label: 'Safety Index', values: [
                    d1.quality_of_life?.safety_index?.toFixed(1) || 'N/A',
                    d2.quality_of_life?.safety_index?.toFixed(1) || 'N/A'
                  ]},
                  { label: 'Quality of Life', values: [
                    d1.quality_of_life?.overall_score?.toFixed(1) || 'N/A',
                    d2.quality_of_life?.overall_score?.toFixed(1) || 'N/A'
                  ]},
                  { label: 'Rent (1BR Center)', values: [
                    d1.cost_of_living?.[0] ? `${d1.cost_of_living[0].currency} ${d1.cost_of_living[0].rent1BRCenter?.toLocaleString()}` : 'N/A',
                    d2.cost_of_living?.[0] ? `${d2.cost_of_living[0].currency} ${d2.cost_of_living[0].rent1BRCenter?.toLocaleString()}` : 'N/A'
                  ]},
                  { label: 'Digital Nomad Visa', values: [
                    d1.digital_nomad_info?.visa_available ? `Yes (€${d1.digital_nomad_info.min_income_monthly_eur}/mo)` : 'No',
                    d2.digital_nomad_info?.visa_available ? `Yes (€${d2.digital_nomad_info.min_income_monthly_eur}/mo)` : 'No'
                  ]},
                  { label: 'Climate', values: [
                    d1.climate_data?.type || 'N/A',
                    d2.climate_data?.type || 'N/A'
                  ]},
                  { label: 'Healthcare', values: [
                    d1.healthcare?.system_type || 'N/A',
                    d2.healthcare?.system_type || 'N/A'
                  ]},
                ],
              }
            },
            {
              type: 'section_header',
              props: {
                title: 'Quality of Life Comparison',
                subtitle: 'Key metrics at a glance'
              }
            },
            {
              type: 'quality_of_life',
              props: {
                title: d1.country_name,
                country: d1.country_name,
                flag: d1.flag,
                overallScore: d1.quality_of_life?.overall_score,
                metrics: [
                  { label: 'Safety', value: d1.quality_of_life?.safety_index || 0, icon: '🛡️' },
                  { label: 'Cost', value: 100 - (d1.quality_of_life?.cost_of_living_index || 50), icon: '💰' },
                  { label: 'Climate', value: d1.quality_of_life?.climate_index || 0, icon: '☀️' },
                  { label: 'Expat', value: (d1.quality_of_life?.expat_friendly_index || 0) * 10, icon: '🌍' },
                ].filter(m => m.value > 0),
              }
            },
            {
              type: 'quality_of_life',
              props: {
                title: d2.country_name,
                country: d2.country_name,
                flag: d2.flag,
                overallScore: d2.quality_of_life?.overall_score,
                metrics: [
                  { label: 'Safety', value: d2.quality_of_life?.safety_index || 0, icon: '🛡️' },
                  { label: 'Cost', value: 100 - (d2.quality_of_life?.cost_of_living_index || 50), icon: '💰' },
                  { label: 'Climate', value: d2.quality_of_life?.climate_index || 0, icon: '☀️' },
                  { label: 'Expat', value: (d2.quality_of_life?.expat_friendly_index || 0) * 10, icon: '🌍' },
                ].filter(m => m.value > 0),
              }
            }
          ]
        };

        setState(prev => ({
          ...prev,
          customView: comparisonView,
          currentDestination: undefined,
        }));
      }
    } catch (error) {
      console.error('Error comparing countries:', error);
    } finally {
      setComparingLoading(false);
    }
  }, []);

  // Handle country selection from force graph
  const handleGraphCountrySelect = useCallback((country: { country_name: string }) => {
    appendMessage(new TextMessage({ content: `Tell me about ${country.country_name}`, role: Role.User }));
  }, [appendMessage]);

  // Available country names for instructions
  const availableCountries = state.availableDestinations
    .map(d => d.country_name)
    .join(', ') || 'Loading...';

  // Dynamic background based on selected country - always use hero image
  const backgroundUrl = state.backgroundImage || 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=2670&auto=format&fit=crop';

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-white transition-all duration-1000"
      style={{ backgroundImage: `url('${backgroundUrl}')` }}
    >
      {/* Dark overlay for readability - always dark, not colored */}
      <div className="min-h-screen bg-black/60 backdrop-blur-[2px]">
        <CopilotSidebar
          defaultOpen={true}
          instructions={`You are ATLAS, a warm and knowledgeable relocation advisor with access to comprehensive data on ${availableCountries}.

YOU HAVE EXTENSIVE DATA including: climate info, cost of living, visa requirements, digital nomad programs, healthcare systems, tax regimes, dining/nightlife, quality of life scores, and relocation timelines for each country.

CRITICAL RULES:

1. SINGLE DESTINATION: When a user mentions ONE country, ALWAYS call show_destination:
   - User: "Tell me about Cyprus" → show_destination(country: "Cyprus")
   - User: "What do you know about Portugal?" → show_destination(country: "Portugal")
   This displays a comprehensive dashboard with timeline, climate, dining, quality of life, and more.

2. COMPARISONS: When user wants to COMPARE countries:
   - User: "Compare Cyprus vs Malta" → generate_custom_view(view_type: "comparison", countries: "Cyprus, Malta", focus: "all")

3. COST BREAKDOWN: When user asks about costs:
   - User: "Show me cost breakdown for Lisbon" → generate_custom_view(view_type: "cost_breakdown", countries: "Portugal", focus: "cost")

4. PROS & CONS: When user asks about advantages/disadvantages:
   - User: "Pros and cons of Spain?" → generate_custom_view(view_type: "pros_cons", countries: "Spain", focus: "lifestyle")

5. PREFERENCES: Call save_preferences when users mention budget, climate, or purpose.

DATA AVAILABLE FOR EACH COUNTRY:
- Climate: seasons, temperatures, sunshine hours, best months to visit
- Cost of Living: rent, groceries, dining, transportation, utilities
- Digital Nomad: visa requirements, income thresholds, coworking scene
- Healthcare: system type, quality ratings, insurance costs
- Dining: Michelin stars, signature dishes, best restaurants
- Quality of Life: safety index, expat friendliness, climate rating
- Relocation Timeline: step-by-step guide with resources and links

Be conversational and helpful. After showing a dashboard, point out specific interesting data points.`}
          labels={{
            title: 'Chat with ATLAS',
            initial: "Hello! I'm ATLAS, your AI relocation advisor. I can help you explore destinations worldwide with real data on visas, costs, and more.\n\nClick a destination below or tell me what you're looking for!",
          }}
          className="[&_.copilotKitSidebar]:bg-stone-900/80 [&_.copilotKitSidebar]:backdrop-blur-sm [&_.copilotKitSidebar]:border-white/10"
        >
          {/* Main Content */}
          <div className="min-h-screen p-8">
            <div className="max-w-3xl mx-auto">
              {/* Header with Voice Widget */}
              <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center relative"
              >
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-3" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  Relocation Quest
                </h1>
                <p className="text-white/80 text-lg">Your AI-powered guide to a new life abroad</p>

                {/* Voice Widget - Centered below title */}
                <div className="mt-8 flex justify-center">
                  <HumeWidget />
                </div>

                {/* Action Toolbar */}
                {!loading && state.availableDestinations.length > 0 && (
                  <div className="mt-8 flex justify-center gap-3">
                    <ComparisonPicker
                      countries={state.availableDestinations.map(d => ({
                        slug: d.slug,
                        country_name: d.country_name,
                        flag: d.flag,
                        region: d.region,
                      }))}
                      onCompare={handleCompare}
                      isLoading={comparingLoading}
                    />
                    <button
                      onClick={() => setShowGraph(!showGraph)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${
                        showGraph
                          ? 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50'
                          : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-cyan-500/30'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {showGraph ? 'Hide Graph' : 'Explore Connections'}
                    </button>
                  </div>
                )}
              </motion.header>

              {/* User Preferences */}
              {state.userPreferences && Object.keys(state.userPreferences).length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-wrap gap-2 mb-6 justify-center"
                >
                  {state.userPreferences.budget && (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded-full">
                      {state.userPreferences.budget}
                    </span>
                  )}
                  {state.userPreferences.climate && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                      {state.userPreferences.climate}
                    </span>
                  )}
                  {state.userPreferences.purpose && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                      {state.userPreferences.purpose}
                    </span>
                  )}
                </motion.div>
              )}

              {/* Force Graph Visualization */}
              {showGraph && state.availableDestinations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8"
                >
                  <CountryForceGraph
                    countries={state.availableDestinations.map(d => ({
                      slug: d.slug,
                      country_name: d.country_name,
                      flag: d.flag,
                      region: d.region,
                      similar_to: d.comparison_highlights?.similar_to,
                    }))}
                    onSelectCountry={handleGraphCountrySelect}
                    highlightedCountry={state.currentCountry?.toLowerCase().replace(/\s+/g, '-')}
                  />
                </motion.div>
              )}

              {/* Dynamic View, Destination Card, or Empty State */}
                          {loading ? (
                            <LoadingSkeleton />
                          ) : state.customView ? (
                            <DynamicView view={state.customView} />
                          ) : (
                            <EmptyState />
                          )}
                          {/* Chat Input */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-12"
                          >
                            <ChatInput />
                          </motion.div>
              
                          {/* Quick Topic Pills */}
                          {!loading && state.availableDestinations.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="mt-8"
                            >
                              <div className="flex flex-wrap justify-center gap-2">
                                <span className="text-sm text-white/50 mr-2 self-center">Or try a topic:</span>
                                {state.availableDestinations.slice(0, 6).map((dest) => (
                                  <button
                                    key={dest.slug}
                                    onClick={() => handleTopicClick(dest.country_name)}
                                    className="px-4 py-2 text-sm rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all border border-white/10 hover:border-amber-500/30"
                                  >
                                    {dest.flag} {dest.country_name}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}            </div>
          </div>

        </CopilotSidebar>
      </div>
    </div>
  );
}
