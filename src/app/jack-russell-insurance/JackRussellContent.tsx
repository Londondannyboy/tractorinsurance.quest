"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Shield, Heart, Activity, Clock, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import {
  QuoteCalculator,
  FeatureComparisonTable,
} from "@/components/mdx/InsuranceChart";
import { FAQ, FAQSchema } from "@/components/mdx/FAQ";
import { CallToAction } from "@/components/mdx/CallToAction";

const jackRussellData = {
  breed: "Jack Russell Terrier",
  riskCategory: "Low to Medium",
  avgLifespan: "13-16 years",
  premiumMultiplier: 0.95,
  avgMonthlyPremium: "£18-£45",
  commonIssues: [
    "Patellar Luxation",
    "Legg-Calve-Perthes Disease",
    "Deafness",
    "Eye Problems (Lens Luxation)",
    "Allergies",
  ],
  temperament: ["Energetic", "Intelligent", "Fearless", "Athletic"],
  exerciseNeeds: "High - 1-2 hours daily",
};

const faqItems = [
  {
    question: "How much is pet insurance for a Jack Russell?",
    answer:
      "Jack Russell insurance typically costs between £15-£45 per month in the UK, depending on your dog's age, location, and the level of coverage you choose. Jack Russells are generally healthy dogs with a 0.95x premium multiplier, making them one of the more affordable breeds to insure.",
  },
  {
    question: "What health conditions are common in Jack Russells?",
    answer:
      "Common health issues in Jack Russell Terriers include patellar luxation (knee problems), Legg-Calve-Perthes disease, hereditary deafness, lens luxation and other eye problems, and skin allergies. A comprehensive insurance plan will cover treatment for these conditions.",
  },
  {
    question: "Is Jack Russell insurance more expensive than other breeds?",
    answer:
      "No, Jack Russells are actually one of the more affordable breeds to insure. With a premium multiplier of 0.95x (below average), they cost less than many popular breeds like French Bulldogs or Cavalier King Charles Spaniels which can have multipliers of 1.4x or higher.",
  },
  {
    question: "What does Jack Russell insurance cover?",
    answer:
      "Jack Russell insurance can cover vet fees for accidents and illnesses, surgery costs, prescription medications, hereditary conditions (on premium plans), dental care, and even alternative therapies. The exact coverage depends on your chosen plan level.",
  },
  {
    question: "Can I get insurance for an older Jack Russell?",
    answer:
      "Yes, you can insure Jack Russells at any age, though premiums increase for older dogs. Jack Russells have a long lifespan of 13-16 years, so getting insurance early locks in lower rates. Dogs over 7 years typically see a 30-50% premium increase.",
  },
  {
    question: "Does Jack Russell insurance cover hereditary conditions?",
    answer:
      "Coverage for hereditary conditions like patellar luxation depends on your plan. Basic plans typically exclude hereditary conditions, while Premium and Comprehensive plans include full coverage. This is important for Jack Russells given their predisposition to certain genetic issues.",
  },
];

