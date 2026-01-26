'use client';

import { useState, useCallback, useEffect } from 'react';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { useCopilotAction, useCopilotReadable, useCopilotChat } from '@copilotkit/react-core';
import { Role, TextMessage } from '@copilotkit/runtime-client-gql';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { HumeWidget } from '@/components/HumeWidget';
import {
  PlanComparisonChart,
  TractorRiskChart,
  AgeCostChart,
  QuoteCalculator,
  FeatureComparisonTable,
} from '@/components/mdx';

// Types for tractor insurance
interface TractorType {
  id: number;
  name: string;
  category: string;
  risk_category: string;
  avg_horsepower: number;
  common_risks: string[];
  base_premium_multiplier: number;
  usage_types: string[];
  typical_value: string;
  fuel_type: string;
}

interface InsuranceQuote {
  quoteId: number;
  tractor: {
    name: string;
    category: string;
    riskCategory: string;
    commonRisks: string[];
  };
  quote: {
    monthlyPremium: number;
    annualPremium: number;
    plan: {
      type: string;
      name: string;
      annualCoverageLimit: number;
      deductible: number;
      features: string[];
    };
    validUntil: string;
  };
}

interface TractorInsuranceState {
  tractorTypes: TractorType[];
  selectedType?: TractorType;
  currentQuote?: InsuranceQuote;
  tractorDetails?: {
    name?: string;
    type?: string;
    age?: number;
    hasModifications?: boolean;
  };
  step: 'welcome' | 'type_selection' | 'tractor_details' | 'quote' | 'coverage';
}

