
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

// --- RAW CONTRACT DATA (Extracted from constants.ts) ---
const RAW_CONTRACTS = [
    {
        id: 'C-01', code: '01/PPXD-CICHĐ2023', signedDate: '2023-01-31',
        packageName: 'Tư vấn BIM - Thiết kế bản vẽ thi công',
        projectName: 'Tây Hồ Tây Lô K8CT1',
        location: 'Tây Hồ Tây Lô K8CT1',
        contractType: 'Tư vấn BIM', lawApplied: 'Luật Việt Nam',
        sideAName: 'CÔNG TY TNHH DAEWOO ENGINEERING & CONSTRUCTION VIỆT NAM', sideARep: 'Kwon Soon Jae', sideAPosition: 'Đại diện', sideAMst: 'ID029', sideAStaff: '',
        sideBName: 'Công ty Cổ phần Công nghệ và Tư vấn CIC', sideBRep: 'Nguyễn Hoàng Hà', sideBPosition: 'Tổng giám đốc', sideBMst: '0100775353', sideBBank: '1200014777 tại BIDV',
        totalValue: 4730000000, vatIncluded: true, advancePayment: 0,
        mainTasks: ['Mô hình BIM giai đoạn TKCS', 'Video diễn họa', 'Báo cáo va chạm', 'Khối lượng trích xuất', 'Mô hình BIM giai đoạn TKKT', 'Video diễn họa TKKT', 'Báo cáo va chạm TKKT', 'Khối lượng trích xuất TKKT', 'Mô hình BIM giai đoạn TKTC', 'Báo cáo va chạm TKTC', 'Khối lượng TKTC'],
        paidValue: 3440000000, remainingValue: 1290000000, wipValue: 3440000000, status: 'Hiệu lực', duration: '31/01/2023 - 31/01/2023', startDate: '2023-01-31', endDate: '2023-01-31'
    },
    {
        id: 'C-08', code: '08/PPXD-CICHĐ2023', signedDate: '2023-01-31',
        packageName: 'Tư vấn BIM - Thiết kế bản vẽ thi công',
        projectName: 'Tây Hồ Tây Lô K8HH1',
        contractType: 'Tư vấn BIM', lawApplied: 'Luật Việt Nam',
        sideAName: 'CÔNG TY TNHH DAEWOO ENGINEERING & CONSTRUCTION VIỆT NAM',
        sideBName: 'Công ty Cổ phần Công nghệ và Tư vấn CIC', sideBRep: 'Nguyễn Hoàng Hà',
        totalValue: 4180000000, vatIncluded: true, advancePayment: 0,
        paidValue: 4119200000, remainingValue: 60800000, wipValue: 4119200000, status: 'Hiệu lực', duration: '31/01/2023 - 31/01/2023', startDate: '2023-01-31', endDate: '2023-01-31'
    },
    {
        id: 'C-03', code: '44/PPXD-CICHĐ2023', signedDate: '2023-06-13',
        packageName: 'Tư vấn BIM - Thiết kế bản vẽ thi công',
        projectName: 'Global Bussiness Center (GBC)',
        contractType: 'Tư vấn BIM',
        sideAName: 'CÔNG TY TNHH PHÁT TRIỂN STS VIỆT NAM',
        sideBName: 'Công ty Cổ phần Công nghệ và Tư vấn CIC',
        totalValue: 6264000000, paidValue: 1879200000, remainingValue: 4384800000, wipValue: 1879200000, status: 'Hiệu lực'
    },
    {
        id: 'C-73', code: '73/PPXD-CICHĐ2023', signedDate: '2023-08-08',
        projectName: 'Kè suối Nặm La, Sơn La',
        contractType: 'Tư vấn BIM',
        sideAName: 'BAN QUẢN LÝ DỰ ÁN ĐẦU TƯ XÂY DỰNG CÔNG TRÌNH DÂN DỤNG VÀ CÔNG NGHIỆP TỈNH SƠN LA',
        sideBName: 'CIC',
        totalValue: 972981000, paidValue: 972981000, remainingValue: 0, wipValue: 972981000, status: 'Hoàn thành'
    },
    {
        id: 'C-74', code: '74/PPXD-CICHĐ2023', signedDate: '2023-08-15',
        projectName: 'Tây Hồ Tây Lô K2CT1',
        contractType: 'Tư vấn BIM',
        sideAName: 'CÔNG TY TNHH DAEWOO ENGINEERING & CONSTRUCTION VIỆT NAM',
        sideBName: 'CIC',
        totalValue: 4860000000, paidValue: 2430000000, remainingValue: 2430000000, status: 'Hiệu lực'
    },
    {
        id: 'C-01-2024-L2.2', code: '01/BIM-CICHĐ2024 LÔ 2.2', signedDate: '2024-02-19',
        projectName: 'Eco Smart City Plot 2-2',
        contractType: 'Tư vấn BIM',
        sideAName: 'CÔNG TY TNHH LOTTE PROPERTIES HCMC',
        sideBName: 'CIC',
        totalValue: 2035168000, paidValue: 104404118, remainingValue: 1930763882, status: 'Hiệu lực'
    },
    {
        id: 'C-09-2024', code: '09/BIM-CICHĐ2024', signedDate: '2024-12-17',
        projectName: 'Khu công nghiệp Thuận Thành I',
        contractType: 'Tư vấn BIM',
        sideAName: 'BAN QUẢN LÝ CÁC DỰ ÁN ĐẦU TƯ XÂY DỰNG - CHI NHÁNH TỔNG CÔNG TY VIGLACERA',
        sideBName: 'CIC',
        totalValue: 344000000, paidValue: 103200000, remainingValue: 240800000, status: 'Hiệu lực'
    },
    {
        id: 'C-14-2024', code: '14/BIM-CICHĐ2024', signedDate: '2024-07-05',
        projectName: 'Xây dựng Bệnh viện Tim Hà Nội cơ sở 2',
        contractType: 'Tư vấn BIM',
        sideAName: 'BAN QUẢN LÝ DỰ ÁN ĐẦU TƯ XÂY DỰNG CÔNG TRÌNH DÂN DỤNG VÀ CÔNG NGHIỆP HN',
        sideBName: 'CIC',
        totalValue: 488132509, paidValue: 414912000, remainingValue: 73220509, status: 'Hoàn thành'
    },
    {
        id: 'C-19-2024', code: '19/BIM-CICHĐ2024', signedDate: '2024-08-30',
        projectName: 'Xây dựng cung thiếu nhi thành phố',
        contractType: 'Tư vấn BIM',
        sideAName: 'BAN QUẢN LÝ DỰ ÁN ĐẦU TƯ XÂY DỰNG CÔNG TRÌNH DÂN DỤNG VÀ CÔNG NGHIỆP TP.HCM',
        sideBName: 'CIC',
        totalValue: 456027200, paidValue: 402962217, remainingValue: 53064983, status: 'Hoàn thành'
    },
    {
        id: 'C-02-2025', code: '02.2025/KCNTRANYEN/VIG.CIC', signedDate: '2025-03-17',
        projectName: 'KCN Trấn Yên - 25010-KCNTY_VIGLACERA',
        contractType: 'Tư vấn BIM',
        sideAName: 'CHI NHÁNH VIGLACERA',
        sideBName: 'CIC',
        totalValue: 259200000, paidValue: 0, remainingValue: 259200000, status: 'Hiệu lực'
    },
    {
        id: 'C-04-2025', code: '04/BIM-CICHĐ2025', signedDate: '2025-03-20',
        projectName: '25014-BVND_BDDHCM',
        contractType: 'Tư vấn BIM',
        sideAName: 'BAN DD&CN TP.HCM',
        sideBName: 'CIC',
        totalValue: 155000000, paidValue: 0, remainingValue: 155000000, status: 'Hiệu lực'
    },
    {
        id: 'C-07-2025', code: '07/BIM-CICHĐ2025', signedDate: '2025-04-18',
        projectName: '24008-BVCM_319',
        contractType: 'Tư vấn BIM',
        sideAName: 'CÔNG TY CỔ PHẦN 319.5',
        sideBName: 'CIC',
        totalValue: 891000000, paidValue: 0, remainingValue: 891000000, status: 'Hiệu lực'
    },
    {
        id: 'C-08-2025', code: '08/BIM-CICHĐ2025', signedDate: '2025-04-09',
        projectName: '15dee908',
        contractType: 'Tư vấn BIM',
        sideAName: 'VIỆN KIẾN TRÚC QUỐC GIA',
        sideBName: 'CIC',
        totalValue: 495811000, remainingValue: 495811000, status: 'Hiệu lực'
    },
    {
        id: 'C-ND1', code: '30/2025/HĐ-DDCN', signedDate: '2025-03-20',
        packageName: 'Tư vấn lập mô hình thông tin công trình (BIM)',
        projectName: 'Xây dựng mới Trung tâm chuyên sâu bệnh nhiệt đới (Khối 4B) Bệnh viện Nhi đồng 1',
        contractType: 'Trọn gói',
        sideAName: 'Ban Quản lý dự án đầu tư xây dựng các công trình dân dụng và công nghiệp',
        sideBName: 'Công ty Cổ phần Công nghệ và Tư vấn CIC',
        totalValue: 155000000, vatIncluded: true, advancePayment: 0,
        paidValue: 0, remainingValue: 155000000, wipValue: 45000000, status: 'Hiệu lực'
    },
    {
        id: 'C-VIG-01', code: '01/2024/VIG-CIC', signedDate: '2024-01-15',
        packageName: 'Tư vấn BIM cấp độ 2 dự án Skyline',
        projectName: 'Skyline Residential - VinGroup',
        contractType: 'Theo đơn giá cố định',
        sideAName: 'Tập đoàn Vingroup - CTCP',
        sideBName: 'Công ty Cổ phần Công nghệ và Tư vấn CIC',
        totalValue: 4200000000, vatIncluded: true, advancePayment: 840000000,
        paidValue: 2100000000, remainingValue: 2100000000, wipValue: 1680000000, status: 'Hiệu lực'
    }
];

