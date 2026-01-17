import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight, Shield, Heart, Zap, Clock } from "lucide-react";
import { QuoteCalculator, FeatureComparisonTable, PlanComparisonChart } from "@/components/mdx/InsuranceChart";
import { FAQ, FAQSchema } from "@/components/mdx/FAQ";
import { CallToAction } from "@/components/mdx/CallToAction";

export const metadata: Metadata = {
  title: "Puppy Insurance UK | Pet Insurance for Puppies from £15/month",
  description:
    "Compare puppy insurance plans in the UK. Get comprehensive pet insurance for your puppy covering accidents, illness, and hereditary conditions. From £15/month.",
  keywords: [
    "puppy insurance",
    "pet insurance puppies",
    "dog insurance for puppies",
    "insurance for puppies",
    "puppy pet insurance",
    "insurance puppy",
    "insure a puppy",
    "puppy and dog insurance",
    "pet insurance for puppies uk",
    "new puppy insurance uk",
    "pet insurance for new puppy",
    "pet insurance for a puppy",
    "pet insurance puppy",
  ],
  alternates: {
    canonical: "/puppy-insurance",
  },
  openGraph: {
    title: "Puppy Insurance UK | Pet Insurance for Puppies",
    description: "Compare the best puppy insurance plans. Coverage from £15/month.",
    url: "https://puppyinsurance.quest/puppy-insurance",
  },
};

const faqItems = [
  {
    question: "What is puppy insurance?",
    answer:
      "Puppy insurance is pet insurance specifically designed to cover veterinary costs for young dogs. It helps pay for accidents, illnesses, hereditary conditions, and sometimes routine care. Getting insurance while your dog is a puppy ensures coverage for conditions that develop later.",
  },
  {
    question: "When can I insure my puppy?",
    answer:
      "Most insurers accept puppies from 8 weeks old. We recommend insuring your puppy as soon as you bring them home. Early insurance means any conditions that develop later will be covered and won't be excluded as pre-existing.",
  },
  {
    question: "What does puppy insurance cover?",
    answer:
      "Depending on your plan: accidents and injuries, illnesses, hereditary conditions (Premium+), surgery, prescriptions, emergency care, dental care (Premium+), and routine/preventive care (Comprehensive). Each plan level offers different coverage.",
  },
  {
    question: "How much does puppy insurance cost in the UK?",
    answer:
      "Puppy insurance costs £15-£85+ per month depending on coverage level and breed. Basic accident-only plans start at £15/month, while comprehensive plans with everything covered cost around £85/month. See our pricing guide for details.",
  },
  {
    question: "Is puppy insurance worth it?",
    answer:
      "Yes. Unexpected vet bills can easily exceed £1,000-5,000+ for emergencies, surgery, or ongoing conditions. Insurance provides financial protection and peace of mind. It's especially valuable for puppies who have their whole life ahead of them.",
  },
  {
    question: "What's the difference between puppy insurance plans?",
    answer:
      "Basic (£15/mo) covers accidents only. Standard (£35/mo) adds illness coverage. Premium (£55/mo) includes hereditary conditions, dental, and routine care. Comprehensive (£85/mo) covers everything including alternative therapies with no deductible.",
  },
];

const breeds = [
  { name: "Jack Russell", href: "/jack-russell-insurance", risk: "Low" },
  { name: "Pug", href: "/pug-insurance", risk: "High" },
  { name: "Cockapoo", href: "/cockapoo-insurance", risk: "Medium" },
  { name: "Cavapoo", href: "/cavapoo-insurance", risk: "Medium" },
  { name: "Dachshund", href: "/dachshund-insurance", risk: "Medium" },
  { name: "French Bulldog", href: "/french-bulldog-insurance", risk: "High" },
  { name: "Labrador", href: "/labrador-insurance", risk: "Medium" },
];

export default function PuppyInsurancePage() {
  return (
    <>
      <FAQSchema items={faqItems} />
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-stone-950 to-orange-900/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full mb-6">
                🐕 Complete Puppy Insurance Guide
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Puppy Insurance
                <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">UK</span>
              </h1>
              <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
                Protect your new puppy with comprehensive pet insurance from just
                <span className="text-amber-400 font-semibold"> £15/month</span>.
                Compare plans, get instant quotes, and find the perfect coverage.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>From 8 weeks old</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Accidents & illness</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Hereditary conditions</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25"
                >
                  Get Puppy Quote <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/compare-pet-insurance"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-stone-800 text-white font-semibold rounded-xl hover:bg-stone-700 transition-all"
                >
                  Compare Plans
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Insure */}
        <section className="py-16 bg-stone-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Why Insure Your Puppy?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: "Financial Protection", desc: "Vet bills can reach £5,000+ for emergencies. Insurance covers the unexpected." },
                { icon: Heart, title: "Peace of Mind", desc: "Focus on your puppy's health, not the cost of treatment." },
                { icon: Zap, title: "Early Coverage", desc: "Insure young to cover conditions that develop later in life." },
                { icon: Clock, title: "Lifetime Protection", desc: "Comprehensive plans provide cover throughout your dog's life." },
              ].map((item) => (
                <div key={item.title} className="bg-stone-900 border border-amber-500/20 rounded-xl p-6">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plan Comparison */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Compare Puppy Insurance Plans
            </h2>
            <p className="text-white/70 text-center mb-12 max-w-3xl mx-auto">
              From basic accident cover to comprehensive protection - find the right plan for your puppy.
            </p>
            <FeatureComparisonTable />
          </div>
        </section>

        {/* Charts */}
        <section className="py-16 bg-stone-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <PlanComparisonChart />
          </div>
        </section>

        {/* Quote Calculator */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Get Your Quick Quote
            </h2>
            <QuoteCalculator />
          </div>
        </section>

        {/* Breed Pages */}
        <section className="py-16 bg-stone-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Breed-Specific Insurance Guides
            </h2>
            <p className="text-white/70 text-center mb-12">
              Find coverage tailored to your breed&apos;s specific health needs.
            </p>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {breeds.map((breed) => (
                <Link
                  key={breed.name}
                  href={breed.href}
                  className="bg-stone-900 border border-stone-700 rounded-xl p-4 hover:border-amber-500/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium group-hover:text-amber-400 transition-colors">
                      {breed.name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      breed.risk === "Low" ? "bg-green-500/20 text-green-400" :
                      breed.risk === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {breed.risk}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQ items={faqItems} title="Puppy Insurance FAQs" />
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16 bg-stone-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              More Insurance Resources
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { name: "Best Puppy Insurance", href: "/best-puppy-insurance" },
                { name: "Cheap Puppy Insurance", href: "/cheap-puppy-insurance" },
                { name: "Insurance Costs", href: "/puppy-insurance-cost" },
                { name: "Compare Plans", href: "/compare-pet-insurance" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="bg-stone-900 border border-stone-700 rounded-xl p-4 text-center hover:border-amber-500/50 transition-colors"
                >
                  <span className="text-white">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <CallToAction
              title="Protect Your Puppy Today"
              description="Get a personalized quote in minutes with our AI-powered advisor. Find the perfect coverage for your new furry friend."
              buttonText="Get Your Quote"
              href="/"
            />
          </div>
        </section>
      </div>
    </>
  );
}
