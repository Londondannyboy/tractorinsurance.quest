import type { Metadata } from "next";
import { CockapooInsuranceContent } from "./CockapooContent";

export const metadata: Metadata = {
  title: "Cockapoo Insurance UK | Designer Breed Pet Insurance from £18/month",
  description:
    "Compare Cockapoo insurance plans in the UK. Cover your Cocker Spaniel Poodle mix for hip dysplasia, eye problems, ear infections & hereditary conditions.",
  keywords: [
    "cockapoo insurance",
    "cockapoo insurance uk",
    "cockapoo dog insurance",
    "pet insurance for a cockapoo",
    "cockapoo puppy insurance",
    "designer dog insurance",
    "poodle mix insurance",
  ],
  alternates: {
    canonical: "/cockapoo-insurance",
  },
  openGraph: {
    title: "Cockapoo Insurance UK | Designer Breed Coverage",
    description: "Compare Cockapoo insurance plans. Cover your Poodle mix from £18/month.",
    url: "https://puppyinsurance.quest/cockapoo-insurance",
  },
};

export default function CockapooInsurancePage() {
  return <CockapooInsuranceContent />;
}
