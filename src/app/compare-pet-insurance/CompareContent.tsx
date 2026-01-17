"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { CheckCircle, X, Filter } from "lucide-react";
import {
  PlanComparisonChart,
  FeatureComparisonTable,
  CoverageBreakdownChart,
} from "@/components/mdx/InsuranceChart";
import { FAQ, FAQSchema } from "@/components/mdx/FAQ";
import { CallToAction } from "@/components/mdx/CallToAction";

const plans = [
  {
    name: "Basic",
    price: 15,
    annualLimit: 5000,
    deductible: 250,
    coverage: ["Accidents", "Emergency care"],
    excluded: ["Illness", "Hereditary", "Dental", "Routine care", "Prescriptions"],
    bestFor: "Budget-conscious owners with healthy, low-risk breeds",
    color: "stone",
  },
  {
    name: "Standard",
    price: 35,
    annualLimit: 10000,
    deductible: 200,
    coverage: ["Accidents", "Illness", "Emergency care", "Prescriptions", "Surgery"],
    excluded: ["Hereditary", "Dental", "Routine care"],
    bestFor: "Most dog owners wanting essential illness and accident cover",
    color: "blue",
  },
  {
    name: "Premium",
    price: 55,
    annualLimit: 20000,
    deductible: 100,
    coverage: ["Accidents", "Illness", "Hereditary", "Dental", "Routine care", "Surgery", "Prescriptions"],
    excluded: ["Alternative therapies", "Behavioral therapy"],
    bestFor: "Owners of breeds prone to hereditary conditions",
    color: "amber",
  },
  {
    name: "Comprehensive",
    price: 85,
    annualLimit: 50000,
    deductible: 0,
    coverage: ["Accidents", "Illness", "Hereditary", "Dental", "Routine care", "Surgery", "Prescriptions", "Alternative therapies", "Behavioral therapy"],
    excluded: [],
    bestFor: "Maximum protection with no deductible",
    color: "green",
  },
];

const faqItems = [
  {
    question: "How do I compare pet insurance plans?",
    answer:
      "Compare plans by looking at: monthly cost, annual coverage limit, deductible amount, what's included (accidents, illness, hereditary conditions), what's excluded, and any waiting periods. Our comparison tool shows all these factors side-by-side.",
  },
  {
    question: "What's the difference between Basic and Comprehensive cover?",
    answer:
      "Basic cover (£15/mo) covers accidents only with a £5,000 limit. Comprehensive (£85/mo) covers everything including hereditary conditions, dental, alternative therapies with a £50,000 limit and £0 deductible. The right choice depends on your breed and budget.",
  },
  {
    question: "Should I get the cheapest or most expensive plan?",
    answer:
      "Neither extreme is necessarily best. Consider your dog's breed (high-risk breeds benefit from comprehensive cover), your budget, and your risk tolerance. Standard or Premium plans often offer the best balance of coverage and cost.",
  },
  {
    question: "What does 'hereditary condition cover' mean?",
    answer:
      "Hereditary conditions are health issues your dog is genetically predisposed to, like hip dysplasia in Labradors or breathing issues in Pugs. Premium and Comprehensive plans cover these; Basic and Standard typically don't.",
  },
  {
    question: "Is a lower deductible worth the higher premium?",
    answer:
      "It depends on how often you expect to claim. A £250 deductible with a £15 premium vs £0 deductible with £85 premium - you'd need to claim frequently to benefit from the lower deductible. For healthy dogs, a higher deductible often makes sense.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "Yes, most insurers allow upgrades. However, any conditions that developed while on the lower plan may be considered pre-existing and excluded from the new coverage. It's often better to start with adequate coverage.",
  },
];

