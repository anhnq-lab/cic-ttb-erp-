/**
 * Seed CRM Data - Phase 4 (Final)
 * Creates Contacts, Activities, and Opportunities for customers
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

// Helper to get date offset
function getDateOffset(daysOffset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
}

// ============================================
// CRM CONTACTS
// ============================================
const CRM_CONTACTS = [
    // Ban QLDA Giao thông HCM
    { customer_id: 'CUST-001', name: 'Bà Trần Thị Bình', position: 'Phó phòng Kỹ thuật', email: 'tran.binh@tphcm.gov.vn', phone: '028 3829 4568', is_primary: true },
    { customer_id: 'CUST-001', name: 'Ông Lê Văn Dũng', position: 'Chuyên viên Kỹ thuật', email: 'le.dung@tphcm.gov.vn', phone: '028 3829 4569', is_primary: false },

    // Sở VH&TT Hà Nội
    { customer_id: 'CUST-002', name: 'Bà Nguyễn Thị Mai', position: 'Phó Giám đốc', email: 'nguyen.mai@hanoi.gov.vn', phone: '024 3825 6790', is_primary: true },
    { customer_id: 'CUST-002', name: 'Ông Hoàng Văn Tú', position: 'Trưởng phòng Dự án', email: 'hoang.tu@hanoi.gov.vn', phone: '024 3825 6791', is_primary: false },

    // Ban QLDA KV5
    { customer_id: 'CUST-003', name: 'Ông Trần Minh Hoàng', position: 'Phó Ban', email: 'tran.hoang@moc.gov.vn', phone: '028 3776 5433', is_primary: true },

    // Sở XD Hà Nội
    { customer_id: 'CUST-004', name: 'Bà Phạm Thị Lan', position: 'Phó Giám đốc', email: 'pham.lan@hanoi.gov.vn', phone: '024 3733 4568', is_primary: true },

    // Vinhomes
    { customer_id: 'CUST-005', name: 'Ông Trần Quốc Việt', position: 'Giám đốc Dự án', email: 'viet.tq@vinhomes.vn', phone: '1900 23 23 90', is_primary: true },
    { customer_id: 'CUST-005', name: 'Bà Lê Thị Hồng', position: 'Trưởng phòng Kỹ thuật', email: 'hong.lt@vinhomes.vn', phone: '1900 23 23 91', is_primary: false },
    { customer_id: 'CUST-005', name: 'Ông Nguyễn Đức Anh', position: 'BIM Manager', email: 'anh.nd@vinhomes.vn', phone: '1900 23 23 92', is_primary: false },

    // Vingroup
    { customer_id: 'CUST-006', name: 'Bà Lê Thị Hương', position: 'Giám đốc Phát triển', email: 'huong.lt@vingroup.net', phone: '024 3974 9991', is_primary: true },
    { customer_id: 'CUST-006', name: 'Ông Phạm Quốc Tuấn', position: 'Deputy Director', email: 'tuan.pq@vingroup.net', phone: '024 3974 9992', is_primary: false },

    // Novaland
    { customer_id: 'CUST-007', name: 'Bà Trần Thị Phương', position: 'Phó Giám đốc Dự án', email: 'phuong.tt@novaland.com.vn', phone: '028 3823 8001', is_primary: true },
    { customer_id: 'CUST-007', name: 'Ông Vũ Minh Quang', position: 'Technical Manager', email: 'quang.vm@novaland.com.vn', phone: '028 3823 8002', is_primary: false },

    // Hòa Phát
    { customer_id: 'CUST-008', name: 'Ông Nguyễn Mạnh Tuấn', position: 'Giám đốc Kỹ thuật', email: 'tuan.nm@hoaphat.com.vn', phone: '024 6281 8889', is_primary: true },
    { customer_id: 'CUST-008', name: 'Ông Lê Công Minh', position: 'Project Manager', email: 'minh.lc@hoaphat.com.vn', phone: '024 6281 8890', is_primary: false },

    // Coteccons
    { customer_id: 'CUST-009', name: 'Bà Võ Thị Nga', position: 'Phó Giám đốc', email: 'nga.vt@coteccons.vn', phone: '028 3815 5123', is_primary: true },

    // Masterise
    { customer_id: 'CUST-010', name: 'Ông Lê Văn Đức', position: 'Giám đốc Phát triển', email: 'duc.lv@masterise.com', phone: '028 6292 5556', is_primary: true }
];

// ============================================
// CRM ACTIVITIES
// ============================================
const CRM_ACTIVITIES = [
    // CUST-001 Activities
    { customer_id: 'CUST-001', type: 'Meeting', date: getDateOffset(-45), title: 'Họp khởi động dự án Cầu Thủ Thiêm 4', description: 'Thảo luận phạm vi công việc, timeline, BEP', created_by: 'NV004' },
    { customer_id: 'CUST-001', type: 'Call', date: getDateOffset(-20), title: 'Điện thoại trao đổi tiến độ', description: 'Cập nhật progress 35%, bàn thẩm định', created_by: 'NV004' },
    { customer_id: 'CUST-001', type: 'Email', date: getDateOffset(-5), title: 'Gửi báo cáo tiến độ tháng 12', description: 'Báo cáo chi tiết progress, clash detection results', created_by: 'NV006' },

    // CUST-002 Activities
    { customer_id: 'CUST-002', type: 'Meeting', date: getDateOffset(-60), title: 'Thuyết trình năng lực công ty', description: 'Giới thiệu portfolio, BIM capabilities', created_by: 'NV004' },
    { customer_id: 'CUST-002', type: 'Meeting', date: getDateOffset(-10), title: 'Họp review thiết kế Hồ Hoàn Kiếm', description: '3D scanning plan, heritage BIM approach', created_by: 'NV005' },

    // CUST-003 Activities
    { customer_id: 'CUST-003', type: 'Call', date: getDateOffset(-90), title: 'Trao đổi cơ hội hợp tác', description: 'Bàn về các dự án sắp tới KV5', created_by: 'NV004' },

    // CUST-004 Activities
    { customer_id: 'CUST-004', type: 'Meeting', date: getDateOffset(-30), title: 'Họp kick-off TTHC Quận 9', description: 'Setup CDE, BEP discussion', created_by: 'NV015' },
    { customer_id: 'CUST-004', type: 'Email', date: getDateOffset(-7), title: 'Gửi progress report', description: 'Update 20% completion', created_by: 'NV015' },

    // CUST-005 Activities (Vinhomes)
    { customer_id: 'CUST-005', type: 'Meeting', date: getDateOffset(-400), title: 'Ký hợp đồng Vinhomes S1', description: 'Contract signing ceremony, BEP approval', created_by: 'NV002' },
    { customer_id: 'CUST-005', type: 'Meeting', date: getDateOffset(-200), title: 'Review MEP coordination', description: 'MEP clash resolution meeting', created_by: 'NV012' },
    { customer_id: 'CUST-005', type: 'Meal', date: getDateOffset(-15), title: 'Tiệc tri ân khách hàng', description: 'Dinner để củng cố quan hệ', created_by: 'NV002' },
    { customer_id: 'CUST-005', type: 'Email', date: getDateOffset(-3), title: 'Gửi As-built model draft', description: 'Preliminary FM database', created_by: 'NV005' },

    // CUST-006 Activities (Vingroup)
    { customer_id: 'CUST-006', type: 'Meeting', date: getDateOffset(-120), title: 'Thuyết trình dự án tiềm năng', description: 'Pitch for new mixed-use project', created_by: 'NV002' },
    { customer_id: 'CUST-006', type: 'Call', date: getDateOffset(-50), title: 'Follow-up cơ hội hợp tác', description: 'Discuss ongoing tender', created_by: 'NV004' },

    // CUST-007 Activities (Novaland)
    { customer_id: 'CUST-007', type: 'Meeting', date: getDateOffset(-180), title: 'Họp tư vấn BIM standards', description: 'BIM implementation roadmap', created_by: 'NV005' },

    // CUST-008 Activities (Hòa Phát)
    { customer_id: 'CUST-008', type: 'Meeting', date: getDateOffset(-600), title: 'Kick-off Nhà máy DQ GĐ2', description: 'Project initiation', created_by: 'NV015' },
    { customer_id: 'CUST-008', type: 'Meeting', date: getDateOffset(-30), title: 'Nghiệm thu hoàn thành', description: 'Final acceptance meeting', created_by: 'NV015' },
    { customer_id: 'CUST-008', type: 'Email', date: getDateOffset(-10), title: 'Gửi hồ sơ hoàn công', description: 'As-built documentation', created_by: 'NV005' },

    // CUST-009 Activities
    { customer_id: 'CUST-009', type: 'Call', date: getDateOffset(-100), title: 'Trao đổi hợp tác tiềm năng', description: 'BIM services for upcoming projects', created_by: 'NV004' },

    // CUST-010 Activities
    { customer_id: 'CUST-010', type: 'Meeting', date: getDateOffset(-75), title: 'Thuyết trình portfolio', description: 'Company capabilities presentation', created_by: 'NV004' }
];

// ============================================
// CRM OPPORTUNITIES
// ============================================
const CRM_OPPORTUNITIES = [
    // Won opportunities (existing projects)
    { customer_id: 'CUST-001', name: 'Cầu Thủ Thiêm 4 - Tư vấn BIM', value: 8500000000, stage: 'Won', probability: 100, expected_close_date: '2025-01-15' },
    { customer_id: 'CUST-002', name: 'Hồ Hoàn Kiếm - BIM Di tích', value: 1800000000, stage: 'Won', probability: 100, expected_close_date: '2026-01-05' },
    { customer_id: 'CUST-004', name: 'TTHC Quận 9 - BIM & Thẩm tra', value: 4200000000, stage: 'Won', probability: 100, expected_close_date: '2025-01-10' },
    { customer_id: 'CUST-005', name: 'Vinhomes Grand Park S1', value: 12000000000, stage: 'Won', probability: 100, expected_close_date: '2024-06-15' },
    { customer_id: 'CUST-008', name: 'Hòa Phát Dung Quất GĐ2', value: 6500000000, stage: 'Won', probability: 100, expected_close_date: '2023-03-20' },

    // Pipeline opportunities
    { customer_id: 'CUST-001', name: 'Cầu Thủ Thiêm 2 - QLDA', value: 2500000000, stage: 'Qualification', probability: 40, expected_close_date: getDateOffset(90) },
    { customer_id: 'CUST-003', name: 'Nhà ga Metro Số 2', value: 3800000000, stage: 'Proposal', probability: 60, expected_close_date: getDateOffset(60) },
    { customer_id: 'CUST-005', name: 'Vinhomes Ocean Park 3 - Tower A', value: 15000000000, stage: 'Negotiation', probability: 75, expected_close_date: getDateOffset(45) },
    { customer_id: 'CUST-006', name: 'VinFast Factory - BIM Consulting', value: 25000000000, stage: 'Proposal', probability: 50, expected_close_date: getDateOffset(120) },
    { customer_id: 'CUST-007', name: 'Novaland - Aqua City Phase 2', value: 8500000000, stage: 'Qualification', probability: 45, expected_close_date: getDateOffset(150) },
    { customer_id: 'CUST-009', name: 'Coteccons - BIM Training Program', value: 800000000, stage: 'New', probability: 25, expected_close_date: getDateOffset(180) },
    { customer_id: 'CUST-010', name: 'Masterise - Grand Marina 2', value: 10500000000, stage: 'Proposal', probability: 55, expected_close_date: getDateOffset(100) }
];

async function seedCRMContacts() {
    console.log('\n👥 Seeding CRM Contacts...');

    let count = 0;
    for (const contact of CRM_CONTACTS) {
        const { error } = await supabase
            .from('crm_contacts')
            .insert(contact);

        if (error) {
            console.error(`   ❌ Error:`, error.message);
        } else {
            count++;
        }
    }
    console.log(`   ✅ Created ${count} contacts`);
}

async function seedCRMActivities() {
    console.log('\n📅 Seeding CRM Activities...');

    let count = 0;
    for (const activity of CRM_ACTIVITIES) {
        const { error } = await supabase
            .from('crm_activities')
            .insert(activity);

        if (error) {
            console.error(`   ❌ Error:`, error.message);
        } else {
            count++;
        }
    }
    console.log(`   ✅ Created ${count} activities`);
}

async function seedCRMOpportunities() {
    console.log('\n💼 Seeding CRM Opportunities...');

    let count = 0;
    for (const opp of CRM_OPPORTUNITIES) {
        const { error } = await supabase
            .from('crm_opportunities')
            .insert(opp);

        if (error) {
            console.error(`   ❌ Error:`, error.message);
        } else {
            count++;
        }
    }
    console.log(`   ✅ Created ${count} opportunities`);
}

async function main() {
    console.log('🚀 Starting Phase 4: CRM Data Seeding...\n');
    console.log('='.repeat(50));

    try {
        await seedCRMContacts();
        await seedCRMActivities();
        await seedCRMOpportunities();

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 PHASE 4 SUMMARY\n');

        const { count: contactCount } = await supabase.from('crm_contacts').select('*', { count: 'exact', head: true });
        const { count: activityCount } = await supabase.from('crm_activities').select('*', { count: 'exact', head: true });
        const { count: opportunityCount } = await supabase.from('crm_opportunities').select('*', { count: 'exact', head: true });

        console.log(`✅ CRM Contacts:        ${contactCount}`);
        console.log(`✅ CRM Activities:      ${activityCount}`);
        console.log(`✅ CRM Opportunities:   ${opportunityCount}`);
        console.log('\n🎉 Phase 4 (FINAL) seeding completed successfully!');
        console.log('='.repeat(50));

    } catch (error) {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    }
}

main();
