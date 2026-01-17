import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";
import { QuoteCalculator } from "@/components/mdx/InsuranceChart";
import { FAQ, FAQSchema } from "@/components/mdx/FAQ";
import { CallToAction } from "@/components/mdx/CallToAction";

export const metadata: Metadata = {
  title: "Labrador Insurance UK | Lab Pet Insurance from £18/month",
  description:
    "Compare Labrador Retriever insurance plans in the UK. Cover hip dysplasia, elbow dysplasia, obesity & hereditary conditions for your Lab.",
  keywords: [
    "labrador insurance",
    "lab insurance",
    "labrador retriever insurance",
    "labrador pet insurance uk",
    "hip dysplasia insurance",
  ],
  alternates: {
    canonical: "/labrador-insurance",
  },
  openGraph: {
    title: "Labrador Insurance UK | Lab Coverage",
    description: "Compare Labrador insurance plans. Cover joint problems and hereditary conditions.",
    url: "https://puppyinsurance.quest/labrador-insurance",
  },
};

const faqItems = [
  {
    question: "How much does Labrador insurance cost?",
    answer:
      "Labrador insurance typically costs £18-£50 per month in the UK. As a medium-risk breed with a 1.00x premium multiplier (baseline), Labs are reasonably priced to insure despite their size.",
  },
  {
    question: "What health problems are common in Labradors?",
    answer:
      "Common Labrador health issues include hip dysplasia, elbow dysplasia, obesity, ear infections, and exercise-induced collapse (EIC). They're also prone to certain cancers and heart conditions as they age.",
  },
  {
    question: "Does insurance cover hip dysplasia for Labradors?",
    answer:
      "Premium and Comprehensive plans typically cover hip dysplasia, which is important for Labs. Hip replacement surgery can cost £4,000-£7,000 per hip. Ensure you get coverage before any symptoms appear.",
  },
  {
    question: "Are Labradors expensive to insure?",
    answer:
      "Labradors are moderately priced to insure. While they have some hereditary concerns, they're generally healthy dogs with a 10-14 year lifespan. Their size means larger food and medication costs, but insurance premiums are average.",
  },
];

export default function LabradorInsurancePage() {
  return (
    <>
      <FAQSchema items={faqItems} />
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/30 via-stone-950 to-amber-900/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full mb-6">
                🐕 Britain&apos;s Favourite Breed
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Labrador Insurance
                <span className="block bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">UK</span>
              </h1>
              <p className="text-xl text-white/70 mb-8">
                Protect your Labrador with coverage that understands their joint and health needs.
                Plans from <span className="text-yellow-400 font-semibold">£18/month</span>.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Medium-risk (1.00x)</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Hip dysplasia cover</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>10-14 year lifespan</span>
                </div>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-stone-950 font-semibold rounded-xl"
              >
                Get Labrador Quote <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Health Issues */}
        <section className="py-16 bg-stone-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Labrador Health Concerns</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Hip Dysplasia", desc: "Joint malformation - very common in Labs", cost: "£4,000-7,000/hip" },
                { name: "Elbow Dysplasia", desc: "Elbow joint abnormality", cost: "£2,000-4,000" },
                { name: "Obesity", desc: "Labs love food - watch their weight!", cost: "Related conditions" },
                { name: "Ear Infections", desc: "Floppy ears prone to infections", cost: "£100-500/treatment" },
                { name: "Exercise-Induced Collapse", desc: "Genetic condition affecting some Labs", cost: "Management" },
                { name: "Cancer", desc: "Higher risk as they age", cost: "£2,000-10,000+" },
              ].map((issue) => (
                <div key={issue.name} className="bg-stone-900 border border-yellow-500/20 rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-2">{issue.name}</h3>
                  <p className="text-white/60 text-sm mb-2">{issue.desc}</p>
                  <p className="text-yellow-400 text-sm font-medium">{issue.cost}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Joint Health Info */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-yellow-400 shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Joint Health in Labradors</h2>
                  <p className="text-white/70 mb-4">
                    Hip and elbow dysplasia affect a significant percentage of Labradors. These hereditary conditions
                    can require expensive surgery and ongoing management.
                  </p>
                  <p className="text-white/70">
                    <strong className="text-yellow-400">Our recommendation:</strong> Choose a Premium plan with hereditary
                    condition coverage. Insure your Lab puppy before any joint symptoms appear to ensure full coverage.
                  </p>
                </div>
              </div>
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
            <FAQ items={faqItems} title="Labrador Insurance FAQs" />
          </div>
        </section>

        {/* Related */}
        <section className="py-16 bg-stone-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Similar Breeds</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Golden Retriever", href: "/compare-pet-insurance" },
                { name: "Cockapoo", href: "/cockapoo-insurance" },
                { name: "Compare All", href: "/compare-pet-insurance" },
              ].map((breed) => (
                <Link
                  key={breed.name}
                  href={breed.href}
                  className="bg-stone-900 border border-stone-700 rounded-xl p-6 hover:border-yellow-500/50 transition-colors text-center"
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
              title="Protect Your Labrador"
              description="Get comprehensive coverage including joint and hereditary condition protection."
              buttonText="Get Your Quote"
              href="/"
            />
          </div>
        </section>
      </div>
    </>
  );
}
