import type { Metadata } from "next";
import { PuppyInsuranceCostContent } from "./CostContent";

export const metadata: Metadata = {
  title: "Puppy Insurance Cost UK | How Much is Pet Insurance? Pricing Guide",
  description:
    "Find out how much puppy insurance costs in the UK. From £15-£85/month depending on breed and coverage. Complete pricing guide with calculator and money-saving tips.",
  keywords: [
    "puppy insurance prices",
    "how much is pet insurance for a puppy",
    "puppy insurance cost",
    "pet insurance cost UK",
    "dog insurance prices",
    "how much is puppy insurance",
  ],
  alternates: {
    canonical: "/puppy-insurance-cost",
  },
  openGraph: {
    title: "Puppy Insurance Cost UK | Pricing Guide 2025",
    description: "How much does puppy insurance cost? Complete UK pricing guide from £15-£85/month.",
    url: "https://puppyinsurance.quest/puppy-insurance-cost",
  },
};

export default function PuppyInsuranceCostPage() {
  return <PuppyInsuranceCostContent />;
}