async function seedContracts() {
    console.log(`Starting seed of ${RAW_CONTRACTS.length} contracts...`);

    let successCount = 0;
    let failCount = 0;

    // Fetch all projects first for matching
    const { data: projects, error: pError } = await supabase.from('projects').select('id, code, name');
    if (pError) {
        console.error("Error fetching projects:", pError);
        return;
    }

    console.log(`Loaded ${projects?.length} projects for linking.`);

    for (const contract of RAW_CONTRACTS) {
        try {
            // LINKING LOGIC
            let projectUUID = null;
            if (projects && contract.projectName) {
                const searchName = contract.projectName.toLowerCase();

                // 1. Exact Name Match
                let match = projects.find(p => p.name.toLowerCase() === searchName);

                // 2. Project Code inside Contract Project Name (e.g. "KCN Trấn Yên - 25010...")
                if (!match) {
                    match = projects.find(p => p.code && searchName.includes(p.code.toLowerCase()));
                }

                // 3. Contract Project Name inside Project Name (e.g. "Eco Smart City Plot 2-2")
                if (!match) {
                    match = projects.find(p => p.name.toLowerCase().includes(searchName));
                }

                // 4. Fallback: Check if Contract Project Name IS the Code (e.g. "25014-...")
                if (!match) {
                    match = projects.find(p => p.code.toLowerCase() === searchName);
                }

                if (match) {
                    projectUUID = match.id;
                    console.log(`Matched Contract [${contract.code}] to Project [${match.code}] (${match.name})`);
                } else {
                    console.warn(`Could not link Contract [${contract.code}] (Name: ${contract.projectName}) to any project.`);
                }
            }

            // Generate Mock Transactions if Payment Exists
            let mockTransactions: any[] = [];
            if ((contract as any).paidValue > 0) {
                const paid = (contract as any).paidValue;
                // Split into 1 or 2 payments
                const count = Math.random() > 0.5 ? 2 : 1;

                if (count === 1) {
                    mockTransactions.push({
                        id: `TX-${contract.code}-1`,
                        amount: paid,
                        paymentDate: (contract as any).startDate || '2023-06-01',
                        description: 'Thanh toán tạm ứng / đợt 1',
                        status: 'Paid',
                        invoiceNumber: `HD-${Math.floor(Math.random() * 10000)}`,
                        paymentMethod: 'Transfer',
                        vatRate: 10,
                        notes: 'Thanh toán đúng hạn',
                        documents: [{ name: 'UNC_Bank.pdf', url: '#' }]
                    });
                } else {
                    mockTransactions.push({
                        id: `TX-${contract.code}-1`,
                        amount: Math.round(paid * 0.4),
                        paymentDate: (contract as any).startDate || '2023-03-01',
                        description: 'Thanh toán tạm ứng',
                        status: 'Paid',
                        invoiceNumber: `HD-${Math.floor(Math.random() * 10000)}`,
                        paymentMethod: 'Transfer',
                        vatRate: 10
                    });
                    mockTransactions.push({
                        id: `TX-${contract.code}-2`,
                        amount: paid - Math.round(paid * 0.4),
                        paymentDate: '2023-09-15',
                        description: 'Thanh toán đợt 2',
                        status: 'Paid',
                        invoiceNumber: `HD-${Math.floor(Math.random() * 10000)}`,
                        paymentMethod: 'Transfer',
                        vatRate: 10,
                        notes: 'Khấu trừ hoàn tạm ứng',
                        documents: [{ name: 'Nghiem_thu.pdf', url: '#' }]
                    });
                }
            }

            const contractData = {
                ...contract,
                projectId: projectUUID,
                transactions: mockTransactions
            };

            // Remove 'id' from insert if we want Supabase to auto-gen UUIDs, OR keep it if we want custom IDs?
            // Contracts table uses UUID default gen. The ID in 'constants.ts' is likely custom string 'C-01'.
            // Supabase UUIDs must be valid UUIDs. 'C-01' is not.
            // So we MUST exclude 'id'.
            // delete (contractData as any).id;
            // Also need to sanitize personnel or other fields if table doesn't support them or handles them as JSONB
            // Table has 'personnel' as JSONB, so it's fine.

            // UPSERT by CODE
            const { data: existing } = await supabase
                .from('contracts')
                .select('id')
                .eq('code', contractData.code)
                .single();

            let error;
            if (existing) {
                const result = await supabase.from('contracts').update(contractData).eq('id', existing.id);
                error = result.error;
            } else {
                const result = await supabase.from('contracts').insert(contractData);
                error = result.error;
            }

            if (error) {
                console.error(`Error upserting contract ${contract.code}:`, error.message);
                failCount++;
            } else {
                console.log(`Successfully upserted contract ${contract.code}`);
                successCount++;
            }
        } catch (e) {
            console.error(`Exception processing contract ${contract.code}:`, e);
            failCount++;
        }
    }

    console.log(`Seeding complete. Success: ${successCount}, Failed: ${failCount}`);
}

seedContracts();
