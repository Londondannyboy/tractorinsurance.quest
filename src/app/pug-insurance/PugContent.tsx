"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Heart, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { QuoteCalculator, FeatureComparisonTable } from "@/components/mdx/InsuranceChart";
import { FAQ, FAQSchema } from "@/components/mdx/FAQ";
import { CallToAction } from "@/components/mdx/CallToAction";

const pugData = {
  breed: "Pug",
  riskCategory: "High",
  avgLifespan: "12-15 years",
  premiumMultiplier: 1.35,
  avgMonthlyPremium: "£25-£65",
  commonIssues: [
    "Brachycephalic Obstructive Airway Syndrome (BOAS)",
    "Eye Problems (Proptosis, Dry Eye)",
    "Skin Fold Dermatitis",
    "Hip Dysplasia",
    "Patellar Luxation",
    "Encephalitis (PDE)",
  ],
  temperament: ["Charming", "Playful", "Loving", "Stubborn"],
  exerciseNeeds: "Moderate - 30-60 mins daily (avoid heat)",
};

const faqItems = [
  {
    question: "How much is pet insurance for a Pug?",
    answer:
      "Pug insurance typically costs between £25-£65 per month in the UK. Pugs are classified as a high-risk breed with a 1.35x premium multiplier due to their brachycephalic nature and associated health conditions. Premium plans with hereditary coverage are recommended.",
  },
  {
    question: "Why is Pug insurance more expensive?",
    answer:
      "Pugs have a flat face (brachycephalic) which causes breathing difficulties, eye problems, and overheating issues. They're also prone to skin fold infections, hip dysplasia, and a rare brain condition called PDE. These health risks mean higher vet bills and insurance premiums.",
  },
  {
    question: "Does pet insurance cover BOAS surgery for Pugs?",
    answer:
      "Yes, most Premium and Comprehensive plans cover BOAS (Brachycephalic Obstructive Airway Syndrome) surgery. This corrective surgery can cost £1,500-£5,000. Basic plans may exclude it as a pre-existing or hereditary condition, so check your policy carefully.",
  },
  {
    question: "What health problems should I insure my Pug for?",
    answer:
      "Key conditions to ensure coverage for include: BOAS and breathing issues, eye problems (corneal ulcers, dry eye, proptosis), skin fold infections, hip and knee problems, and PDE (Pug Dog Encephalitis). A comprehensive plan offers the best protection.",
  },
  {
    question: "Can I get insurance for a Pug puppy?",
    answer:
      "Yes, and we strongly recommend insuring Pug puppies as early as possible. Starting coverage at 8 weeks locks in lower premiums and ensures any conditions that develop later are covered. Pre-existing conditions are typically excluded.",
  },
  {
    question: "Is it worth getting pet insurance for a Pug?",
    answer:
      "Absolutely. Pugs have among the highest vet bills of any breed due to their health issues. A single BOAS surgery can cost £3,000+, eye surgery £1,500+, and hip surgery £4,000+. Insurance provides peace of mind and financial protection.",
  },
];

export function PugInsuranceContent() {
  useCopilotReadable({
    description: "Pug breed information and insurance data",
    value: JSON.stringify(pugData),
  });

  return (
    <>
      <FAQSchema items={faqItems} />

      <CopilotSidebar
        className="z-[9998]"
        instructions={`You are Buddy, a friendly puppy insurance advisor specializing in Pugs and brachycephalic breeds.
        Help users understand Pug insurance options, health concerns specific to flat-faced breeds, and find the right coverage.
        Key facts about Pugs:
        - Risk Category: High (brachycephalic breed)
        - Premium Multiplier: 1.35x (above average)
        - Average Lifespan: 12-15 years
        - Common Health Issues: BOAS, eye problems, skin fold infections, PDE
        - They need moderate exercise but must avoid heat and overexertion
        Emphasize the importance of comprehensive coverage for this breed.`}
        labels={{
          title: "Pug Insurance Advisor",
          initial: "Hi! I'm Buddy, your Pug insurance specialist. Pugs need special coverage - let me help you find the right plan!",
        }}
      >
        <div className="min-h-screen">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-stone-950 to-orange-900/20" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-block px-4 py-2 bg-red-500/20 text-red-400 text-sm font-medium rounded-full mb-6">
                    🐶 Brachycephalic Specialist Coverage
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Pug Insurance
                    <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                      UK Coverage
                    </span>
                  </h1>
                  <p className="text-xl text-white/70 mb-8 leading-relaxed">
                    Specialist pet insurance for your Pug from
                    <span className="text-amber-400 font-semibold"> £25/month</span>.
                    Cover BOAS surgery, eye problems, and hereditary conditions.
                  </p>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 text-white/80">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span>High-risk breed (1.35x)</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>BOAS coverage available</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Eye condition cover</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25"
                    >
                      Get Pug Quote
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
                      src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600"
                      alt="Pug dog"
                      fill
                      className="object-cover rounded-3xl"
                      priority
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Why Pugs Need Special Coverage */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Why Pugs Need Specialist Insurance
                </h2>
                <p className="text-white/70 text-lg max-w-3xl mx-auto">
                  Pugs are brachycephalic (flat-faced) dogs with unique health challenges.
                  Understanding these helps you choose the right coverage.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pugData.commonIssues.map((issue, index) => (
                  <motion.div
                    key={issue}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-stone-900 border border-red-500/20 rounded-xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-2">{issue}</h3>
                        <p className="text-white/60 text-sm">
                          Covered under Premium and Comprehensive plans.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-red-900/20 border border-red-500/30 rounded-xl">
                <div className="flex items-start gap-4">
                  <Heart className="w-6 h-6 text-red-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Important: Pre-existing conditions
                    </h3>
                    <p className="text-white/70">
                      If your Pug already shows signs of breathing difficulties or other conditions,
                      these may be excluded as pre-existing. Insure your Pug puppy as early as possible
                      (from 8 weeks) to ensure maximum coverage for conditions that develop later.
                    </p>
                  </div>
                </div>
              </div>
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
                  Get Your Pug Insurance Quote
                </h2>
                <p className="text-white/70 text-lg">
                  See estimated costs for your Pug, then chat with our AI advisor for a personalized quote.
                </p>
              </motion.div>

              <QuoteCalculator />
            </div>
          </section>

          {/* Plan Comparison */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Compare Pug Insurance Plans
                </h2>
                <p className="text-white/70 text-lg max-w-3xl mx-auto">
                  For Pugs, we recommend at least Premium coverage to ensure hereditary and
                  brachycephalic conditions are covered.
                </p>
              </motion.div>

              <FeatureComparisonTable />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <FAQ items={faqItems} title="Pug Insurance FAQs" />
            </div>
          </section>

          {/* Related Breeds */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Other Breed Insurance Guides
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: "French Bulldog", href: "/french-bulldog-insurance", risk: "High" },
                  { name: "Jack Russell", href: "/jack-russell-insurance", risk: "Low" },
                  { name: "Cavapoo", href: "/cavapoo-insurance", risk: "Medium" },
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
                      {breed.risk} risk breed coverage
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
                title="Protect Your Pug Today"
                description="Don't wait until health issues develop. Get comprehensive coverage for your Pug now."
                buttonText="Get Your Pug Quote"
                href="/"
              />
            </div>
          </section>
        </div>
      </CopilotSidebar>
    </>
  );
}
