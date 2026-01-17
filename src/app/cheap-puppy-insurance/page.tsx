import type { Metadata } from "next";
import { CheapPuppyInsuranceContent } from "./CheapPuppyContent";

export const metadata: Metadata = {
  title: "Cheap Puppy Insurance UK | Budget Pet Insurance from £15/month",
  description:
    "Find cheap puppy insurance in the UK without compromising on coverage. Compare budget-friendly pet insurance plans from £15/month. Tips to save on dog insurance.",
  keywords: [
    "cheap puppy insurance",
    "cheap pet insurance for puppies",
    "cheapest pet insurance for puppies",
    "cheap puppy insurance uk",
    "budget puppy insurance",
    "affordable pet insurance puppies",
    "cheap dog insurance",
  ],
  alternates: {
    canonical: "/cheap-puppy-insurance",
  },
  openGraph: {
    title: "Cheap Puppy Insurance UK | Budget Plans from £15/month",
    description: "Find affordable puppy insurance without sacrificing coverage. Compare cheap plans today.",
    url: "https://puppyinsurance.quest/cheap-puppy-insurance",
  },
};

export default function CheapPuppyInsurancePage() {
  return <CheapPuppyInsuranceContent />;
}
