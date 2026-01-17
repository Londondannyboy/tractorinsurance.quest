import type { Metadata } from "next";
import { JackRussellInsuranceContent } from "./JackRussellContent";

export const metadata: Metadata = {
  title: "Jack Russell Insurance UK | Terrier Pet Insurance from £15/month",
  description:
    "Compare Jack Russell Terrier insurance plans in the UK. Get instant quotes for your Jack Russell puppy or adult dog. Cover hereditary conditions, accidents & illness.",
  keywords: [
    "jack russell insurance",
    "jack russell dog insurance",
    "jack russell pet insurance",
    "jack russell terrier insurance",
    "insurance for jack russells",
    "pet insurance for jack russell",
    "how much is pet insurance for a jack russell",
    "insurance for jack russell",
  ],
  alternates: {
    canonical: "/jack-russell-insurance",
  },
  openGraph: {
    title: "Jack Russell Insurance UK | Terrier Pet Insurance",
    description:
      "Compare Jack Russell Terrier insurance plans. Get instant quotes for your Jack Russell from £15/month.",
    url: "https://puppyinsurance.quest/jack-russell-insurance",
  },
};

export default function JackRussellInsurancePage() {
  return <JackRussellInsuranceContent />;
}
