"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Info } from "lucide-react";
import { UserButton } from "@/lib/auth/client";

const navigationItems = [
  {
    label: "Insurance",
    items: [
      { href: "/tractor-insurance", label: "Tractor Insurance", description: "Complete coverage for your tractor" },
      { href: "/best-tractor-insurance", label: "Best Tractor Insurance", description: "Top-rated plans compared" },
      { href: "/cheap-tractor-insurance", label: "Cheap Tractor Insurance", description: "Budget-friendly options" },
      { href: "/tractor-insurance-cost", label: "Insurance Costs", description: "Pricing guide & calculator" },
      { href: "/compare-tractor-insurance", label: "Compare Plans", description: "Side-by-side comparison tool" },
    ],
  },
  {
    label: "Tractor Types",
    items: [
      { href: "/utility-tractor-insurance", label: "Utility Tractor Insurance", description: "All-purpose tractor cover" },
      { href: "/mini-tractor-insurance", label: "Mini Tractor Insurance", description: "Compact machine coverage" },
      { href: "/compact-tractor-insurance", label: "Compact Tractor Insurance", description: "Sub-compact & compact plans" },
      { href: "/garden-tractor-insurance", label: "Garden Tractor Insurance", description: "Domestic tractor protection" },
      { href: "/ride-on-mower-insurance", label: "Ride-on Mower Insurance", description: "Mower & groundcare cover" },
      { href: "/vintage-tractor-insurance", label: "Vintage Tractor Insurance", description: "Classic tractor specialist" },
      { href: "/farm-tractor-insurance", label: "Farm Tractor Insurance", description: "Agricultural tractor cover" },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/dashboard", label: "My Tractors", description: "Manage your tractor profiles" },
      { href: "/site-map", label: "Sitemap", description: "Browse all pages" },
    ],
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <>
      {/* Disclaimer Banner */}
      <div className="fixed top-0 left-0 right-0 z-[10000] bg-amber-900/90 backdrop-blur-sm border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <p className="text-amber-100 text-xs text-center">
            <span className="font-medium">Comparison site only.</span> We do not sell insurance. Always consult an authorised provider before purchasing.
          </p>
        </div>
      </div>

      <header className="fixed top-7 left-0 right-0 z-[9999] bg-stone-950/95 backdrop-blur-md border-b border-amber-500/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl group-hover:scale-110 transition-transform">🚜</span>
              <span className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                Tractor Insurance
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationItems.map((navItem) => (
                <div
                  key={navItem.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(navItem.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className="flex items-center gap-1 px-4 py-2 text-white/80 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/5"
                  >
                    {navItem.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === navItem.label ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === navItem.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full pt-2 w-72"
                      >
                        <div className="bg-stone-900 border border-amber-500/20 rounded-xl shadow-xl shadow-black/30 overflow-hidden">
                          {navItem.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block px-4 py-3 hover:bg-amber-500/10 transition-colors border-b border-stone-800 last:border-0"
                            >
                              <div className="font-medium text-white text-sm">{item.label}</div>
                              <div className="text-white/50 text-xs mt-0.5">{item.description}</div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <Link
                href="/"
                className="ml-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-semibold text-sm rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25"
              >
                Get Quote
              </Link>

              <div className="ml-2">
                <UserButton size="icon" />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <UserButton size="icon" />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/5"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="py-4 space-y-2 border-t border-amber-500/20">
                  {navigationItems.map((navItem) => (
                    <div key={navItem.label} className="space-y-1">
                      <div className="px-3 py-2 text-amber-400 font-semibold text-sm">
                        {navItem.label}
                      </div>
                      {navItem.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-6 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg text-sm"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <div className="pt-4 px-3">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-semibold text-center rounded-lg"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
}
