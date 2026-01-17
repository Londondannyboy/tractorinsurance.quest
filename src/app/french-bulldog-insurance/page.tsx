import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";
import { QuoteCalculator } from "@/components/mdx/InsuranceChart";
import { FAQ, FAQSchema } from "@/components/mdx/FAQ";
import { CallToAction } from "@/components/mdx/CallToAction";

export const metadata: Metadata = {
  title: "French Bulldog Insurance UK | Frenchie Pet Insurance from £30/month",
  description:
    "Compare French Bulldog insurance plans in the UK. Specialist coverage for BOAS, breathing issues, skin problems & hereditary conditions.",
  keywords: [
    "french bulldog insurance",
    "frenchie insurance",
    "french bulldog pet insurance",
    "brachycephalic dog insurance",
    "BOAS coverage",
  ],
  alternates: {
    canonical: "/french-bulldog-insurance",
  },
  openGraph: {
    title: "French Bulldog Insurance UK | Frenchie Coverage",
    description: "Compare French Bulldog insurance plans. Cover breathing issues and BOAS.",
    url: "https://puppyinsurance.quest/french-bulldog-insurance",
  },
};

const faqItems = [
  {
    question: "How much does French Bulldog insurance cost?",
    answer:
      "French Bulldog insurance typically costs £30-£75 per month in the UK. Frenchies have a high-risk premium multiplier of 1.40x due to their brachycephalic nature and associated health problems.",
  },
  {
    question: "Why is French Bulldog insurance so expensive?",
    answer:
      "French Bulldogs are one of the most expensive breeds to insure due to: BOAS (breathing problems), skin fold infections, spinal issues, eye problems, allergies, and difficulty regulating body temperature. They frequently need veterinary care.",
  },
  {
    question: "Does insurance cover BOAS surgery for French Bulldogs?",
    answer:
      "Yes, Premium and Comprehensive plans typically cover BOAS surgery, which can cost £2,000-£5,000. However, if your Frenchie shows breathing symptoms before insurance starts, it may be excluded as pre-existing.",
  },
  {
    question: "Is pet insurance worth it for a French Bulldog?",
    answer:
      "Absolutely. French Bulldogs have among the highest vet costs of any breed. Without insurance, you could face bills of £3,000+ for BOAS surgery, £4,000+ for spinal surgery, and ongoing costs for skin and allergy treatments.",
  },
];

export default function FrenchBulldogInsurancePage() {
  return (
    <>
      <FAQSchema items={faqItems} />
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-stone-950 to-amber-900/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block px-4 py-2 bg-red-500/20 text-red-400 text-sm font-medium rounded-full mb-6">
                🐕 High-Risk Breed Specialist
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                French Bulldog Insurance
                <span className="block bg-gradient-to-r from-red-400 to-amber-500 bg-clip-text text-transparent">UK</span>
              </h1>
              <p className="text-xl text-white/70 mb-8">
                Specialist coverage for your Frenchie&apos;s unique health needs.
                Plans from <span className="text-red-400 font-semibold">£30/month</span>.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-white/80">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span>High-risk (1.40x)</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>BOAS coverage</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Skin condition cover</span>
                </div>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-amber-500 text-stone-950 font-semibold rounded-xl"
              >
                Get Frenchie Quote <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Warning */}
        <section className="py-16 bg-stone-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-400 shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Important: French Bulldogs Need Comprehensive Cover</h2>
                  <p className="text-white/70 mb-4">
                    French Bulldogs are brachycephalic (flat-faced) and prone to numerous health issues.
                    Basic plans will NOT cover most Frenchie health problems.
                  </p>
                  <p className="text-white/70">
                    <strong className="text-red-400">We strongly recommend:</strong> Premium or Comprehensive plans with
                    hereditary condition coverage. Budget at least £50-75/month for adequate protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Health Issues */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">French Bulldog Health Concerns</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "BOAS", desc: "Breathing problems from flat face", cost: "£2,000-5,000 surgery" },
                { name: "Skin Fold Infections", desc: "Require regular cleaning", cost: "Ongoing treatment" },
                { name: "Spinal Issues", desc: "IVDD and hemivertebrae", cost: "£3,000-6,000 surgery" },
                { name: "Eye Problems", desc: "Cherry eye, corneal ulcers", cost: "£500-2,000" },
                { name: "Allergies", desc: "Food and environmental", cost: "Ongoing medication" },
                { name: "Heat Sensitivity", desc: "Can&apos;t regulate temperature", cost: "Emergency care" },
              ].map((issue) => (
                <div key={issue.name} className="bg-stone-900 border border-red-500/20 rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-2">{issue.name}</h3>
                  <p className="text-white/60 text-sm mb-2">{issue.desc}</p>
                  <p className="text-red-400 text-sm font-medium">{issue.cost}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-16 bg-stone-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <QuoteCalculator />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQ items={faqItems} title="French Bulldog Insurance FAQs" />
          </div>
        </section>

        {/* Related */}
        <section className="py-16 bg-stone-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Other Brachycephalic Breeds</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Pug", href: "/pug-insurance" },
                { name: "Jack Russell", href: "/jack-russell-insurance" },
                { name: "Compare All", href: "/compare-pet-insurance" },
              ].map((breed) => (
                <Link
                  key={breed.name}
                  href={breed.href}
                  className="bg-stone-900 border border-stone-700 rounded-xl p-6 hover:border-red-500/50 transition-colors text-center"
                >
                  <span className="text-white font-medium">{breed.name} Insurance</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <CallToAction
              title="Protect Your French Bulldog"
              description="Get comprehensive coverage designed for Frenchie health needs."
              buttonText="Get Your Quote"
              href="/"
            />
          </div>
        </section>
      </div>
    </>
  );
}
