/**
 * Setup Puppy Insurance Database Schema
 *
 * Tables:
 * - dog_breeds: Master list of dog breeds with risk factors
 * - user_dogs: User's registered dogs
 * - insurance_policies: Active insurance policies
 * - policy_quotes: Quote history
 * - claims: Insurance claims
 */

require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  console.log('🐕 Setting up Puppy Insurance database...\n');

  // Dog breeds table
  console.log('Creating dog_breeds table...');
  await sql`
    CREATE TABLE IF NOT EXISTS dog_breeds (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      size VARCHAR(20) NOT NULL, -- small, medium, large, giant
      risk_category VARCHAR(20) NOT NULL, -- low, medium, high
      avg_lifespan_years INTEGER,
      common_health_issues TEXT[],
      base_premium_multiplier DECIMAL(3,2) DEFAULT 1.00,
      image_url TEXT,
      description TEXT,
      temperament TEXT[],
      exercise_needs VARCHAR(20), -- low, moderate, high
      grooming_needs VARCHAR(20), -- low, moderate, high
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // User dogs table
  console.log('Creating user_dogs table...');
  await sql`
    CREATE TABLE IF NOT EXISTS user_dogs (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      breed_id INTEGER REFERENCES dog_breeds(id),
      breed_name VARCHAR(100), -- For custom/mixed breeds
      date_of_birth DATE,
      age_years INTEGER,
      weight_kg DECIMAL(5,2),
      gender VARCHAR(20),
      is_neutered BOOLEAN DEFAULT false,
      microchip_number VARCHAR(50),
      has_preexisting_conditions BOOLEAN DEFAULT false,
      preexisting_conditions TEXT[],
      photo_url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Insurance policies table
  console.log('Creating insurance_policies table...');
  await sql`
    CREATE TABLE IF NOT EXISTS insurance_policies (
      id SERIAL PRIMARY KEY,
      policy_number VARCHAR(50) UNIQUE NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      dog_id INTEGER REFERENCES user_dogs(id),
      plan_type VARCHAR(50) NOT NULL, -- basic, standard, premium, comprehensive
      monthly_premium DECIMAL(10,2) NOT NULL,
      annual_coverage_limit DECIMAL(10,2),
      deductible DECIMAL(10,2),
      coverage_details JSONB,
      start_date DATE NOT NULL,
      end_date DATE,
      status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled, pending
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Policy quotes table
  console.log('Creating policy_quotes table...');
  await sql`
    CREATE TABLE IF NOT EXISTS policy_quotes (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255),
      session_id VARCHAR(255),
      dog_details JSONB NOT NULL,
      plan_type VARCHAR(50) NOT NULL,
      quoted_premium DECIMAL(10,2) NOT NULL,
      coverage_details JSONB,
      valid_until TIMESTAMP,
      converted_to_policy_id INTEGER REFERENCES insurance_policies(id),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Claims table
  console.log('Creating claims table...');
  await sql`
    CREATE TABLE IF NOT EXISTS claims (
      id SERIAL PRIMARY KEY,
      claim_number VARCHAR(50) UNIQUE NOT NULL,
      policy_id INTEGER REFERENCES insurance_policies(id),
      user_id VARCHAR(255) NOT NULL,
      dog_id INTEGER REFERENCES user_dogs(id),
      incident_date DATE NOT NULL,
      incident_type VARCHAR(50), -- accident, illness, routine, emergency
      description TEXT,
      vet_name VARCHAR(200),
      vet_invoice_amount DECIMAL(10,2),
      approved_amount DECIMAL(10,2),
      status VARCHAR(20) DEFAULT 'pending', -- pending, approved, denied, paid
      documents JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // User profiles for the puppy insurance context
  console.log('Creating user_profiles table...');
  await sql`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255),
      name VARCHAR(200),
      phone VARCHAR(50),
      address JSONB,
      preferences JSONB,
      onboarding_completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Seed dog breeds data
  console.log('\n🐾 Seeding dog breeds...');
  const breeds = [
    { name: 'Labrador Retriever', size: 'large', risk: 'medium', lifespan: 12, health: ['Hip dysplasia', 'Obesity', 'Ear infections'], multiplier: 1.0, temperament: ['Friendly', 'Active', 'Outgoing'], exercise: 'high', grooming: 'moderate' },
    { name: 'German Shepherd', size: 'large', risk: 'medium', lifespan: 11, health: ['Hip dysplasia', 'Bloat', 'Degenerative myelopathy'], multiplier: 1.1, temperament: ['Loyal', 'Confident', 'Courageous'], exercise: 'high', grooming: 'high' },
    { name: 'Golden Retriever', size: 'large', risk: 'medium', lifespan: 11, health: ['Hip dysplasia', 'Cancer', 'Heart disease'], multiplier: 1.05, temperament: ['Intelligent', 'Friendly', 'Devoted'], exercise: 'high', grooming: 'high' },
    { name: 'French Bulldog', size: 'small', risk: 'high', lifespan: 11, health: ['Breathing issues', 'Skin allergies', 'Spinal disorders'], multiplier: 1.4, temperament: ['Playful', 'Alert', 'Adaptable'], exercise: 'low', grooming: 'low' },
    { name: 'Bulldog', size: 'medium', risk: 'high', lifespan: 9, health: ['Breathing issues', 'Hip dysplasia', 'Skin infections'], multiplier: 1.5, temperament: ['Docile', 'Willful', 'Friendly'], exercise: 'low', grooming: 'moderate' },
    { name: 'Poodle', size: 'medium', risk: 'low', lifespan: 14, health: ['Hip dysplasia', 'Eye problems', 'Bloat'], multiplier: 0.9, temperament: ['Intelligent', 'Active', 'Alert'], exercise: 'high', grooming: 'high' },
    { name: 'Beagle', size: 'medium', risk: 'low', lifespan: 13, health: ['Epilepsy', 'Hypothyroidism', 'Cherry eye'], multiplier: 0.85, temperament: ['Friendly', 'Curious', 'Merry'], exercise: 'high', grooming: 'low' },
    { name: 'Rottweiler', size: 'large', risk: 'medium', lifespan: 10, health: ['Hip dysplasia', 'Heart disease', 'Cancer'], multiplier: 1.2, temperament: ['Loyal', 'Confident', 'Good-natured'], exercise: 'high', grooming: 'low' },
    { name: 'Yorkshire Terrier', size: 'small', risk: 'low', lifespan: 14, health: ['Dental issues', 'Hypoglycemia', 'Collapsed trachea'], multiplier: 0.8, temperament: ['Bold', 'Intelligent', 'Independent'], exercise: 'moderate', grooming: 'high' },
    { name: 'Dachshund', size: 'small', risk: 'medium', lifespan: 13, health: ['Back problems', 'Obesity', 'Dental issues'], multiplier: 1.0, temperament: ['Clever', 'Stubborn', 'Devoted'], exercise: 'moderate', grooming: 'low' },
    { name: 'Boxer', size: 'large', risk: 'medium', lifespan: 10, health: ['Heart conditions', 'Cancer', 'Hip dysplasia'], multiplier: 1.15, temperament: ['Fun-loving', 'Bright', 'Active'], exercise: 'high', grooming: 'low' },
    { name: 'Cavalier King Charles Spaniel', size: 'small', risk: 'high', lifespan: 12, health: ['Heart disease', 'Syringomyelia', 'Hip dysplasia'], multiplier: 1.35, temperament: ['Affectionate', 'Gentle', 'Graceful'], exercise: 'moderate', grooming: 'moderate' },
    { name: 'Siberian Husky', size: 'large', risk: 'low', lifespan: 13, health: ['Eye problems', 'Hip dysplasia', 'Hypothyroidism'], multiplier: 0.95, temperament: ['Outgoing', 'Mischievous', 'Loyal'], exercise: 'high', grooming: 'high' },
    { name: 'Chihuahua', size: 'small', risk: 'low', lifespan: 15, health: ['Dental issues', 'Luxating patella', 'Heart problems'], multiplier: 0.75, temperament: ['Charming', 'Graceful', 'Sassy'], exercise: 'low', grooming: 'low' },
    { name: 'Great Dane', size: 'giant', risk: 'high', lifespan: 8, health: ['Bloat', 'Heart disease', 'Hip dysplasia'], multiplier: 1.6, temperament: ['Friendly', 'Patient', 'Dependable'], exercise: 'moderate', grooming: 'low' },
    { name: 'Shih Tzu', size: 'small', risk: 'low', lifespan: 14, health: ['Eye problems', 'Dental issues', 'Hip dysplasia'], multiplier: 0.85, temperament: ['Affectionate', 'Playful', 'Outgoing'], exercise: 'low', grooming: 'high' },
    { name: 'Border Collie', size: 'medium', risk: 'low', lifespan: 13, health: ['Hip dysplasia', 'Epilepsy', 'Eye problems'], multiplier: 0.9, temperament: ['Intelligent', 'Energetic', 'Alert'], exercise: 'high', grooming: 'moderate' },
    { name: 'Mixed Breed', size: 'medium', risk: 'low', lifespan: 13, health: ['Varies'], multiplier: 0.85, temperament: ['Varies'], exercise: 'moderate', grooming: 'moderate' },
  ];

  for (const breed of breeds) {
    await sql`
      INSERT INTO dog_breeds (name, size, risk_category, avg_lifespan_years, common_health_issues, base_premium_multiplier, temperament, exercise_needs, grooming_needs)
      VALUES (${breed.name}, ${breed.size}, ${breed.risk}, ${breed.lifespan}, ${breed.health}, ${breed.multiplier}, ${breed.temperament}, ${breed.exercise}, ${breed.grooming})
      ON CONFLICT (name) DO UPDATE SET
        size = EXCLUDED.size,
        risk_category = EXCLUDED.risk_category,
        avg_lifespan_years = EXCLUDED.avg_lifespan_years,
        common_health_issues = EXCLUDED.common_health_issues,
        base_premium_multiplier = EXCLUDED.base_premium_multiplier,
        temperament = EXCLUDED.temperament,
        exercise_needs = EXCLUDED.exercise_needs,
        grooming_needs = EXCLUDED.grooming_needs
    `;
    console.log(`  ✓ ${breed.name}`);
  }

  console.log('\n✅ Database setup complete!');
  console.log('\nTables created:');
  console.log('  - dog_breeds (18 breeds seeded)');
  console.log('  - user_dogs');
  console.log('  - insurance_policies');
  console.log('  - policy_quotes');
  console.log('  - claims');
  console.log('  - user_profiles');
}

setupDatabase().catch(console.error);
