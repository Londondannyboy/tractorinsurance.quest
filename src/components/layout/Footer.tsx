"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";

const footerLinks = {
  insurance: {
    title: "Insurance",
    links: [
      { href: "/tractor-insurance", label: "Tractor Insurance" },
      { href: "/best-tractor-insurance", label: "Best Tractor Insurance" },
      { href: "/cheap-tractor-insurance", label: "Cheap Tractor Insurance" },
      { href: "/tractor-insurance-cost", label: "Insurance Costs" },
      { href: "/compare-tractor-insurance", label: "Compare Plans" },
    ],
  },
  tractorTypes: {
    title: "Tractor Types",
    links: [
      { href: "/utility-tractor-insurance", label: "Utility Tractor" },
      { href: "/mini-tractor-insurance", label: "Mini Tractor" },
      { href: "/compact-tractor-insurance", label: "Compact Tractor" },
      { href: "/garden-tractor-insurance", label: "Garden Tractor" },
      { href: "/ride-on-mower-insurance", label: "Ride-on Mower" },
      { href: "/vintage-tractor-insurance", label: "Vintage Tractor" },
      { href: "/farm-tractor-insurance", label: "Farm Tractor" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/dashboard", label: "My Account" },
      { href: "/site-map", label: "Sitemap" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/cookie-policy", label: "Cookie Policy" },
    ],
  },
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 border-t border-amber-500/20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🚜</span>
              <span className="font-bold text-xl text-white">Tractor Insurance</span>
            </Link>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              Your AI-powered guide to finding the perfect tractor insurance. Compare plans, get quotes, and protect your machinery today.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="mailto:hello@tractorinsurance.quest"
                className="p-2 bg-amber-500/10 rounded-lg text-amber-400 hover:bg-amber-500/20 transition-colors"
                aria-label="Email us"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="tel:+441234567890"
                className="p-2 bg-amber-500/10 rounded-lg text-amber-400 hover:bg-amber-500/20 transition-colors"
                aria-label="Call us"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-amber-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-amber-500/20 bg-amber-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-amber-200/70 text-xs text-center leading-relaxed">
            <span className="font-semibold text-amber-300">Important:</span> Tractor Insurance Quest is a comparison website only. We do not sell, underwrite, or provide insurance policies. Always consult with an authorised insurance provider before making any financial commitment. Information provided is for guidance only and should not be considered financial advice.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              &copy; {currentYear} Tractor Insurance Quest. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms-of-service" className="text-white/50 hover:text-white text-sm transition-colors">
                Terms
              </Link>
              <Link href="/privacy-policy" className="text-white/50 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/cookie-policy" className="text-white/50 hover:text-white text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
