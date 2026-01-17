import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight, AlertTriangle, Heart } from "lucide-react";
import { QuoteCalculator } from "@/components/mdx/InsuranceChart";
import { FAQ, FAQSchema } from "@/components/mdx/FAQ";
import { CallToAction } from "@/components/mdx/CallToAction";

export const metadata: Metadata = {
  title: "Cavapoo Insurance UK | Designer Breed Pet Insurance from £20/month",
  description:
    "Compare Cavapoo insurance plans in the UK. Cover your Cavalier King Charles Spaniel Poodle mix for heart conditions, eye problems & hereditary issues.",
  keywords: [
    "cavapoo insurance",
    "cavapoo pet insurance uk",
    "cavapoo dog insurance",
    "cavalier poodle mix insurance",
    "designer dog insurance",
  ],
  alternates: {
    canonical: "/cavapoo-insurance",
  },
  openGraph: {
    title: "Cavapoo Insurance UK | Designer Breed Coverage",
    description: "Compare Cavapoo insurance plans. Cover your Cavalier-Poodle mix from £20/month.",
    url: "https://puppyinsurance.quest/cavapoo-insurance",
  },
};

const faqItems = [
  {
    question: "How much does Cavapoo insurance cost?",
    answer:
      "Cavapoo insurance typically costs £20-£55 per month in the UK. As a medium-risk designer breed with a 1.15x premium multiplier, Cavapoos are moderately priced to insure due to inherited health concerns from both parent breeds.",
  },
  {
    question: "What health problems are common in Cavapoos?",
    answer:
      "Cavapoos can inherit conditions from Cavalier King Charles Spaniels (heart disease, syringomyelia) and Poodles (hip dysplasia, eye problems). Common issues include mitral valve disease, progressive retinal atrophy, ear infections, and luxating patella.",
  },
  {
    question: "Does Cavapoo insurance cover heart conditions?",
    answer:
      "Premium and Comprehensive plans typically cover heart conditions like mitral valve disease, which is common in Cavalier-derived breeds. This is important as Cavaliers have a high incidence of heart problems that can be inherited by Cavapoos.",
  },
  {
    question: "When should I insure my Cavapoo?",
    answer:
      "Insure your Cavapoo puppy from 8 weeks old. This is crucial for Cavapoos because heart conditions and other hereditary issues often develop later - insuring early ensures they're covered when symptoms appear.",
  },
];

export default function CavapooInsurancePage() {
  return (
    <>
      <FAQSchema items={faqItems} />
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-stone-950 to-amber-900/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block px-4 py-2 bg-pink-500/20 text-pink-400 text-sm font-medium rounded-full mb-6">
                🐩 Cavalier-Poodle Mix Coverage
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Cavapoo Insurance
                <span className="block bg-gradient-to-r from-pink-400 to-amber-500 bg-clip-text text-transparent">UK</span>
              </h1>
              <p className="text-xl text-white/70 mb-8">
                Protect your Cavapoo with coverage that understands Cavalier and Poodle health concerns.
                Plans from <span className="text-pink-400 font-semibold">£20/month</span>.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-white/80">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Medium-risk (1.15x)</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span>Heart condition cover</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>12-15 year lifespan</span>
                </div>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-amber-500 text-stone-950 font-semibold rounded-xl"
              >
                Get Cavapoo Quote <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Health Info */}
        <section className="py-16 bg-stone-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Cavapoo Health Concerns</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Mitral Valve Disease (from Cavalier)",
                "Syringomyelia",
                "Progressive Retinal Atrophy",
                "Hip Dysplasia",
                "Luxating Patella",
                "Ear Infections",
              ].map((issue) => (
                <div key={issue} className="bg-stone-900 border border-pink-500/20 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-5 h-5 text-pink-400 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white">{issue}</h3>
                      <p className="text-white/60 text-sm mt-1">Covered by Premium plans</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <QuoteCalculator />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-stone-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQ items={faqItems} title="Cavapoo Insurance FAQs" />
          </div>
        </section>

        {/* Related */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Other Designer Breeds</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Cockapoo", href: "/cockapoo-insurance" },
                { name: "Labrador", href: "/labrador-insurance" },
                { name: "Pug", href: "/pug-insurance" },
              ].map((breed) => (
                <Link
                  key={breed.name}
                  href={breed.href}
                  className="bg-stone-900 border border-stone-700 rounded-xl p-6 hover:border-pink-500/50 transition-colors text-center"
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
              title="Protect Your Cavapoo Today"
              description="Get comprehensive coverage that understands Cavalier-Poodle health needs."
              buttonText="Get Your Quote"
              href="/"
            />
          </div>
        </section>
      </div>
    </>
  );
}