export function JackRussellInsuranceContent() {
  useCopilotReadable({
    description: "Jack Russell breed information and insurance data",
    value: JSON.stringify(jackRussellData),
  });

  return (
    <>
      <FAQSchema items={faqItems} />

      <CopilotSidebar
        className="z-[9998]"
        instructions={`You are Buddy, a friendly puppy insurance advisor specializing in Jack Russell Terriers.
        Help users understand Jack Russell insurance options, health concerns, and find the right coverage.
        Key facts about Jack Russells:
        - Risk Category: Low to Medium
        - Premium Multiplier: 0.95x (below average - good!)
        - Average Lifespan: 13-16 years
        - Common Health Issues: Patellar luxation, eye problems, deafness
        - They're energetic, intelligent dogs that need 1-2 hours of exercise daily
        Guide users to get a personalized quote.`}
        labels={{
          title: "Jack Russell Insurance Advisor",
          initial: "Hi! I'm Buddy, your Jack Russell insurance specialist. How can I help you find the perfect coverage for your terrier?",
        }}
      >
        <div className="min-h-screen">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-stone-950 to-orange-900/20" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full mb-6">
                    🐕 Terrier Specialist Coverage
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Jack Russell
                    <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                      Insurance UK
                    </span>
                  </h1>
                  <p className="text-xl text-white/70 mb-8 leading-relaxed">
                    Protect your energetic Jack Russell Terrier with comprehensive pet insurance
                    from just <span className="text-amber-400 font-semibold">£15/month</span>.
                    Cover accidents, illness, and hereditary conditions.
                  </p>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 text-white/80">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Low-risk breed (0.95x)</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>13-16 year lifespan</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Hereditary cover available</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25"
                    >
                      Get Jack Russell Quote
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      href="/compare-pet-insurance"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-stone-800 text-white font-semibold rounded-xl hover:bg-stone-700 transition-all"
                    >
                      Compare Plans
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <div className="relative aspect-square max-w-md mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-3xl blur-3xl" />
                    <Image
                      src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600"
                      alt="Jack Russell Terrier"
                      fill
                      className="object-cover rounded-3xl"
                      priority
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Breed Info Cards */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  About Jack Russell Terrier Insurance
                </h2>
                <p className="text-white/70 text-lg max-w-3xl mx-auto">
                  Jack Russells are one of the most affordable breeds to insure, with a below-average
                  risk profile. Here&apos;s what you need to know.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6"
                >
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Low Risk Breed</h3>
                  <p className="text-white/60 text-sm">
                    With a 0.95x premium multiplier, Jack Russells cost less to insure than many breeds.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6"
                >
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Long Lifespan</h3>
                  <p className="text-white/60 text-sm">
                    Jack Russells live 13-16 years on average, one of the longest-living breeds.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6"
                >
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Activity className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">High Energy</h3>
                  <p className="text-white/60 text-sm">
                    These athletic dogs need 1-2 hours of exercise daily, increasing accident risk.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6"
                >
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Health Watch</h3>
                  <p className="text-white/60 text-sm">
                    Monitor for patellar luxation, eye problems, and skin allergies in your Jack Russell.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Common Health Issues */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Common Jack Russell Health Issues
                </h2>
                <p className="text-white/70 text-lg">
                  Understanding breed-specific health concerns helps you choose the right coverage level.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jackRussellData.commonIssues.map((issue, index) => (
                  <motion.div
                    key={issue}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-stone-900/50 border border-stone-700 rounded-xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-2">{issue}</h3>
                        <p className="text-white/60 text-sm">
                          Covered under Premium and Comprehensive plans with hereditary condition coverage.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-amber-900/20 border border-amber-500/30 rounded-xl">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Why hereditary coverage matters for Jack Russells
                    </h3>
                    <p className="text-white/70">
                      While Jack Russells are generally healthy, conditions like patellar luxation are
                      hereditary. Basic plans exclude these conditions, so we recommend at least Standard
                      coverage for peace of mind. Treatment for patellar luxation surgery alone can cost
                      £1,500-£3,000.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quote Calculator */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Get Your Jack Russell Quote
                </h2>
                <p className="text-white/70 text-lg">
                  Use our calculator for an instant estimate, then get a personalized quote from our AI advisor.
                </p>
              </motion.div>

              <QuoteCalculator />
            </div>
          </section>

          {/* Plan Comparison */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Compare Jack Russell Insurance Plans
                </h2>
                <p className="text-white/70 text-lg max-w-3xl mx-auto">
                  From accident-only cover to comprehensive protection. Find the right level for your
                  Jack Russell&apos;s needs and your budget.
                </p>
              </motion.div>

              <FeatureComparisonTable />

              <div className="mt-8 text-center">
                <Link
                  href="/compare-pet-insurance"
                  className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium"
                >
                  See detailed plan comparison
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <FAQ items={faqItems} title="Jack Russell Insurance FAQs" />
            </div>
          </section>

          {/* Related Breeds */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Explore Other Breed Insurance
                </h2>
                <p className="text-white/70">
                  Compare coverage options for other popular breeds.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: "Pug", href: "/pug-insurance", risk: "High" },
                  { name: "Cockapoo", href: "/cockapoo-insurance", risk: "Medium" },
                  { name: "Dachshund", href: "/dachshund-insurance", risk: "Medium" },
                ].map((breed) => (
                  <Link
                    key={breed.name}
                    href={breed.href}
                    className="bg-stone-900 border border-stone-700 rounded-xl p-6 hover:border-amber-500/50 transition-colors group"
                  >
                    <h3 className="font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {breed.name} Insurance
                    </h3>
                    <p className="text-white/60 text-sm mb-4">
                      {breed.risk} risk breed coverage options
                    </p>
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
                title="Protect Your Jack Russell Today"
                description="Get a personalized quote in minutes. Our AI advisor will help you find the perfect coverage for your terrier."
                buttonText="Start Your Quote"
                href="/"
              />
            </div>
          </section>
        </div>
      </CopilotSidebar>
    </>
  );
}
