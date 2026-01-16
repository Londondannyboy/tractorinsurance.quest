'use client';

import { motion } from 'framer-motion';

interface PropertyData {
  type: string;
  avgPriceEur: number;
  pricePerSqm: number;
  rentalYield?: number;
}

interface CityPropertyData {
  city: string;
  properties: PropertyData[];
}

interface PropertyPricesProps {
  country: string;
  flag: string;
  currency?: string;
  cities: CityPropertyData[];
  avgPricePerSqmNational?: number;
  priceGrowthYoY?: number;
  foreignOwnershipAllowed?: boolean;
  mortgageAvailable?: boolean;
  typicalDepositPercent?: number;
}

export function PropertyPrices({
  country,
  flag,
  currency = 'EUR',
  cities,
  avgPricePerSqmNational,
  priceGrowthYoY,
  foreignOwnershipAllowed = true,
  mortgageAvailable = true,
  typicalDepositPercent = 20,
}: PropertyPricesProps) {
  const maxPrice = Math.max(
    ...cities.flatMap(city => city.properties.map(p => p.avgPriceEur))
  );

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toString();
  };

  const propertyTypeIcons: Record<string, string> = {
    'Apartment': '🏢',
    'House': '🏠',
    'Villa': '🏡',
    'Penthouse': '🌆',
    'Studio': '🛏️',
    'Townhouse': '🏘️',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-stone-900/80 to-stone-950/80 rounded-2xl border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{flag}</span>
            <div>
              <h3 className="text-xl font-bold text-white">{country} Property Market</h3>
              <p className="text-white/50 text-sm">Average prices by city and property type</p>
            </div>
          </div>
          {priceGrowthYoY !== undefined && (
            <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              priceGrowthYoY >= 0
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {priceGrowthYoY >= 0 ? '+' : ''}{priceGrowthYoY.toFixed(1)}% YoY
            </div>
          )}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-white/5">
        <div className="text-center">
          <div className="text-2xl mb-1">
            {avgPricePerSqmNational ? `${currency} ${formatPrice(avgPricePerSqmNational)}` : 'N/A'}
          </div>
          <div className="text-xs text-white/50">Avg. /sqm</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">{typicalDepositPercent}%</div>
          <div className="text-xs text-white/50">Typical Deposit</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">{foreignOwnershipAllowed ? '✅' : '❌'}</div>
          <div className="text-xs text-white/50">Foreign Ownership</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">{mortgageAvailable ? '✅' : '❌'}</div>
          <div className="text-xs text-white/50">Mortgages Available</div>
        </div>
      </div>

      {/* City-by-City Breakdown */}
      <div className="p-6 space-y-6">
        {cities.map((cityData, cityIndex) => (
          <motion.div
            key={cityData.city}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: cityIndex * 0.1 }}
            className="space-y-3"
          >
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-amber-400">📍</span>
              {cityData.city}
            </h4>

            <div className="space-y-2">
              {cityData.properties.map((property, propIndex) => (
                <motion.div
                  key={property.type}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  transition={{ delay: cityIndex * 0.1 + propIndex * 0.05 }}
                  className="relative"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg">
                      {propertyTypeIcons[property.type] || '🏠'}
                    </span>
                    <span className="text-white/80 text-sm font-medium flex-1">
                      {property.type}
                    </span>
                    <span className="text-white font-semibold">
                      {currency} {formatPrice(property.avgPriceEur)}
                    </span>
                    {property.rentalYield && (
                      <span className="text-emerald-400 text-xs bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        {property.rentalYield.toFixed(1)}% yield
                      </span>
                    )}
                  </div>

                  {/* Price bar */}
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(property.avgPriceEur / maxPrice) * 100}%` }}
                      transition={{ delay: cityIndex * 0.1 + propIndex * 0.05, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    />
                  </div>

                  {/* Price per sqm */}
                  <div className="text-xs text-white/40 mt-1">
                    {currency} {property.pricePerSqm.toLocaleString()}/sqm
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer with disclaimer */}
      <div className="px-6 py-3 bg-white/5 border-t border-white/10">
        <p className="text-xs text-white/30 text-center">
          Prices are indicative averages. Actual prices vary by location, condition, and market conditions.
        </p>
      </div>
    </motion.div>
  );
}
