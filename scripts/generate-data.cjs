// Script to generate TypeScript constants from Excel data
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '..', 'BIM - Digital Twin 2025.xlsx');
console.log('Reading file:', filePath);

try {
    const workbook = XLSX.readFile(filePath);

    // Helper to convert Excel date serial to JS date string
    const excelDateToString = (serial) => {
        if (!serial || typeof serial !== 'number') return '2025-01-01';
        const date = new Date((serial - 25569) * 86400 * 1000);
        return date.toISOString().split('T')[0];
    };

    // Helper to format currency
    const formatNumber = (num) => {
        if (!num || isNaN(num)) return 0;
        return Number(num);
    };

    // Read DuAn (Projects) sheet
    const duAnSheet = workbook.Sheets['DuAn'];
    const duAnData = XLSX.utils.sheet_to_json(duAnSheet);

    // Read HopDong (Contracts) sheet  
    const hopDongSheet = workbook.Sheets['HopDong'];
    const hopDongData = XLSX.utils.sheet_to_json(hopDongSheet);

    // Select 10 representative projects with good data
    const selectedProjectIds = [
        'K8CT1', 'K8HH1', 'K2CT1', 'H1HH1', 'B1CC4',
        'LOTT-PL26', 'LOTT-PL24', 'LOTT-PL22', 'LOTT-PL21', 'LOTT-PL23'
    ];

    const projectMap = new Map();
    duAnData.forEach(p => projectMap.set(p.ID_DuAn, p));

    // Generate PROJECTS array (10 projects)
    const projects = selectedProjectIds.map((id, idx) => {
        const p = projectMap.get(id) || {};
        const relatedContract = hopDongData.find(c => c.TenDuAn === id);

        return {
            id: id,
            code: `25${String(idx + 1).padStart(3, '0')}`,
            name: p.TenDuAn || id,
            client: relatedContract?.BenA || 'Chưa xác định',
            location: 'Hồ Chí Minh',
            manager: 'NV006',
            projectGroup: 'BIM',
            constructionType: p.LoaiCongTrinh || 'Dân dụng',
            constructionLevel: p.CapCongTrinh || 'I',
            scale: p.DienTich ? `${formatNumber(p.DienTich).toLocaleString()} m²` : 'N/A',
            capitalSource: 'NonStateBudget',
            status: p.GiaiDoan?.includes('đang') ? 'InProgress' : 'Planning',
            progress: Math.floor(Math.random() * 50) + 30,
            budget: relatedContract?.GiaTriHopDong || 1000000000,
            spent: relatedContract?.['Tổng giá trị thanh toán'] || 0,
            deadline: excelDateToString(relatedContract?.NgayHetHan),
            members: [],
            description: p.PhamViCongViec || ''
        };
    });

    // Generate CONTRACTS array (10 contracts)
    const contracts = hopDongData.slice(0, 10).map((c, idx) => {
        return {
            id: `C${String(idx + 1).padStart(3, '0')}`,
            contractNumber: c.SoHopDong,
            projectId: c.TenDuAn || selectedProjectIds[idx % selectedProjectIds.length],
            type: c.LoaiHopDong || 'Tư vấn BIM',
            partyA: c.BenA || 'N/A',
            partyARepresentative: c.NguoiDaiDienBenA || 'N/A',
            partyB: 'Công ty CP Công nghệ và Tư vấn CIC',
            partyBRepresentative: c.NguoiDaiDienBenB || 'Nguyễn Hoàng Hà',
            signedDate: excelDateToString(c.NgayKy),
            effectiveDate: excelDateToString(c.NgayHieuLuc || c.NgayKy),
            expiryDate: excelDateToString(c.NgayHetHan),
            totalValue: formatNumber(c.GiaTriHopDong),
            paidValue: formatNumber(c['Tổng giá trị thanh toán']),
            status: c.TrangThai?.includes('Đang') ? 'Active' :
                c.TrangThai?.includes('Hoàn thành') ? 'Completed' : 'Draft',
            description: c.TaskCongViec || c.PhamViCongViec || '',
            constructionType: c.LoaiCongTrinh || 'Dân dụng',
            constructionLevel: c.CapCongTrinh || 'I',
            capitalSource: c.NguonVon || 'Vốn khác'
        };
    });

    // Extract unique customers from contracts
    const customerMap = new Map();
    hopDongData.forEach(c => {
        if (c.BenA && !customerMap.has(c.BenA)) {
            customerMap.set(c.BenA, {
                id: c.BenA,
                name: c.BenA,
                representative: c.NguoiDaiDienBenA || 'N/A',
                type: 'Doanh nghiệp'
            });
        }
    });

    const customers = Array.from(customerMap.values()).slice(0, 10);

    // Output the results
    console.log('\n// ============= PROJECTS =============');
    console.log('export const PROJECTS_FROM_EXCEL: Project[] = ');
    console.log(JSON.stringify(projects, null, 2));

    console.log('\n// ============= CONTRACTS =============');
    console.log('export const CONTRACTS_FROM_EXCEL: Contract[] = ');
    console.log(JSON.stringify(contracts, null, 2));

    console.log('\n// ============= CUSTOMERS =============');
    console.log('export const CUSTOMERS_FROM_EXCEL = ');
    console.log(JSON.stringify(customers, null, 2));

    // Write to a file
    const outputContent = `// Auto-generated from BIM - Digital Twin 2025.xlsx
// Generated on: ${new Date().toISOString()}

export const PROJECTS_FROM_EXCEL = ${JSON.stringify(projects, null, 2)};

export const CONTRACTS_FROM_EXCEL = ${JSON.stringify(contracts, null, 2)};

export const CUSTOMERS_FROM_EXCEL = ${JSON.stringify(customers, null, 2)};
`;

    fs.writeFileSync(path.join(__dirname, 'generated-data.ts'), outputContent, 'utf8');
    console.log('\n✅ Generated data saved to scripts/generated-data.ts');

} catch (error) {
    console.error('Error:', error);
}
