import type { Metadata } from "next";
import { ComparePetInsuranceContent } from "./CompareContent";

export const metadata: Metadata = {
  title: "Compare Pet Insurance for Dogs UK | Side-by-Side Plan Comparison",
  description:
    "Compare pet insurance plans for dogs side-by-side. See coverage, prices, and features across Basic, Standard, Premium, and Comprehensive plans. Find your perfect match.",
  keywords: [
    "compare pet insurance dogs",
    "dogs insurance compare",
    "compare pet insurance",
    "pet insurance comparison UK",
    "dog insurance comparison",
    "compare puppy insurance plans",
  ],
  alternates: {
    canonical: "/compare-pet-insurance",
  },
  openGraph: {
    title: "Compare Pet Insurance for Dogs UK",
    description: "Side-by-side comparison of dog insurance plans. Find your perfect coverage.",
    url: "https://puppyinsurance.quest/compare-pet-insurance",
  },
};

export default function ComparePetInsurancePage() {
  return <ComparePetInsuranceContent />;
}
