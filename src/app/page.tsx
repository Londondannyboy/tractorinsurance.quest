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
  BreedRiskChart,
  AgeCostChart,
  QuoteCalculator,
  FeatureComparisonTable,
} from '@/components/mdx';

// Types for puppy insurance
interface DogBreed {
  id: number;
  name: string;
  size: string;
  risk_category: string;
  avg_lifespan_years: number;
  common_health_issues: string[];
  base_premium_multiplier: number;
  temperament: string[];
  exercise_needs: string;
  grooming_needs: string;
}

interface InsuranceQuote {
  quoteId: number;
  breed: {
    name: string;
    size: string;
    riskCategory: string;
    commonHealthIssues: string[];
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

interface PuppyInsuranceState {
  breeds: DogBreed[];
  selectedBreed?: DogBreed;
  currentQuote?: InsuranceQuote;
  dogDetails?: {
    name?: string;
    breed?: string;
    age?: number;
    hasPreexistingConditions?: boolean;
  };
  step: 'welcome' | 'breed_selection' | 'dog_details' | 'quote' | 'coverage';
}

// Breed card for grid display
function BreedCard({ name, href, risk, description, image }: {
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
            alt={`${name} puppy insurance`}
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
        <span className="text-6xl mb-4 block">🐶</span>
        <h2 className="text-3xl font-bold text-white mb-2">Your Quote is Ready!</h2>
        <p className="text-white/60">Coverage for your {quote.breed.name}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white/10 rounded-2xl p-6 text-center">
          <p className="text-white/50 text-sm mb-2">Monthly Premium</p>
          <p className="text-5xl font-bold text-emerald-400">${quote.quote.monthlyPremium.toFixed(2)}</p>
          <p className="text-white/40 text-sm mt-2">per month</p>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 text-center">
          <p className="text-white/50 text-sm mb-2">Annual Coverage</p>
          <p className="text-4xl font-bold text-white">${quote.quote.plan.annualCoverageLimit.toLocaleString()}</p>
          <p className="text-white/40 text-sm mt-2">max per year</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">{quote.quote.plan.name} Plan Features</h3>
        <ul className="space-y-3">
          {quote.quote.plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-white/80">
              <span className="text-emerald-400 mt-1">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {quote.breed.commonHealthIssues && quote.breed.commonHealthIssues.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-300 text-sm font-medium mb-2">Common health concerns for {quote.breed.name}:</p>
          <p className="text-amber-200/70 text-sm">{quote.breed.commonHealthIssues.join(', ')}</p>
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
  const [state, setState] = useState<PuppyInsuranceState>({
    breeds: [],
    step: 'welcome',
  });
  const [loading, setLoading] = useState(true);
  const { appendMessage } = useCopilotChat();

  // Fetch breeds on mount
  useEffect(() => {
    async function fetchBreeds() {
      try {
        const res = await fetch('/api/breeds');
        if (res.ok) {
          const breeds = await res.json();
          setState(prev => ({ ...prev, breeds }));
        }
      } catch (error) {
        console.error('Failed to fetch breeds:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBreeds();
  }, []);

  // Make state readable to the AI
  useCopilotReadable({
    description: 'Current puppy insurance application state',
    value: state,
  });

  // Action: Show breed info
  useCopilotAction({
    name: "show_breed_info",
    description: "Show detailed information about a specific dog breed when the user mentions a breed.",
    parameters: [
      { name: "breed_name", type: "string" as const, description: "Name of the dog breed (e.g., 'Labrador', 'French Bulldog')" },
    ],
    handler: async ({ breed_name }) => {
      try {
        const res = await fetch(`/api/breeds?name=${encodeURIComponent(breed_name)}`);
        if (res.ok) {
          const breed = await res.json();
          setState(prev => ({
            ...prev,
            selectedBreed: breed,
            dogDetails: { ...prev.dogDetails, breed: breed.name },
            step: 'breed_selection',
          }));
          return `Found ${breed.name}! This is a ${breed.size} breed with ${breed.risk_category} health risk. Common health issues include: ${breed.common_health_issues.join(', ')}. They typically live ${breed.avg_lifespan_years} years.`;
        }
        return `I couldn't find a breed called "${breed_name}". Could you try a different breed name?`;
      } catch (error) {
        console.error('Error fetching breed:', error);
        return 'Error looking up breed information. Please try again.';
      }
    },
  });

  // Action: Confirm dog details
  useCopilotAction({
    name: "confirm_dog_details",
    description: "Confirm and save the dog's details when the user provides their dog's name, breed, and age.",
    parameters: [
      { name: "dog_name", type: "string" as const, description: "The dog's name" },
      { name: "breed_name", type: "string" as const, description: "The dog's breed" },
      { name: "age_years", type: "number" as const, description: "The dog's age in years" },
      { name: "has_preexisting_conditions", type: "boolean" as const, description: "Whether the dog has preexisting health conditions" },
    ],
    handler: async ({ dog_name, breed_name, age_years, has_preexisting_conditions }) => {
      let breed = state.selectedBreed;
      if (!breed || breed.name.toLowerCase() !== breed_name.toLowerCase()) {
        const res = await fetch(`/api/breeds?name=${encodeURIComponent(breed_name)}`);
        if (res.ok) {
          breed = await res.json();
        }
      }

      setState(prev => ({
        ...prev,
        selectedBreed: breed,
        dogDetails: {
          name: dog_name,
          breed: breed_name,
          age: age_years,
          hasPreexistingConditions: has_preexisting_conditions || false,
        },
        step: 'dog_details',
      }));

      return `Great! I've noted that ${dog_name} is a ${age_years} year old ${breed_name}${has_preexisting_conditions ? ' with some preexisting conditions' : ''}. Would you like to see our insurance plans?`;
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
      const dogDetails = state.dogDetails;
      if (!dogDetails?.breed || dogDetails?.age === undefined) {
        return "I need to know your dog's breed and age first. What kind of dog do you have?";
      }

      try {
        const res = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            breedName: dogDetails.breed,
            ageYears: dogDetails.age,
            planType: plan_type || 'standard',
            hasPreexistingConditions: dogDetails.hasPreexistingConditions || false,
          }),
        });

        if (res.ok) {
          const quote = await res.json();
          setState(prev => ({
            ...prev,
            currentQuote: quote,
            step: 'quote',
          }));

          return `Here's your quote for ${dogDetails.name || 'your ' + dogDetails.breed}! With our ${quote.quote.plan.name} plan, you'll pay $${quote.quote.monthlyPremium.toFixed(2)}/month for up to $${quote.quote.plan.annualCoverageLimit.toLocaleString()} in annual coverage.`;
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

  const availableBreeds = state.breeds.map(b => b.name).join(', ') || 'Loading...';

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white">
      <CopilotSidebar
        defaultOpen={false}
        instructions={`You are Buddy, a friendly and knowledgeable puppy insurance advisor. You help pet owners find the right insurance coverage for their dogs.

AVAILABLE BREEDS IN DATABASE: ${availableBreeds}

YOUR PERSONALITY:
- Warm, friendly, and enthusiastic about dogs
- Use dog-related language naturally
- Be empathetic when discussing health concerns
- Always prioritize the dog's wellbeing

CRITICAL RULES:
1. When user mentions a breed, ALWAYS call show_breed_info
2. When user provides dog details, call confirm_dog_details
3. When user wants prices/coverage, call generate_quote
4. When user wants to compare options, call show_plans

${state.dogDetails?.name ? `CURRENT DOG: ${state.dogDetails.name}, a ${state.dogDetails.age || '?'} year old ${state.dogDetails.breed}` : ''}
${state.currentQuote ? `CURRENT QUOTE: $${state.currentQuote.quote.monthlyPremium}/mo for ${state.currentQuote.quote.plan.name} plan` : ''}`}
        labels={{
          title: 'Chat with Buddy',
          initial: "Woof! I'm Buddy, your friendly puppy insurance advisor! Tell me about your dog - what breed are they?",
        }}
      >
        {/* Trusted Sources Banner */}
        <div className="bg-stone-900/80 border-b border-stone-700/50 py-4">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-white/50 text-xs text-center mb-3">Trusted resources for pet insurance information:</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
              <a href="https://www.bbc.co.uk/news/business-67116578" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">BBC News</a>
              <a href="https://en.wikipedia.org/wiki/Pet_insurance" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">Wikipedia</a>
              <a href="https://www.theguardian.com/money/pet-insurance" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">The Guardian</a>
              <a href="https://www.which.co.uk/money/insurance/pet-insurance" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">Which?</a>
              <a href="https://www.moneysavingexpert.com/insurance/cheap-pet-insurance/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">MoneySavingExpert</a>
              <a href="https://www.gov.uk/pet-travel-quarantine" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">GOV.UK</a>
              <a href="https://www.rspca.org.uk/adviceandwelfare/pets/dogs" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">RSPCA</a>
              <a href="https://www.bluecross.org.uk/pet-advice/dog-advice" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">Blue Cross</a>
              <a href="https://www.thekennelclub.org.uk/health-and-dog-care/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">The Kennel Club</a>
              <a href="https://www.pdsa.org.uk/pet-help-and-advice" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">PDSA</a>
              <a href="https://www.fca.org.uk/consumers/pet-insurance" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">FCA</a>
              <a href="https://www.citizensadvice.org.uk/consumer/insurance/insurance/types-of-insurance/pet-insurance/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">Citizens Advice</a>
              <a href="https://www.abi.org.uk/products-and-issues/choosing-the-right-insurance/pet-insurance/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">ABI</a>
              <a href="https://www.bva.co.uk/resources-support/practice-management/pet-insurance/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">British Veterinary Association</a>
              <a href="https://www.telegraph.co.uk/money/insurance/pet-insurance/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-400 transition-colors">The Telegraph</a>
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
                <span className="text-amber-400">Puppy Insurance UK</span>
                <br />
                <span className="text-white">Compare Pet Insurance for Puppies</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                Find the <strong>best puppy insurance</strong> for your furry friend. Compare puppy insurance plans from top UK providers,
                get instant quotes, and protect your pet from unexpected vet bills. Whether you have a playful
                <Link href="/labrador-insurance" className="text-amber-400 hover:underline"> Labrador</Link>,
                a lovable <Link href="/french-bulldog-insurance" className="text-amber-400 hover:underline"> French Bulldog</Link>,
                or a spirited <Link href="/jack-russell-insurance" className="text-amber-400 hover:underline"> Jack Russell</Link> -
                we help you find <Link href="/cheap-puppy-insurance" className="text-amber-400 hover:underline">cheap puppy insurance</Link> that fits your budget.
                Understanding <Link href="/puppy-insurance-cost" className="text-amber-400 hover:underline">puppy insurance cost</Link> is essential before you buy.
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
                <p className="text-3xl md:text-4xl font-bold text-amber-400">18+</p>
                <p className="text-white/60 text-sm">Breeds Covered</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-6 py-4 text-center">
                <p className="text-3xl md:text-4xl font-bold text-amber-400">From £12</p>
                <p className="text-white/60 text-sm">Per Month</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-6 py-4 text-center">
                <p className="text-3xl md:text-4xl font-bold text-amber-400">24/7</p>
                <p className="text-white/60 text-sm">Vet Helpline</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-6 py-4 text-center">
                <p className="text-3xl md:text-4xl font-bold text-amber-400">90%</p>
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
                onClick={() => handleQuickPrompt("I want to get a quote for my puppy")}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-lg rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25"
              >
                Get Your Free Quote
              </button>
              <Link
                href="/compare-pet-insurance"
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

        {/* What is Puppy Insurance Section */}
        <Section id="what-is-puppy-insurance" className="bg-stone-900/30">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                What is Puppy Insurance and Why Do You Need It?
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/70 text-lg leading-relaxed mb-6">
                  <strong className="text-white">Puppy insurance</strong> is a type of pet insurance specifically designed to cover
                  veterinary costs for young dogs. With the average vet bill in the UK now exceeding £800 for emergency treatment,
                  having comprehensive puppy insurance gives you peace of mind that your furry friend will always get the care they need.
                </p>
                <p className="text-white/70 leading-relaxed mb-6">
                  Puppies are naturally curious and can get into all sorts of trouble - from swallowing foreign objects to injuries
                  from adventurous play. Additionally, many hereditary conditions don&apos;t show symptoms until later in life. By getting
                  <strong className="text-white"> pet insurance for puppies</strong> early, you ensure these conditions are covered
                  before they become &quot;pre-existing.&quot;
                </p>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">✓</span>
                    <span>Cover unexpected accidents and illnesses from day one</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">✓</span>
                    <span>Protect against breed-specific hereditary conditions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">✓</span>
                    <span>Access to 24/7 vet helplines for advice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">✓</span>
                    <span>Third-party liability cover if your dog causes damage</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80"
                alt="Happy puppy with owner - puppy insurance protects your pet"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-amber-500 text-stone-950 px-6 py-3 rounded-xl font-bold shadow-lg">
                Insure from 8 weeks old
              </div>
            </div>
          </div>
        </Section>

        {/* Video Resources Section */}
        <Section id="video-guides">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Puppy Insurance Explained: Video Guides
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Learn more about pet insurance for puppies with these helpful video guides from trusted sources.
              Understanding how puppy insurance works helps you make an informed decision.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-stone-900/60 rounded-xl overflow-hidden border border-stone-700/50">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/VLkrpN6UJHI"
                  title="Pet Insurance Explained - Is It Worth It?"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white mb-1">Pet Insurance: Is It Worth It?</h4>
                <p className="text-white/60 text-sm">Expert breakdown of pet insurance pros and cons</p>
              </div>
            </div>

            <div className="bg-stone-900/60 rounded-xl overflow-hidden border border-stone-700/50">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/5Z5gPhVHh7k"
                  title="How to Choose Pet Insurance"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white mb-1">How to Choose Pet Insurance</h4>
                <p className="text-white/60 text-sm">Step-by-step guide to selecting the right policy</p>
              </div>
            </div>

            <div className="bg-stone-900/60 rounded-xl overflow-hidden border border-stone-700/50">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/Qv1glHQvEyI"
                  title="New Puppy Checklist - Essential Guide"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white mb-1">New Puppy Checklist</h4>
                <p className="text-white/60 text-sm">Everything you need when bringing home a new puppy</p>
              </div>
            </div>
          </div>

          <p className="text-center mt-8 text-white/50 text-sm">
            Videos sourced from YouTube. We recommend also visiting{' '}
            <a href="https://www.rspca.org.uk/adviceandwelfare/pets/dogs/puppies" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">RSPCA</a>,{' '}
            <a href="https://www.bluecross.org.uk/pet-advice/getting-a-puppy" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Blue Cross</a>, and{' '}
            <a href="https://www.thekennelclub.org.uk/getting-a-dog/are-you-ready/puppy-or-adult-dog/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">The Kennel Club</a> for authoritative puppy advice.
          </p>
        </Section>

        {/* Puppy Insurance Cost Section */}
        <Section id="puppy-insurance-cost">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How Much Does Puppy Insurance Cost?
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              <strong className="text-white">Puppy insurance costs</strong> vary based on breed, age, location, and coverage level.
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
              Get Your Personalised Puppy Insurance Quote
            </h3>
            <QuoteCalculator />
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-stone-900/40 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-amber-400 mb-2">£12-£25</p>
              <p className="text-white font-medium mb-1">Basic Cover</p>
              <p className="text-white/60 text-sm">Accident only, lower limits</p>
            </div>
            <div className="bg-stone-900/40 rounded-xl p-6 text-center border-2 border-amber-500/30">
              <p className="text-4xl font-bold text-amber-400 mb-2">£25-£45</p>
              <p className="text-white font-medium mb-1">Standard Cover</p>
              <p className="text-white/60 text-sm">Accidents + illness, most popular</p>
            </div>
            <div className="bg-stone-900/40 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-amber-400 mb-2">£45-£80+</p>
              <p className="text-white font-medium mb-1">Comprehensive</p>
              <p className="text-white/60 text-sm">Full cover including routine care</p>
            </div>
          </div>

          <p className="text-center mt-8">
            <Link href="/puppy-insurance-cost" className="text-amber-400 hover:text-amber-300 underline font-medium">
              View our complete puppy insurance cost guide →
            </Link>
          </p>
        </Section>

        {/* Compare Pet Insurance Section */}
        <Section id="compare-pet-insurance" className="bg-stone-900/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare Pet Insurance Plans
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Not sure which plan is right for your puppy? <strong className="text-white">Compare pet insurance</strong> options
              side-by-side to find the perfect balance of coverage and cost for your needs.
            </p>
          </div>

          <div className="bg-stone-900/60 backdrop-blur-sm rounded-2xl border border-stone-700/50 p-6 md:p-8 mb-8 overflow-x-auto">
            <FeatureComparisonTable />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
              <h4 className="text-lg font-bold text-white mb-2">Basic</h4>
              <p className="text-3xl font-bold text-white mb-1">£12<span className="text-lg">/mo</span></p>
              <p className="text-white/60 text-sm mb-4">Up to £5,000/year</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ Accident coverage</li>
                <li>✓ Emergency care</li>
                <li>✓ 24/7 helpline</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-xl p-6 border-2 border-blue-500/50 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
              <h4 className="text-lg font-bold text-white mb-2">Standard</h4>
              <p className="text-3xl font-bold text-white mb-1">£28<span className="text-lg">/mo</span></p>
              <p className="text-white/60 text-sm mb-4">Up to £10,000/year</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ Accidents & illness</li>
                <li>✓ Prescriptions</li>
                <li>✓ Specialist treatment</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-xl p-6 border border-purple-700">
              <h4 className="text-lg font-bold text-white mb-2">Premium</h4>
              <p className="text-3xl font-bold text-white mb-1">£45<span className="text-lg">/mo</span></p>
              <p className="text-white/60 text-sm mb-4">Up to £20,000/year</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ All Standard features</li>
                <li>✓ Dental cover</li>
                <li>✓ Hereditary conditions</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-xl p-6 border border-emerald-700">
              <h4 className="text-lg font-bold text-white mb-2">Comprehensive</h4>
              <p className="text-3xl font-bold text-white mb-1">£68<span className="text-lg">/mo</span></p>
              <p className="text-white/60 text-sm mb-4">Up to £50,000/year</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ Everything covered</li>
                <li>✓ Zero deductible option</li>
                <li>✓ Alternative therapies</li>
              </ul>
            </div>
          </div>

          <p className="text-center mt-8">
            <Link href="/compare-pet-insurance" className="text-amber-400 hover:text-amber-300 underline font-medium">
              View detailed plan comparison →
            </Link>
          </p>
        </Section>

        {/* Best Puppy Insurance Section */}
        <Section id="best-puppy-insurance">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80"
                alt="Best puppy insurance - Golden Retriever puppy"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Finding the Best Puppy Insurance in 2025
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                The <strong className="text-white">best puppy insurance</strong> isn&apos;t always the cheapest - it&apos;s the one
                that provides the right coverage for your specific breed and circumstances. Here&apos;s what to look for:
              </p>
              <div className="space-y-4">
                <div className="bg-stone-900/60 rounded-xl p-4 border border-stone-700/50">
                  <h4 className="font-bold text-white mb-1">Lifetime Cover</h4>
                  <p className="text-white/60 text-sm">Covers conditions for life, not just one policy year. Essential for breeds prone to chronic conditions.</p>
                </div>
                <div className="bg-stone-900/60 rounded-xl p-4 border border-stone-700/50">
                  <h4 className="font-bold text-white mb-1">Hereditary Condition Cover</h4>
                  <p className="text-white/60 text-sm">Many breeds have genetic health issues. Make sure these are covered from the start.</p>
                </div>
                <div className="bg-stone-900/60 rounded-xl p-4 border border-stone-700/50">
                  <h4 className="font-bold text-white mb-1">No Upper Age Limit</h4>
                  <p className="text-white/60 text-sm">Some insurers won&apos;t cover dogs over 8-10 years. Look for lifetime policies without age caps.</p>
                </div>
                <div className="bg-stone-900/60 rounded-xl p-4 border border-stone-700/50">
                  <h4 className="font-bold text-white mb-1">Direct Vet Payment</h4>
                  <p className="text-white/60 text-sm">The best policies pay your vet directly, so you don&apos;t have to find hundreds of pounds upfront.</p>
                </div>
              </div>
              <p className="mt-6">
                <Link href="/best-puppy-insurance" className="text-amber-400 hover:text-amber-300 underline font-medium">
                  Read our complete guide to the best puppy insurance →
                </Link>
              </p>
            </div>
          </div>
        </Section>

        {/* Cheap Puppy Insurance Section */}
        <Section id="cheap-puppy-insurance" className="bg-stone-900/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cheap Puppy Insurance That Doesn&apos;t Compromise
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Looking for <strong className="text-white">cheap puppy insurance</strong>? You don&apos;t have to sacrifice quality
              for affordability. Here are proven ways to reduce your premium while maintaining solid coverage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="text-3xl mb-4">💰</div>
              <h4 className="font-bold text-white mb-2">Increase Your Excess</h4>
              <p className="text-white/60 text-sm">Choosing a higher excess (£100-£250) can reduce monthly premiums by 15-30%.</p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="text-3xl mb-4">📅</div>
              <h4 className="font-bold text-white mb-2">Pay Annually</h4>
              <p className="text-white/60 text-sm">Annual payment often saves 10-15% compared to monthly direct debit.</p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="text-3xl mb-4">🐕</div>
              <h4 className="font-bold text-white mb-2">Multi-Pet Discount</h4>
              <p className="text-white/60 text-sm">Insuring multiple pets with the same provider often qualifies for 5-15% discount.</p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="text-3xl mb-4">🏥</div>
              <h4 className="font-bold text-white mb-2">Choose Lower Coverage Limit</h4>
              <p className="text-white/60 text-sm">If you have savings for emergencies, a £5,000 limit may suffice over £15,000.</p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="text-3xl mb-4">⏰</div>
              <h4 className="font-bold text-white mb-2">Insure Early</h4>
              <p className="text-white/60 text-sm">Premiums are lowest for puppies 8-12 weeks old. Waiting costs more.</p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="text-3xl mb-4">🔍</div>
              <h4 className="font-bold text-white mb-2">Compare Providers</h4>
              <p className="text-white/60 text-sm">Prices vary significantly between insurers. Always compare at least 5 quotes.</p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-6xl">⚠️</div>
              <div>
                <h4 className="text-xl font-bold text-amber-300 mb-2">A Warning About &quot;Too Cheap&quot; Insurance</h4>
                <p className="text-white/70">
                  Be cautious of policies under £10/month - they often have severe limitations like accident-only cover,
                  12-month condition limits, or very low annual caps. A single surgery can cost £3,000-£8,000,
                  so make sure your &quot;cheap&quot; policy actually covers what you need.
                </p>
              </div>
            </div>
          </div>

          <p className="text-center mt-8">
            <Link href="/cheap-puppy-insurance" className="text-amber-400 hover:text-amber-300 underline font-medium">
              View our cheap puppy insurance guide →
            </Link>
          </p>
        </Section>

        {/* Breed-Specific Insurance Section */}
        <Section id="breed-insurance">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Dog Insurance by Breed
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Different breeds have different health risks and insurance costs. Explore our breed-specific guides
              to understand what coverage your dog needs and how much you&apos;ll pay.
            </p>
          </div>

          <div className="bg-stone-900/60 backdrop-blur-sm rounded-2xl border border-stone-700/50 p-6 md:p-8 mb-12">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Premium Multiplier by Breed Risk Category</h3>
            <div className="h-80">
              <BreedRiskChart />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <BreedCard
              name="Labrador"
              href="/labrador-insurance"
              risk="medium"
              description="Britain's favourite breed. Active dogs prone to hip dysplasia and joint issues."
              image="https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=500&q=80"
            />
            <BreedCard
              name="French Bulldog"
              href="/french-bulldog-insurance"
              risk="high"
              description="Popular but expensive to insure due to breathing and spinal issues."
              image="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&q=80"
            />
            <BreedCard
              name="Cockapoo"
              href="/cockapoo-insurance"
              risk="low"
              description="Healthy crossbreed with lower premiums than purebreds."
              image="https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=500&q=80"
            />
            <BreedCard
              name="Jack Russell"
              href="/jack-russell-insurance"
              risk="low"
              description="Hardy terriers with few health issues but accident-prone nature."
              image="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=80"
            />
            <BreedCard
              name="Pug"
              href="/pug-insurance"
              risk="high"
              description="Brachycephalic breed requiring comprehensive cover for breathing issues."
              image="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&q=80"
            />
            <BreedCard
              name="Cavapoo"
              href="/cavapoo-insurance"
              risk="medium"
              description="Popular designer breed. Watch for inherited heart conditions."
              image="https://images.unsplash.com/photo-1587564758086-8c0c91521428?w=500&q=80"
            />
            <BreedCard
              name="Dachshund"
              href="/dachshund-insurance"
              risk="high"
              description="Prone to IVDD spinal disease. Specialist cover essential."
              image="https://images.unsplash.com/photo-1612195583950-b8fd34c87093?w=500&q=80"
            />
            <div className="bg-stone-900/60 backdrop-blur-sm rounded-2xl border border-amber-500/30 p-6 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4">🐕</div>
              <h3 className="text-lg font-bold text-white mb-2">Other Breeds</h3>
              <p className="text-white/60 text-sm mb-4">We cover 18+ breeds including Golden Retrievers, Bulldogs, Beagles, and more.</p>
              <button
                onClick={() => handleQuickPrompt("What breeds do you cover?")}
                className="text-amber-400 hover:text-amber-300 font-medium text-sm"
              >
                Ask Buddy about your breed →
              </button>
            </div>
          </div>
        </Section>

        {/* How to Choose Section */}
        <Section className="bg-stone-900/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How to Choose the Right Puppy Insurance
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Follow our step-by-step guide to find the perfect policy for your new puppy. Making the right choice now
              saves thousands in the long run.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Research Your Breed&apos;s Health Risks</h4>
                  <p className="text-white/60">Every breed has specific conditions they&apos;re prone to. French Bulldogs need BOAS cover,
                  Dachshunds need spinal cover, Labs need joint cover. Know what to look for.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Decide on Coverage Level</h4>
                  <p className="text-white/60">Accident-only is cheapest but limited. Time-limited covers conditions for 12 months.
                  Lifetime cover is comprehensive but costs more. Choose based on your budget and risk tolerance.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Set Your Annual Limit</h4>
                  <p className="text-white/60">£5,000 covers most incidents, but complex surgeries can cost £8,000+.
                  High-risk breeds should consider £10,000-£15,000 limits minimum.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">4</div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Compare Multiple Quotes</h4>
                  <p className="text-white/60">Prices vary dramatically between providers. Get at least 5 quotes and compare
                  not just price but exclusions, waiting periods, and claim limits.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">5</div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Read the Policy Document</h4>
                  <p className="text-white/60">The devil is in the details. Check for breed-specific exclusions, waiting periods for
                  illness claims (usually 14 days), and what &quot;pre-existing conditions&quot; means.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">6</div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Insure Early, Don&apos;t Wait</h4>
                  <p className="text-white/60">Every week you wait is a week your puppy could develop a condition that becomes
                  &quot;pre-existing&quot; and uninsurable. Most puppies can be insured from 8 weeks.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-stone-950 mb-4">Ready to Protect Your Puppy?</h3>
            <p className="text-stone-800 mb-6 max-w-xl mx-auto">
              Chat with Buddy, our AI insurance advisor, to get personalised recommendations for your specific breed and circumstances.
            </p>
            <button
              onClick={() => handleQuickPrompt("Help me find the right insurance for my puppy")}
              className="px-8 py-4 bg-stone-950 text-white font-bold rounded-xl hover:bg-stone-900 transition-all"
            >
              Start Your Free Consultation
            </button>
          </div>
        </Section>

        {/* Types of Pet Insurance Section */}
        <Section id="types-of-insurance">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Understanding Different Types of Pet Insurance
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Before you buy, it&apos;s crucial to understand the different policy types available in the UK market.
              Each type offers varying levels of protection at different price points.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-stone-900/60 rounded-2xl border border-stone-700/50 overflow-hidden">
              <div className="bg-emerald-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Lifetime Pet Insurance</h3>
                <p className="text-emerald-100 text-sm">Best for long-term protection</p>
              </div>
              <div className="p-6">
                <p className="text-white/70 mb-4">
                  <strong className="text-white">Lifetime insurance</strong> is the gold standard of pet cover. It provides
                  continuous protection for ongoing conditions throughout your dog&apos;s life, with the annual limit resetting
                  each year when you renew.
                </p>
                <p className="text-white/70 mb-4">
                  If your puppy develops diabetes, hip dysplasia, or any chronic condition, lifetime cover continues paying
                  for treatment year after year - provided you renew without a break. This is particularly important for
                  breeds prone to hereditary conditions like French Bulldogs, Cavalier King Charles Spaniels, and Dachshunds.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <span className="text-2xl font-bold text-emerald-400">£35-£80/mo</span>
                  <span className="text-white/50">|</span>
                  <span className="text-white/60">Best value long-term</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-900/60 rounded-2xl border border-stone-700/50 overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Annual/Time-Limited Insurance</h3>
                <p className="text-blue-100 text-sm">Budget-friendly option</p>
              </div>
              <div className="p-6">
                <p className="text-white/70 mb-4">
                  <strong className="text-white">Time-limited policies</strong> cover each condition for a set period
                  (usually 12 months) or up to a maximum amount per condition. After that, the condition becomes excluded.
                </p>
                <p className="text-white/70 mb-4">
                  This type is cheaper than lifetime cover but has significant drawbacks. If your dog develops a condition
                  requiring ongoing treatment - like allergies, arthritis, or heart disease - you&apos;ll need to pay out
                  of pocket after the 12-month period ends. Consider this carefully before choosing based on price alone.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <span className="text-2xl font-bold text-blue-400">£20-£40/mo</span>
                  <span className="text-white/50">|</span>
                  <span className="text-white/60">Lower cost, limited cover</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-900/60 rounded-2xl border border-stone-700/50 overflow-hidden">
              <div className="bg-amber-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Maximum Benefit Insurance</h3>
                <p className="text-amber-100 text-sm">Fixed amount per condition</p>
              </div>
              <div className="p-6">
                <p className="text-white/70 mb-4">
                  <strong className="text-white">Maximum benefit policies</strong> set a fixed amount you can claim per
                  condition (e.g., £2,000 for hip problems) with no time limit. Once you reach that limit, the condition
                  is excluded forever.
                </p>
                <p className="text-white/70 mb-4">
                  This can work well for acute conditions that resolve quickly, but chronic conditions can easily exceed
                  the limit within months. For example, treating IVDD (common in Dachshunds) can cost £5,000-£10,000 for
                  surgery alone, quickly exceeding most maximum benefit limits.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <span className="text-2xl font-bold text-amber-400">£15-£35/mo</span>
                  <span className="text-white/50">|</span>
                  <span className="text-white/60">Limited per condition</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-900/60 rounded-2xl border border-stone-700/50 overflow-hidden">
              <div className="bg-slate-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Accident-Only Insurance</h3>
                <p className="text-slate-100 text-sm">Basic emergency cover</p>
              </div>
              <div className="p-6">
                <p className="text-white/70 mb-4">
                  <strong className="text-white">Accident-only policies</strong> are the cheapest option but only cover
                  injuries from accidents - not illnesses. This means broken bones and road traffic accidents are covered,
                  but cancer, infections, allergies, and hereditary conditions are not.
                </p>
                <p className="text-white/70 mb-4">
                  While this might seem like a good way to save money, illness claims actually make up the majority of
                  pet insurance claims. Most pet owners find accident-only cover insufficient when their dog gets sick
                  and they face a large vet bill with no support.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <span className="text-2xl font-bold text-slate-400">£8-£20/mo</span>
                  <span className="text-white/50">|</span>
                  <span className="text-white/60">Accidents only, no illness</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-2xl border border-emerald-500/20 p-6 md:p-8">
            <h4 className="text-xl font-bold text-white mb-4 text-center">Our Recommendation</h4>
            <p className="text-white/70 text-center max-w-2xl mx-auto">
              For most puppy owners, we recommend <strong className="text-emerald-300">lifetime cover</strong> with at
              least £7,000-£10,000 annual limit. Yes, it costs more upfront, but the peace of mind and long-term savings
              when your dog needs treatment far outweigh the monthly premium difference. The average dog owner makes
              2-3 significant claims over their pet&apos;s lifetime.
            </p>
          </div>
        </Section>

        {/* Common Exclusions Section */}
        <Section id="exclusions" className="bg-stone-900/30">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                What Pet Insurance Doesn&apos;t Cover
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                Understanding exclusions is just as important as knowing what&apos;s covered. Here are the most common
                things that puppy insurance policies won&apos;t pay for:
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="text-red-400 text-xl mt-1">✗</span>
                  <div>
                    <h4 className="font-bold text-white">Pre-existing Conditions</h4>
                    <p className="text-white/60 text-sm">Any condition your puppy had before the policy started, or during the waiting period, won&apos;t be covered. This is why insuring early is so important.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-red-400 text-xl mt-1">✗</span>
                  <div>
                    <h4 className="font-bold text-white">Routine & Preventative Care</h4>
                    <p className="text-white/60 text-sm">Vaccinations, flea/worm treatments, microchipping, and annual health checks are typically excluded unless you have a comprehensive wellness add-on.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-red-400 text-xl mt-1">✗</span>
                  <div>
                    <h4 className="font-bold text-white">Neutering & Spaying</h4>
                    <p className="text-white/60 text-sm">Elective procedures like neutering aren&apos;t covered as they&apos;re considered routine. However, complications arising from these procedures may be covered.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-red-400 text-xl mt-1">✗</span>
                  <div>
                    <h4 className="font-bold text-white">Pregnancy & Breeding</h4>
                    <p className="text-white/60 text-sm">Costs related to pregnancy, whelping, and breeding are excluded. If you plan to breed your dog, you&apos;ll need specialist breeder insurance.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-red-400 text-xl mt-1">✗</span>
                  <div>
                    <h4 className="font-bold text-white">Cosmetic Procedures</h4>
                    <p className="text-white/60 text-sm">Ear cropping, tail docking, and other cosmetic procedures aren&apos;t covered. Procedures deemed medically unnecessary are excluded.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-red-400 text-xl mt-1">✗</span>
                  <div>
                    <h4 className="font-bold text-white">Waiting Period Claims</h4>
                    <p className="text-white/60 text-sm">Most policies have a 14-day waiting period for illness claims (accidents are often covered immediately). Conditions that arise during this period become pre-existing.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Image
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80"
                alt="Two dogs running - healthy puppies need insurance too"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl mb-8"
              />

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <h4 className="font-bold text-red-300 mb-3">Breed-Specific Exclusions to Watch</h4>
                <p className="text-white/70 text-sm mb-4">
                  Some insurers exclude certain conditions for specific breeds. Always check for these:
                </p>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li>• <strong className="text-white">French Bulldogs/Pugs:</strong> BOAS (breathing problems) sometimes excluded</li>
                  <li>• <strong className="text-white">Dachshunds:</strong> IVDD (spinal disease) may have limits</li>
                  <li>• <strong className="text-white">Cavaliers:</strong> Heart conditions (MVD) may be excluded</li>
                  <li>• <strong className="text-white">Large breeds:</strong> Hip dysplasia exclusions common</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Puppy Health Tips Section */}
        <Section id="health-tips">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Keeping Your Puppy Healthy: Prevention Tips
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              While insurance protects you financially, prevention is always better than cure. Here are expert tips
              to keep your puppy healthy and potentially lower your insurance premiums over time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🥗</span>
              </div>
              <h4 className="font-bold text-white mb-2">Quality Nutrition</h4>
              <p className="text-white/60 text-sm">
                Feed your puppy high-quality, age-appropriate food. Proper nutrition supports immune function, healthy
                joints, and coat condition. Avoid overfeeding - obesity causes numerous health problems and can
                increase insurance premiums.
              </p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏃</span>
              </div>
              <h4 className="font-bold text-white mb-2">Regular Exercise</h4>
              <p className="text-white/60 text-sm">
                Appropriate exercise keeps your puppy fit and mentally stimulated. However, avoid over-exercising young
                puppies - their joints are still developing. A general rule is 5 minutes of exercise per month of age,
                twice daily.
              </p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💉</span>
              </div>
              <h4 className="font-bold text-white mb-2">Vaccinations</h4>
              <p className="text-white/60 text-sm">
                Keep vaccinations up to date. Core vaccines protect against parvovirus, distemper, and leptospirosis -
                all serious and expensive to treat. Many insurers require proof of vaccination for claims to be valid.
              </p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🦷</span>
              </div>
              <h4 className="font-bold text-white mb-2">Dental Care</h4>
              <p className="text-white/60 text-sm">
                Start dental hygiene early. Brush your puppy&apos;s teeth regularly to prevent periodontal disease,
                which affects 80% of dogs by age 3. Dental problems can lead to heart, kidney, and liver issues.
              </p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h4 className="font-bold text-white mb-2">Regular Vet Checks</h4>
              <p className="text-white/60 text-sm">
                Annual vet check-ups catch problems early when they&apos;re cheaper and easier to treat. Your vet can
                spot issues you might miss and provide breed-specific health advice. Early detection saves money
                and improves outcomes.
              </p>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-6 border border-stone-700/50">
              <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🐛</span>
              </div>
              <h4 className="font-bold text-white mb-2">Parasite Prevention</h4>
              <p className="text-white/60 text-sm">
                Regular flea, tick, and worm treatments prevent parasitic diseases. Lungworm in particular can be
                fatal if untreated. Monthly preventatives are much cheaper than treating an infestation or infection.
              </p>
            </div>
          </div>

          <div className="bg-stone-900/60 rounded-2xl border border-stone-700/50 p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">The True Cost of Vet Care in 2025</h3>
                <p className="text-white/70 mb-4">
                  Veterinary costs have increased significantly in recent years. Understanding typical costs helps
                  you appreciate the value of insurance:
                </p>
                <ul className="space-y-3 text-white/70">
                  <li className="flex justify-between">
                    <span>Emergency consultation</span>
                    <span className="text-amber-400 font-medium">£150-£300</span>
                  </li>
                  <li className="flex justify-between">
                    <span>X-ray or ultrasound</span>
                    <span className="text-amber-400 font-medium">£200-£500</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Blood tests</span>
                    <span className="text-amber-400 font-medium">£100-£300</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Cruciate ligament surgery</span>
                    <span className="text-amber-400 font-medium">£2,000-£4,500</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Cancer treatment</span>
                    <span className="text-amber-400 font-medium">£3,000-£10,000+</span>
                  </li>
                  <li className="flex justify-between">
                    <span>IVDD spinal surgery</span>
                    <span className="text-amber-400 font-medium">£5,000-£10,000</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&q=80"
                  alt="Veterinarian examining a puppy"
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
              How to Make a Pet Insurance Claim
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Knowing how to claim properly ensures you get reimbursed quickly. Here&apos;s what you need to know
              before your puppy needs treatment.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-stone-950">1</span>
              </div>
              <h4 className="font-bold text-white mb-2">Visit the Vet</h4>
              <p className="text-white/60 text-sm">
                Take your puppy to any licensed vet (you don&apos;t need to use a specific network with most UK insurers).
                Keep all receipts and invoices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-stone-950">2</span>
              </div>
              <h4 className="font-bold text-white mb-2">Complete Claim Form</h4>
              <p className="text-white/60 text-sm">
                Fill out your insurer&apos;s claim form. Most can be done online now. Your vet will need to complete
                a section with clinical details.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-stone-950">3</span>
              </div>
              <h4 className="font-bold text-white mb-2">Submit Documents</h4>
              <p className="text-white/60 text-sm">
                Send the completed form with invoices, receipts, and any clinical notes requested. Submit within
                the time limit (usually 90-180 days).
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-stone-950">4</span>
              </div>
              <h4 className="font-bold text-white mb-2">Receive Payment</h4>
              <p className="text-white/60 text-sm">
                Claims are typically processed within 5-10 working days. Payment goes to you or directly to your vet
                if they offer direct billing.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
              <h4 className="font-bold text-emerald-300 mb-4">Tips for Faster Claims</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>✓ Keep all receipts and invoices organised</li>
                <li>✓ Take photos of documents before submitting</li>
                <li>✓ Ask your vet to complete their section promptly</li>
                <li>✓ Submit claims online rather than by post</li>
                <li>✓ Respond quickly to any follow-up questions</li>
                <li>✓ Know your policy excess and what&apos;s covered</li>
              </ul>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
              <h4 className="font-bold text-amber-300 mb-4">Common Reasons Claims Are Rejected</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>✗ Condition existed before policy started</li>
                <li>✗ Claim submitted after deadline</li>
                <li>✗ Treatment during waiting period</li>
                <li>✗ Annual limit already reached</li>
                <li>✗ Vaccinations not up to date</li>
                <li>✗ Treatment for excluded condition</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* FAQ Section */}
        <Section id="faq">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions About Puppy Insurance
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Get answers to the most common questions about insuring your new puppy.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "When can I insure my puppy?",
                a: "Most insurers allow you to insure puppies from 8 weeks old. Some require puppies to be microchipped and have had their first vaccinations. The earlier you insure, the lower your premiums and the fewer pre-existing condition exclusions."
              },
              {
                q: "What does puppy insurance cover?",
                a: "Standard policies cover vet fees for accidents and illnesses, including diagnostics, surgery, medication, and hospital stays. Comprehensive policies add dental care, routine treatments, behavioural therapy, and alternative therapies like hydrotherapy."
              },
              {
                q: "What isn't covered by puppy insurance?",
                a: "Pre-existing conditions (anything before the policy starts), routine vaccinations, neutering/spaying, pregnancy-related costs, and cosmetic procedures are typically excluded. Some policies exclude certain breed-specific conditions."
              },
              {
                q: "How much does puppy insurance cost per month?",
                a: "Expect to pay £12-£25/month for basic cover, £25-£45/month for standard cover, and £45-£80+/month for comprehensive lifetime cover. Costs vary significantly by breed - French Bulldogs and Pugs cost more than Labradors or mixed breeds."
              },
              {
                q: "Is puppy insurance worth it?",
                a: "The average vet bill for an emergency is £800, and complex surgeries can exceed £5,000-£10,000. If you couldn't afford an unexpected £3,000 bill, insurance is worth considering. It provides peace of mind and ensures your puppy always gets needed care."
              },
              {
                q: "What's the difference between lifetime and annual policies?",
                a: "Lifetime policies cover conditions for your dog's entire life, resetting the limit each year. Annual/time-limited policies only cover each condition for 12 months, then exclude it. For breeds with chronic conditions, lifetime is essential."
              },
              {
                q: "Can I insure an older dog?",
                a: "Yes, but it's more expensive and some insurers won't cover dogs over 8-10 years for new policies. If you have a senior dog, look for providers specialising in older pet insurance. Pre-existing conditions won't be covered."
              },
              {
                q: "Do I need insurance if my puppy is healthy?",
                a: "Insurance is for unexpected events - accidents, sudden illnesses, and hereditary conditions that appear later. Even healthy puppies can swallow foreign objects, break bones, or develop conditions. The best time to insure is while they're healthy."
              },
            ].map((faq, i) => (
              <details key={i} className="bg-stone-900/60 rounded-xl border border-stone-700/50 group">
                <summary className="p-6 cursor-pointer text-white font-medium flex items-center justify-between">
                  {faq.q}
                  <span className="text-amber-400 group-open:rotate-180 transition-transform">▼</span>
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
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "When can I insure my puppy?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Most insurers allow you to insure puppies from 8 weeks old. Some require puppies to be microchipped and have had their first vaccinations."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How much does puppy insurance cost per month?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Expect to pay £12-£25/month for basic cover, £25-£45/month for standard cover, and £45-£80+/month for comprehensive lifetime cover."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is puppy insurance worth it?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The average vet bill for an emergency is £800, and complex surgeries can exceed £5,000-£10,000. Insurance provides peace of mind and ensures your puppy always gets needed care."
                    }
                  }
                ]
              })
            }}
          />
        </Section>

        {/* Final CTA Section */}
        <Section className="bg-gradient-to-b from-stone-900/50 to-amber-900/20">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Protect Your Puppy Today
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Don&apos;t wait until it&apos;s too late. Get a free, personalised quote in minutes and give your
              furry friend the protection they deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => handleQuickPrompt("I want to get a quote for my puppy")}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-lg rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25"
              >
                Get Your Free Quote Now
              </button>
              <Link
                href="/compare-pet-insurance"
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
              <p className="text-white/60 text-sm mb-3">Quick questions for Buddy:</p>
              <div className="flex flex-wrap gap-2">
                {['I have a Labrador', 'Compare plans', 'Get a quote', 'Cheapest option'].map((prompt) => (
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