export function ComparePetInsuranceContent() {
  const [selectedPlans, setSelectedPlans] = useState<string[]>(["Basic", "Premium"]);

  useCopilotReadable({
    description: "All available insurance plans with details",
    value: JSON.stringify(plans),
  });

  useCopilotReadable({
    description: "User's currently selected plans for comparison",
    value: JSON.stringify(selectedPlans),
  });

  useCopilotAction({
    name: "compare_plans",
    description: "Set which plans to compare",
    parameters: [
      { name: "plans", type: "string[]", description: "Array of plan names to compare" },
    ],
    handler: ({ plans: planNames }) => {
      setSelectedPlans(planNames);
      return `Now comparing: ${planNames.join(", ")}`;
    },
  });

  const togglePlan = (planName: string) => {
    setSelectedPlans((prev) =>
      prev.includes(planName)
        ? prev.filter((p) => p !== planName)
        : [...prev, planName]
    );
  };

  return (
    <>
      <FAQSchema items={faqItems} />

      <CopilotSidebar
        className="z-[9998]"
        instructions={`You are Buddy, helping users compare pet insurance plans.
        Available plans:
        - Basic (£15/mo): Accidents only, £5,000 limit, £250 deductible
        - Standard (£35/mo): Accidents + illness, £10,000 limit, £200 deductible
        - Premium (£55/mo): Full cover inc. hereditary, £20,000 limit, £100 deductible
        - Comprehensive (£85/mo): Everything, £50,000 limit, £0 deductible
        Help users understand which plan suits their needs based on their dog's breed, age, and their budget.
        You can use the compare_plans action to show specific plans side-by-side.`}
        labels={{
          title: "Plan Comparison Advisor",
          initial: "Hi! I'm Buddy. I'll help you compare insurance plans. What breed is your dog, and what's your monthly budget?",
        }}
      >
        <div className="min-h-screen">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-stone-950 to-amber-900/20" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-4xl mx-auto"
              >
                <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full mb-6">
                  📊 Interactive Comparison Tool
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Compare Pet Insurance
                  <span className="block bg-gradient-to-r from-blue-400 to-amber-500 bg-clip-text text-transparent">
                    for Dogs UK
                  </span>
                </h1>
                <p className="text-xl text-white/70 mb-8 leading-relaxed max-w-3xl mx-auto">
                  See all our plans side-by-side. Compare coverage, prices, and features
                  to find the perfect match for your furry friend.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Plan Selector */}
          <section className="py-8 bg-stone-900/50 sticky top-16 z-40 border-b border-stone-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <span className="text-white/70 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Compare:
                </span>
                {plans.map((plan) => (
                  <button
                    key={plan.name}
                    onClick={() => togglePlan(plan.name)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedPlans.includes(plan.name)
                        ? "bg-amber-500 text-stone-950"
                        : "bg-stone-800 text-white/70 hover:bg-stone-700"
                    }`}
                  >
                    {plan.name} (£{plan.price}/mo)
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Comparison Cards */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-stone-900 rounded-2xl overflow-hidden transition-all ${
                      selectedPlans.includes(plan.name)
                        ? "border-2 border-amber-500 shadow-lg shadow-amber-500/20"
                        : "border border-stone-700 opacity-60"
                    }`}
                  >
                    {/* Header */}
                    <div className={`p-6 ${
                      plan.name === "Premium"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950"
                        : "bg-stone-800"
                    }`}>
                      {plan.name === "Premium" && (
                        <span className="text-xs font-bold bg-stone-950 text-amber-400 px-2 py-1 rounded mb-2 inline-block">
                          MOST POPULAR
                        </span>
                      )}
                      <h3 className={`text-2xl font-bold ${plan.name === "Premium" ? "text-stone-950" : "text-white"}`}>
                        {plan.name}
                      </h3>
                      <div className={`text-3xl font-bold mt-2 ${plan.name === "Premium" ? "text-stone-950" : "text-amber-400"}`}>
                        £{plan.price}
                        <span className={`text-sm font-normal ${plan.name === "Premium" ? "text-stone-950/70" : "text-white/50"}`}>/month</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-white/60">Annual Limit</span>
                          <span className="text-white font-medium">£{plan.annualLimit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Deductible</span>
                          <span className="text-white font-medium">£{plan.deductible}</span>
                        </div>
                      </div>

                      {/* Included */}
                      <div className="mb-4">
                        <div className="text-white/50 text-xs uppercase mb-2">Included</div>
                        <ul className="space-y-2">
                          {plan.coverage.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              <span className="text-white/80">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Excluded */}
                      {plan.excluded.length > 0 && (
                        <div className="mb-4">
                          <div className="text-white/50 text-xs uppercase mb-2">Not Included</div>
                          <ul className="space-y-2">
                            {plan.excluded.slice(0, 3).map((item) => (
                              <li key={item} className="flex items-center gap-2 text-sm">
                                <X className="w-4 h-4 text-red-400 shrink-0" />
                                <span className="text-white/50">{item}</span>
                              </li>
                            ))}
                            {plan.excluded.length > 3 && (
                              <li className="text-white/40 text-sm">
                                +{plan.excluded.length - 3} more exclusions
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Best For */}
                      <div className="pt-4 border-t border-stone-700">
                        <div className="text-white/50 text-xs uppercase mb-1">Best For</div>
                        <p className="text-white/70 text-sm">{plan.bestFor}</p>
                      </div>

                      {/* CTA */}
                      <Link
                        href="/"
                        className={`block w-full mt-6 px-4 py-3 text-center font-semibold rounded-lg transition-all ${
                          plan.name === "Premium"
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 hover:from-amber-400 hover:to-orange-400"
                            : "bg-stone-800 text-white hover:bg-stone-700"
                        }`}
                      >
                        Get Quote
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Feature Comparison Table */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Detailed Feature Comparison
                </h2>
                <p className="text-white/70 text-lg max-w-3xl mx-auto">
                  See exactly what&apos;s included in each plan.
                </p>
              </motion.div>

              <FeatureComparisonTable />
            </div>
          </section>

          {/* Charts */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <PlanComparisonChart />
              <CoverageBreakdownChart />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-stone-900/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <FAQ items={faqItems} title="Plan Comparison FAQs" />
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <CallToAction
                title="Need Help Choosing?"
                description="Chat with our AI advisor to get a personalized recommendation based on your dog's breed, age, and your budget."
                buttonText="Get Personalized Advice"
                href="/"
                variant="chat"
              />
            </div>
          </section>
        </div>
      </CopilotSidebar>
    </>
  );
}
