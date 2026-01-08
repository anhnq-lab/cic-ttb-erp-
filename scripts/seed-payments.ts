
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// --- RAW CONTRACT DATA WITH PAYMENTS (Extracted from constants.ts) ---
const CONTRACTS_WITH_PAYMENTS = [
    {
        code: '30/2025/HĐ-DDCN', // C-ND1
        paymentMilestones: [
            { phase: 'Đợt 1', condition: 'Thanh toán 90%', percentage: 90, amount: 139500000, dueDate: '2025-04-30', status: 'Chưa thanh toán' },
            { phase: 'Đợt 2', condition: 'Thanh toán 10%', percentage: 10, amount: 15500000, dueDate: '2025-06-30', status: 'Chưa thanh toán' }
        ],
        transactions: []
    },
    {
        code: '01/2024/VIG-CIC', // C-VIG-01
        paymentMilestones: [
            { phase: 'Tạm ứng', condition: 'Ký HĐ', percentage: 20, amount: 840000000, dueDate: '2024-01-20', status: 'Đã thanh toán' },
            { phase: 'Đợt 1', condition: 'LOD 300', percentage: 30, amount: 1260000000, dueDate: '2024-06-15', status: 'Đã thanh toán' },
            { phase: 'Đợt 2', condition: 'LOD 400', percentage: 40, amount: 1680000000, dueDate: '2024-11-30', status: 'Đã xuất hóa đơn' }
        ],
        transactions: [
            { date: '2024-01-20', amount: 840000000, description: 'Tạm ứng', method: 'Bank Transfer', status: 'Completed' }
        ]
    }
];

async function seedPayments() {
    console.log(`Starting seed of payments for ${CONTRACTS_WITH_PAYMENTS.length} contracts...`);

    let milestoneCount = 0;
    let transactionCount = 0;

    for (const contractData of CONTRACTS_WITH_PAYMENTS) {
        try {
            // 1. Get Contract ID
            const { data: contract } = await supabase
                .from('contracts')
                .select('id')
                .eq('code', contractData.code)
                .single();

            if (!contract) {
                console.warn(`Contract with code ${contractData.code} not found. Skipping.`);
                continue;
            }

            const contractId = contract.id;

            // 2. Insert Milestones
            if (contractData.paymentMilestones && contractData.paymentMilestones.length > 0) {
                const milestones = contractData.paymentMilestones.map(m => ({
                    contractId: contractId,
                    phase: m.phase,
                    condition: m.condition,
                    percentage: m.percentage,
                    amount: m.amount,
                    dueDate: m.dueDate, // ISO Date string yyyy-mm-dd check? Data is '2025-04-30' which is good.
                    status: m.status
                }));

                const { error: mError } = await supabase.from('payment_milestones').insert(milestones);
                if (mError) {
                    console.error(`Error inserting milestones for ${contractData.code}:`, mError.message);
                } else {
                    console.log(`Inserted ${milestones.length} milestones for ${contractData.code}`);
                    milestoneCount += milestones.length;
                }
            }

            // 3. Insert Transactions
            if (contractData.transactions && contractData.transactions.length > 0) {
                const transactions = contractData.transactions.map(t => ({
                    contractId: contractId,
                    date: t.date.split('/').reverse().join('-'), // Convert DD/MM/YYYY to YYYY-MM-DD
                    amount: t.amount,
                    description: t.description,
                    method: t.method,
                    status: t.status
                }));

                const { error: tError } = await supabase.from('payment_transactions').insert(transactions);
                if (tError) {
                    console.error(`Error inserting transactions for ${contractData.code}:`, tError.message);
                } else {
                    console.log(`Inserted ${transactions.length} transactions for ${contractData.code}`);
                    transactionCount += transactions.length;
                }
            }

        } catch (e) {
            console.error(`Exception processing ${contractData.code}:`, e);
        }
    }

    console.log('--------------------------------------------------');
    console.log(`Seeding complete.`);
    console.log(`Milestones created: ${milestoneCount}`);
    console.log(`Transactions created: ${transactionCount}`);
}

seedPayments();
