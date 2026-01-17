import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Browse all pages on Puppy Insurance Quest. Find puppy insurance guides, breed-specific coverage, and comparison tools.",
  alternates: {
    canonical: "/site-map",
  },
};

const siteStructure = [
  {
    category: "Insurance Guides",
    links: [
      { href: "/", label: "Home - Get a Quote" },
      { href: "/puppy-insurance", label: "Puppy Insurance" },
      { href: "/best-puppy-insurance", label: "Best Puppy Insurance" },
      { href: "/cheap-puppy-insurance", label: "Cheap Puppy Insurance" },
      { href: "/puppy-insurance-cost", label: "Puppy Insurance Cost" },
      { href: "/compare-pet-insurance", label: "Compare Pet Insurance" },
      { href: "/new-puppy-guide", label: "New Puppy Guide" },
    ],
  },
  {
    category: "Breed Insurance",
    links: [
      { href: "/jack-russell-insurance", label: "Jack Russell Insurance" },
      { href: "/pug-insurance", label: "Pug Insurance" },
      { href: "/cockapoo-insurance", label: "Cockapoo Insurance" },
      { href: "/cavapoo-insurance", label: "Cavapoo Insurance" },
      { href: "/dachshund-insurance", label: "Dachshund Insurance" },
      { href: "/french-bulldog-insurance", label: "French Bulldog Insurance" },
      { href: "/labrador-insurance", label: "Labrador Insurance" },
    ],
  },
  {
    category: "Account",
    links: [
      { href: "/dashboard", label: "My Pets Dashboard" },
      { href: "/auth/sign-in", label: "Sign In" },
      { href: "/auth/sign-up", label: "Sign Up" },
    ],
  },
  {
    category: "Legal",
    links: [
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/cookie-policy", label: "Cookie Policy" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Sitemap</h1>
          <p className="text-white/70 text-lg">
            Browse all pages on Puppy Insurance Quest
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {siteStructure.map((section) => (
            <div key={section.category}>
              <h2 className="text-lg font-semibold text-amber-400 mb-4 pb-2 border-b border-amber-500/30">
                {section.category}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-amber-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Schema.org SiteNavigationElement */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: siteStructure.flatMap((section, sectionIndex) =>
                section.links.map((link, linkIndex) => ({
                  "@type": "SiteNavigationElement",
                  position: sectionIndex * 10 + linkIndex + 1,
                  name: link.label,
                  url: `https://puppyinsurance.quest${link.href}`,
                }))
              ),
            }),
          }}
        />
      </div>
    </div>
  );
}
