import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function addColumn() {
  try {
    await sql`
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS property_market JSONB
    `;
    console.log('✅ property_market column added/verified');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

addColumn();
