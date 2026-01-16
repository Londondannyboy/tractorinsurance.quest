'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Country {
  slug: string;
  country_name: string;
  flag: string;
  region: string;
}

interface ComparisonPickerProps {
  countries: Country[];
  onCompare: (country1: string, country2: string) => void;
  isLoading?: boolean;
}

export function ComparisonPicker({ countries, onCompare, isLoading }: ComparisonPickerProps) {
  const [country1, setCountry1] = useState<Country | null>(null);
  const [country2, setCountry2] = useState<Country | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState<1 | 2 | null>(null);

  const handleSelectCountry = (country: Country) => {
    if (selectingFor === 1) {
      setCountry1(country);
    } else if (selectingFor === 2) {
      setCountry2(country);
    }
    setSelectingFor(null);
  };

  const handleCompare = () => {
    if (country1 && country2) {
      onCompare(country1.country_name, country2.country_name);
    }
  };

  const availableForSelection = countries.filter(c => {
    if (selectingFor === 1) return c.slug !== country2?.slug;
    if (selectingFor === 2) return c.slug !== country1?.slug;
    return true;
  });

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl transition-all border border-purple-500/30"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Compare Countries
      </button>

      {/* Comparison Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 z-50 w-80 bg-stone-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white">Compare Two Countries</h3>
                <p className="text-xs text-white/50 mt-1">Select countries to see side-by-side comparison</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors p-1 -mr-1 -mt-1"
                aria-label="Close comparison picker"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* Country 1 Selector */}
              <div>
                <label className="text-xs text-white/50 mb-1 block">First Country</label>
                <button
                  onClick={() => setSelectingFor(selectingFor === 1 ? null : 1)}
                  className={`w-full p-3 rounded-xl border transition-all text-left ${
                    selectingFor === 1
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {country1 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{country1.flag}</span>
                      <span className="text-white font-medium">{country1.country_name}</span>
                    </div>
                  ) : (
                    <span className="text-white/50">Select a country...</span>
                  )}
                </button>
              </div>

              {/* VS Divider */}
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-sm">VS</span>
                </div>
              </div>

              {/* Country 2 Selector */}
              <div>
                <label className="text-xs text-white/50 mb-1 block">Second Country</label>
                <button
                  onClick={() => setSelectingFor(selectingFor === 2 ? null : 2)}
                  className={`w-full p-3 rounded-xl border transition-all text-left ${
                    selectingFor === 2
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {country2 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{country2.flag}</span>
                      <span className="text-white font-medium">{country2.country_name}</span>
                    </div>
                  ) : (
                    <span className="text-white/50">Select a country...</span>
                  )}
                </button>
              </div>

              {/* Country List (when selecting) */}
              <AnimatePresence>
                {selectingFor && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="max-h-48 overflow-y-auto border border-white/10 rounded-xl"
                  >
                    {availableForSelection.map((country) => (
                      <button
                        key={country.slug}
                        onClick={() => handleSelectCountry(country)}
                        className="w-full p-3 flex items-center gap-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
                      >
                        <span className="text-xl">{country.flag}</span>
                        <div className="text-left">
                          <div className="text-white text-sm font-medium">{country.country_name}</div>
                          <div className="text-white/40 text-xs">{country.region}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Compare Button */}
              <button
                onClick={handleCompare}
                disabled={!country1 || !country2 || isLoading}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  country1 && country2 && !isLoading
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Comparing...
                  </span>
                ) : (
                  'Compare Now'
                )}
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="text-xs text-white/50 mb-2">Popular comparisons:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { c1: 'Cyprus', c2: 'Malta' },
                  { c1: 'Portugal', c2: 'Spain' },
                  { c1: 'Thailand', c2: 'Indonesia' },
                ].map(({ c1, c2 }) => (
                  <button
                    key={`${c1}-${c2}`}
                    onClick={() => {
                      const country1Data = countries.find(c => c.country_name === c1);
                      const country2Data = countries.find(c => c.country_name === c2);
                      if (country1Data && country2Data) {
                        setCountry1(country1Data);
                        setCountry2(country2Data);
                      }
                    }}
                    className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-white/70 rounded-full transition-colors"
                  >
                    {c1} vs {c2}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
