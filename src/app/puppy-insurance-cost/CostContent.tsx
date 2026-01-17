"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotReadable } from "@copilotkit/react-core";
import { PoundSterling, TrendingUp, Calculator, ArrowRight, Info } from "lucide-react";
import { QuoteCalculator, AgeCostChart, BreedRiskChart, PlanComparisonChart } from "@/components/mdx/InsuranceChart";
import { FAQ, FAQSchema } from "@/components/mdx/FAQ";
import { CallToAction } from "@/components/mdx/CallToAction";

const pricingData = {
  plans: [
    { name: "Basic", monthlyRange: "£15-£25", coverage: "Accidents only" },
    { name: "Standard", monthlyRange: "£35-£50", coverage: "Accidents + illness" },
    { name: "Premium", monthlyRange: "£55-£70", coverage: "Full + hereditary" },
    { name: "Comprehensive", monthlyRange: "£85-£120", coverage: "Everything" },
  ],
  breedFactors: [
    { breed: "Mixed Breed", multiplier: "0.85x", category: "Low Risk" },
    { breed: "Beagle", multiplier: "0.90x", category: "Low Risk" },
    { breed: "Labrador", multiplier: "1.00x", category: "Medium Risk" },
    { breed: "French Bulldog", multiplier: "1.40x", category: "High Risk" },
    { breed: "Pug", multiplier: "1.35x", category: "High Risk" },
  ],
  ageFactors: [
    { age: "Under 1 year", adjustment: "+10%" },
    { age: "1-6 years", adjustment: "Base rate" },
    { age: "7-9 years", adjustment: "+30%" },
    { age: "10+ years", adjustment: "+50%" },
  ],
};

const faqItems = [
  {
    question: "How much does puppy insurance cost per month?",
    answer:
      "Puppy insurance costs between £15-£120 per month in the UK depending on coverage level. Basic accident-only plans start at £15/month, while comprehensive plans with everything covered cost around £85/month. Your puppy's breed and age also affect the price.",
  },
  {
    question: "Why does my breed affect insurance cost?",
    answer:
      "Different breeds have different health risk profiles. Breeds prone to health issues (like French Bulldogs with breathing problems or Cavaliers with heart conditions) cost more to insure because they're more likely to need expensive vet care.",
  },
  {
    question: "Is puppy insurance cheaper than adult dog insurance?",
    answer:
      "Generally yes. Puppies aged 8 weeks to 1 year get similar rates to young adults (1-6 years). However, very young puppies may see a slight premium increase (+10%) due to their vulnerability. The best rates are typically for dogs aged 1-6 years.",
  },
  {
    question: "What's the cheapest way to insure my puppy?",
    answer:
      "To minimize costs: choose a higher deductible (£250 vs £100), opt for accident-only cover, insure while young, consider a lower-risk breed, pay annually instead of monthly, and compare quotes from multiple providers.",
  },
  {
    question: "Does location affect puppy insurance cost?",
    answer:
      "Yes, vet costs vary by region. Insurance in London and the South East tends to be more expensive than in other parts of the UK because vet fees are higher in these areas.",
  },
  {
    question: "How much does a vet visit cost without insurance?",
    answer:
      "Without insurance, a routine vet visit costs £30-£60. However, emergencies can cost £500-£5,000+. Common procedures: neutering £150-£365, dental work £200-£500, X-rays £150-£500, surgery £1,000-£5,000+. Insurance protects against these unexpected costs.",
  },
];

