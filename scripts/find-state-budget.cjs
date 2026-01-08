// Script to find state budget projects from Ban QLDA
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '..', 'BIM - Digital Twin 2025.xlsx');

try {
    const workbook = XLSX.readFile(filePath);

    // Read HopDong (Contracts) sheet  
    const hopDongSheet = workbook.Sheets['HopDong'];
    const hopDongData = XLSX.utils.sheet_to_json(hopDongSheet);

    console.log('\n=== STATE BUDGET CONTRACTS (Vốn đầu tư công) ===\n');

    const stateBudgetContracts = hopDongData.filter(c =>
        c.NguonVon && (
            c.NguonVon.includes('đầu tư công') ||
            c.NguonVon.includes('nhà nước') ||
            c.NguonVon.includes('NSNN')
        )
    );

    console.log(`Found ${stateBudgetContracts.length} state budget contracts\n`);

    // Display unique clients for state budget
    const uniqueClients = [...new Set(stateBudgetContracts.map(c => c.BenA))];
    console.log('Unique clients (Ban QLDA):');
    uniqueClients.forEach((client, i) => console.log(`  ${i + 1}. ${client}`));

    console.log('\n--- Top 15 State Budget Contracts ---\n');
    stateBudgetContracts.slice(0, 15).forEach((c, i) => {
        console.log(`${i + 1}. ${c.SoHopDong}`);
        console.log(`   Dự án: ${c.TenDuAn}`);
        console.log(`   Khách hàng: ${c.BenA}`);
        console.log(`   Giá trị: ${(c.GiaTriHopDong / 1000000).toFixed(0)} triệu`);
        console.log(`   Loại CT: ${c.LoaiCongTrinh}`);
        console.log(`   Nguồn vốn: ${c.NguonVon}`);
        console.log('');
    });

    // Read DuAn (Projects) sheet
    const duAnSheet = workbook.Sheets['DuAn'];
    const duAnData = XLSX.utils.sheet_to_json(duAnSheet);

    console.log('\n=== ALL PROJECTS OVERVIEW ===\n');
    console.log(`Total projects: ${duAnData.length}\n`);

    // Group by LoaiCongTrinh
    const byType = {};
    duAnData.forEach(p => {
        const type = p.LoaiCongTrinh || 'Unknown';
        if (!byType[type]) byType[type] = [];
        byType[type].push(p);
    });

    Object.entries(byType).forEach(([type, projects]) => {
        console.log(`${type}: ${projects.length} projects`);
    });

    console.log('\n--- Sample Projects by Category ---\n');

    // Show diverse projects
    const diverseProjects = [];
    Object.entries(byType).forEach(([type, projects]) => {
        if (projects.length > 0 && type !== 'Unknown') {
            diverseProjects.push(...projects.slice(0, 2));
        }
    });

    diverseProjects.slice(0, 20).forEach((p, i) => {
        console.log(`${i + 1}. [${p.ID_DuAn}] ${p.TenDuAn}`);
        console.log(`   Loại: ${p.LoaiCongTrinh} | CĐT: ${p.ChuDauTu} | Giai đoạn: ${p.GiaiDoan}`);
    });

    // Write state budget contracts to file
    const output = {
        stateBudgetContracts: stateBudgetContracts.slice(0, 20),
        diverseProjects: diverseProjects.slice(0, 20)
    };

    fs.writeFileSync(
        path.join(__dirname, 'state-budget-data.json'),
        JSON.stringify(output, null, 2),
        'utf8'
    );
    console.log('\n✅ Data saved to scripts/state-budget-data.json');

} catch (error) {
    console.error('Error:', error);
}
