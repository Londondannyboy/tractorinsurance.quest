"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { UserButton } from "@/lib/auth/client";

const navigationItems = [
  {
    label: "Insurance",
    items: [
      { href: "/puppy-insurance", label: "Puppy Insurance", description: "Complete coverage for your new puppy" },
      { href: "/best-puppy-insurance", label: "Best Puppy Insurance", description: "Top-rated plans compared" },
      { href: "/cheap-puppy-insurance", label: "Cheap Puppy Insurance", description: "Budget-friendly options" },
      { href: "/puppy-insurance-cost", label: "Insurance Costs", description: "Pricing guide & calculator" },
      { href: "/compare-pet-insurance", label: "Compare Plans", description: "Side-by-side comparison tool" },
    ],
  },
  {
    label: "Breeds",
    items: [
      { href: "/jack-russell-insurance", label: "Jack Russell Insurance", description: "Terrier-specific coverage" },
      { href: "/pug-insurance", label: "Pug Insurance", description: "Brachycephalic breed plans" },
      { href: "/cockapoo-insurance", label: "Cockapoo Insurance", description: "Designer breed coverage" },
      { href: "/cavapoo-insurance", label: "Cavapoo Insurance", description: "Cavalier mix protection" },
      { href: "/dachshund-insurance", label: "Dachshund Insurance", description: "Sausage dog specialist" },
      { href: "/french-bulldog-insurance", label: "French Bulldog Insurance", description: "Frenchie health cover" },
      { href: "/labrador-insurance", label: "Labrador Insurance", description: "Lab breed coverage" },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/new-puppy-guide", label: "New Puppy Guide", description: "First-time owner essentials" },
      { href: "/dashboard", label: "My Pets", description: "Manage your pet profiles" },
      { href: "/site-map", label: "Sitemap", description: "Browse all pages" },
    ],
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-stone-950/95 backdrop-blur-md border-b border-amber-500/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🐾</span>
            <span className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
              Puppy Insurance
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
  );
}
