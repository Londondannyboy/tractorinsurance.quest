import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";
import { QuoteCalculator } from "@/components/mdx/InsuranceChart";
import { FAQ, FAQSchema } from "@/components/mdx/FAQ";
import { CallToAction } from "@/components/mdx/CallToAction";

export const metadata: Metadata = {
  title: "Dachshund Insurance UK | Sausage Dog Pet Insurance from £20/month",
  description:
    "Compare Dachshund insurance plans in the UK. Specialist coverage for back problems, IVDD, and other sausage dog health issues. From £20/month.",
  keywords: [
    "dachshund insurance",
    "sausage dog insurance",
    "miniature dachshund insurance",
    "cheapest miniature dachshund insurance cost uk",
    "dachshund pet insurance",
    "IVDD insurance",
  ],
  alternates: {
    canonical: "/dachshund-insurance",
  },
  openGraph: {
    title: "Dachshund Insurance UK | Sausage Dog Coverage",
    description: "Compare Dachshund insurance plans. Cover back problems and IVDD from £20/month.",
    url: "https://puppyinsurance.quest/dachshund-insurance",
  },
};

const faqItems = [
  {
    question: "How much does Dachshund insurance cost?",
    answer:
      "Dachshund insurance typically costs £20-£55 per month in the UK. With a 1.10x premium multiplier, Dachshunds are a medium-risk breed primarily due to their susceptibility to back problems and IVDD.",
  },
  {
    question: "What is IVDD and does insurance cover it?",
    answer:
      "IVDD (Intervertebral Disc Disease) is a spinal condition common in Dachshunds due to their long backs. Premium and Comprehensive plans typically cover IVDD treatment, which can cost £3,000-£8,000 for surgery.",
  },
  {
    question: "Are Dachshunds expensive to insure?",
    answer:
      "Dachshunds are moderately priced to insure compared to other breeds. While they're prone to back problems, they're generally healthy otherwise with a 12-16 year lifespan. Insuring early is key before any back issues develop.",
  },
  {
    question: "What health problems are common in Dachshunds?",
    answer:
      "Common Dachshund health issues include IVDD (back problems), obesity, dental problems, ear infections, and in some varieties, eye conditions. Their long spine makes them vulnerable to disc problems, especially if overweight or jumping.",
  },
];

export default function DachshundInsurancePage() {
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
                🌭 Sausage Dog Specialist
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Dachshund Insurance
                <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">UK</span>
              </h1>
              <p className="text-xl text-white/70 mb-8">
                Protect your sausage dog with coverage that understands their unique back care needs.
                Plans from <span className="text-amber-400 font-semibold">£20/month</span>.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-white/80">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Medium-risk (1.10x)</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>IVDD coverage available</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>12-16 year lifespan</span>
                </div>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-semibold rounded-xl"
              >
                Get Dachshund Quote <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* IVDD Warning */}
        <section className="py-16 bg-stone-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">IVDD: The Dachshund Risk</h2>
                  <p className="text-white/70 mb-4">
                    Up to 25% of Dachshunds will experience some form of back problem in their lifetime.
                    Intervertebral Disc Disease (IVDD) surgery can cost £3,000-£8,000, plus ongoing rehabilitation.
                  </p>
                  <p className="text-white/70">
                    <strong className="text-amber-400">Our recommendation:</strong> Choose a Premium or Comprehensive
                    plan with hereditary condition coverage. Insure your Dachshund puppy early, before any symptoms appear.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Health Issues */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Common Dachshund Health Issues</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "IVDD (Back Problems)", desc: "Primary concern - long spine vulnerability" },
                { name: "Obesity", desc: "Extra weight increases back strain" },
                { name: "Dental Disease", desc: "Small mouths prone to crowding" },
                { name: "Ear Infections", desc: "Floppy ears trap moisture" },
                { name: "Eye Conditions", desc: "PRA in some varieties" },
                { name: "Patella Luxation", desc: "Knee cap displacement" },
              ].map((issue) => (
                <div key={issue.name} className="bg-stone-900 border border-amber-500/20 rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-2">{issue.name}</h3>
                  <p className="text-white/60 text-sm">{issue.desc}</p>
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
            <FAQ items={faqItems} title="Dachshund Insurance FAQs" />
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <CallToAction
              title="Protect Your Sausage Dog"
              description="Get comprehensive coverage including IVDD and back problem protection."
              buttonText="Get Your Quote"
              href="/"
            />
          </div>
        </section>
      </div>
    </>
  );
}
