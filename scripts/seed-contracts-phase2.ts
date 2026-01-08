/**
 * Seed Contracts, Payment Milestones & Transactions
 * Phase 2 of Comprehensive Data Seeding
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// CONTRACTS DATA
// ============================================
const CONTRACTS = [
    // Contract 1: Cầu Thủ Thiêm 4 - Thiết kế BIM
    {
        id: 'CTR-SB-001',
        project_id: 'PRJ-SB-001',
        code: 'HĐ-2025-001-TKBIM',
        signed_date: '2025-01-15',
        package_name: 'Gói thầu Tư vấn Thiết kế BIM',
        project_name: 'Cầu Thủ Thiêm 4',
        location: 'TP.HCM',
        contract_type: 'Tư vấn BIM',
        law_applied: 'Luật Đấu thầu 2023, Nghị định 24/2024/NĐ-CP',
        side_a_name: 'Ban Quản lý Dự án Đầu tư Xây dựng Giao thông TP.HCM',
        side_a_rep: 'Ông Nguyễn Văn An',
        side_a_position: 'Giám đốc',
        side_a_mst: '0301234567',
        side_a_staff: 'Bà Trần Thị Bình - Phó phòng Kỹ thuật',
        side_b_name: 'Công ty CP Tư vấn Xây dựng Chuyển đổi số',
        side_b_rep: 'Nguyễn Hoàng Hà',
        side_b_position: 'Tổng Giám đốc',
        side_b_mst: '0303456789',
        side_b_bank: 'Vietcombank Chi nhánh HCM - STK: 0071234567890',
        total_value: 8500000000,
        vat_included: true,
        advance_payment: 1700000000, // 20%
        paid_value: 1700000000,
        remaining_value: 6800000000,
        wip_value: 2550000000, // 30% WIP
        duration: '39 tháng',
        start_date: '2025-02-01',
        end_date: '2028-05-31',
        warranty_period: '24 tháng',
        main_tasks: [
            'Lập mô hình BIM LOD 350 toàn bộ công trình',
            'Xuất bản vẽ thi công 2D từ mô hình',
            'Mô phỏng 4D tiến độ thi công',
            'Báo cáo kiểm tra va chạm (Clash Detection)',
            'Xuất khối lượng công trình',
            'Hỗ trợ QLDA trong suốt quá trình thi công'
        ],
        file_formats: 'RVT, IFC, DWG, PDF',
        delivery_method: 'CDE (Autodesk Docs)',
        acceptance_standard: 'Theo BIM Execution Plan đã phê duyệt',
        penalty_rate: '0.05%/ngày chậm',
        max_penalty: '10% giá trị hợp đồng',
        dispute_resolution: 'Trọng tài Việt Nam',
        status: 'Hiệu lực',
        file_url: 'https://drive.google.com/sample/contract-001.pdf',
        drive_link: 'https://drive.google.com/drive/folders/ctr-sb-001'
    },

    // Contract 2: Cầu Thủ Thiêm 4 - Thẩm tra
    {
        id: 'CTR-SB-002',
        project_id: 'PRJ-SB-001',
        code: 'HĐ-2025-002-TVTT',
        signed_date: '2025-02-20',
        package_name: 'Gói thầu Tư vấn Thẩm tra Thiết kế',
        project_name: 'Cầu Thủ Thiêm 4',
        location: 'TP.HCM',
        contract_type: 'Tư vấn Thẩm tra',
        law_applied: 'Luật Đấu thầu 2023',
        side_a_name: 'Ban Quản lý Dự án Đầu tư Xây dựng Giao thông TP.HCM',
        side_a_rep: 'Ông Nguyễn Văn An',
        side_a_position: 'Giám đốc',
        side_a_mst: '0301234567',
        side_b_name: 'Công ty CP Tư vấn Xây dựng Chuyển đổi số',
        side_b_rep: 'Nguyễn Hoàng Hà',
        side_b_position: 'Tổng Giám đốc',
        side_b_mst: '0303456789',
        total_value: 850000000,
        vat_included: true,
        advance_payment: 170000000, // 20%
        paid_value: 170000000,
        remaining_value: 680000000,
        wip_value: 0,
        duration: '6 tháng',
        start_date: '2025-03-01',
        end_date: '2025-08-31',
        warranty_period: '12 tháng',
        main_tasks: [
            'Thẩm tra hồ sơ thiết kế BIM',
            'Kiểm tra clash detection report',
            'Đánh giá tuân thủ BIM standards'
        ],
        status: 'Hiệu lực'
    },

    // Contract 3: TTHC Quận 9
    {
        id: 'CTR-SB-003',
        project_id: 'PRJ-SB-002',
        code: 'HĐ-2025-003-BIM',
        signed_date: '2025-01-10',
        package_name: 'Tư vấn BIM và Thẩm tra Thiết kế',
        project_name: 'Trung tâm Hành chính Quận 9',
        location: 'TP.Thủ Đức, TP.HCM',
        contract_type: 'Tư vấn BIM',
        law_applied: 'Luật Đấu thầu 2023',
        side_a_name: 'Sở Xây dựng Hà Nội',
        side_a_rep: 'Ông Đỗ Văn Minh',
        side_a_position: 'Giám đốc Sở',
        side_a_mst: '0101234570',
        side_b_name: 'Công ty CP Tư vấn Xây dựng Chuyển đổi số',
        side_b_rep: 'Nguyễn Hoàng Hà',
        side_b_position: 'Tổng Giám đốc',
        side_b_mst: '0303456789',
        total_value: 4200000000,
        vat_included: true,
        advance_payment: 840000000, // 20%
        paid_value: 840000000,
        remaining_value: 3360000000,
        wip_value: 0,
        duration: '30 tháng',
        start_date: '2025-02-01',
        end_date: '2027-08-31',
        warranty_period: '24 tháng',
        main_tasks: [
            'Mô hình BIM LOD 300',
            'Kiểm tra va chạm',
            'Thẩm tra thiết kế',
            'Hỗ trợ QLDA'
        ],
        status: 'Hiệu lực'
    },

    // Contract 4: Hồ Hoàn Kiếm
    {
        id: 'CTR-SB-004',
        project_id: 'PRJ-SB-003',
        code: 'HĐ-2026-001-DT',
        signed_date: '2026-01-05',
        package_name: 'Tư vấn BIM Di tích',
        project_name: 'Cải tạo và Tôn tạo Hồ Hoàn Kiếm',
        location: 'Hà Nội',
        contract_type: 'Tư vấn BIM Di tích',
        law_applied: 'Luật Di sản văn hóa 2024, Luật Đấu thầu 2023',
        side_a_name: 'Sở Văn hóa và Thể thao Hà Nội',
        side_a_rep: 'Ông Phạm Văn Tuấn',
        side_a_position: 'Giám đốc Sở',
        side_a_mst: '0101234568',
        side_b_name: 'Công ty CP Tư vấn Xây dựng Chuyển đổi số',
        side_b_rep: 'Nguyễn Hoàng Hà',
        side_b_position: 'Tổng Giám đốc',
        side_b_mst: '0303456789',
        total_value: 1800000000,
        vat_included: true,
        advance_payment: 360000000, // 20%
        paid_value: 90000000, // Partial advance
        remaining_value: 1710000000,
        wip_value: 0,
        duration: '18 tháng',
        start_date: '2026-02-01',
        end_date: '2027-08-31',
        warranty_period: '36 tháng',
        main_tasks: [
            'Quét 3D Laser Scanning hiện trạng',
            'Mô hình BIM di tích LOD 350',
            'Bảo tồn số hóa di sản',
            'Heritage BIM database'
        ],
        status: 'Hiệu lực'
    },

    // Contract 5: Vinhomes Grand Park S1 - Main
    {
        id: 'CTR-NSB-001',
        project_id: 'PRJ-NSB-001',
        code: 'HĐ-VH-2024-S1',
        signed_date: '2024-06-15',
        package_name: 'Tư vấn BIM Toàn diện - Tòa S1',
        project_name: 'Vinhomes Grand Park - Tòa S1 (The Rainbow)',
        location: 'TP.Thủ Đức, TP.HCM',
        contract_type: 'Tư vấn BIM',
        law_applied: 'Bộ luật Dân sự 2015',
        side_a_name: 'Công ty Cổ phần Vinhomes',
        side_a_rep: 'Bà Nguyễn Thị Thu Hà',
        side_a_position: 'Phó Tổng Giám đốc',
        side_a_mst: '0106515830',
        side_a_staff: 'Ông Trần Quốc Việt - Giám đốc Dự án',
        side_b_name: 'Công ty CP Tư vấn Xây dựng Chuyển đổi số',
        side_b_rep: 'Nguyễn Hoàng Hà',
        side_b_position: 'Tổng Giám đốc',
        side_b_mst: '0303456789',
        side_b_bank: 'Vietcombank - STK: 0071234567890',
        total_value: 12000000000,
        vat_included: true,
        advance_payment: 3600000000, // 30%
        paid_value: 9600000000, // 80% completed
        remaining_value: 2400000000,
        wip_value: 0,
        duration: '24 tháng',
        start_date: '2024-07-01',
        end_date: '2026-06-30',
        warranty_period: '12 tháng',
        main_tasks: [
            'Mô hình BIM LOD 400 Kiến trúc, Kết cấu, MEP',
            'Phối hợp MEP integration',
            'Mô phỏng 4D/5D',
            'Hỗ trợ thi công',
            'As-built BIM model',
            'Facility Management handover'
        ],
        file_formats: 'RVT, IFC, NWD, PDF',
        delivery_method: 'BIM360/Autodesk Docs',
        acceptance_standard: 'Vinhomes BIM Standards V2.0',
        penalty_rate: '0.1%/ngày chậm',
        max_penalty: '15% giá trị hợp đồng',
        dispute_resolution: 'Hòa giải tại TP.HCM',
        status: 'Hiệu lực'
    },

    // Contract 6: Hòa Phát Dung Quất
    {
        id: 'CTR-NSB-002',
        project_id: 'PRJ-NSB-002',
        code: 'HĐ-HP-2023-DQ2',
        signed_date: '2023-03-20',
        package_name: 'Tư vấn BIM Công nghiệp - Giai đoạn 2',
        project_name: 'Nhà máy Gang thép Hòa Phát Dung Quất',
        location: 'Quảng Ngãi',
        contract_type: 'Tư vấn BIM Công nghiệp',
        law_applied: 'Bộ luật Dân sự 2015',
        side_a_name: 'Tập đoàn Hòa Phát',
        side_a_rep: 'Ông Trần Đình Long',
        side_a_position: 'Chủ tịch HĐQT',
        side_a_mst: '0100259885',
        side_a_staff: 'Ông Nguyễn Mạnh Tuấn - Giám đốc Kỹ thuật',
        side_b_name: 'Công ty CP Tư vấn Xây dựng Chuyển đổi số',
        side_b_rep: 'Nguyễn Hoàng Hà',
        side_b_position: 'Tổng Giám đốc',
        side_b_mst: '0303456789',
        total_value: 6500000000,
        vat_included: true,
        advance_payment: 1950000000, // 30%
        paid_value: 6200000000, // 95%+ paid (near completion)
        remaining_value: 300000000,
        wip_value: 0,
        duration: '30 tháng',
        start_date: '2023-04-01',
        end_date: '2025-10-31',
        warranty_period: '12 tháng',
        main_tasks: [
            'Mô hình BIM kết cấu thép LOD 400',
            'Phối hợp hệ thống công nghệ',
            'Steel detailing drawings',
            'As-built model',
            'Facility database'
        ],
        status: 'Hoàn thành'
    }
];

// ============================================
// PAYMENT MILESTONES
// ============================================
async function generatePaymentMilestones() {
    const milestones = [];

    // CTR-SB-001: Cầu Thủ Thiêm 4 - StateBudget (20-30-30-20)
    milestones.push(
        {
            contract_id: 'CTR-SB-001',
            phase: 'Tạm ứng',
            condition: 'Ký hợp đồng',
            percentage: 20,
            amount: 1700000000,
            due_date: '2025-02-15',
            status: 'Đã thanh toán',
            invoice_date: '2025-02-10',
            acceptance_product: 'Hợp đồng đã ký',
            completion_progress: 100
        },
        {
            contract_id: 'CTR-SB-001',
            phase: 'Đợt 2',
            condition: 'Hoàn thành Thiết kế Kỹ thuật, Thẩm định xong',
            percentage: 30,
            amount: 2550000000,
            due_date: '2026-06-30',
            status: 'Đang thực hiện',
            acceptance_product: 'Hồ sơ TKKT, Mô hình BIM LOD 350',
            completion_progress: 45
        },
        {
            contract_id: 'CTR-SB-001',
            phase: 'Đợt 3',
            condition: 'Hoàn thành hỗ trợ thi công',
            percentage: 30,
            amount: 2550000000,
            due_date: '2027-12-31',
            status: 'Chưa thanh toán',
            acceptance_product: 'Hồ sơ hoàn công, As-built model'
        },
        {
            contract_id: 'CTR-SB-001',
            phase: 'Quyết toán',
            condition: 'Nghiệm thu hoàn thành, bàn giao',
            percentage: 20,
            amount: 1700000000,
            due_date: '2028-06-30',
            status: 'Chưa thanh toán',
            acceptance_product: 'Biên bản nghiệm thu, FM data'
        }
    );

    // CTR-SB-002: Thẩm tra (20-80)
    milestones.push(
        {
            contract_id: 'CTR-SB-002',
            phase: 'Tạm ứng',
            condition: 'Ký hợp đồng',
            percentage: 20,
            amount: 170000000,
            due_date: '2025-03-10',
            status: 'Đã thanh toán',
            invoice_date: '2025-03-05',
            completion_progress: 100
        },
        {
            contract_id: 'CTR-SB-002',
            phase: 'Quyết toán',
            condition: 'Hoàn thành thẩm tra',
            percentage: 80,
            amount: 680000000,
            due_date: '2025-09-15',
            status: 'Chưa thanh toán'
        }
    );

    // CTR-SB-003: TTHC Quận 9 (20-30-30-20)
    milestones.push(
        {
            contract_id: 'CTR-SB-003',
            phase: 'Tạm ứng',
            condition: 'Ký hợp đồng',
            percentage: 20,
            amount: 840000000,
            due_date: '2025-02-10',
            status: 'Đã thanh toán',
            invoice_date: '2025-02-05',
            completion_progress: 100
        },
        {
            contract_id: 'CTR-SB-003',
            phase: 'Đợt 2',
            condition: 'Hoàn thành thẩm định',
            percentage: 30,
            amount: 1260000000,
            due_date: '2026-02-28',
            status: 'Chưa thanh toán',
            completion_progress: 20
        },
        {
            contract_id: 'CTR-SB-003',
            phase: 'Đợt 3',
            condition: 'Hoàn thành hỗ trợ QLDA',
            percentage: 30,
            amount: 1260000000,
            due_date: '2027-04-30',
            status: 'Chưa thanh toán'
        },
        {
            contract_id: 'CTR-SB-003',
            phase: 'Quyết toán',
            condition: 'Nghiệm thu',
            percentage: 20,
            amount: 840000000,
            due_date: '2027-09-30',
            status: 'Chưa thanh toán'
        }
    );

    // CTR-SB-004: Hồ Hoàn Kiếm (20-30-30-20)
    milestones.push(
        {
            contract_id: 'CTR-SB-004',
            phase: 'Tạm ứng',
            condition: 'Ký hợp đồng',
            percentage: 20,
            amount: 360000000,
            due_date: '2026-02-10',
            status: 'Thanh toán 1 phần',
            invoice_date: '2026-02-05',
            completion_progress: 25
        },
        {
            contract_id: 'CTR-SB-004',
            phase: 'Đợt 2',
            condition: 'Hoàn thành quét 3D và mô hình BIM',
            percentage: 30,
            amount: 540000000,
            due_date: '2026-10-31',
            status: 'Chưa thanh toán'
        }
    );

    // CTR-NSB-001: Vinhomes S1 - NonStateBudget (30-50-20)
    milestones.push(
        {
            contract_id: 'CTR-NSB-001',
            phase: 'Tạm ứng',
            condition: 'Ký hợp đồng',
            percentage: 30,
            amount: 3600000000,
            due_date: '2024-07-10',
            status: 'Đã thanh toán',
            invoice_date: '2024-07-05',
            completion_progress: 100
        },
        {
            contract_id: 'CTR-NSB-001',
            phase: 'Đợt 2',
            condition: 'Hoàn thành 50% tiến độ',
            percentage: 50,
            amount: 6000000000,
            due_date: '2025-06-30',
            status: 'Đã thanh toán',
            invoice_date: '2025-06-25',
            completion_progress: 100
        },
        {
            contract_id: 'CTR-NSB-001',
            phase: 'Quyết toán',
            condition: 'Nghiệm thu hoàn thành',
            percentage: 20,
            amount: 2400000000,
            due_date: '2026-07-31',
            status: 'Chưa thanh toán',
            completion_progress: 0
        }
    );

    // CTR-NSB-002: Hòa Phát DQ (30-50-20)
    milestones.push(
        {
            contract_id: 'CTR-NSB-002',
            phase: 'Tạm ứng',
            condition: 'Ký hợp đồng',
            percentage: 30,
            amount: 1950000000,
            due_date: '2023-04-10',
            status: 'Đã thanh toán',
            invoice_date: '2023-04-05',
            completion_progress: 100
        },
        {
            contract_id: 'CTR-NSB-002',
            phase: 'Đợt 2',
            condition: 'Hoàn thành mô hình BIM',
            percentage: 50,
            amount: 3250000000,
            due_date: '2024-12-31',
            status: 'Đã thanh toán',
            invoice_date: '2024-12-20',
            completion_progress: 100
        },
        {
            contract_id: 'CTR-NSB-002',
            phase: 'Quyết toán',
            condition: 'Nghiệm thu, bàn giao FM',
            percentage: 20,
            amount: 1300000000,
            due_date: '2025-11-30',
            status: 'Đã thanh toán',
            invoice_date: '2025-12-15',
            completion_progress: 100
        }
    );

    return milestones;
}

// ============================================
// PAYMENT TRANSACTIONS
// ============================================
async function generatePaymentTransactions() {
    return [
        // CTR-SB-001 Transactions
        {
            contract_id: 'CTR-SB-001',
            milestone_id: null,
            description: 'Tạm ứng đợt 1 - 20% giá trị hợp đồng',
            amount: 1700000000,
            payment_date: '2025-02-20',
            status: 'Đã thanh toán',
            invoice_number: 'VAT-2025-001',
            payment_method: 'Chuyển khoản',
            vat_rate: 8,
            notes: 'Thanh toán đúng hạn'
        },

        // CTR-SB-002 Transactions
        {
            contract_id: 'CTR-SB-002',
            description: 'Tạm ứng hợp đồng thẩm tra',
            amount: 170000000,
            payment_date: '2025-03-08',
            status: 'Đã thanh toán',
            invoice_number: 'VAT-2025-002',
            payment_method: 'Chuyển khoản',
            vat_rate: 8
        },

        // CTR-SB-003 Transactions
        {
            contract_id: 'CTR-SB-003',
            description: 'Tạm ứng 20%',
            amount: 840000000,
            payment_date: '2025-02-08',
            status: 'Đã thanh toán',
            invoice_number: 'VAT-2025-003',
            payment_method: 'Chuyển khoản',
            vat_rate: 8
        },

        // CTR-SB-004 Transactions
        {
            contract_id: 'CTR-SB-004',
            description: 'Tạm ứng 1 phần (25% trên tổng 20%)',
            amount: 90000000,
            payment_date: '2026-02-08',
            status: 'Đã thanh toán',
            invoice_number: 'VAT-2026-001',
            payment_method: 'Chuyển khoản',
            vat_rate: 8,
            notes: 'Tạm ứng theo tiến độ ký quỹ'
        },

        // CTR-NSB-001 Transactions  
        {
            contract_id: 'CTR-NSB-001',
            description: 'Tạm ứng 30%',
            amount: 3600000000,
            payment_date: '2024-07-12',
            status: 'Đã thanh toán',
            invoice_number: 'VAT-2024-VH-001',
            payment_method: 'Chuyển khoản',
            vat_rate: 10
        },
        {
            contract_id: 'CTR-NSB-001',
            description: 'Thanh toán đợt 2 - 50%',
            amount: 6000000000,
            payment_date: '2025-06-28',
            status: 'Đã thanh toán',
            invoice_number: 'VAT-2025-VH-002',
            payment_method: 'Chuyển khoản',
            vat_rate: 10,
            notes: 'Hoàn thành đúng tiến độ'
        },

        // CTR-NSB-002 Transactions
        {
            contract_id: 'CTR-NSB-002',
            description: 'Tạm ứng 30%',
            amount: 1950000000,
            payment_date: '2023-04-08',
            status: 'Đã thanh toán',
            invoice_number: 'VAT-2023-HP-001',
            payment_method: 'Chuyển khoản',
            vat_rate: 10
        },
        {
            contract_id: 'CTR-NSB-002',
            description: 'Thanh toán đợt 2 - 50%',
            amount: 3250000000,
            payment_date: '2024-12-22',
            status: 'Đã thanh toán',
            invoice_number: 'VAT-2024-HP-002',
            payment_method: 'Chuyển khoản',
            vat_rate: 10
        },
        {
            contract_id: 'CTR-NSB-002',
            description: 'Quyết toán hoàn thành - 20%',
            amount: 1300000000,
            payment_date: '2025-12-18',
            status: 'Đã thanh toán',
            invoice_number: 'VAT-2025-HP-003',
            payment_method: 'Chuyển khoản',
            vat_rate: 10,
            notes: 'Nghiệm thu đạt, thanh toán cuối cùng'
        }
    ];
}

async function seedContracts() {
    console.log('\n📝 Seeding Contracts...');

    for (const contract of CONTRACTS) {
        const { error } = await supabase
            .from('contracts')
            .insert(contract);

        if (error) {
            console.error(`   ❌ Error inserting ${contract.code}:`, error.message);
        } else {
            console.log(`   ✅ ${contract.code} - ${contract.package_name}`);
        }
    }
}

async function seedPaymentMilestones() {
    console.log('\n💰 Seeding Payment Milestones...');

    const milestones = await generatePaymentMilestones();
    let count = 0;

    for (const milestone of milestones) {
        const { error } = await supabase
            .from('payment_milestones')
            .insert({
                id: `PM-${String(count + 1).padStart(3, '0')}`,
                ...milestone
            });

        if (error) {
            console.error(`   ❌ Error:`, error.message);
        } else {
            count++;
        }
    }
    console.log(`   ✅ Created ${count} payment milestones`);
}

async function seedPaymentTransactions() {
    console.log('\n💸 Seeding Payment Transactions...');

    const transactions = await generatePaymentTransactions();
    let count = 0;

    for (const transaction of transactions) {
        const { error } = await supabase
            .from('payment_transactions')
            .insert({
                id: `PTX-${String(count + 1).padStart(3, '0')}`,
                ...transaction
            });

        if (error) {
            console.error(`   ❌ Error:`, error.message);
        } else {
            count++;
        }
    }
    console.log(`   ✅ Created ${count} payment transactions`);
}

async function main() {
    console.log('🚀 Starting Phase 2: Contracts & Payments Seeding...\n');
    console.log('='.repeat(50));

    try {
        await seedContracts();
        await seedPaymentMilestones();
        await seedPaymentTransactions();

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 PHASE 2 SUMMARY\n');

        const { count: contractCount } = await supabase.from('contracts').select('*', { count: 'exact', head: true });
        const { count: milestoneCount } = await supabase.from('payment_milestones').select('*', { count: 'exact', head: true });
        const { count: transactionCount } = await supabase.from('payment_transactions').select('*', { count: 'exact', head: true });

        console.log(`✅ Contracts:              ${contractCount}`);
        console.log(`✅ Payment Milestones:     ${milestoneCount}`);
        console.log(`✅ Payment Transactions:   ${transactionCount}`);
        console.log('\n🎉 Phase 2 seeding completed successfully!');
        console.log('='.repeat(50));

    } catch (error) {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    }
}

main();
