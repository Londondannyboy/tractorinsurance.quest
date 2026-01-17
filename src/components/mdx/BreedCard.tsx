"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Shield, Clock } from "lucide-react";

interface BreedCardProps {
  breed: string;
  image?: string;
  riskCategory: "low" | "medium" | "high";
  avgLifespan: string;
  commonIssues: string[];
  premiumMultiplier: number;
  href: string;
}

const riskColors = {
  low: "text-green-400 bg-green-500/20",
  medium: "text-yellow-400 bg-yellow-500/20",
  high: "text-red-400 bg-red-500/20",
};

export function BreedCard({
  breed,
  image,
  riskCategory,
  avgLifespan,
  commonIssues,
  premiumMultiplier,
  href,
}: BreedCardProps) {
  useCopilotReadable({
    description: `Breed card for ${breed}`,
    value: JSON.stringify({ breed, riskCategory, avgLifespan, commonIssues, premiumMultiplier }),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={href} className="block">
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 border border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-colors">
          {/* Image */}
          {image && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={image}
                alt={breed}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent" />
              <span className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${riskColors[riskCategory]}`}>
                {riskCategory.charAt(0).toUpperCase() + riskCategory.slice(1)} Risk
              </span>
            </div>
          )}

          {/* Content */}
          <div className="p-5">
            <h3 className="text-xl font-bold text-white mb-3">{breed}</h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{avgLifespan}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>{premiumMultiplier}x premium</span>
              </div>
            </div>

            {/* Common Issues */}
            <div className="mb-4">
              <div className="text-white/50 text-xs mb-2">Common Health Issues:</div>
              <div className="flex flex-wrap gap-1">
                {commonIssues.slice(0, 3).map((issue) => (
                  <span
                    key={issue}
                    className="px-2 py-1 bg-stone-800 rounded text-white/60 text-xs"
                  >
                    {issue}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors">
              View Insurance Options →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Grid wrapper for multiple breed cards
export function BreedGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      {children}
    </div>
  );
}