export function PuppyInsuranceCostContent() {
  useCopilotReadable({
    description: "Pricing data for puppy insurance",
    value: JSON.stringify(pricingData),
  });

  return (
    <>
      <FAQSchema items={faqItems} />

      <CopilotSidebar
        className="z-[9998]"
        instructions={`You are Buddy, helping users understand puppy insurance costs.
        Key pricing info:
        - Basic: £15-25/mo (accidents only)
        - Standard: £35-50/mo (accidents + illness)
        - Premium: £55-70/mo (full + hereditary)
        - Comprehensive: £85-120/mo (everything)

        Factors affecting price:
        - Breed risk (0.85x to 1.60x multiplier)
        - Age (puppies +10%, 7+ years +30-50%)
        - Coverage level
        - Deductible amount
        - Location

        Help users understand what affects their quote and how to save money.`}
        labels={{
          title: "Pricing Advisor",
          initial: "Hi! I'm Buddy. Want to know how much puppy insurance costs? Tell me about your dog and I'll explain the pricing!",
        }}
      >
        <div className="min-h-screen">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-stone-950 to-amber-900/20" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-4xl mx-auto"
              >
                <span className="inline-block px-4 py-2 bg-green-500/20 text-green-400 text-sm font-medium rounded-full mb-6">
                  💷 Complete Pricing Guide
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Puppy Insurance Cost
                  <span className="block bg-gradient-to-r from-green-400 to-amber-500 bg-clip-text text-transparent">
                    UK 2025
                  </span>
                </h1>
                <p className="text-xl text-white/70 mb-8 leading-relaxed max-w-3xl mx-auto">
                  How much is pet insurance for a puppy? From
                  <span className="text-green-400 font-semibold"> £15-£85/month</span> depending on
                  coverage, breed, and age. See our complete pricing breakdown.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-amber-500 text-stone-950 font-semibold rounded-xl hover:from-green-400 hover:to-amber-400 transition-all"
                  >
                    <Calculator className="w-5 h-5" />
                    Calculate Your Cost
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Price Overview */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Puppy Insurance Prices by Plan
                </h2>
                <p className="text-white/70 text-lg max-w-3xl mx-auto">
                  Here&apos;s what you can expect to pay for each level of coverage.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pricingData.plans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-stone-900 border border-green-500/20 rounded-2xl p-6 text-center"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-green-400 mb-2">{plan.monthlyRange}</div>
                    <div className="text-white/50 text-sm mb-4">per month</div>
                    <div className="text-white/70 text-sm">{plan.coverage}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* What Affects Cost */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  What Affects Puppy Insurance Cost?
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-stone-900/50 border border-stone-700 rounded-xl p-6"
                >
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                    <PoundSterling className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Breed</h3>
                  <ul className="space-y-3 text-sm">
                    {pricingData.breedFactors.map((item) => (
                      <li key={item.breed} className="flex justify-between text-white/70">
                        <span>{item.breed}</span>
                        <span className="text-amber-400 font-medium">{item.multiplier}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-stone-900/50 border border-stone-700 rounded-xl p-6"
                >
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Age</h3>
                  <ul className="space-y-3 text-sm">
                    {pricingData.ageFactors.map((item) => (
                      <li key={item.age} className="flex justify-between text-white/70">
                        <span>{item.age}</span>
                        <span className="text-blue-400 font-medium">{item.adjustment}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-stone-900/50 border border-stone-700 rounded-xl p-6"
                >
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Info className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Other Factors</h3>
                  <ul className="space-y-3 text-sm text-white/70">
                    <li className="flex justify-between">
                      <span>Coverage level</span>
                      <span className="text-green-400">Major impact</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Deductible amount</span>
                      <span className="text-green-400">10-20% diff</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Location (vet costs)</span>
                      <span className="text-green-400">5-15% diff</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Annual vs monthly</span>
                      <span className="text-green-400">5-10% savings</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Charts */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <AgeCostChart title="How Age Affects Your Premium" />
              <BreedRiskChart title="How Breed Risk Affects Cost" />
              <PlanComparisonChart title="Plan Price Comparison" />
            </div>
          </section>

          {/* Quote Calculator */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Calculate Your Puppy Insurance Cost
                </h2>
                <p className="text-white/70 text-lg">
                  Enter your puppy&apos;s details to see estimated pricing.
                </p>
              </motion.div>

              <QuoteCalculator />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <FAQ items={faqItems} title="Puppy Insurance Cost FAQs" />
            </div>
          </section>

          {/* Related Links */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  More Insurance Guides
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: "Cheap Puppy Insurance", href: "/cheap-puppy-insurance", desc: "Budget-friendly options" },
                  { name: "Best Puppy Insurance", href: "/best-puppy-insurance", desc: "Top-rated plans" },
                  { name: "Compare Plans", href: "/compare-pet-insurance", desc: "Side-by-side comparison" },
                ].map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="bg-stone-900 border border-stone-700 rounded-xl p-6 hover:border-amber-500/50 transition-colors group"
                  >
                    <h3 className="font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-white/60 text-sm mb-4">{link.desc}</p>
                    <span className="text-amber-400 text-sm font-medium flex items-center gap-1">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <CallToAction
                title="Get Your Personalized Quote"
                description="Chat with our AI advisor to get an accurate price based on your puppy's specific details."
                buttonText="Get Accurate Quote"
                href="/"
              />
            </div>
          </section>
        </div>
      </CopilotSidebar>
    </>
  );
}
