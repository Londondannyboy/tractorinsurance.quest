import type { Metadata } from "next";
import { MiniTractorInsuranceContent } from "./MiniTractorContent";

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
  return <MiniTractorInsuranceContent />;
}
