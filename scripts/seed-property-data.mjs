import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

// Property market data for each country
const propertyData = {
  cyprus: {
    property_market: {
      avgPricePerSqmNational: 2800,
      priceGrowthYoY: 7.2,
      foreignOwnershipAllowed: true,
      mortgageAvailable: true,
      typicalDepositPercent: 30,
      cities: [
        {
          city: 'Limassol',
          properties: [
            { type: 'Apartment', avgPriceEur: 280000, pricePerSqm: 3500, rentalYield: 5.2 },
            { type: 'Villa', avgPriceEur: 650000, pricePerSqm: 2800, rentalYield: 4.1 },
            { type: 'Penthouse', avgPriceEur: 750000, pricePerSqm: 4200, rentalYield: 4.8 },
          ],
        },
        {
          city: 'Paphos',
          properties: [
            { type: 'Apartment', avgPriceEur: 180000, pricePerSqm: 2400, rentalYield: 5.8 },
            { type: 'Villa', avgPriceEur: 420000, pricePerSqm: 2200, rentalYield: 4.5 },
            { type: 'Townhouse', avgPriceEur: 280000, pricePerSqm: 2600, rentalYield: 5.0 },
          ],
        },
        {
          city: 'Nicosia',
          properties: [
            { type: 'Apartment', avgPriceEur: 150000, pricePerSqm: 2000, rentalYield: 6.2 },
            { type: 'House', avgPriceEur: 320000, pricePerSqm: 1800, rentalYield: 5.0 },
          ],
        },
      ],
    },
  },
  malta: {
    property_market: {
      avgPricePerSqmNational: 4500,
      priceGrowthYoY: 4.5,
      foreignOwnershipAllowed: true,
      mortgageAvailable: true,
      typicalDepositPercent: 20,
      cities: [
        {
          city: 'Sliema',
          properties: [
            { type: 'Apartment', avgPriceEur: 450000, pricePerSqm: 5500, rentalYield: 4.8 },
            { type: 'Penthouse', avgPriceEur: 1200000, pricePerSqm: 6500, rentalYield: 3.8 },
          ],
        },
        {
          city: 'St. Julians',
          properties: [
            { type: 'Apartment', avgPriceEur: 480000, pricePerSqm: 5800, rentalYield: 4.5 },
            { type: 'Studio', avgPriceEur: 250000, pricePerSqm: 6200, rentalYield: 5.5 },
          ],
        },
        {
          city: 'Valletta',
          properties: [
            { type: 'Apartment', avgPriceEur: 380000, pricePerSqm: 4800, rentalYield: 5.2 },
            { type: 'Townhouse', avgPriceEur: 850000, pricePerSqm: 5200, rentalYield: 4.0 },
          ],
        },
      ],
    },
  },
  portugal: {
    property_market: {
      avgPricePerSqmNational: 3200,
      priceGrowthYoY: 8.5,
      foreignOwnershipAllowed: true,
      mortgageAvailable: true,
      typicalDepositPercent: 20,
      cities: [
        {
          city: 'Lisbon',
          properties: [
            { type: 'Apartment', avgPriceEur: 420000, pricePerSqm: 5200, rentalYield: 4.2 },
            { type: 'Villa', avgPriceEur: 950000, pricePerSqm: 4500, rentalYield: 3.5 },
            { type: 'Studio', avgPriceEur: 250000, pricePerSqm: 5800, rentalYield: 5.0 },
          ],
        },
        {
          city: 'Porto',
          properties: [
            { type: 'Apartment', avgPriceEur: 280000, pricePerSqm: 3500, rentalYield: 5.5 },
            { type: 'House', avgPriceEur: 450000, pricePerSqm: 3000, rentalYield: 4.8 },
          ],
        },
        {
          city: 'Algarve',
          properties: [
            { type: 'Villa', avgPriceEur: 650000, pricePerSqm: 3200, rentalYield: 5.8 },
            { type: 'Apartment', avgPriceEur: 320000, pricePerSqm: 3800, rentalYield: 6.2 },
          ],
        },
      ],
    },
  },
  spain: {
    property_market: {
      avgPricePerSqmNational: 2400,
      priceGrowthYoY: 5.8,
      foreignOwnershipAllowed: true,
      mortgageAvailable: true,
      typicalDepositPercent: 30,
      cities: [
        {
          city: 'Barcelona',
          properties: [
            { type: 'Apartment', avgPriceEur: 380000, pricePerSqm: 4500, rentalYield: 4.0 },
            { type: 'Penthouse', avgPriceEur: 850000, pricePerSqm: 5500, rentalYield: 3.2 },
          ],
        },
        {
          city: 'Madrid',
          properties: [
            { type: 'Apartment', avgPriceEur: 350000, pricePerSqm: 4200, rentalYield: 4.3 },
            { type: 'House', avgPriceEur: 600000, pricePerSqm: 3500, rentalYield: 3.8 },
          ],
        },
        {
          city: 'Valencia',
          properties: [
            { type: 'Apartment', avgPriceEur: 180000, pricePerSqm: 2400, rentalYield: 5.8 },
            { type: 'Villa', avgPriceEur: 380000, pricePerSqm: 2000, rentalYield: 4.5 },
          ],
        },
      ],
    },
  },
  thailand: {
    property_market: {
      avgPricePerSqmNational: 2800,
      priceGrowthYoY: 3.2,
      foreignOwnershipAllowed: false, // Condos only
      mortgageAvailable: false,
      typicalDepositPercent: 100, // Cash purchase typical for foreigners
      cities: [
        {
          city: 'Bangkok',
          properties: [
            { type: 'Apartment', avgPriceEur: 180000, pricePerSqm: 3500, rentalYield: 5.5 },
            { type: 'Penthouse', avgPriceEur: 450000, pricePerSqm: 4800, rentalYield: 4.2 },
          ],
        },
        {
          city: 'Phuket',
          properties: [
            { type: 'Villa', avgPriceEur: 350000, pricePerSqm: 2800, rentalYield: 6.5 },
            { type: 'Apartment', avgPriceEur: 150000, pricePerSqm: 3200, rentalYield: 7.2 },
          ],
        },
        {
          city: 'Chiang Mai',
          properties: [
            { type: 'Apartment', avgPriceEur: 80000, pricePerSqm: 1800, rentalYield: 6.8 },
            { type: 'House', avgPriceEur: 180000, pricePerSqm: 1500, rentalYield: 5.5 },
          ],
        },
      ],
    },
  },
  indonesia: {
    property_market: {
      avgPricePerSqmNational: 1800,
      priceGrowthYoY: 4.5,
      foreignOwnershipAllowed: false, // Leasehold only
      mortgageAvailable: false,
      typicalDepositPercent: 100,
      cities: [
        {
          city: 'Bali (Canggu)',
          properties: [
            { type: 'Villa', avgPriceEur: 280000, pricePerSqm: 2200, rentalYield: 8.5 },
            { type: 'Apartment', avgPriceEur: 120000, pricePerSqm: 2500, rentalYield: 7.8 },
          ],
        },
        {
          city: 'Bali (Seminyak)',
          properties: [
            { type: 'Villa', avgPriceEur: 380000, pricePerSqm: 2800, rentalYield: 7.2 },
            { type: 'Penthouse', avgPriceEur: 250000, pricePerSqm: 3200, rentalYield: 6.8 },
          ],
        },
        {
          city: 'Jakarta',
          properties: [
            { type: 'Apartment', avgPriceEur: 150000, pricePerSqm: 2000, rentalYield: 5.5 },
          ],
        },
      ],
    },
  },
  uae: {
    property_market: {
      avgPricePerSqmNational: 4200,
      priceGrowthYoY: 12.5,
      foreignOwnershipAllowed: true,
      mortgageAvailable: true,
      typicalDepositPercent: 25,
      cities: [
        {
          city: 'Dubai',
          properties: [
            { type: 'Apartment', avgPriceEur: 350000, pricePerSqm: 4500, rentalYield: 6.5 },
            { type: 'Villa', avgPriceEur: 1200000, pricePerSqm: 3800, rentalYield: 4.8 },
            { type: 'Penthouse', avgPriceEur: 2500000, pricePerSqm: 6500, rentalYield: 4.2 },
          ],
        },
        {
          city: 'Abu Dhabi',
          properties: [
            { type: 'Apartment', avgPriceEur: 280000, pricePerSqm: 3800, rentalYield: 7.0 },
            { type: 'Villa', avgPriceEur: 800000, pricePerSqm: 3200, rentalYield: 5.5 },
          ],
        },
      ],
    },
  },
  greece: {
    property_market: {
      avgPricePerSqmNational: 1800,
      priceGrowthYoY: 9.2,
      foreignOwnershipAllowed: true,
      mortgageAvailable: true,
      typicalDepositPercent: 30,
      cities: [
        {
          city: 'Athens',
          properties: [
            { type: 'Apartment', avgPriceEur: 180000, pricePerSqm: 2400, rentalYield: 5.5 },
            { type: 'House', avgPriceEur: 350000, pricePerSqm: 2000, rentalYield: 4.5 },
          ],
        },
        {
          city: 'Thessaloniki',
          properties: [
            { type: 'Apartment', avgPriceEur: 120000, pricePerSqm: 1600, rentalYield: 6.2 },
          ],
        },
        {
          city: 'Santorini',
          properties: [
            { type: 'Villa', avgPriceEur: 650000, pricePerSqm: 4500, rentalYield: 8.5 },
            { type: 'Apartment', avgPriceEur: 280000, pricePerSqm: 3800, rentalYield: 7.2 },
          ],
        },
      ],
    },
  },
  italy: {
    property_market: {
      avgPricePerSqmNational: 2200,
      priceGrowthYoY: 2.8,
      foreignOwnershipAllowed: true,
      mortgageAvailable: true,
      typicalDepositPercent: 20,
      cities: [
        {
          city: 'Milan',
          properties: [
            { type: 'Apartment', avgPriceEur: 450000, pricePerSqm: 5500, rentalYield: 3.8 },
            { type: 'Penthouse', avgPriceEur: 1200000, pricePerSqm: 7000, rentalYield: 3.2 },
          ],
        },
        {
          city: 'Rome',
          properties: [
            { type: 'Apartment', avgPriceEur: 380000, pricePerSqm: 4200, rentalYield: 4.0 },
            { type: 'House', avgPriceEur: 650000, pricePerSqm: 3500, rentalYield: 3.5 },
          ],
        },
        {
          city: 'Tuscany',
          properties: [
            { type: 'Villa', avgPriceEur: 850000, pricePerSqm: 3200, rentalYield: 4.5 },
            { type: 'Townhouse', avgPriceEur: 420000, pricePerSqm: 2800, rentalYield: 5.0 },
          ],
        },
      ],
    },
  },
  croatia: {
    property_market: {
      avgPricePerSqmNational: 2600,
      priceGrowthYoY: 11.5,
      foreignOwnershipAllowed: true,
      mortgageAvailable: true,
      typicalDepositPercent: 20,
      cities: [
        {
          city: 'Zagreb',
          properties: [
            { type: 'Apartment', avgPriceEur: 220000, pricePerSqm: 2800, rentalYield: 5.0 },
            { type: 'House', avgPriceEur: 380000, pricePerSqm: 2400, rentalYield: 4.2 },
          ],
        },
        {
          city: 'Split',
          properties: [
            { type: 'Apartment', avgPriceEur: 280000, pricePerSqm: 3500, rentalYield: 6.5 },
            { type: 'Villa', avgPriceEur: 550000, pricePerSqm: 3000, rentalYield: 5.8 },
          ],
        },
        {
          city: 'Dubrovnik',
          properties: [
            { type: 'Apartment', avgPriceEur: 350000, pricePerSqm: 4500, rentalYield: 7.5 },
            { type: 'Villa', avgPriceEur: 850000, pricePerSqm: 4000, rentalYield: 6.2 },
          ],
        },
      ],
    },
  },
  singapore: {
    property_market: {
      avgPricePerSqmNational: 15000,
      priceGrowthYoY: 6.8,
      foreignOwnershipAllowed: true, // With restrictions
      mortgageAvailable: true,
      typicalDepositPercent: 25,
      cities: [
        {
          city: 'Singapore Central',
          properties: [
            { type: 'Apartment', avgPriceEur: 1500000, pricePerSqm: 18000, rentalYield: 2.8 },
            { type: 'Penthouse', avgPriceEur: 5000000, pricePerSqm: 22000, rentalYield: 2.2 },
          ],
        },
        {
          city: 'Singapore (Suburban)',
          properties: [
            { type: 'Apartment', avgPriceEur: 850000, pricePerSqm: 12000, rentalYield: 3.5 },
          ],
        },
      ],
    },
  },
  mexico: {
    property_market: {
      avgPricePerSqmNational: 1600,
      priceGrowthYoY: 8.2,
      foreignOwnershipAllowed: true, // Restricted in coastal zones
      mortgageAvailable: true,
      typicalDepositPercent: 30,
      cities: [
        {
          city: 'Mexico City',
          properties: [
            { type: 'Apartment', avgPriceEur: 180000, pricePerSqm: 2800, rentalYield: 5.5 },
            { type: 'Penthouse', avgPriceEur: 450000, pricePerSqm: 3500, rentalYield: 4.5 },
          ],
        },
        {
          city: 'Playa del Carmen',
          properties: [
            { type: 'Apartment', avgPriceEur: 220000, pricePerSqm: 3200, rentalYield: 8.0 },
            { type: 'Villa', avgPriceEur: 450000, pricePerSqm: 2800, rentalYield: 7.2 },
          ],
        },
        {
          city: 'Puerto Vallarta',
          properties: [
            { type: 'Apartment', avgPriceEur: 180000, pricePerSqm: 2500, rentalYield: 7.5 },
            { type: 'Villa', avgPriceEur: 350000, pricePerSqm: 2200, rentalYield: 6.5 },
          ],
        },
      ],
    },
  },
};

async function seedPropertyData() {
  console.log('Starting property data seed...');

  for (const [slug, data] of Object.entries(propertyData)) {
    try {
      await sql`
        UPDATE destinations
        SET property_market = ${JSON.stringify(data.property_market)}::jsonb
        WHERE slug = ${slug}
      `;
      console.log(`✅ Updated property data for ${slug}`);
    } catch (error) {
      console.error(`❌ Failed to update ${slug}:`, error.message);
    }
  }

  console.log('✅ Property data seed complete!');
}

seedPropertyData().catch(console.error);
