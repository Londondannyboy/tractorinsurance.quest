'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { authClient } from '@/lib/auth/client';
import { HumeWidget } from '@/components/HumeWidget';

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  persona: string | null;
  onboarding_completed: boolean;
  onboarding_step: number;
  target_destinations: string[] | null;
  recommended_destinations: any;
  ai_insights: any;
  current_country?: string;
  timeline?: string;
  budget_monthly?: number;
  priority_tax_benefits?: number;
  priority_cost_of_living?: number;
  priority_climate?: number;
}

// Persona options
const PERSONAS = [
  {
    id: 'company',
    label: 'Corporate Relocation',
    description: 'Moving with your company or setting up a business abroad',
    icon: '🏢',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'hnw',
    label: 'High Net Worth',
    description: 'Seeking tax optimization and lifestyle upgrades',
    icon: '💎',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'digital_nomad',
    label: 'Digital Nomad',
    description: 'Remote worker looking for the best place to live and work',
    icon: '💻',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle Change',
    description: 'Seeking better quality of life, climate, or culture',
    icon: '🌴',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'family',
    label: 'Family Relocation',
    description: 'Moving with children, focused on schools and safety',
    icon: '👨‍👩‍👧‍👦',
    color: 'from-rose-500 to-red-600',
  },
  {
    id: 'retiree',
    label: 'Retirement',
    description: 'Looking for the perfect place to enjoy retirement',
    icon: '🏖️',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'medical',
    label: 'Medical Relocation',
    description: 'Seeking better healthcare or medical treatment abroad',
    icon: '🏥',
    color: 'from-red-500 to-pink-600',
  },
];

// Onboarding steps
const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome to Relocation Quest' },
  { id: 'persona', title: 'What best describes your situation?' },
  { id: 'basics', title: 'Tell us about yourself' },
  { id: 'priorities', title: 'What matters most to you?' },
  { id: 'destinations', title: 'Any destinations in mind?' },
  { id: 'complete', title: "You're all set!" },
];

