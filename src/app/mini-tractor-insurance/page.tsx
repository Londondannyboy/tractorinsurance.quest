import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";

export const metadata: Metadata = {
  title: "Mini Tractor Insurance UK | Specialist Vehicle Insurance from £25/month",
  description:
    "Compare mini tractor insurance plans in the UK. Specialist coverage for compact mini tractors. Cover engine problems, transmission issues and mechanical failures.",
  keywords: [
    "mini tractor insurance",
    "mini tractor insurance uk",
    "insurance for mini tractors",
    "how much is insurance for a mini tractor",
    "mini tractor vehicle insurance",
    "small tractor insurance",
  ],
  alternates: {
    canonical: "/mini-tractor-insurance",
  },
  openGraph: {
    title: "Mini Tractor Insurance UK | Specialist Coverage",
    description: "Compare mini tractor insurance plans. Specialist coverage from £25/month.",
    url: "https://tractorinsurance.quest/mini-tractor-insurance",
  },
};

export default function MiniTractorInsurancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <PageContent slug="mini-tractor" />
      </div>
    </main>
  );
}
