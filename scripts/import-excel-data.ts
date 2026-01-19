
import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

// Configuration
const FILE_PATH = 'DuAn.xlsx';
const SUPABASE_URL = 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false }
});

// Helper to parse dates from Excel (which are numbers like 45146)
function parseExcelDate(serial: number | string): string | null {
    if (!serial) return null;
    if (typeof serial === 'string') return null; // Or try to parse string date
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return date_info.toISOString().split('T')[0];
}

// Helper to map capital source from NguonVon
function mapCapitalSource(nguonVon: string): string {
    if (!nguonVon) return 'NonStateBudget';
    const lower = nguonVon.toLowerCase();
    if (lower.includes('ngân sách') || lower.includes('nhà nước') || lower.includes('đầu tư công')) {
        return 'StateBudget';
    }
    return 'NonStateBudget';
}

// Available employees for random assignment
const AVAILABLE_MANAGERS = ['NV001', 'NV002', 'NV003', 'NV004', 'NV005', 'NV006', 'NV015'];

function assignRandomManager(): string {
    return AVAILABLE_MANAGERS[Math.floor(Math.random() * AVAILABLE_MANAGERS.length)];
}

async function checkTablesExist() {
    const { error } = await supabase.from('contracts').select('count', { count: 'exact', head: true });
    if (error && error.code === '42P01') { // undefined_table
        return false;
    }
    return true;
}

