
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

import { ContractService } from '../services/contract.service';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function seedAmendments() {
    console.log('🌱 Seeding Contract Amendments...');

    try {
        // 1. Get existing contracts
        const { data: contracts, error } = await supabase.from('contracts').select('id, code, total_value');

        if (error || !contracts || contracts.length === 0) {
            console.log('❌ No contracts found to seed amendments.');
            return;
        }

        console.log(`Found ${contracts.length} contracts.`);

        for (const contract of contracts) {
            // 30% chance to have amendments
            if (Math.random() > 0.3) {

                // Create 1-3 amendments
                const count = Math.floor(Math.random() * 3) + 1;
                console.log(`Creating ${count} amendments for contract ${contract.code}...`);

                let currentTotal = Number(contract.total_value);

                for (let i = 1; i <= count; i++) {
                    const isIncrease = Math.random() > 0.3;
                    const changeAmount = isIncrease
                        ? Math.round(Math.random() * 500000000)
                        : -Math.round(Math.random() * 200000000);

                    currentTotal += changeAmount;

                    const amendment = {
                        contract_id: contract.id,
                        amendment_number: i,
                        amendment_date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
                        description: isIncrease ? 'Bổ sung khối lượng phát sinh' : 'Giảm trừ khối lượng không thực hiện',
                        value_change: changeAmount,
                        new_total_value: currentTotal,
                        // approved_by: ... (skip for now)
                    };

                    const { error: insertError } = await supabase.from('contract_amendments').insert([amendment]);
                    if (insertError) console.error('Error inserting amendment:', insertError);
                }
            }
        }

        console.log('✅ Seeding amendments completed.');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    }
}

seedAmendments();
