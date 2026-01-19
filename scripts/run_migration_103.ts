import { Client } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env
dotenv.config();

const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

if (!connectionString) {
    console.error('Missing DATABASE_URL or VITE_DATABASE_URL environment variable.');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

async function runMigration() {
    const migrationPath = path.join(process.cwd(), 'database/migrations/103_rebuild_task_templates.sql');
    console.log(`Reading migration file: ${migrationPath}`);

    try {
        await client.connect();
        console.log('Connected to database.');

        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Executing SQL...');
        await client.query(sql);

        console.log('Migration 103 executed successfully!');
    } catch (err) {
        console.error('Error executing migration:', err);
    } finally {
        await client.end();
    }
}

runMigration();
