import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Enable UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Create schemas table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schemas (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        description TEXT,
        json_schema JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create authorities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS authorities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        title TEXT,
        pubkey TEXT NOT NULL,
        jurisdiction TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create proof_requests table (optional)
    await client.query(`
      CREATE TABLE IF NOT EXISTS proof_requests (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        schema_id UUID REFERENCES schemas(id),
        authority_id UUID REFERENCES authorities(id),
        proof JSONB,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create events table (optional)
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tx_hash TEXT,
        land_ref TEXT NOT NULL,
        verified BOOLEAN NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('Tables created successfully.');

    // Seed data
    await client.query(`
      INSERT INTO schemas (name, description, json_schema)
      VALUES 
        ('Buganda Land Title', 'Official Mailo land title (Kanzu)', '{"type": "object", "properties": {"ownerName": {"type": "string"}, "plotNumber": {"type": "string"}, "blockNumber": {"type": "string"}}}'),
        ('Kibanja Holder Receipt', 'Official receipt for Kibanja holder', '{"type": "object", "properties": {"holderName": {"type": "string"}, "village": {"type": "string"}, "amountPaid": {"type": "number"}}}')
      ON CONFLICT DO NOTHING;
    `);

    await client.query(`
      INSERT INTO authorities (name, title, pubkey, jurisdiction)
      VALUES 
        ('Mengo Land Board', 'Central Registrar', '0x1234...abcd', 'Buganda Kingdom'),
        ('Wakiso District Surveyor', 'District Surveyor', '0x5678...efgh', 'Wakiso')
      ON CONFLICT DO NOTHING;
    `);

    await client.query(`
      INSERT INTO events (tx_hash, land_ref, verified, timestamp)
      VALUES
        ('0xabc...', 'BLK-10-PLT-25', true, '2025-10-20T10:30:00Z'),
        ('0xdef...', 'BLK-12-PLT-11', false, '2025-10-21T14:45:00Z'),
        ('0xghi...', 'KIB-WAK-003', true, '2025-10-22T09:15:00Z')
      ON CONFLICT DO NOTHING;
    `);
    
    console.log('Mock data seeded successfully.');

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

createTables();