import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Sample legal documents for different project types
const LEGAL_DOCUMENT_TEMPLATES = {
    StateBudget: [
        {
            document_type: 'license',
            document_name: 'Giấy phép xây dựng',
            document_number: 'GPXD-2024-001',
            issuing_authority: 'Sở Xây dựng',
            status: 'valid'
        },
        {
            document_type: 'approval',
            document_name: 'Quyết định phê duyệt dự án',
            document_number: 'QĐ-2024-123',
            issuing_authority: 'UBND Tỉnh',
            status: 'valid'
        },
        {
            document_type: 'permit',
            document_name: 'Giấy phép môi trường',
            document_number: 'GPMT-2024-045',
            issuing_authority: 'Sở Tài nguyên và Môi trường',
            status: 'valid'
        },
        {
            document_type: 'certificate',
            document_name: 'Chứng nhận đủ điều kiện an toàn lao động',
            document_number: 'CN-ATLĐ-2024-078',
            issuing_authority: 'Sở Lao động - Thương binh và Xã hội',
            status: 'valid'
        }
    ],
    NonStateBudget: [
        {
            document_type: 'license',
            document_name: 'Giấy phép xây dựng',
            document_number: 'GPXD-2024-002',
            issuing_authority: 'Sở Xây dựng',
            status: 'valid'
        },
        {
            document_type: 'approval',
            document_name: 'Văn bản chấp thuận đầu tư',
            document_number: 'VB-2024-456',
            issuing_authority: 'Sở Kế hoạch và Đầu tư',
            status: 'valid'
        },
        {
            document_type: 'permit',
            document_name: 'Giấy phép PCCC',
            document_number: 'GP-PCCC-2024-089',
            issuing_authority: 'Cảnh sát PCCC',
            status: 'valid'
        }
    ]
};

// Sample compliance checks
const COMPLIANCE_CHECK_TEMPLATES = [
    {
        check_type: 'safety',
        check_name: 'Kiểm tra an toàn lao động định kỳ',
        inspector_organization: 'Thanh tra Sở Lao động',
        status: 'passed',
        score: 92
    },
    {
        check_type: 'environmental',
        check_name: 'Kiểm tra môi trường công trình',
        inspector_organization: 'Sở Tài nguyên và Môi trường',
        status: 'passed',
        score: 88
    },
    {
        check_type: 'quality',
        check_name: 'Kiểm tra chất lượng thi công',
        inspector_organization: 'Tư vấn giám sát',
        status: 'conditional',
        score: 75,
        findings: 'Phát hiện một số vị trí thi công chưa đạt yêu cầu kỹ thuật',
        actions_required: 'Sửa chữa và kiểm tra lại trong vòng 7 ngày'
    },
    {
        check_type: 'legal',
        check_name: 'Kiểm tra tuân thủ pháp luật xây dựng',
        inspector_organization: 'Thanh tra Sở Xây dựng',
        status: 'passed',
        score: 95
    }
];

async function seedLegalData() {
    console.log('🚀 Seeding legal documents and compliance checks...\n');

    // Get all projects
    const { data: projects, error: prjError } = await supabase
        .from('projects')
        .select('id, code, name, capital_source');

    if (prjError) {
        console.error('❌ Error fetching projects:', prjError);
        return;
    }

    console.log(`📊 Found ${projects.length} projects\n`);

    let totalDocs = 0;
    let totalChecks = 0;

    // For each project, seed legal documents and compliance checks
    for (const project of projects) {
        const capitalSource = project.capital_source || 'NonStateBudget';
        const templates = LEGAL_DOCUMENT_TEMPLATES[capitalSource] || LEGAL_DOCUMENT_TEMPLATES.NonStateBudget;

        // Seed legal documents
        const documents = templates.map(template => {
            const issueDate = new Date();
            issueDate.setMonth(issueDate.getMonth() - Math.floor(Math.random() * 12));

            const expiryDate = new Date(issueDate);
            expiryDate.setFullYear(expiryDate.getFullYear() + 2);

            return {
                project_id: project.id,
                ...template,
                issue_date: issueDate.toISOString().split('T')[0],
                expiry_date: expiryDate.toISOString().split('T')[0],
                notes: `Tài liệu pháp lý cho dự án ${project.name}`
            };
        });

        const { error: docError } = await supabase
            .from('project_legal_documents')
            .insert(documents);

        if (docError) {
            console.error(`❌ Error seeding documents for ${project.code}:`, docError.message);
        } else {
            console.log(`✅ [${project.code}] ${documents.length} legal documents`);
            totalDocs += documents.length;
        }

        // Seed compliance checks (2-3 checks per project)
        const numChecks = 2 + Math.floor(Math.random() * 2);
        const checks = COMPLIANCE_CHECK_TEMPLATES.slice(0, numChecks).map(template => {
            const checkDate = new Date();
            checkDate.setDate(checkDate.getDate() - Math.floor(Math.random() * 90));

            return {
                project_id: project.id,
                ...template,
                check_date: checkDate.toISOString().split('T')[0],
                inspector_name: 'Thanh tra viên ' + Math.floor(Math.random() * 100)
            };
        });

        const { error: checkError } = await supabase
            .from('project_compliance_checks')
            .insert(checks);

        if (checkError) {
            console.error(`❌ Error seeding checks for ${project.code}:`, checkError.message);
        } else {
            console.log(`   ✅ ${checks.length} compliance checks`);
            totalChecks += checks.length;
        }
    }

    console.log(`\n🎉 Seeded ${totalDocs} legal documents and ${totalChecks} compliance checks for ${projects.length} projects!`);
}

seedLegalData();
