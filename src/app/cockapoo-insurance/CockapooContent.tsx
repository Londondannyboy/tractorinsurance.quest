"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotReadable } from "@copilotkit/react-core";
import { AlertTriangle, CheckCircle, ArrowRight, Ear, Eye } from "lucide-react";
import { QuoteCalculator, FeatureComparisonTable } from "@/components/mdx/InsuranceChart";
import { FAQ, FAQSchema } from "@/components/mdx/FAQ";
import { CallToAction } from "@/components/mdx/CallToAction";

const cockapooData = {
  breed: "Cockapoo",
  riskCategory: "Medium",
  avgLifespan: "14-18 years",
  premiumMultiplier: 1.05,
  avgMonthlyPremium: "£18-£50",
  commonIssues: [
    "Hip Dysplasia",
    "Progressive Retinal Atrophy (PRA)",
    "Ear Infections",
    "Patellar Luxation",
    "Allergies",
    "Cataracts",
  ],
  temperament: ["Friendly", "Intelligent", "Energetic", "Affectionate"],
  exerciseNeeds: "Moderate to High - 45-60 mins daily",
};

const faqItems = [
  {
    question: "How much does Cockapoo insurance cost?",
    answer:
      "Cockapoo insurance typically costs between £18-£50 per month in the UK. As a medium-risk designer breed with a 1.05x premium multiplier, Cockapoos are reasonably affordable to insure compared to many purebreds.",
  },
  {
    question: "What health problems are common in Cockapoos?",
    answer:
      "Cockapoos can inherit conditions from both Cocker Spaniels and Poodles. Common issues include hip dysplasia, progressive retinal atrophy (PRA), ear infections (due to their floppy ears), patellar luxation, allergies, and cataracts.",
  },
  {
    question: "Is pet insurance worth it for a Cockapoo?",
    answer:
      "Yes, Cockapoos can develop expensive hereditary conditions from either parent breed. Hip dysplasia surgery costs £3,000-£5,000, and ongoing treatment for conditions like allergies or ear infections adds up. Insurance provides financial protection.",
  },
  {
    question: "Do Cockapoos need hereditary condition coverage?",
    answer:
      "We recommend it. Both Cocker Spaniels and Poodles carry genetic health issues that can be passed to Cockapoos. Premium or Comprehensive plans that cover hereditary conditions offer the best protection.",
  },
  {
    question: "When should I insure my Cockapoo puppy?",
    answer:
      "Insure your Cockapoo puppy as soon as possible, ideally from 8 weeks old. This ensures any conditions that develop later are covered and locks in lower premiums. Cockapoos have a long lifespan of 14-18 years.",
  },
  {
    question: "Does Cockapoo insurance cover ear infections?",
    answer:
      "Yes, ear infections are typically covered by pet insurance as they're treated as an illness. Cockapoos are prone to ear infections due to their floppy ears that trap moisture. Regular cleaning helps prevent them.",
  },
];

export function CockapooInsuranceContent() {
  useCopilotReadable({
    description: "Cockapoo breed information and insurance data",
    value: JSON.stringify(cockapooData),
  });

  return (
    <>
      <FAQSchema items={faqItems} />

      <CopilotSidebar
        className="z-[9998]"
        instructions={`You are Buddy, a friendly puppy insurance advisor specializing in Cockapoos and designer breeds.
        Help users understand Cockapoo insurance options, inherited health concerns from both parent breeds, and find the right coverage.
        Key facts about Cockapoos:
        - Risk Category: Medium (designer breed)
        - Premium Multiplier: 1.05x (slightly above average)
        - Average Lifespan: 14-18 years (long-lived!)
        - Parent breeds: Cocker Spaniel x Poodle
        - Common Health Issues: Hip dysplasia, PRA, ear infections, allergies
        Recommend plans that cover hereditary conditions.`}
        labels={{
          title: "Cockapoo Insurance Advisor",
          initial: "Hi! I'm Buddy, your Cockapoo insurance specialist. These adorable Poodle mixes need tailored coverage - let me help!",
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
                  <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full mb-6">
                    🐩 Designer Breed Coverage
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Cockapoo Insurance
                    <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                      UK
                    </span>
                  </h1>
                  <p className="text-xl text-white/70 mb-8 leading-relaxed">
                    Protect your Cocker Spaniel Poodle mix with comprehensive coverage from
                    <span className="text-amber-400 font-semibold"> £18/month</span>.
                    Cover hip dysplasia, eye conditions, and hereditary issues.
                  </p>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 text-white/80">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Medium-risk (1.05x)</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>14-18 year lifespan</span>
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
                      Get Cockapoo Quote
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
                      alt="Cockapoo dog"
                      fill
                      className="object-cover rounded-3xl"
                      priority
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Health Concerns */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Cockapoo Health Concerns
                </h2>
                <p className="text-white/70 text-lg max-w-3xl mx-auto">
                  Cockapoos can inherit health issues from both Cocker Spaniels and Poodles.
                  Here&apos;s what to look out for.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cockapooData.commonIssues.map((issue, index) => (
                  <motion.div
                    key={issue}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-stone-900 border border-amber-500/20 rounded-xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center shrink-0">
                        {issue.includes("Ear") ? (
                          <Ear className="w-5 h-5 text-amber-400" />
                        ) : issue.includes("Eye") || issue.includes("Retinal") || issue.includes("Cataract") ? (
                          <Eye className="w-5 h-5 text-amber-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                        )}
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
            </div>
          </section>

          {/* Quote Calculator */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  Compare Cockapoo Insurance Plans
                </h2>
              </motion.div>

              <FeatureComparisonTable />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <FAQ items={faqItems} title="Cockapoo Insurance FAQs" />
            </div>
          </section>

          {/* Related Breeds */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Other Designer Breed Insurance
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: "Cavapoo", href: "/cavapoo-insurance", risk: "Medium" },
                  { name: "Labrador", href: "/labrador-insurance", risk: "Medium" },
                  { name: "Pug", href: "/pug-insurance", risk: "High" },
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
                title="Protect Your Cockapoo Today"
                description="Get comprehensive coverage for your designer breed. Our AI advisor will help you find the perfect plan."
                buttonText="Get Your Quote"
                href="/"
              />
            </div>
          </section>
        </div>
      </CopilotSidebar>
    </>
  );
}