// Onboarding Wizard Component
function OnboardingWizard({
  user,
  profile,
  onComplete,
}: {
  user: User;
  profile: UserProfile | null;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(profile?.onboarding_step || 0);
  const [formData, setFormData] = useState({
    persona: profile?.persona || '',
    currentCountry: profile?.current_country || '',
    timeline: profile?.timeline || '',
    budgetMonthly: profile?.budget_monthly || 2000,
    priorityTaxBenefits: profile?.priority_tax_benefits || 3,
    priorityCostOfLiving: profile?.priority_cost_of_living || 3,
    priorityClimate: profile?.priority_climate || 3,
    targetDestinations: profile?.target_destinations || [],
  });

  const saveProgress = async (data: any, newStep: number) => {
    try {
      await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          onboarding_step: newStep,
          onboarding_completed: newStep >= ONBOARDING_STEPS.length - 1,
        }),
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const nextStep = async () => {
    const newStep = step + 1;
    await saveProgress(formData, newStep);
    setStep(newStep);
    if (newStep >= ONBOARDING_STEPS.length - 1) {
      onComplete();
    }
  };

  const prevStep = () => setStep(Math.max(0, step - 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-2 bg-slate-100">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            animate={{ width: `${((step + 1) / ONBOARDING_STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <span className="text-6xl mb-6 block">🌍</span>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Welcome, {user.name || 'Explorer'}!
                </h2>
                <p className="text-slate-600 mb-8">
                  Let&apos;s set up your personalized relocation dashboard.
                </p>
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Let&apos;s Get Started
                </button>
              </motion.div>
            )}

            {/* Step 1: Persona Selection */}
            {step === 1 && (
              <motion.div
                key="persona"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  {ONBOARDING_STEPS[1].title}
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {PERSONAS.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => setFormData({ ...formData, persona: persona.id })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.persona === persona.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{persona.icon}</span>
                      <div className="font-semibold text-slate-900">{persona.label}</div>
                      <div className="text-sm text-slate-500">{persona.description}</div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between">
                  <button onClick={prevStep} className="text-slate-500 hover:text-slate-700">Back</button>
                  <button
                    onClick={nextStep}
                    disabled={!formData.persona}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Basic Info */}
            {step === 2 && (
              <motion.div
                key="basics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">{ONBOARDING_STEPS[2].title}</h2>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Where are you currently based?
                    </label>
                    <input
                      type="text"
                      value={formData.currentCountry}
                      onChange={(e) => setFormData({ ...formData, currentCountry: e.target.value })}
                      placeholder="e.g., United Kingdom"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      When are you planning to relocate?
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">As soon as possible</option>
                      <option value="3-6months">3-6 months</option>
                      <option value="6-12months">6-12 months</option>
                      <option value="1-2years">1-2 years</option>
                      <option value="exploring">Just exploring options</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Monthly budget: €{formData.budgetMonthly.toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="500"
                      value={formData.budgetMonthly}
                      onChange={(e) => setFormData({ ...formData, budgetMonthly: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <button onClick={prevStep} className="text-slate-500 hover:text-slate-700">Back</button>
                  <button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Priorities */}
            {step === 3 && (
              <motion.div
                key="priorities"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">{ONBOARDING_STEPS[3].title}</h2>
                <div className="space-y-6 mb-8">
                  {[
                    { key: 'priorityTaxBenefits', label: 'Tax Benefits', icon: '💰' },
                    { key: 'priorityCostOfLiving', label: 'Affordable Cost of Living', icon: '🏠' },
                    { key: 'priorityClimate', label: 'Good Weather/Climate', icon: '☀️' },
                  ].map((priority) => (
                    <div key={priority.key}>
                      <div className="flex items-center gap-2 mb-2">
                        <span>{priority.icon}</span>
                        <label className="font-medium text-slate-700">{priority.label}</label>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            onClick={() => setFormData({ ...formData, [priority.key]: value })}
                            className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                              (formData as any)[priority.key] === value
                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                : 'border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <button onClick={prevStep} className="text-slate-500 hover:text-slate-700">Back</button>
                  <button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Destinations */}
            {step === 4 && (
              <motion.div
                key="destinations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">{ONBOARDING_STEPS[4].title}</h2>
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { slug: 'portugal', name: 'Portugal', flag: '🇵🇹' },
                    { slug: 'spain', name: 'Spain', flag: '🇪🇸' },
                    { slug: 'cyprus', name: 'Cyprus', flag: '🇨🇾' },
                    { slug: 'dubai', name: 'Dubai', flag: '🇦🇪' },
                    { slug: 'malta', name: 'Malta', flag: '🇲🇹' },
                    { slug: 'greece', name: 'Greece', flag: '🇬🇷' },
                    { slug: 'italy', name: 'Italy', flag: '🇮🇹' },
                    { slug: 'france', name: 'France', flag: '🇫🇷' },
                    { slug: 'thailand', name: 'Thailand', flag: '🇹🇭' },
                  ].map((dest) => (
                    <button
                      key={dest.slug}
                      onClick={() => {
                        const current = formData.targetDestinations || [];
                        const updated = current.includes(dest.slug)
                          ? current.filter((d) => d !== dest.slug)
                          : [...current, dest.slug];
                        setFormData({ ...formData, targetDestinations: updated });
                      }}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        formData.targetDestinations?.includes(dest.slug)
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{dest.flag}</span>
                      <span className="text-sm text-slate-700">{dest.name}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between">
                  <button onClick={prevStep} className="text-slate-500 hover:text-slate-700">Back</button>
                  <button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    {formData.targetDestinations?.length ? 'Continue' : 'Skip'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Complete */}
            {step === 5 && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <span className="text-6xl mb-6 block">🎉</span>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">You&apos;re All Set!</h2>
                <p className="text-slate-600 mb-8">
                  Your personalized dashboard is ready. ATLAS will now provide
                  recommendations tailored to your profile.
                </p>
                <button
                  onClick={onComplete}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Main Dashboard Component
function Dashboard({ user, profile, onEditProfile }: { user: User; profile: UserProfile; onEditProfile: () => void }) {
  const persona = PERSONAS.find((p) => p.id === profile.persona);

  // Make user profile readable to CopilotKit
  useCopilotReadable({
    description: 'User relocation profile and preferences',
    value: {
      name: user.name,
      persona: profile.persona,
      currentCountry: profile.current_country,
      timeline: profile.timeline,
      budgetMonthly: profile.budget_monthly,
      targetDestinations: profile.target_destinations,
    },
  });

  // CopilotKit action to update recommendations
  useCopilotAction({
    name: 'update_recommendations',
    description: 'Update AI recommendations for the user',
    parameters: [
      { name: 'destinations', type: 'object[]', description: 'Recommended destinations' },
    ],
    handler: async ({ destinations }) => {
      await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommended_destinations: destinations }),
      });
      return 'Recommendations updated!';
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <span className="font-bold text-lg text-slate-900">
                Relocation<span className="text-amber-500">Quest</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{user.email}</span>
              <Link href="/account/settings" className="text-slate-500 hover:text-slate-700">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, {user.name || 'Explorer'}!
            </h1>
            <p className="text-slate-600 mt-1">Here&apos;s your personalized relocation dashboard</p>
          </div>

          {/* Persona Card */}
          {persona && (
            <div className={`bg-gradient-to-r ${persona.color} rounded-2xl p-6 text-white mb-8`}>
              <div className="flex items-center gap-4">
                <span className="text-4xl">{persona.icon}</span>
                <div>
                  <div className="text-white/80 text-sm">Your Profile</div>
                  <div className="text-2xl font-bold">{persona.label}</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="text-slate-500 text-sm">Target Destinations</div>
              <div className="text-3xl font-bold text-slate-900 mt-1">
                {profile.target_destinations?.length || 0}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="text-slate-500 text-sm">Monthly Budget</div>
              <div className="text-3xl font-bold text-slate-900 mt-1">
                €{(profile.budget_monthly || 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="text-slate-500 text-sm">Timeline</div>
              <div className="text-xl font-bold text-slate-900 mt-1 capitalize">
                {profile.timeline?.replace('-', ' ') || 'Not set'}
              </div>
            </div>
          </div>

          {/* Destinations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Explore Destinations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(profile.target_destinations || ['cyprus', 'portugal', 'spain']).map((slug) => (
                <Link
                  key={slug}
                  href={`/destinations/${slug}`}
                  className="p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all"
                >
                  <div className="text-2xl mb-2">
                    {slug === 'cyprus' ? '🇨🇾' : slug === 'portugal' ? '🇵🇹' : slug === 'spain' ? '🇪🇸' : slug === 'dubai' ? '🇦🇪' : '🌍'}
                  </div>
                  <div className="font-semibold text-slate-900 capitalize">{slug}</div>
                  <div className="text-sm text-slate-500">View guide</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Getting Started</h2>
            <div className="space-y-3">
              {[
                { label: 'Complete your profile', done: profile.onboarding_completed },
                { label: 'Explore destination guides', done: false },
                { label: 'Calculate cost of living', done: false },
                { label: 'Check visa requirements', done: false },
                { label: 'Talk to ATLAS about your options', done: false },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    item.done ? 'bg-emerald-50' : 'bg-slate-50'
                  }`}
                >
                  <span className={item.done ? 'text-emerald-500' : 'text-slate-300'}>
                    {item.done ? '✓' : '○'}
                  </span>
                  <span className={item.done ? 'text-emerald-700' : 'text-slate-700'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile & Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Profile & Settings</h2>
              <button
                onClick={onEditProfile}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Account Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Account</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-500">Email</div>
                    <div className="text-slate-900">{user.email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Name</div>
                    <div className="text-slate-900">{user.name || 'Not set'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Member since</div>
                    <div className="text-slate-900">January 2026</div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Preferences</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-500">Current Country</div>
                    <div className="text-slate-900">{profile.current_country || 'Not set'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Timeline</div>
                    <div className="text-slate-900 capitalize">{profile.timeline?.replace('-', ' ') || 'Not set'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Monthly Budget</div>
                    <div className="text-slate-900">€{(profile.budget_monthly || 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Priorities */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Your Priorities</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700">Tax Benefits</span>
                    <span className="text-amber-600 font-bold">{profile.priority_tax_benefits || 3}/5</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                      style={{ width: `${((profile.priority_tax_benefits || 3) / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700">Cost of Living</span>
                    <span className="text-emerald-600 font-bold">{profile.priority_cost_of_living || 3}/5</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                      style={{ width: `${((profile.priority_cost_of_living || 3) / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700">Climate</span>
                    <span className="text-blue-600 font-bold">{profile.priority_climate || 3}/5</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"
                      style={{ width: `${((profile.priority_climate || 3) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex gap-4">
              <Link
                href="/account/settings"
                className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account Settings
              </Link>
              <button
                onClick={onEditProfile}
                className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Preferences
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar: CopilotKit */}
        <aside className="w-96 border-l border-slate-200 bg-white">
          <div className="sticky top-0 h-screen">
            <div className="h-full flex flex-col">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>💬</span> ATLAS
                </h2>
                <p className="text-sm text-white/80">Your AI relocation advisor</p>
              </div>
              <div className="flex-1 overflow-hidden">
                <CopilotSidebar
                  defaultOpen={true}
                  labels={{
                    title: 'ATLAS - Your Advisor',
                    initial: `Hi ${user.name || 'there'}! I've reviewed your profile and I'm ready to help you plan your relocation.\n\nBased on your preferences, I can help you with:\n• Comparing destinations\n• Understanding visa options\n• Estimating costs\n• Planning your timeline\n\nWhat would you like to explore?`,
                  }}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Voice Widget - Fixed Bottom Left */}
      <div className="fixed bottom-6 left-6 z-50">
        <HumeWidget />
      </div>
    </div>
  );
}

// Demo user for when auth is not configured
const DEMO_USER: User = {
  id: 'demo-user',
  email: 'demo@relocation.quest',
  name: 'Demo User',
};

const DEMO_PROFILE: UserProfile = {
  id: 'demo-profile',
  user_id: 'demo-user',
  full_name: 'Demo User',
  persona: null,
  onboarding_completed: false,
  onboarding_step: 0,
  target_destinations: null,
  recommended_destinations: [],
  ai_insights: {},
};

export default function DashboardClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Get real auth data from Neon Auth (using authClient.useSession like fractional.quest)
  const { data: session, isPending: authPending } = authClient.useSession();
  const authUser = session?.user;

  // Build user object from auth
  const user: User = authUser ? {
    id: authUser.id,
    email: authUser.email || '',
    name: authUser.name || authUser.email?.split('@')[0] || null,
  } : DEMO_USER;

  // Debug auth state
  useEffect(() => {
    console.log('[Dashboard Auth] ================================');
    console.log('[Dashboard Auth] authPending:', authPending);
    console.log('[Dashboard Auth] session:', session);
    console.log('[Dashboard Auth] authUser:', authUser);
    console.log('[Dashboard Auth] user (final):', user);
    console.log('[Dashboard Auth] ================================');
  }, [authPending, session, authUser, user]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user-profile');
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
          setShowOnboarding(!data.profile.onboarding_completed);
        } else {
          setProfile(DEMO_PROFILE);
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setProfile(DEMO_PROFILE);
        setShowOnboarding(true);
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  if (loading || authPending) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
          <span className="text-6xl mb-6 block">🌍</span>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Relocation Quest</h1>
          <p className="text-slate-600 mb-8">Sign in to access your personalized dashboard and track your relocation journey.</p>
          <Link
            href="/auth/sign-in"
            className="block w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all mb-4"
          >
            Sign In
          </Link>
          <Link
            href="/auth/sign-up"
            className="block w-full border-2 border-slate-200 text-slate-700 px-8 py-3 rounded-xl font-semibold hover:border-amber-300 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingWizard
        user={user}
        profile={profile}
        onComplete={() => {
          setShowOnboarding(false);
          fetch('/api/user-profile')
            .then((res) => res.json())
            .then((data) => setProfile(data.profile || DEMO_PROFILE));
        }}
      />
    );
  }

  return <Dashboard user={user} profile={profile || DEMO_PROFILE} onEditProfile={() => setShowOnboarding(true)} />;
}
