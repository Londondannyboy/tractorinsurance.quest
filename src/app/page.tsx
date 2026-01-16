'use client';

import { useState, useCallback, useEffect } from 'react';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { useCopilotAction, useCopilotReadable, useCopilotChat } from '@copilotkit/react-core';
import { Role, TextMessage } from '@copilotkit/runtime-client-gql';
import { motion } from 'framer-motion';
import { HumeWidget } from '@/components/HumeWidget';

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

// Breed Card Component
function BreedCard({ breed, onSelect }: { breed: DogBreed; onSelect: () => void }) {
  const riskColors = {
    low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    high: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
      className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-6 cursor-pointer hover:bg-white/15 transition-all"
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">🐕</span>
        <div>
          <h3 className="text-xl font-bold text-white">{breed.name}</h3>
          <p className="text-white/60 text-sm capitalize">{breed.size} • {breed.avg_lifespan_years} year lifespan</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 text-xs rounded-full border ${riskColors[breed.risk_category as keyof typeof riskColors] || riskColors.medium}`}>
          {breed.risk_category} risk
        </span>
        <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
          {breed.exercise_needs} exercise
        </span>
      </div>

      {breed.temperament && breed.temperament.length > 0 && (
        <p className="text-white/50 text-sm">
          {breed.temperament.slice(0, 3).join(' • ')}
        </p>
      )}
    </motion.div>
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

// Plan Comparison Component
function PlanComparison({ onSelectPlan }: { onSelectPlan: (plan: string) => void }) {
  const plans = [
    {
      type: 'basic',
      name: 'Basic',
      price: '$15',
      coverage: '$5,000',
      features: ['Accident coverage', 'Emergency care', '24/7 helpline'],
      color: 'from-slate-600 to-slate-700',
      border: 'border-slate-500/30',
    },
    {
      type: 'standard',
      name: 'Standard',
      price: '$35',
      coverage: '$10,000',
      features: ['Accidents & illness', 'Prescriptions', 'Specialists', 'Emergency care'],
      color: 'from-blue-600 to-blue-700',
      border: 'border-blue-500/30',
      popular: true,
    },
    {
      type: 'premium',
      name: 'Premium',
      price: '$55',
      coverage: '$20,000',
      features: ['All Standard features', 'Routine care', 'Dental', 'Hereditary conditions'],
      color: 'from-purple-600 to-purple-700',
      border: 'border-purple-500/30',
    },
    {
      type: 'comprehensive',
      name: 'Comprehensive',
      price: '$85',
      coverage: '$50,000',
      features: ['Everything covered', 'Zero deductible', 'Alternative therapies', 'Travel coverage'],
      color: 'from-emerald-600 to-emerald-700',
      border: 'border-emerald-500/30',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {plans.map((plan) => (
        <motion.div
          key={plan.type}
          whileHover={{ scale: 1.03 }}
          onClick={() => onSelectPlan(plan.type)}
          className={`relative bg-gradient-to-br ${plan.color} rounded-2xl p-6 cursor-pointer border ${plan.border} transition-all hover:shadow-xl`}
        >
          {plan.popular && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-amber-900 text-xs font-bold rounded-full">
              Most Popular
            </span>
          )}
          <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
          <p className="text-3xl font-bold text-white mb-1">{plan.price}<span className="text-lg font-normal">/mo</span></p>
          <p className="text-white/60 text-sm mb-4">Up to {plan.coverage}/year</p>
          <ul className="space-y-2">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="text-white/80 text-sm flex items-start gap-2">
                <span className="text-white/60">•</span>{feature}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Welcome/Empty State
function WelcomeState() {
  return (
    <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-md rounded-3xl border border-amber-500/20 p-12 text-center shadow-lg">
      <div className="text-8xl mb-6">🐾</div>
      <h2 className="text-4xl font-bold text-white mb-4">Protect Your Furry Friend</h2>
      <p className="text-white/70 max-w-lg mx-auto text-lg mb-8">
        Get personalized pet insurance quotes in seconds. Talk to Buddy, our AI assistant, to find the perfect coverage for your pup.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="bg-white/10 rounded-xl px-6 py-4 text-center">
          <p className="text-3xl font-bold text-amber-400">18+</p>
          <p className="text-white/60 text-sm">Breeds covered</p>
        </div>
        <div className="bg-white/10 rounded-xl px-6 py-4 text-center">
          <p className="text-3xl font-bold text-amber-400">$15</p>
          <p className="text-white/60 text-sm">Starting from/mo</p>
        </div>
        <div className="bg-white/10 rounded-xl px-6 py-4 text-center">
          <p className="text-3xl font-bold text-amber-400">24/7</p>
          <p className="text-white/60 text-sm">Pet helpline</p>
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
        placeholder="Tell Buddy about your dog... e.g., 'I have a 3 year old Labrador'"
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
      console.log('🐕 show_breed_info called for:', breed_name);

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
    render: ({ status }) => {
      if (status === 'executing') {
        return <div className="text-amber-400 text-sm p-2 bg-amber-500/10 rounded">Looking up breed information...</div>;
      }
      if (status === 'complete') {
        return <div className="text-emerald-400 text-sm p-2 bg-emerald-500/10 rounded">✓ Breed info loaded!</div>;
      }
      return <></>;
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
      console.log('📝 confirm_dog_details:', { dog_name, breed_name, age_years, has_preexisting_conditions });

      // Fetch breed info if not already loaded
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
    render: ({ status, args }) => {
      if (status === 'complete' && args) {
        return (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-amber-300 font-medium mb-2">Dog Details Confirmed:</p>
            <ul className="text-white/80 text-sm space-y-1">
              <li>🐕 Name: {args.dog_name}</li>
              <li>🏷️ Breed: {args.breed_name}</li>
              <li>📅 Age: {args.age_years} years</li>
            </ul>
          </div>
        );
      }
      return <></>;
    },
  });

  // Action: Generate quote
  useCopilotAction({
    name: "generate_quote",
    description: "Generate an insurance quote when the user wants to see prices or get a quote. Use this when they ask about coverage, pricing, or want to see their options.",
    parameters: [
      { name: "plan_type", type: "string" as const, description: "Plan type: 'basic', 'standard', 'premium', or 'comprehensive'" },
    ],
    handler: async ({ plan_type }) => {
      console.log('💰 generate_quote:', plan_type);

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

          return `Here's your quote for ${dogDetails.name || 'your ' + dogDetails.breed}! With our ${quote.quote.plan.name} plan, you'll pay $${quote.quote.monthlyPremium.toFixed(2)}/month for up to $${quote.quote.plan.annualCoverageLimit.toLocaleString()} in annual coverage. The deductible is $${quote.quote.plan.deductible}. Would you like to compare other plans or proceed with this one?`;
        }
        return 'There was an error generating your quote. Please try again.';
      } catch (error) {
        console.error('Error generating quote:', error);
        return 'Error generating quote. Please try again.';
      }
    },
    render: ({ status }) => {
      if (status === 'executing') {
        return <div className="text-emerald-400 text-sm p-2 bg-emerald-500/10 rounded">Calculating your personalized quote...</div>;
      }
      return <></>;
    },
  });

  // Action: Show plan comparison
  useCopilotAction({
    name: "show_plans",
    description: "Show all available insurance plans for comparison when the user wants to see options or compare plans.",
    parameters: [],
    handler: async () => {
      setState(prev => ({ ...prev, step: 'coverage' }));
      return "Here are all our insurance plans! Click on any plan to get a quote, or tell me which one interests you.";
    },
  });

  // Handle breed selection
  const handleBreedSelect = useCallback((breed: DogBreed) => {
    setState(prev => ({
      ...prev,
      selectedBreed: breed,
      dogDetails: { ...prev.dogDetails, breed: breed.name },
      step: 'breed_selection',
    }));
    appendMessage(new TextMessage({
      content: `I'm interested in getting insurance for a ${breed.name}`,
      role: Role.User,
    }));
  }, [appendMessage]);

  // Handle plan selection
  const handlePlanSelect = useCallback((planType: string) => {
    appendMessage(new TextMessage({
      content: `I'd like a quote for the ${planType} plan`,
      role: Role.User,
    }));
  }, [appendMessage]);

  // Handle quick prompts
  const handleQuickPrompt = useCallback((prompt: string) => {
    appendMessage(new TextMessage({ content: prompt, role: Role.User }));
  }, [appendMessage]);

  // Available breeds for instructions
  const availableBreeds = state.breeds.map(b => b.name).join(', ') || 'Loading...';

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-stone-900 text-white"
    >
      <CopilotSidebar
        defaultOpen={true}
        instructions={`You are Buddy, a friendly and knowledgeable puppy insurance advisor. You help pet owners find the right insurance coverage for their dogs.

AVAILABLE BREEDS IN DATABASE: ${availableBreeds}

YOUR PERSONALITY:
- Warm, friendly, and enthusiastic about dogs
- Use dog-related language naturally (like "paw-some!", "fur baby")
- Be empathetic when discussing health concerns
- Always prioritize the dog's wellbeing

CRITICAL RULES:

1. BREED IDENTIFICATION: When user mentions a breed, ALWAYS call show_breed_info:
   - User: "I have a Labrador" → show_breed_info(breed_name: "Labrador")
   - User: "My French Bulldog needs insurance" → show_breed_info(breed_name: "French Bulldog")

2. DOG DETAILS: When user provides their dog's info, call confirm_dog_details:
   - User: "My dog Max is a 3 year old Golden Retriever" → confirm_dog_details(dog_name: "Max", breed_name: "Golden Retriever", age_years: 3, has_preexisting_conditions: false)

3. QUOTES: When user wants to see prices or coverage, call generate_quote:
   - User: "Show me prices" → generate_quote(plan_type: "standard")
   - User: "What's the premium plan like?" → generate_quote(plan_type: "premium")

4. PLAN COMPARISON: When user wants to compare all options:
   - User: "What plans do you have?" → show_plans()

INSURANCE KNOWLEDGE:
- Basic ($15/mo): Accident-only coverage, $5k annual limit
- Standard ($35/mo): Accidents + illness, prescriptions, $10k annual limit
- Premium ($55/mo): Adds routine care, dental, hereditary conditions, $20k limit
- Comprehensive ($85/mo): Everything, zero deductible, alternative therapies, $50k limit

HIGH-RISK BREEDS (higher premiums): French Bulldog, Bulldog, Cavalier King Charles Spaniel, Great Dane
LOW-RISK BREEDS (lower premiums): Chihuahua, Beagle, Poodle, Yorkshire Terrier, Mixed Breed

Be conversational and guide users through: 1) Telling you about their dog → 2) Understanding their needs → 3) Getting a personalized quote.

${state.dogDetails?.name ? `CURRENT DOG: ${state.dogDetails.name}, a ${state.dogDetails.age || '?'} year old ${state.dogDetails.breed}` : ''}
${state.currentQuote ? `CURRENT QUOTE: $${state.currentQuote.quote.monthlyPremium}/mo for ${state.currentQuote.quote.plan.name} plan` : ''}`}
        labels={{
          title: 'Chat with Buddy 🐕',
          initial: "Woof! I'm Buddy, your friendly puppy insurance advisor! 🐾\n\nI'm here to help you find the perfect coverage for your furry friend. Tell me about your dog - what breed are they, and how old?",
        }}
        className="[&_.copilotKitSidebar]:bg-stone-900/80 [&_.copilotKitSidebar]:backdrop-blur-sm [&_.copilotKitSidebar]:border-white/10"
      >
        {/* Main Content */}
        <div className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-3" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                🐾 Puppy Insurance
              </h1>
              <p className="text-white/80 text-lg">Protect your furry family member with personalized coverage</p>

              {/* Voice Widget */}
              <div className="mt-8 flex justify-center">
                <HumeWidget />
              </div>
            </motion.header>

            {/* Main Content Area */}
            {loading ? (
              <div className="bg-black/20 backdrop-blur-lg rounded-3xl p-12 text-center animate-pulse">
                <div className="text-6xl mb-4">🐕</div>
                <p className="text-white/60">Loading breeds...</p>
              </div>
            ) : state.currentQuote ? (
              <QuoteDisplay quote={state.currentQuote} />
            ) : state.step === 'coverage' ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Choose Your Coverage</h2>
                <PlanComparison onSelectPlan={handlePlanSelect} />
              </div>
            ) : state.selectedBreed ? (
              <BreedCard breed={state.selectedBreed} onSelect={() => {}} />
            ) : (
              <WelcomeState />
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

            {/* Quick Actions */}
            {!loading && state.breeds.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="text-sm text-white/50 mr-2 self-center">Quick start:</span>
                  {['I have a Labrador', 'Compare all plans', 'Mixed breed puppy', 'Senior dog coverage'].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="px-4 py-2 text-sm rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all border border-white/10 hover:border-amber-500/30"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Popular Breeds */}
            {!state.selectedBreed && !state.currentQuote && state.step === 'welcome' && state.breeds.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <h3 className="text-xl font-semibold text-white text-center mb-6">Popular Breeds</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {state.breeds.slice(0, 6).map((breed) => (
                    <BreedCard key={breed.id} breed={breed} onSelect={() => handleBreedSelect(breed)} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </CopilotSidebar>
    </div>
  );
}
