import type { Metadata } from "next";
import { BestPuppyInsuranceContent } from "./BestPuppyContent";

export const metadata: Metadata = {
  title: "Best Pet Insurance for Puppies UK 2025 | Top Rated Plans Compared",
  description:
    "Find the best pet insurance for puppies in the UK. Compare top-rated plans, coverage options, and prices. Expert guide to choosing puppy insurance that suits your needs.",
  keywords: [
    "best pet insurance for puppies",
    "best puppy insurance",
    "best pet insurance for puppy",
    "best puppy pet insurance",
    "best pet insurance for a puppy",
    "top puppy insurance UK",
    "what pet insurance should i get for my puppy",
  ],
  alternates: {
    canonical: "/best-puppy-insurance",
  },
  openGraph: {
    title: "Best Pet Insurance for Puppies UK 2025",
    description: "Compare top-rated puppy insurance plans. Expert guide to finding the best coverage.",
    url: "https://puppyinsurance.quest/best-puppy-insurance",
  },
};

export default function BestPuppyInsurancePage() {
  return <BestPuppyInsuranceContent />;
}
