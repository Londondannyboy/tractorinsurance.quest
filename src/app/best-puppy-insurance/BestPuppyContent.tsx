"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Trophy, Star, CheckCircle, ArrowRight, Shield, Zap, Heart } from "lucide-react";
import { FeatureComparisonTable, BreedRiskChart } from "@/components/mdx/InsuranceChart";
import { FAQ, FAQSchema } from "@/components/mdx/FAQ";
import { CallToAction } from "@/components/mdx/CallToAction";

const planRankings = [
  {
    rank: 1,
    name: "Comprehensive Plan",
    price: "£85/month",
    rating: 5,
    bestFor: "Maximum protection",
    highlights: ["£50,000 annual limit", "£0 deductible", "Everything covered", "Alternative therapies"],
  },
  {
    rank: 2,
    name: "Premium Plan",
    price: "£55/month",
    rating: 4.5,
    bestFor: "Best value",
    highlights: ["£20,000 annual limit", "£100 deductible", "Hereditary conditions", "Dental care"],
  },
  {
    rank: 3,
    name: "Standard Plan",
    price: "£35/month",
    rating: 4,
    bestFor: "Essential coverage",
    highlights: ["£10,000 annual limit", "£200 deductible", "Illness & accidents", "Prescriptions"],
  },
  {
    rank: 4,
    name: "Basic Plan",
    price: "£15/month",
    rating: 3.5,
    bestFor: "Budget option",
    highlights: ["£5,000 annual limit", "£250 deductible", "Accidents only", "Emergency care"],
  },
];

const faqItems = [
  {
    question: "What is the best pet insurance for puppies?",
    answer:
      "The best puppy insurance depends on your needs and budget. For comprehensive protection, we recommend Premium or Comprehensive plans that cover hereditary conditions, illness, and accidents. These plans offer the best value for puppies who may develop breed-specific health issues.",
  },
  {
    question: "What should I look for in puppy insurance?",
    answer:
      "Key factors to consider: coverage for hereditary conditions (important for purebreds), lifetime vs annual limits, deductible amounts, waiting periods, exclusions, and whether routine care is included. Also check if the plan covers your puppy's specific breed risks.",
  },
  {
    question: "Is it worth getting comprehensive puppy insurance?",
    answer:
      "Yes, especially for breeds prone to health issues. While basic plans are cheaper, they often exclude hereditary conditions and illnesses. A comprehensive plan may cost more upfront but saves thousands if your puppy develops a serious condition requiring ongoing treatment.",
  },
  {
    question: "When should I get insurance for my puppy?",
    answer:
      "Insure your puppy as soon as possible, ideally from 8 weeks old when you bring them home. Early insurance ensures any conditions that develop are covered and locks in lower premiums. Waiting until issues arise means they become pre-existing and excluded.",
  },
  {
    question: "Do all puppy insurance plans cover vaccinations?",
    answer:
      "No, routine care like vaccinations is typically only covered by Premium and Comprehensive plans. Basic and Standard plans focus on unexpected accidents and illnesses. If you want vaccination coverage, choose a higher-tier plan or add a wellness rider.",
  },
  {
    question: "What's the difference between lifetime and annual cover?",
    answer:
      "Lifetime cover renews your annual limit each year, allowing ongoing treatment for chronic conditions. Annual cover caps total treatment per condition. For puppies, lifetime cover is recommended as it protects against long-term health issues throughout their life.",
  },
];