// Tractor type card for grid display
function TractorCard({ name, href, risk, description, image }: {
  name: string;
  href: string;
  risk: 'low' | 'medium' | 'high';
  description: string;
  image: string;
}) {
  const riskColors = {
    low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    high: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        className="bg-stone-900/60 backdrop-blur-sm rounded-2xl border border-stone-700/50 overflow-hidden hover:border-amber-500/30 transition-all group"
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={`Compare Tractor Insurance - ${name}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent" />
          <span className={`absolute bottom-3 left-3 px-3 py-1 text-xs rounded-full border ${riskColors[risk]}`}>
            {risk} risk
          </span>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
            {name} Insurance
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
}

// Quote Display Component
function QuoteDisplay({ quote }: { quote: InsuranceQuote }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 backdrop-blur-lg rounded-3xl border border-emerald-500/20 p-8"
    >
      <div className="text-center mb-8">
        <span className="text-6xl mb-4 block">🚜</span>
        <h2 className="text-3xl font-bold text-white mb-2">Your Quote is Ready!</h2>
        <p className="text-white/60">Coverage for your {quote.tractor.name}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white/10 rounded-2xl p-6 text-center">
          <p className="text-white/50 text-sm mb-2">Monthly Premium</p>
          <p className="text-5xl font-bold text-emerald-400">&pound;{quote.quote.monthlyPremium.toFixed(2)}</p>
          <p className="text-white/40 text-sm mt-2">per month</p>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 text-center">
          <p className="text-white/50 text-sm mb-2">Annual Coverage</p>
          <p className="text-4xl font-bold text-white">&pound;{quote.quote.plan.annualCoverageLimit.toLocaleString()}</p>
          <p className="text-white/40 text-sm mt-2">max per year</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">{quote.quote.plan.name} Plan Features</h3>
        <ul className="space-y-3">
          {quote.quote.plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-white/80">
              <span className="text-emerald-400 mt-1">&#10003;</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {quote.tractor.commonRisks && quote.tractor.commonRisks.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-300 text-sm font-medium mb-2">Common risks for {quote.tractor.name}:</p>
          <p className="text-amber-200/70 text-sm">{quote.tractor.commonRisks.join(', ')}</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-white/40 text-sm">
          Quote valid until {new Date(quote.quote.validUntil).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}

// Section wrapper for consistent spacing
function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const [state, setState] = useState<TractorInsuranceState>({
    tractorTypes: [],
    step: 'welcome',
  });
  const [loading, setLoading] = useState(true);
  const { appendMessage } = useCopilotChat();

  // Fetch tractor types on mount
  useEffect(() => {
    async function fetchTractorTypes() {
      try {
        const res = await fetch('/api/tractor-types');
        if (res.ok) {
          const types = await res.json();
          setState(prev => ({ ...prev, tractorTypes: types }));
        }
      } catch (error) {
        console.error('Failed to fetch tractor types:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTractorTypes();
  }, []);

  // Make state readable to the AI
  useCopilotReadable({
    description: 'Current tractor insurance application state',
    value: state,
  });

  // Action: Show tractor type info
  useCopilotAction({
    name: "show_tractor_info",
    description: "Show detailed information about a specific tractor type when the user mentions a tractor type.",
    parameters: [
      { name: "tractor_type_name", type: "string" as const, description: "Type of tractor (e.g., 'Farm Tractor', 'Vintage Tractor', 'Compact Tractor')" },
    ],
    handler: async ({ tractor_type_name }) => {
      try {
        const res = await fetch(`/api/tractor-types?name=${encodeURIComponent(tractor_type_name)}`);
        if (res.ok) {
          const tractorType = await res.json();
          setState(prev => ({
            ...prev,
            selectedType: tractorType,
            tractorDetails: { ...prev.tractorDetails, type: tractorType.name },
            step: 'type_selection',
          }));
          return `Found ${tractorType.name}! This is a ${tractorType.category} tractor with ${tractorType.risk_category} risk level. Common risks include: ${tractorType.common_risks?.join(', ') || tractorType.common_health_issues?.join(', ')}. Average horsepower: ${tractorType.avg_horsepower || tractorType.avg_lifespan_years}.`;
        }
        return `I couldn't find a tractor type called "${tractor_type_name}". Could you try a different type?`;
      } catch (error) {
        console.error('Error fetching tractor type:', error);
        return 'Error looking up tractor type information. Please try again.';
      }
    },
  });

  // Action: Confirm tractor details
  useCopilotAction({
    name: "confirm_tractor_details",
    description: "Confirm and save the tractor's details when the user provides their tractor's name, type, and age.",
    parameters: [
      { name: "tractor_name", type: "string" as const, description: "The tractor's name or identifier" },
      { name: "tractor_type_name", type: "string" as const, description: "The tractor type" },
      { name: "age_years", type: "number" as const, description: "The tractor's age in years" },
      { name: "has_modifications", type: "boolean" as const, description: "Whether the tractor has modifications or prior damage" },
    ],
    handler: async ({ tractor_name, tractor_type_name, age_years, has_modifications }) => {
      let tractorType = state.selectedType;
      if (!tractorType || tractorType.name.toLowerCase() !== tractor_type_name.toLowerCase()) {
        const res = await fetch(`/api/tractor-types?name=${encodeURIComponent(tractor_type_name)}`);
        if (res.ok) {
          tractorType = await res.json();
        }
      }

      setState(prev => ({
        ...prev,
        selectedType: tractorType,
        tractorDetails: {
          name: tractor_name,
          type: tractor_type_name,
          age: age_years,
          hasModifications: has_modifications || false,
        },
        step: 'tractor_details',
      }));

      return `Great! I've noted that ${tractor_name} is a ${age_years} year old ${tractor_type_name}${has_modifications ? ' with modifications' : ''}. Would you like to see our insurance plans?`;
    },
  });

  // Action: Generate quote
  useCopilotAction({
    name: "generate_quote",
    description: "Generate an insurance quote when the user wants to see prices or get a quote.",
    parameters: [
      { name: "plan_type", type: "string" as const, description: "Plan type: 'basic', 'standard', 'premium', or 'comprehensive'" },
    ],
    handler: async ({ plan_type }) => {
      const tractorDetails = state.tractorDetails;
      if (!tractorDetails?.type || tractorDetails?.age === undefined) {
        return "I need to know your tractor type and age first. What kind of tractor do you have?";
      }

      try {
        const res = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tractorTypeName: tractorDetails.type,
            ageYears: tractorDetails.age,
            planType: plan_type || 'standard',
            hasModifications: tractorDetails.hasModifications || false,
          }),
        });

        if (res.ok) {
          const quote = await res.json();
          setState(prev => ({
            ...prev,
            currentQuote: quote,
            step: 'quote',
          }));

          return `Here's your quote for ${tractorDetails.name || 'your ' + tractorDetails.type}! With our ${quote.quote.plan.name} plan, you'll pay \u00a3${quote.quote.monthlyPremium.toFixed(2)}/month for up to \u00a3${quote.quote.plan.annualCoverageLimit.toLocaleString()} in annual coverage.`;
        }
        return 'There was an error generating your quote. Please try again.';
      } catch (error) {
        console.error('Error generating quote:', error);
        return 'Error generating quote. Please try again.';
      }
    },
  });

  // Action: Show plan comparison
  useCopilotAction({
    name: "show_plans",
    description: "Show all available insurance plans for comparison.",
    parameters: [],
    handler: async () => {
      setState(prev => ({ ...prev, step: 'coverage' }));
      return "Here are all our insurance plans! Click on any plan to get a quote.";
    },
  });

  // Handle quick prompts
  const handleQuickPrompt = useCallback((prompt: string) => {
    appendMessage(new TextMessage({ content: prompt, role: Role.User }));
  }, [appendMessage]);

  const availableTypes = state.tractorTypes.map(t => t.name).join(', ') || 'Loading...';

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white">
      <CopilotSidebar
        defaultOpen={false}
        instructions={`You are Tracker, a knowledgeable tractor insurance advisor. You help tractor owners find the right insurance coverage for their machinery.

AVAILABLE TRACTOR TYPES IN DATABASE: ${availableTypes}

YOUR PERSONALITY:
- Professional, helpful, and knowledgeable about agricultural machinery
- Use tractor and farming-related language naturally
- Be practical when discussing risk and coverage
- Always prioritise protecting the owner's investment

CRITICAL RULES:
1. When user mentions a tractor type, ALWAYS call show_tractor_info
2. When user provides tractor details, call confirm_tractor_details
3. When user wants prices/coverage, call generate_quote
4. When user wants to compare options, call show_plans

${state.tractorDetails?.name ? `CURRENT TRACTOR: ${state.tractorDetails.name}, a ${state.tractorDetails.age || '?'} year old ${state.tractorDetails.type}` : ''}
${state.currentQuote ? `CURRENT QUOTE: \u00a3${state.currentQuote.quote.monthlyPremium}/mo for ${state.currentQuote.quote.plan.name} plan` : ''}`}
        labels={{
          title: 'Chat with Tracker',
          initial: "Hello! I'm Tracker, your tractor insurance advisor. Tell me about your tractor - what type is it?",
        }}
      >
        {/* Trusted Sources Banner */}
        <div className="bg-stone-900/80 border-b border-stone-700/50 py-4">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-white/50 text-xs text-center mb-3">Trusted resources for tractor insurance information:</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
              <a href="https://www.nfuonline.com/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">NFU</a>
              <a href="https://www.fwi.co.uk/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">Farmers Weekly</a>
              <a href="https://www.gov.uk/farming-equipment" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">GOV.UK</a>
              <a href="https://www.hse.gov.uk/agriculture/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">HSE Agriculture</a>
              <a href="https://www.abi.org.uk/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">ABI</a>
              <a href="https://www.fca.org.uk/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">FCA</a>
              <a href="https://www.which.co.uk/money/insurance/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">Which?</a>
              <a href="https://www.moneysavingexpert.com/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">MoneySavingExpert</a>
              <a href="https://www.citizensadvice.org.uk/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">Citizens Advice</a>
              <a href="https://www.bbc.co.uk/news/topics/cvenzmgyg4rt" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">BBC Farming</a>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <Section className="pt-8 md:pt-16">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="text-amber-400">Compare Tractor Insurance</span>
                <br />
                <span className="text-white">Compare Tractor Insurance UK</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                Find the <strong>best tractor insurance</strong> for your machinery. Compare tractor insurance plans from top UK providers,
                get instant quotes, and protect your investment from unexpected repair bills. Whether you have a powerful
                <Link href="/farm-tractor-insurance" className="text-amber-400 hover:underline"> Farm Tractor</Link>,
                a classic <Link href="/vintage-tractor-insurance" className="text-amber-400 hover:underline"> Vintage Tractor</Link>,
                or a versatile <Link href="/utility-tractor-insurance" className="text-amber-400 hover:underline"> Utility Tractor</Link> -
                we help you find <Link href="/cheap-tractor-insurance" className="text-amber-400 hover:underline">cheap tractor insurance</Link> that fits your budget.
                Understanding <Link href="/tractor-insurance-cost" className="text-amber-400 hover:underline">tractor insurance cost</Link> is essential before you buy.
              </p>
            </motion.div>

            {/* Voice Widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <HumeWidget />
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8"
            >
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-6 py-4 text-center">
                <p className="text-3xl md:text-4xl font-bold text-amber-400">7+</p>
                <p className="text-white/60 text-sm">Tractor Types Covered</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-6 py-4 text-center">
                <p className="text-3xl md:text-4xl font-bold text-amber-400">From &pound;25</p>
                <p className="text-white/60 text-sm">Per Month</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-6 py-4 text-center">
                <p className="text-3xl md:text-4xl font-bold text-amber-400">24/7</p>
                <p className="text-white/60 text-sm">Breakdown Cover</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-6 py-4 text-center">
                <p className="text-3xl md:text-4xl font-bold text-amber-400">95%</p>
                <p className="text-white/60 text-sm">Claims Paid</p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => handleQuickPrompt("I want to get a quote for my tractor")}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-lg rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25"
              >
                Get Your Free Quote
              </button>
              <Link
                href="/compare-tractor-insurance"
                className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold text-lg rounded-xl hover:bg-white/20 transition-all"
              >
                Compare All Plans
              </Link>
            </motion.div>
          </div>

          {/* Policy Banner */}
          <div className="bg-stone-900/60 backdrop-blur-sm rounded-xl border border-stone-700/50 px-6 py-4 text-center max-w-2xl mx-auto">
            <p className="text-white/60 text-sm">
              By using our service, you agree to our{' '}
              <Link href="/terms-of-service" className="text-amber-400 hover:text-amber-300 underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy-policy" className="text-amber-400 hover:text-amber-300 underline">Privacy Policy</Link>.
            </p>
          </div>
        </Section>

        {/* Quote Display (if active) */}
        {state.currentQuote && (
          <Section>
            <QuoteDisplay quote={state.currentQuote} />
          </Section>
        )}

        {/* What is Tractor Insurance Section */}
        <Section id="what-is-tractor-insurance" className="bg-stone-900/30">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Compare Tractor Insurance: What is It and Why Do You Need It?
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/70 text-lg leading-relaxed mb-6">
                  <strong className="text-white">Tractor insurance</strong> is a specialist type of agricultural vehicle insurance
                  designed to cover tractors and other farm machinery. With the average tractor repair now exceeding &pound;3,000
                  and replacement costs running into tens of thousands, having comprehensive tractor insurance gives you peace of
                  mind that your essential machinery is always protected.
                </p>
                <p className="text-white/70 leading-relaxed mb-6">
                  Tractors face unique risks - from mechanical breakdowns and hydraulic failures to theft, fire, and accidental
                  damage during fieldwork. Additionally, tractors used on public roads require specific insurance to meet legal
                  requirements. By getting <strong className="text-white">tractor insurance</strong> early, you protect your
                  investment from day one.
                </p>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">&#10003;</span>
                    <span>Cover against theft, fire, and accidental damage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">&#10003;</span>
                    <span>Protection for road use and third-party liability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">&#10003;</span>
                    <span>24/7 breakdown and recovery assistance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">&#10003;</span>
                    <span>Replacement machinery hire during repairs</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=800&q=80"
                alt="Compare Tractor Insurance - Farm tractor in field"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-amber-500 text-stone-950 px-6 py-3 rounded-xl font-bold shadow-lg">
                Cover from day one
              </div>
            </div>
          </div>
        </Section>

        {/* Video Resources Section */}
        <Section id="video-guides">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare Tractor Insurance: Video Guides
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Learn more about tractor and agricultural vehicle insurance with these helpful video guides.
              Understanding how tractor insurance works helps you make an informed decision.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-stone-900/60 rounded-xl overflow-hidden border border-stone-700/50">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/VLkrpN6UJHI"
                  title="Agricultural Vehicle Insurance Explained"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white mb-1">Agricultural Insurance: Is It Worth It?</h4>
                <p className="text-white/60 text-sm">Expert breakdown of tractor insurance pros and cons</p>
              </div>
            </div>

            <div className="bg-stone-900/60 rounded-xl overflow-hidden border border-stone-700/50">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/5Z5gPhVHh7k"
                  title="How to Choose Farm Insurance"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white mb-1">How to Choose Tractor Insurance</h4>
                <p className="text-white/60 text-sm">Step-by-step guide to selecting the right policy</p>
              </div>
            </div>

            <div className="bg-stone-900/60 rounded-xl overflow-hidden border border-stone-700/50">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/Qv1glHQvEyI"
                  title="New Tractor Owner's Guide"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white mb-1">New Tractor Owner&apos;s Guide</h4>
                <p className="text-white/60 text-sm">Everything you need when buying your first tractor</p>
              </div>
            </div>
          </div>

          <p className="text-center mt-8 text-white/50 text-sm">
            Videos sourced from YouTube. We recommend also visiting{' '}
            <a href="https://www.nfuonline.com/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">NFU</a>,{' '}
            <a href="https://www.fwi.co.uk/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Farmers Weekly</a>, and{' '}
            <a href="https://www.hse.gov.uk/agriculture/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">HSE Agriculture</a> for authoritative farming advice.
          </p>
        </Section>

        {/* Tractor Insurance Cost Section */}
        <Section id="tractor-insurance-cost">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare Tractor Insurance Costs: How Much Does It Cost?
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              <strong className="text-white">Tractor insurance costs</strong> vary based on type, age, value, usage, and coverage level.
              Use our interactive calculator to get an instant estimate, or explore our detailed pricing guide.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-stone-900/60 backdrop-blur-sm rounded-2xl border border-stone-700/50 p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6">Average Monthly Costs by Plan Type</h3>
              <div className="h-80">
                <PlanComparisonChart />
              </div>
            </div>
            <div className="bg-stone-900/60 backdrop-blur-sm rounded-2xl border border-stone-700/50 p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6">How Age Affects Insurance Cost</h3>
              <div className="h-80">
                <AgeCostChart />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-2xl border border-amber-500/20 p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Get Your Personalised Tractor Insurance Quote
            </h3>
            <QuoteCalculator />
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-stone-900/40 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-amber-400 mb-2">&pound;25-&pound;50</p>
              <p className="text-white font-medium mb-1">Basic Cover</p>
              <p className="text-white/60 text-sm">Third-party only, field use</p>
            </div>
            <div className="bg-stone-900/40 rounded-xl p-6 text-center border-2 border-amber-500/30">
              <p className="text-4xl font-bold text-amber-400 mb-2">&pound;50-&pound;120</p>
              <p className="text-white font-medium mb-1">Standard Cover</p>
              <p className="text-white/60 text-sm">Theft + damage, most popular</p>
            </div>
            <div className="bg-stone-900/40 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-amber-400 mb-2">&pound;120-&pound;300+</p>
              <p className="text-white font-medium mb-1">Comprehensive</p>
              <p className="text-white/60 text-sm">Full cover including breakdown</p>
            </div>
          </div>

          <p className="text-center mt-8">
            <Link href="/tractor-insurance-cost" className="text-amber-400 hover:text-amber-300 underline font-medium">
              View our complete tractor insurance cost guide &rarr;
            </Link>
          </p>
        </Section>

        {/* Compare Tractor Insurance Section */}
        <Section id="compare-tractor-insurance" className="bg-stone-900/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare Tractor Insurance Plans
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Not sure which plan is right for your tractor? <strong className="text-white">Compare Tractor Insurance</strong> options
              side-by-side to find the perfect balance of coverage and cost for your needs.
            </p>
          </div>

          <div className="bg-stone-900/60 backdrop-blur-sm rounded-2xl border border-stone-700/50 p-6 md:p-8 mb-8 overflow-x-auto">
            <FeatureComparisonTable />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
              <h4 className="text-lg font-bold text-white mb-2">Basic</h4>
              <p className="text-3xl font-bold text-white mb-1">&pound;25<span className="text-lg">/mo</span></p>
              <p className="text-white/60 text-sm mb-4">Up to &pound;25,000/year</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>&#10003; Third-party liability</li>
                <li>&#10003; Fire coverage</li>
                <li>&#10003; 24/7 helpline</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-xl p-6 border-2 border-blue-500/50 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
              <h4 className="text-lg font-bold text-white mb-2">Standard</h4>
              <p className="text-3xl font-bold text-white mb-1">&pound;75<span className="text-lg">/mo</span></p>
              <p className="text-white/60 text-sm mb-4">Up to &pound;75,000/year</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>&#10003; Theft &amp; accidental damage</li>
                <li>&#10003; Road use cover</li>
                <li>&#10003; Breakdown assistance</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl p-6 border border-purple-700">
              <h4 className="text-lg font-bold text-white mb-2">Premium</h4>
              <p className="text-3xl font-bold text-white mb-1">&pound;150<span className="text-lg">/mo</span></p>
              <p className="text-white/60 text-sm mb-4">Up to &pound;150,000/year</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>&#10003; All Standard features</li>
                <li>&#10003; Hire replacement cover</li>
                <li>&#10003; Attached implements</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-xl p-6 border border-emerald-700">
              <h4 className="text-lg font-bold text-white mb-2">Comprehensive</h4>
              <p className="text-3xl font-bold text-white mb-1">&pound;250<span className="text-lg">/mo</span></p>
              <p className="text-white/60 text-sm mb-4">Up to &pound;500,000/year</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>&#10003; Everything covered</li>
                <li>&#10003; Zero excess option</li>
                <li>&#10003; Fleet discount available</li>
              </ul>
            </div>
          </div>

          <p className="text-center mt-8">
            <Link href="/compare-tractor-insurance" className="text-amber-400 hover:text-amber-300 underline font-medium">
              View detailed plan comparison &rarr;
            </Link>
          </p>
        </Section>

        {/* Best Tractor Insurance Section */}
        <Section id="best-tractor-insurance">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1592805144716-feeccccef5ac?w=800&q=80"
                alt="Compare Tractor Insurance - Modern farm tractor"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Compare Tractor Insurance: Finding the Best in 2025
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                The <strong className="text-white">best tractor insurance</strong> isn&apos;t always the cheapest - it&apos;s the one
                that provides the right coverage for your specific machine and usage. Here&apos;s what to look for:
              </p>
              <div className="space-y-4">
                <div className="bg-stone-900/60 rounded-xl p-4 border border-stone-700/50">
                  <h4 className="font-bold text-white mb-1">Agreed Value Cover</h4>
                  <p className="text-white/60 text-sm">Ensures you receive the full agreed value in case of total loss, not a depreciated market value.</p>
                </div>
                <div className="bg-stone-900/60 rounded-xl p-4 border border-stone-700/50">
                  <h4 className="font-bold text-white mb-1">Road &amp; Field Use</h4>
                  <p className="text-white/60 text-sm">If your tractor travels between fields on public roads, you need road-use cover to meet legal requirements.</p>
                </div>
                <div className="bg-stone-900/60 rounded-xl p-4 border border-stone-700/50">
                  <h4 className="font-bold text-white mb-1">Implements &amp; Attachments</h4>
                  <p className="text-white/60 text-sm">Make sure ploughs, loaders, mowers, and other attachments are covered under your policy.</p>
                </div>
                <div className="bg-stone-900/60 rounded-xl p-4 border border-stone-700/50">
                  <h4 className="font-bold text-white mb-1">Hire Replacement</h4>
                  <p className="text-white/60 text-sm">The best policies cover the cost of hiring a replacement tractor while yours is being repaired.</p>
                </div>
              </div>
              <p className="mt-6">
                <Link href="/best-tractor-insurance" className="text-amber-400 hover:text-amber-300 underline font-medium">
                  Read our complete guide to the best tractor insurance &rarr;
                </Link>
              </p>
            </div>
          </div>
        </Section>

        {/* Cheap Tractor Insurance Section */}
        <Section id="cheap-tractor-insurance" className="bg-stone-900/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare Tractor Insurance: Cheap Options That Don&apos;t Compromise
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Looking for <strong className="text-white">cheap tractor insurance</strong>? You don&apos;t have to sacrifice quality
              for affordability. Here are proven ways to reduce your premium while maintaining solid coverage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="text-3xl mb-4">&#128176;</div>
              <h4 className="font-bold text-white mb-2">Increase Your Excess</h4>
              <p className="text-white/60 text-sm">Choosing a higher excess (&pound;500-&pound;1,000) can reduce monthly premiums by 15-30%.</p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="text-3xl mb-4">&#128197;</div>
              <h4 className="font-bold text-white mb-2">Pay Annually</h4>
              <p className="text-white/60 text-sm">Annual payment often saves 10-15% compared to monthly direct debit.</p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="text-3xl mb-4">🚜</div>
              <h4 className="font-bold text-white mb-2">Fleet Discount</h4>
              <p className="text-white/60 text-sm">Insuring multiple tractors or vehicles with the same provider qualifies for 10-20% discount.</p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="text-3xl mb-4">&#127969;</div>
              <h4 className="font-bold text-white mb-2">Secure Storage</h4>
              <p className="text-white/60 text-sm">Keeping your tractor in a locked barn or compound can reduce theft premiums significantly.</p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="text-3xl mb-4">&#9201;</div>
              <h4 className="font-bold text-white mb-2">Limited Road Use</h4>
              <p className="text-white/60 text-sm">If your tractor stays on private land, field-only policies are much cheaper than road-use cover.</p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="text-3xl mb-4">&#128269;</div>
              <h4 className="font-bold text-white mb-2">Compare Providers</h4>
              <p className="text-white/60 text-sm">Prices vary significantly between insurers. Always compare at least 5 specialist agricultural quotes.</p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-6xl">&#9888;&#65039;</div>
              <div>
                <h4 className="text-xl font-bold text-amber-300 mb-2">A Warning About &quot;Too Cheap&quot; Insurance</h4>
                <p className="text-white/70">
                  Be cautious of policies under &pound;20/month - they often have severe limitations like third-party only cover,
                  no theft protection, or very low payout limits. A single engine rebuild can cost &pound;5,000-&pound;15,000,
                  so make sure your &quot;cheap&quot; policy actually covers what you need.
                </p>
              </div>
            </div>
          </div>

          <p className="text-center mt-8">
            <Link href="/cheap-tractor-insurance" className="text-amber-400 hover:text-amber-300 underline font-medium">
              View our cheap tractor insurance guide &rarr;
            </Link>
          </p>
        </Section>

        {/* Tractor Type Insurance Section */}
        <Section id="tractor-type-insurance">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare Tractor Insurance by Type
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Different tractor types have different risks and insurance costs. Explore our type-specific guides
              to understand what coverage your machinery needs and how much you&apos;ll pay.
            </p>
          </div>

          <div className="bg-stone-900/60 backdrop-blur-sm rounded-2xl border border-stone-700/50 p-6 md:p-8 mb-12">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Premium Multiplier by Tractor Risk Category</h3>
            <div className="h-80">
              <TractorRiskChart />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <TractorCard
              name="Farm Tractor"
              href="/farm-tractor-insurance"
              risk="medium"
              description="The workhorse of British farming. High-value machines prone to mechanical wear and theft."
              image="https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=500&q=80"
            />
            <TractorCard
              name="Vintage Tractor"
              href="/vintage-tractor-insurance"
              risk="high"
              description="Classic and collectible tractors requiring specialist agreed-value cover."
              image="https://images.unsplash.com/photo-1605338803901-58d0e5312a3e?w=500&q=80"
            />
            <TractorCard
              name="Compact Tractor"
              href="/compact-tractor-insurance"
              risk="low"
              description="Smaller machines for smallholdings and estates with lower premiums."
              image="https://images.unsplash.com/photo-1592805144716-feeccccef5ac?w=500&q=80"
            />
            <TractorCard
              name="Utility Tractor"
              href="/utility-tractor-insurance"
              risk="medium"
              description="Versatile all-rounders used for multiple tasks across the farm."
              image="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80"
            />
            <TractorCard
              name="Mini Tractor"
              href="/mini-tractor-insurance"
              risk="low"
              description="Sub-compact machines for gardens and small properties with affordable cover."
              image="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&q=80"
            />
            <TractorCard
              name="Garden Tractor"
              href="/garden-tractor-insurance"
              risk="low"
              description="Domestic garden tractors and ride-on equipment for private use."
              image="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80"
            />
            <TractorCard
              name="Ride-on Mower"
              href="/ride-on-mower-insurance"
              risk="low"
              description="Ride-on mowers and groundcare equipment for larger gardens and estates."
              image="https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&q=80"
            />
            <div className="bg-stone-900/60 backdrop-blur-sm rounded-2xl border border-amber-500/30 p-6 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4">🚜</div>
              <h3 className="text-lg font-bold text-white mb-2">Other Machinery</h3>
              <p className="text-white/60 text-sm mb-4">We also cover combine harvesters, telehandlers, ATVs, and more farm machinery.</p>
              <button
                onClick={() => handleQuickPrompt("What types of agricultural machinery do you cover?")}
                className="text-amber-400 hover:text-amber-300 font-medium text-sm"
              >
                Ask Tracker about your machine &rarr;
              </button>
            </div>
          </div>
        </Section>

        {/* How to Choose Section */}
        <Section className="bg-stone-900/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How to Compare Tractor Insurance and Choose Right
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Follow our step-by-step guide to find the perfect policy for your tractor. Making the right choice now
              saves thousands in the long run.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Assess Your Tractor&apos;s Value</h4>
                  <p className="text-white/60">Know your tractor&apos;s current market value. New machines need comprehensive cover,
                  while older tractors may only need third-party. Get a professional valuation for vintage models.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Determine Usage Requirements</h4>
                  <p className="text-white/60">Field-only use is cheaper to insure. If you drive on public roads between fields,
                  you legally need road-use cover. Commercial haulage needs specialist policies.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Consider Attachment Cover</h4>
                  <p className="text-white/60">Ploughs, loaders, sprayers, and trailers can be worth thousands.
                  Make sure your policy covers all attached and detached implements.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">4</div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Compare Specialist Providers</h4>
                  <p className="text-white/60">General insurers often don&apos;t understand agricultural needs. Use specialist farm
                  insurance brokers who know the sector and can offer tailored policies.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">5</div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Check Security Requirements</h4>
                  <p className="text-white/60">Many insurers require specific security measures - immobilisers, GPS trackers,
                  locked storage. Meeting these requirements upfront avoids claim rejections later.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">6</div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Review Breakdown Cover</h4>
                  <p className="text-white/60">During harvest or planting season, a breakdown can cost you thousands in lost time.
                  Good breakdown cover with rapid response is essential for working farms.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-stone-950 mb-4">Ready to Protect Your Tractor?</h3>
            <p className="text-stone-800 mb-6 max-w-xl mx-auto">
              Chat with Tracker, our AI insurance advisor, to get personalised recommendations for your specific machine and usage.
            </p>
            <button
              onClick={() => handleQuickPrompt("Help me find the right insurance for my tractor")}
              className="px-8 py-4 bg-stone-950 text-white font-bold rounded-xl hover:bg-stone-900 transition-all"
            >
              Start Your Free Consultation
            </button>
          </div>
        </Section>

        {/* Types of Tractor Insurance Section */}
        <Section id="types-of-insurance">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare Tractor Insurance: Understanding Different Policy Types
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Before you buy, it&apos;s crucial to understand the different policy types available in the UK market.
              Each type offers varying levels of protection at different price points.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-stone-900/60 rounded-2xl border border-stone-700/50 overflow-hidden">
              <div className="bg-emerald-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Comprehensive Cover</h3>
                <p className="text-emerald-100 text-sm">Best for high-value machinery</p>
              </div>
              <div className="p-6">
                <p className="text-white/70 mb-4">
                  <strong className="text-white">Comprehensive tractor insurance</strong> is the gold standard of cover. It protects
                  against theft, fire, accidental damage, malicious damage, and third-party claims. Most policies also include
                  breakdown assistance and replacement hire.
                </p>
                <p className="text-white/70 mb-4">
                  For new or high-value tractors, comprehensive cover ensures you receive the full agreed value in case of
                  a write-off. This is particularly important for modern machines with GPS guidance systems, precision farming
                  technology, and other expensive integrated equipment.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <span className="text-2xl font-bold text-emerald-400">&pound;120-&pound;300/mo</span>
                  <span className="text-white/50">|</span>
                  <span className="text-white/60">Best for valuable machines</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-900/60 rounded-2xl border border-stone-700/50 overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Third-Party, Fire &amp; Theft</h3>
                <p className="text-blue-100 text-sm">Mid-range protection</p>
              </div>
              <div className="p-6">
                <p className="text-white/70 mb-4">
                  <strong className="text-white">TPFT policies</strong> cover you against theft, fire damage, and any damage or
                  injury caused to third parties. However, accidental damage to your own tractor is not covered.
                </p>
                <p className="text-white/70 mb-4">
                  This type is a good middle ground for tractors that are a few years old where the replacement cost is
                  moderate. If your tractor is stolen or catches fire, you&apos;re covered. But if you accidentally reverse
                  into a gatepost or roll the machine, you&apos;ll pay for repairs yourself.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <span className="text-2xl font-bold text-blue-400">&pound;50-&pound;120/mo</span>
                  <span className="text-white/50">|</span>
                  <span className="text-white/60">Good for mid-value tractors</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-900/60 rounded-2xl border border-stone-700/50 overflow-hidden">
              <div className="bg-amber-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Third-Party Only</h3>
                <p className="text-amber-100 text-sm">Legal minimum for road use</p>
              </div>
              <div className="p-6">
                <p className="text-white/70 mb-4">
                  <strong className="text-white">Third-party only</strong> is the minimum legal requirement for any tractor
                  used on public roads. It covers damage or injury you cause to other people, their vehicles, or property -
                  but nothing on your own tractor.
                </p>
                <p className="text-white/70 mb-4">
                  This is the cheapest option but leaves your own machine completely unprotected. Only consider this for
                  very old, low-value tractors where the cost of comprehensive cover exceeds the machine&apos;s value.
                  Remember: even basic repairs can cost &pound;1,000+.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <span className="text-2xl font-bold text-amber-400">&pound;25-&pound;50/mo</span>
                  <span className="text-white/50">|</span>
                  <span className="text-white/60">Legal minimum only</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-900/60 rounded-2xl border border-stone-700/50 overflow-hidden">
              <div className="bg-slate-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Fleet/Farm Policy</h3>
                <p className="text-slate-100 text-sm">Best for multiple machines</p>
              </div>
              <div className="p-6">
                <p className="text-white/70 mb-4">
                  <strong className="text-white">Fleet policies</strong> cover all your agricultural vehicles under one policy.
                  This typically includes tractors, combine harvesters, telehandlers, ATVs, and other farm machinery - often
                  at a significant discount compared to insuring each separately.
                </p>
                <p className="text-white/70 mb-4">
                  Fleet policies are ideal for farms with 3+ vehicles. They simplify administration with one renewal date
                  and one point of contact. Many also include automatic cover for new additions to your fleet for 30 days,
                  giving you time to formally add new machines.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <span className="text-2xl font-bold text-slate-400">&pound;200-&pound;800+/mo</span>
                  <span className="text-white/50">|</span>
                  <span className="text-white/60">Best value for multiple vehicles</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-2xl border border-emerald-500/20 p-6 md:p-8">
            <h4 className="text-xl font-bold text-white mb-4 text-center">Our Recommendation</h4>
            <p className="text-white/70 text-center max-w-2xl mx-auto">
              For most tractor owners, we recommend <strong className="text-emerald-300">comprehensive cover</strong> with
              agreed value protection. The cost of a single major repair or theft far exceeds a year&apos;s premiums. If you
              have multiple machines, a fleet policy offers the best value and simplest management.
            </p>
          </div>
        </Section>

        {/* Common Exclusions Section */}
        <Section id="exclusions" className="bg-stone-900/30">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                What Tractor Insurance Doesn&apos;t Cover
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                Understanding exclusions is just as important as knowing what&apos;s covered. Here are the most common
                things that tractor insurance policies won&apos;t pay for:
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="text-red-400 text-xl mt-1">&#10007;</span>
                  <div>
                    <h4 className="font-bold text-white">Wear &amp; Tear</h4>
                    <p className="text-white/60 text-sm">Normal mechanical wear, gradual deterioration, and routine maintenance are never covered. Insurance is for sudden, unexpected events only.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-red-400 text-xl mt-1">&#10007;</span>
                  <div>
                    <h4 className="font-bold text-white">Tyres (Unless Damaged by Accident)</h4>
                    <p className="text-white/60 text-sm">Tyre replacement due to punctures, wear, or blowouts is typically excluded unless it results from an insured accident or collision.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-red-400 text-xl mt-1">&#10007;</span>
                  <div>
                    <h4 className="font-bold text-white">Unlicensed Road Use</h4>
                    <p className="text-white/60 text-sm">If your policy is for field use only and you have an incident on a public road, your claim will be rejected. Ensure your cover matches your usage.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-red-400 text-xl mt-1">&#10007;</span>
                  <div>
                    <h4 className="font-bold text-white">Inadequate Security</h4>
                    <p className="text-white/60 text-sm">Theft claims may be rejected if you haven&apos;t met security requirements - locked storage, immobiliser, or GPS tracker as specified in your policy.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-red-400 text-xl mt-1">&#10007;</span>
                  <div>
                    <h4 className="font-bold text-white">Unqualified Operators</h4>
                    <p className="text-white/60 text-sm">Damage caused by operators without proper training, licensing, or authorisation to use the machine will typically not be covered.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-red-400 text-xl mt-1">&#10007;</span>
                  <div>
                    <h4 className="font-bold text-white">Consequential Loss</h4>
                    <p className="text-white/60 text-sm">Lost income from crops not harvested, or contracts not fulfilled because your tractor broke down, is not covered unless you have specific business interruption add-ons.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Image
                src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80"
                alt="Compare Tractor Insurance - Tractor working in field"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl mb-8"
              />

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <h4 className="font-bold text-red-300 mb-3">Type-Specific Exclusions to Watch</h4>
                <p className="text-white/70 text-sm mb-4">
                  Some insurers have specific exclusions based on tractor type. Always check for these:
                </p>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li>&#8226; <strong className="text-white">Vintage tractors:</strong> Rally/show use may need separate event cover</li>
                  <li>&#8226; <strong className="text-white">High-HP machines:</strong> Some insurers limit cover above 300HP</li>
                  <li>&#8226; <strong className="text-white">Modified tractors:</strong> Aftermarket modifications may void cover</li>
                  <li>&#8226; <strong className="text-white">Hired-in machines:</strong> Usually need separate hire-in plant cover</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Tractor Maintenance Tips Section */}
        <Section id="maintenance-tips">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Keeping Your Tractor in Top Condition
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              While insurance protects you financially, proper maintenance prevents breakdowns and can lower your premiums.
              Here are expert tips to keep your tractor running smoothly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">&#9881;&#65039;</span>
              </div>
              <h4 className="font-bold text-white mb-2">Regular Servicing</h4>
              <p className="text-white/60 text-sm">
                Follow the manufacturer&apos;s service schedule. Regular oil changes, filter replacements, and inspections
                prevent major failures and maintain your warranty. Keep all service records as proof for insurers.
              </p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">&#128167;</span>
              </div>
              <h4 className="font-bold text-white mb-2">Hydraulic System Care</h4>
              <p className="text-white/60 text-sm">
                Check hydraulic fluid levels and condition regularly. Look for leaks around hoses, cylinders, and
                connections. Hydraulic failures are one of the most common and expensive repairs.
              </p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">&#128274;</span>
              </div>
              <h4 className="font-bold text-white mb-2">Security Measures</h4>
              <p className="text-white/60 text-sm">
                Fit an immobiliser and GPS tracker. Store in a locked building overnight. Good security not only prevents
                theft but can significantly reduce your insurance premium.
              </p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">&#128308;</span>
              </div>
              <h4 className="font-bold text-white mb-2">Tyre Maintenance</h4>
              <p className="text-white/60 text-sm">
                Check tyre pressures regularly - incorrect pressure causes uneven wear, reduces traction, and increases
                fuel consumption. Inspect for cuts, cracks, and embedded objects before each use.
              </p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">&#128161;</span>
              </div>
              <h4 className="font-bold text-white mb-2">Electrical Checks</h4>
              <p className="text-white/60 text-sm">
                Test all lights, indicators, and warning systems regularly - especially before road use. Check battery
                terminals for corrosion and ensure the alternator is charging properly.
              </p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">&#127777;&#65039;</span>
              </div>
              <h4 className="font-bold text-white mb-2">Cooling System</h4>
              <p className="text-white/60 text-sm">
                Keep radiators and grilles clear of debris. Check coolant levels and condition. Overheating causes
                catastrophic engine damage - clean the radiator after dusty fieldwork.
              </p>
            </div>
          </div>

          <div className="bg-stone-900/60 rounded-2xl border border-stone-700/50 p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">The True Cost of Tractor Repairs in 2025</h3>
                <p className="text-white/70 mb-4">
                  Tractor repair costs have increased significantly. Understanding typical costs helps you appreciate
                  the value of insurance:
                </p>
                <ul className="space-y-3 text-white/70">
                  <li className="flex justify-between">
                    <span>Engine overhaul</span>
                    <span className="text-amber-400 font-medium">&pound;5,000-&pound;15,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Transmission rebuild</span>
                    <span className="text-amber-400 font-medium">&pound;3,000-&pound;8,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Hydraulic pump replacement</span>
                    <span className="text-amber-400 font-medium">&pound;1,500-&pound;4,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span>PTO repair</span>
                    <span className="text-amber-400 font-medium">&pound;800-&pound;2,500</span>
                  </li>
                  <li className="flex justify-between">
                    <span>GPS/Autosteer system</span>
                    <span className="text-amber-400 font-medium">&pound;8,000-&pound;25,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Complete cab replacement</span>
                    <span className="text-amber-400 font-medium">&pound;10,000-&pound;30,000</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"
                  alt="Compare Tractor Insurance - Maintenance and repairs"
                  width={500}
                  height={350}
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Making a Claim Section */}
        <Section id="making-a-claim" className="bg-stone-900/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How to Make a Tractor Insurance Claim
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Knowing how to claim properly ensures you get reimbursed quickly. Here&apos;s what you need to know
              before your tractor needs a claim.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-stone-950">1</span>
              </div>
              <h4 className="font-bold text-white mb-2">Report the Incident</h4>
              <p className="text-white/60 text-sm">
                Contact your insurer immediately. For theft, also report to the police and get a crime reference number.
                Take photos of any damage.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-stone-950">2</span>
              </div>
              <h4 className="font-bold text-white mb-2">Complete Claim Form</h4>
              <p className="text-white/60 text-sm">
                Fill out your insurer&apos;s claim form with full details of the incident, including date, time, location,
                and circumstances.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-stone-950">3</span>
              </div>
              <h4 className="font-bold text-white mb-2">Provide Evidence</h4>
              <p className="text-white/60 text-sm">
                Submit photos, repair quotes, police reports, and any witness details. The more evidence you provide,
                the faster your claim will be processed.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-stone-950">4</span>
              </div>
              <h4 className="font-bold text-white mb-2">Receive Settlement</h4>
              <p className="text-white/60 text-sm">
                Claims are typically processed within 10-20 working days. Payment covers repairs or replacement
                value minus your excess.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
              <h4 className="font-bold text-emerald-300 mb-4">Tips for Faster Claims</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>&#10003; Keep all purchase receipts and service records</li>
                <li>&#10003; Take photos of your tractor in good condition for reference</li>
                <li>&#10003; Report theft to police within 24 hours</li>
                <li>&#10003; Get at least two repair quotes from approved engineers</li>
                <li>&#10003; Respond quickly to any follow-up questions from your insurer</li>
                <li>&#10003; Know your policy excess and coverage limits</li>
              </ul>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
              <h4 className="font-bold text-amber-300 mb-4">Common Reasons Claims Are Rejected</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>&#10007; Security requirements not met (no immobiliser, unlocked)</li>
                <li>&#10007; Claim submitted after deadline</li>
                <li>&#10007; Maintenance-related failure (wear and tear)</li>
                <li>&#10007; Unlicensed operator was driving</li>
                <li>&#10007; Tractor used outside policy terms (e.g. road use on field-only policy)</li>
                <li>&#10007; Modifications not declared to insurer</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* FAQ Section */}
        <Section id="faq">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare Tractor Insurance: Frequently Asked Questions
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Get answers to the most common questions about insuring your tractor.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Do I need insurance for my tractor?",
                a: "If your tractor is used on public roads, you legally need at least third-party insurance. For field-only use, insurance isn't legally required but is strongly recommended given the high cost of repairs and replacement. Most farmers and landowners choose to insure regardless of legal requirements."
              },
              {
                q: "What does tractor insurance cover?",
                a: "Standard comprehensive policies cover theft, fire, accidental damage, malicious damage, and third-party liability. Many also include breakdown assistance, replacement hire, and attached implements. You can add optional extras like business interruption cover and legal expenses."
              },
              {
                q: "How much does tractor insurance cost per month?",
                a: "Expect to pay \u00a325-\u00a350/month for basic third-party cover, \u00a350-\u00a3120/month for TPFT, and \u00a3120-\u00a3300+/month for comprehensive cover. Costs vary significantly by tractor value, age, usage, location, and security measures."
              },
              {
                q: "Is tractor insurance different from regular vehicle insurance?",
                a: "Yes. Tractor insurance is a specialist product that understands agricultural use, field operations, seasonal usage patterns, and the unique risks tractors face. Standard car insurance companies typically won't cover tractors, and general policies may not understand the sector."
              },
              {
                q: "Can I insure a vintage tractor?",
                a: "Yes, specialist vintage tractor insurance is available. These policies typically offer agreed-value cover (you agree the value upfront rather than accepting market value), rally/show cover, and restoration cover. Premiums are often lower due to limited road use and careful ownership."
              },
              {
                q: "Are my tractor attachments covered?",
                a: "This depends on your policy. Many comprehensive policies cover permanently attached implements. Detached implements (ploughs stored separately, trailers, etc.) may need to be listed separately. Always declare all attachments and their values to your insurer."
              },
              {
                q: "What security do I need for tractor insurance?",
                a: "Most insurers require an immobiliser as minimum. Many also require GPS tracking and locked overnight storage for theft cover to be valid. Higher security measures typically result in lower premiums. Check your specific policy requirements carefully."
              },
              {
                q: "Can I get a fleet discount for multiple tractors?",
                a: "Yes, most agricultural insurers offer fleet policies for 3+ vehicles at a significant discount (typically 10-20% off individual policy costs). Fleet policies also simplify administration with one renewal date and one policy document covering all machines."
              },
            ].map((faq, i) => (
              <details key={i} className="bg-stone-900/60 rounded-xl border border-stone-700/50 group">
                <summary className="p-6 cursor-pointer text-white font-medium flex items-center justify-between">
                  {faq.q}
                  <span className="text-amber-400 group-open:rotate-180 transition-transform">&#9660;</span>
                </summary>
                <div className="px-6 pb-6 text-white/70">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          {/* FAQ Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "name": "Compare Tractor Insurance - FAQ",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How do I compare tractor insurance?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Compare Tractor Insurance by reviewing coverage levels, premiums, excess amounts, and included features. Use Compare Tractor Insurance Quest to easily compare tractor insurance plans side-by-side."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Do I need insurance for my tractor?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "If your tractor is used on public roads, you legally need at least third-party insurance. Compare tractor insurance options to find the best cover for your needs."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How much does tractor insurance cost per month?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "When you compare tractor insurance, expect to pay £25-£50/month for basic cover, £50-£120/month for TPFT, and £120-£300+/month for comprehensive cover."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Why should I compare tractor insurance before buying?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Compare Tractor Insurance to ensure you get the best value. Prices and coverage vary significantly between providers. Compare Tractor Insurance Quest helps you find the right policy."
                    }
                  }
                ]
              })
            }}
          />

          {/* WebSite Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Compare Tractor Insurance Quest",
                "alternateName": "Compare Tractor Insurance",
                "url": "https://tractorinsurance.quest",
                "description": "Compare Tractor Insurance with Compare Tractor Insurance Quest. Find the best tractor insurance deals in the UK.",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://tractorinsurance.quest/?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              })
            }}
          />

          {/* Organization Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Compare Tractor Insurance Quest",
                "alternateName": "Compare Tractor Insurance",
                "url": "https://tractorinsurance.quest",
                "logo": "https://tractorinsurance.quest/favicon.svg",
                "description": "Compare Tractor Insurance with Compare Tractor Insurance Quest. The UK's leading tractor insurance comparison site."
              })
            }}
          />
        </Section>

        {/* Final CTA Section */}
        <Section className="bg-gradient-to-b from-stone-900/50 to-amber-900/20">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Compare Tractor Insurance and Protect Your Tractor Today
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Don&apos;t wait until it&apos;s too late. Get a free, personalised quote in minutes and give your
              machinery the protection it deserves.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => handleQuickPrompt("I want to get a quote for my tractor")}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-lg rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25"
              >
                Get Your Free Quote Now
              </button>
              <Link
                href="/compare-tractor-insurance"
                className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold text-lg rounded-xl hover:bg-white/20 transition-all"
              >
                Compare All Plans
              </Link>
            </div>
            <p className="text-white/50 text-sm">
              Comparison site only. We help you find the best quotes - always consult authorised providers before purchasing.
            </p>
          </div>
        </Section>

        {/* Quick Chat Prompts (Floating) */}
        {!loading && !state.currentQuote && (
          <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50">
            <div className="bg-stone-900/95 backdrop-blur-md rounded-2xl border border-amber-500/20 p-4 shadow-xl">
              <p className="text-white/60 text-sm mb-3">Quick questions for Tracker:</p>
              <div className="flex flex-wrap gap-2">
                {['I have a farm tractor', 'Compare plans', 'Get a quote', 'Cheapest option'].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-3 py-1.5 text-sm rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CopilotSidebar>
    </div>
  );
}
