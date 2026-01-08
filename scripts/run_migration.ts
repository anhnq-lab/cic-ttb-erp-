import { Client } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env
dotenv.config();

// Construct connection string if not explicitly in env
// Supabase usually provides DATABASE_URL, but sometimes only SUPABASE_URL/KEY in frontend envs.
// We need the postgres connection string.
// Let's check if DATABASE_URL exists, otherwise try to construct it or fail.
const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

if (!connectionString) {
    console.error('Missing DATABASE_URL or VITE_DATABASE_URL environment variable.');
    console.log('Please ensure your .env has the postgres connection string.');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

async function runMigration() {
    const migrationPath = path.join(process.cwd(), 'database/migrations/007_comprehensive_seed_data.sql');
    console.log(`Reading migration file: ${migrationPath}`);

    try {
        await client.connect();
        console.log('Connected to database.');

        const sql = fs.readFileSync(migrationPath, 'utf8');

        // Postgres driver can run multiple statements at once usually
        console.log('Executing SQL...');
        await client.query(sql);

        console.log('Migration executed successfully!');
    } catch (err) {
        console.error('Error executing migration:', err);
    } finally {
        await client.end();
    }
}

runMigration();