export function BestPuppyInsuranceContent() {
  useCopilotReadable({
    description: "Plan rankings and comparison data",
    value: JSON.stringify(planRankings),
  });

  return (
    <>
      <FAQSchema items={faqItems} />

      <CopilotSidebar
        className="z-[9998]"
        instructions={`You are Buddy, an expert puppy insurance advisor helping users find the best coverage.
        You know all about different plan types, what makes a good puppy insurance policy, and can recommend plans based on breed, budget, and coverage needs.
        Plan Rankings (our recommendations):
        1. Comprehensive (£85/mo) - Best overall protection
        2. Premium (£55/mo) - Best value
        3. Standard (£35/mo) - Essential coverage
        4. Basic (£15/mo) - Budget option
        Help users understand which plan is best for their specific situation.`}
        labels={{
          title: "Find Your Best Plan",
          initial: "Hi! I'm Buddy. Let me help you find the best puppy insurance for your needs. What breed is your puppy?",
        }}
      >
        <div className="min-h-screen">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-stone-950 to-orange-900/20" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-4xl mx-auto"
              >
                <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full mb-6">
                  🏆 2025 Expert Guide
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Best Pet Insurance
                  <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    for Puppies UK
                  </span>
                </h1>
                <p className="text-xl text-white/70 mb-8 leading-relaxed max-w-3xl mx-auto">
                  Compare the top-rated puppy insurance plans in the UK. Our expert guide helps you
                  find the perfect coverage for your new furry family member.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25"
                  >
                    Get Personalized Quote
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/compare-pet-insurance"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-stone-800 text-white font-semibold rounded-xl hover:bg-stone-700 transition-all"
                  >
                    Compare All Plans
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Plan Rankings */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Our Top Puppy Insurance Plans
                </h2>
                <p className="text-white/70 text-lg max-w-3xl mx-auto">
                  We&apos;ve ranked the best puppy insurance options based on coverage, value, and customer satisfaction.
                </p>
              </motion.div>

              <div className="space-y-6">
                {planRankings.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative bg-stone-900 border rounded-2xl p-6 lg:p-8 ${
                      plan.rank === 1
                        ? "border-amber-500/50 shadow-lg shadow-amber-500/10"
                        : plan.rank === 2
                        ? "border-amber-500/30"
                        : "border-stone-700"
                    }`}
                  >
                    {plan.rank === 1 && (
                      <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 text-xs font-bold rounded-full">
                        BEST OVERALL
                      </div>
                    )}
                    {plan.rank === 2 && (
                      <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-500/30 text-amber-400 text-xs font-bold rounded-full border border-amber-500/50">
                        BEST VALUE
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Rank Badge */}
                      <div className="flex items-center gap-4 lg:w-48">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                          plan.rank === 1
                            ? "bg-gradient-to-br from-amber-500 to-orange-500 text-stone-950"
                            : "bg-stone-800 text-white"
                        }`}>
                          #{plan.rank}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(plan.rating)
                                    ? "text-amber-400 fill-amber-400"
                                    : i < plan.rating
                                    ? "text-amber-400 fill-amber-400/50"
                                    : "text-stone-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="lg:w-32">
                        <div className="text-2xl font-bold text-amber-400">{plan.price}</div>
                        <div className="text-white/50 text-sm">per month</div>
                      </div>

                      {/* Best For */}
                      <div className="lg:w-40">
                        <div className="text-white/50 text-sm mb-1">Best for</div>
                        <div className="text-white font-medium">{plan.bestFor}</div>
                      </div>

                      {/* Highlights */}
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          {plan.highlights.map((highlight) => (
                            <span
                              key={highlight}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-stone-800 rounded-full text-white/80 text-sm"
                            >
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="lg:w-40">
                        <Link
                          href="/"
                          className={`block w-full px-6 py-3 text-center font-semibold rounded-xl transition-all ${
                            plan.rank === 1
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 hover:from-amber-400 hover:to-orange-400"
                              : "bg-stone-800 text-white hover:bg-stone-700"
                          }`}
                        >
                          Get Quote
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* What Makes Good Insurance */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  What Makes the Best Puppy Insurance?
                </h2>
                <p className="text-white/70 text-lg max-w-3xl mx-auto">
                  Here are the key factors we consider when ranking puppy insurance plans.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Shield,
                    title: "Comprehensive Coverage",
                    description: "The best plans cover accidents, illness, hereditary conditions, and preventive care.",
                  },
                  {
                    icon: Zap,
                    title: "Fast Claims Processing",
                    description: "Quick reimbursement means you're not out of pocket when your puppy needs care.",
                  },
                  {
                    icon: Heart,
                    title: "Lifetime Cover",
                    description: "Renewable annual limits ensure chronic conditions are covered throughout your pet's life.",
                  },
                  {
                    icon: Trophy,
                    title: "Value for Money",
                    description: "Balance between premium cost and coverage benefits. Not always the cheapest option.",
                  },
                  {
                    icon: Star,
                    title: "Customer Reviews",
                    description: "Real customer experiences and satisfaction ratings help identify reliable providers.",
                  },
                  {
                    icon: CheckCircle,
                    title: "Flexible Options",
                    description: "Customizable deductibles, coverage limits, and add-ons to suit your needs.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-stone-900/50 border border-stone-700 rounded-xl p-6 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Comparison Chart */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Plan Feature Comparison
                </h2>
              </motion.div>

              <FeatureComparisonTable />
            </div>
          </section>

          {/* Breed Risk Chart */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  How Your Breed Affects Costs
                </h2>
                <p className="text-white/70 text-lg">
                  Different breeds have different risk profiles, affecting insurance premiums.
                </p>
              </motion.div>

              <BreedRiskChart />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <FAQ items={faqItems} title="Best Puppy Insurance FAQs" />
            </div>
          </section>

          {/* Breed Pages Links */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Breed-Specific Insurance Guides
                </h2>
                <p className="text-white/70">
                  Find the best insurance for your specific breed.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Jack Russell", href: "/jack-russell-insurance" },
                  { name: "Pug", href: "/pug-insurance" },
                  { name: "Cockapoo", href: "/cockapoo-insurance" },
                  { name: "Cavapoo", href: "/cavapoo-insurance" },
                  { name: "Dachshund", href: "/dachshund-insurance" },
                  { name: "French Bulldog", href: "/french-bulldog-insurance" },
                  { name: "Labrador", href: "/labrador-insurance" },
                  { name: "Compare All", href: "/compare-pet-insurance" },
                ].map((breed) => (
                  <Link
                    key={breed.name}
                    href={breed.href}
                    className="bg-stone-900 border border-stone-700 rounded-xl p-4 text-center hover:border-amber-500/50 transition-colors"
                  >
                    <span className="text-white font-medium">{breed.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <CallToAction
                title="Find Your Best Puppy Insurance"
                description="Chat with our AI advisor to get personalized recommendations based on your puppy's breed, age, and your budget."
                buttonText="Get Personalized Quote"
                href="/"
              />
            </div>
          </section>
        </div>
      </CopilotSidebar>
    </>
  );
}
