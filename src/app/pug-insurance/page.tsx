import type { Metadata } from "next";
import { PugInsuranceContent } from "./PugContent";

export const metadata: Metadata = {
  title: "Pug Insurance UK | Brachycephalic Pet Insurance from £20/month",
  description:
    "Compare Pug insurance plans in the UK. Specialist coverage for brachycephalic breeds. Cover breathing issues, BOAS, eye problems & hereditary conditions.",
  keywords: [
    "pug insurance",
    "pug puppy insurance",
    "insurance for pugs",
    "pet insurance for pug",
    "how much is pet insurance for a pug",
    "pug dog insurance UK",
    "brachycephalic dog insurance",
  ],
  alternates: {
    canonical: "/pug-insurance",
  },
  openGraph: {
    title: "Pug Insurance UK | Brachycephalic Pet Insurance",
    description:
      "Compare Pug insurance plans. Specialist coverage for flat-faced breeds from £20/month.",
    url: "https://puppyinsurance.quest/pug-insurance",
  },
};

export default function PugInsurancePage() {
  return <PugInsuranceContent />;
}
