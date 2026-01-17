"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotReadable } from "@copilotkit/react-core";
import { ArrowRight, AlertTriangle, Lightbulb } from "lucide-react";
import { QuoteCalculator, AgeCostChart, BreedRiskChart } from "@/components/mdx/InsuranceChart";
import { FAQ, FAQSchema } from "@/components/mdx/FAQ";
import { CallToAction } from "@/components/mdx/CallToAction";

const savingTips = [
  {
    tip: "Choose a higher deductible",
    description: "Increasing your deductible from £100 to £250 can reduce premiums by 10-20%.",
    savings: "10-20%",
  },
  {
    tip: "Insure while young",
    description: "Puppies under 1 year get the best rates. Premiums increase with age.",
    savings: "Up to 50%",
  },
  {
    tip: "Choose a low-risk breed",
    description: "Mixed breeds and healthy purebreds like Beagles cost less to insure.",
    savings: "15-40%",
  },
  {
    tip: "Consider accident-only cover",
    description: "Basic plans covering accidents only are the cheapest option available.",
    savings: "50-70%",
  },
  {
    tip: "Pay annually",
    description: "Annual payments often come with a discount vs monthly payments.",
    savings: "5-10%",
  },
  {
    tip: "Multi-pet discount",
    description: "Insuring multiple pets with the same provider can earn discounts.",
    savings: "5-15%",
  },
];

const faqItems = [
  {
    question: "What is the cheapest puppy insurance available?",
    answer:
      "The cheapest puppy insurance is typically accident-only coverage, starting from around £15/month. However, this only covers accidents, not illnesses. For more comprehensive but still affordable cover, Standard plans start around £35/month.",
  },
  {
    question: "Is cheap puppy insurance worth it?",
    answer:
      "Cheap insurance is better than no insurance, but check what's covered. Very cheap plans often exclude illness, hereditary conditions, and routine care. Ensure the plan covers your main concerns - an unexpected vet bill can easily exceed £1,000.",
  },
  {
    question: "How can I reduce my puppy insurance costs?",
    answer:
      "Key ways to save: insure while your puppy is young, choose a higher deductible, consider a low-risk breed, pay annually instead of monthly, and compare quotes from multiple providers. Our AI advisor can help find the best value for your situation.",
  },
  {
    question: "Why does puppy age affect insurance cost?",
    answer:
      "Younger puppies have lower premiums because they're less likely to have pre-existing conditions and have more healthy years ahead. Premiums typically increase 30-50% for dogs over 7 years old as health risks increase.",
  },
  {
    question: "Does breed affect how much puppy insurance costs?",
    answer:
      "Yes, significantly. High-risk breeds like French Bulldogs and Pugs can cost 35-60% more to insure than low-risk breeds like Beagles or mixed breeds. This reflects the likelihood of breed-specific health issues.",
  },
  {
    question: "What's the difference between cheap and comprehensive insurance?",
    answer:
      "Cheap (basic) insurance typically covers accidents only with lower annual limits (£5,000). Comprehensive plans cover accidents, illness, hereditary conditions, dental, and routine care with higher limits (£20,000-£50,000). The difference in claims coverage can be significant.",
  },
];

export function CheapPuppyInsuranceContent() {
  useCopilotReadable({
    description: "Money-saving tips for puppy insurance",
    value: JSON.stringify(savingTips),
  });

  return (
    <>
      <FAQSchema items={faqItems} />

      <CopilotSidebar
        className="z-[9998]"
        instructions={`You are Buddy, a puppy insurance advisor helping users find affordable coverage.
        You understand budget constraints and can recommend ways to save money while still getting adequate protection.
        Key money-saving strategies:
        - Higher deductibles reduce premiums
        - Insure puppies while young for best rates
        - Low-risk breeds cost less (Beagles, mixed breeds)
        - Accident-only is cheapest but limited
        - Annual payment discounts
        - Multi-pet discounts
        Help users balance cost with coverage needs.`}
        labels={{
          title: "Budget Insurance Advisor",
          initial: "Hi! I'm Buddy. Looking for affordable puppy insurance? Let me help you find the best value coverage!",
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
                  💰 Budget-Friendly Options
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Cheap Puppy Insurance
                  <span className="block bg-gradient-to-r from-green-400 to-amber-500 bg-clip-text text-transparent">
                    UK
                  </span>
                </h1>
                <p className="text-xl text-white/70 mb-8 leading-relaxed max-w-3xl mx-auto">
                  Find affordable pet insurance for your puppy from just
                  <span className="text-green-400 font-semibold"> £15/month</span>.
                  Compare budget-friendly plans without compromising on essential coverage.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-amber-500 text-stone-950 font-semibold rounded-xl hover:from-green-400 hover:to-amber-400 transition-all shadow-lg shadow-green-500/25"
                  >
                    Find Cheap Quote
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
            </div>
          </section>

          {/* Money Saving Tips */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  6 Ways to Save on Puppy Insurance
                </h2>
                <p className="text-white/70 text-lg max-w-3xl mx-auto">
                  Use these tips to reduce your premium while maintaining good coverage.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savingTips.map((item, index) => (
                  <motion.div
                    key={item.tip}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-stone-900 border border-green-500/20 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-bold rounded-full">
                        Save {item.savings}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-2">{item.tip}</h3>
                    <p className="text-white/60 text-sm">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Warning about cheap insurance */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      What to Watch Out For with Cheap Insurance
                    </h3>
                    <ul className="space-y-3 text-white/70">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span><strong>Exclusions:</strong> Very cheap plans often exclude illness, hereditary conditions, dental, and routine care.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span><strong>Low limits:</strong> £5,000 annual limit may not cover major surgery or ongoing treatment.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span><strong>High deductibles:</strong> Check the excess amount - you might pay more out of pocket per claim.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span><strong>Waiting periods:</strong> Some cheap plans have longer waiting periods before coverage begins.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Price Charts */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  What Affects Your Premium?
                </h2>
              </motion.div>

              <AgeCostChart title="How Age Affects Cost" />
              <BreedRiskChart title="How Breed Affects Cost" />
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
                  Find Your Cheapest Quote
                </h2>
                <p className="text-white/70 text-lg">
                  Try different breeds and plan levels to see how costs compare.
                </p>
              </motion.div>

              <QuoteCalculator />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <FAQ items={faqItems} title="Cheap Puppy Insurance FAQs" />
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <CallToAction
                title="Find Affordable Coverage Today"
                description="Our AI advisor will help you find the best value puppy insurance that fits your budget."
                buttonText="Get Cheap Quote"
                href="/"
              />
            </div>
          </section>
        </div>
      </CopilotSidebar>
    </>
  );
}