async function importData() {
    console.log('🚀 Starting Data Import...');

    // 1. Check Tables
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
        console.error('❌ CRITICAL ERROR: Table "contracts" does not exist!');
        console.error('⚠️  Please run the SQL migration "database/migrations/103_create_contract_schema.sql" in Supabase SQL Editor first.');
        process.exit(1);
    }

    // 2. Read Excel
    if (!fs.existsSync(FILE_PATH)) {
        console.error(`❌ File not found: ${FILE_PATH}`);
        process.exit(1);
    }
    const workbook = XLSX.readFile(FILE_PATH);

    const duAnSheet = workbook.Sheets['DuAn'];
    const hopDongSheet = workbook.Sheets['HopDong'];

    const duAnData = XLSX.utils.sheet_to_json<any>(duAnSheet);
    const hopDongData = XLSX.utils.sheet_to_json<any>(hopDongSheet);

    console.log(`📊 Found ${duAnData.length} projects and ${hopDongData.length} contracts in Excel.`);

    // 3. Import Projects
    console.log('\n--- Importing Projects ---');
    const projects = duAnData.map(row => ({
        id: row.ID_DuAn ? String(row.ID_DuAn).trim() : undefined,
        code: row.MaDuAn ? String(row.MaDuAn) : (row.ID_DuAn ? String(row.ID_DuAn) : `GEN-${Math.random()}`),
        name: row.TenDuAn,
        status: mapProjectStatus(row.GiaiDoan),
        client: row.ChuDauTu,
        location: row.DiaDiem || null,
        capital_source: mapCapitalSource(row.NguonVon),
        manager_id: assignRandomManager(),
        thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
        description: row.PhamViCongViec
    })).filter(p => p.id); // Must have ID

    // Upsert Projects
    // Note: 'id' is primary key. 'code' must be unique.
    let successProjects = 0;
    for (const p of projects) {
        // Check if exists to preserve other fields? No, overwrite specified fields is better for sync.
        const { error } = await supabase.from('projects').upsert(p, { onConflict: 'id' });
        if (error) {
            console.warn(`⚠️ Failed to import project ${p.code}:`, error.message);
        } else {
            successProjects++;
        }
    }
    console.log(`✅ Upserted ${successProjects}/${projects.length} projects.`);


    // 4. Import Customers (from HopDong sheet)
    console.log('\n--- Importing Customers ---');
    const customerMap = new Map<string, any>();

    hopDongData.forEach(row => {
        if (row.BenA && row.TenKhachHang) {
            const code = String(row.BenA).trim();
            if (!customerMap.has(code)) {
                customerMap.set(code, {
                    // id: undefined, // Let gen_random_uuid handle it? No, if we want to update, we need stable ID or lookup.
                    // Let's rely on 'code' being unique. Supabase upsert on code needs unique constraint.
                    // My schema made 'code' UNIQUE.
                    code: code,
                    name: row.TenKhachHang,
                    representative: row.NguoiDaiDienBenA,
                    type: 'Client'
                });
            }
        }
    });

    const customers = Array.from(customerMap.values());
    let successCustomers = 0;

    // We need to fetch existing customers to get IDs if we want to link cleanly, 
    // OR we use upsert and then re-fetch.
    // Let's upsert matching 'code'.
    if (customers.length > 0) {
        const { error: custError } = await supabase.from('customers').upsert(customers, { onConflict: 'code' });
        if (custError) {
            console.error('❌ Error importing customers:', custError);
        } else {
            console.log(`✅ Upserted ${customers.length} customers.`);
            successCustomers = customers.length;
        }
    }

    // Refresh customer ID map
    const { data: dbCustomers } = await supabase.from('customers').select('id, code');
    const dbCustMap = new Map();
    if (dbCustomers) {
        dbCustomers.forEach(c => dbCustMap.set(c.code, c.id));
    }


    // 5. Import Contracts
    console.log('\n--- Importing Contracts ---');
    let successContracts = 0;

    const contracts = hopDongData.map(row => {
        const projectId = row.TenDuAn ? String(row.TenDuAn).trim() : null;
        const customerCode = row.BenA ? String(row.BenA).trim() : null;

        let validProject = true;
        // Check if project exists in our payload? No, check if ID exists.
        // Assuming ID_DuAn matches TenDuAn column in HopDong (based on previous analysis 'cc7595fe')

        return {
            code: row.SoHopDong,
            project_id: projectId, // Foreign key
            customer_id: customerCode ? dbCustMap.get(customerCode) : null,
            name: row['Tên dự án'] || row.TenDuAn, // Often specific contract name
            type: row.LoaiHopDong,
            status: mapContractStatus(row.TrangThai),
            signed_date: parseExcelDate(row.NgayKy),
            start_date: parseExcelDate(row.NgayHieuLuc),
            end_date: parseExcelDate(row.NgayHetHan),
            total_value: row.GiaTriHopDong && typeof row.GiaTriHopDong === 'number' ? row.GiaTriHopDong : 0,
            paid_value: row['Tổng giá trị thanh toán'] && typeof row['Tổng giá trị thanh toán'] === 'number' ? row['Tổng giá trị thanh toán'] : 0,
            file_url: row.File,
            side_a_rep: row.NguoiDaiDienBenA,
            side_b_rep: row.NguoiDaiDienBenB
        };
    }).filter(c => c.code && c.code !== 'undefined');

    for (const c of contracts) {
        const { error } = await supabase.from('contracts').upsert(c, { onConflict: 'code' });
        if (error) {
            // Foreign key violation is common if project doesn't exist.
            if (error.code === '23503') {
                console.warn(`⚠️ Skipped contract ${c.code}: Project ID "${c.project_id}" or Customer not found.`);
            } else {
                console.warn(`⚠️ Failed to import contract ${c.code}:`, error.message);
            }
        } else {
            successContracts++;
        }
    }

    console.log(`✅ Upserted ${successContracts}/${contracts.length} contracts.`);
    console.log('\n🎉 Import Complete!');
}

function mapProjectStatus(filesStatus: string): string {
    if (!filesStatus) return 'Lập kế hoạch';
    if (filesStatus.includes('2. Dự án đang thực hiện')) return 'Đang thực hiện';
    if (filesStatus.includes('3. Đã hoàn thành')) return 'Hoàn thành';
    if (filesStatus.includes('1. Xúc tiến')) return 'Lập kế hoạch';
    return 'Đang thực hiện';
}

function mapContractStatus(status: string): string {
    if (!status) return 'Nháp';
    if (status.includes('đang thực hiện')) return 'Hiệu lực';
    if (status.includes('thanh lý') || status.includes('hoàn thành')) return 'Hoàn thành';
    return 'Nháp';
}

importData();
