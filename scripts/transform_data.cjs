
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'excel-data-output.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

// Helper to parse Excel date serial
function parseExcelDate(serial) {
    if (!serial || typeof serial !== 'number') return new Date().toISOString().split('T')[0];
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return date_info.toISOString().split('T')[0];
}

// Helper to map status
function mapProjectStatus(statusStr) {
    if (!statusStr) return 'InProgress';
    if (statusStr.includes('đang thực hiện')) return 'InProgress';
    if (statusStr.includes('hoàn thành')) return 'Completed';
    if (statusStr.includes('tiềm năng')) return 'Planning';
    if (statusStr.includes('tạm dừng')) return 'Paused';
    return 'InProgress';
}

function mapContractStatus(statusStr) {
    if (!statusStr) return 'Active';
    if (statusStr.includes('đang thực hiện')) return 'Active';
    if (statusStr.includes('hoàn thành') || statusStr.includes('thanh lý')) return 'Completed';
    return 'Active';
}

// 1. Process CUSTOMERS (Extract from HopDong BenA)
const customersMap = new Map();
const contracts = data.HopDong ? data.HopDong.sample : [];
const projects = data.DuAn ? data.DuAn.sample : [];

let custIdCounter = 1;

// Extract from Contracts
contracts.forEach(c => {
    const name = c.BenA;
    if (name && !customersMap.has(name)) {
        customersMap.set(name, {
            id: `CUST-${String(custIdCounter++).padStart(3, '0')}`,
            code: `CUST-${String(custIdCounter).padStart(3, '0')}`,
            name: name,
            shortName: name.length > 20 ? name.substring(0, 20) + '...' : name,
            type: 'Client',
            category: 'Construction',
            taxCode: '',
            address: '',
            representative: c.NguoiDaiDienBenA || '',
            contactPerson: '',
            email: '',
            phone: '',
            status: 'Active',
            tier: 'Standard',
            totalProjectValue: 0,
            rating: 4,
            evaluation: 'Từ dữ liệu nhập'
        });
    }
    // Update value
    if (customersMap.has(name)) {
        const ag = customersMap.get(name);
        ag.totalProjectValue += (c.GiaTriHopDong || 0);
    }
});

// Extract from Projects (ChuDauTu might be ID or Name)
projects.forEach(p => {
    // If ChuDauTu is just ID, we skip strict mapping if we can't find name, 
    // but here we just process if it looks like a name. 
    // Actually in the json sample ChuDauTu was "ID029" (Daewoo).
    // So we might miss meaningful names if we only have IDs. 
    // But HopDong has full names.
});

const CUSTOMERS = Array.from(customersMap.values());

// 2. Process PROJECTS
const PROJECTS = projects.map(p => {
    return {
        id: p.ID_DuAn || `P-${Math.random().toString(36).substr(2, 5)}`,
        code: p.ID_DuAn,
        name: p.TenDuAn,
        client: p.ChuDauTu, // Might need to map ID to Name if possible, but keeping invalid ID is ok for now
        location: 'Việt Nam', // Placeholder
        manager: p.NguoiPhuTrach, // Mapped to code like NV006
        projectGroup: 'BIM',
        constructionType: p.LoaiCongTrinh,
        constructionLevel: p.CapCongTrinh,
        scale: p.DienTich ? `${p.DienTich} m2` : '',
        capitalSource: 'NonStateBudget',
        status: mapProjectStatus(p.GiaiDoan),
        progress: 0,
        budget: 0,
        spent: 0,
        deadline: new Date().getFullYear() + 1 + '-12-31',
        members: 5,
        thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=60'
    };
});

// 3. Process CONTRACTS
const CONTRACTS = contracts.map(c => {
    // Find customer
    const cust = customersMap.get(c.BenA);
    const total = c.GiaTriHopDong || 0;
    const paid = c['Tổng giá trị thanh toán'] || 0;

    return {
        id: c.SoHopDong || `C-${Math.random().toString(36).substr(2, 5)}`,
        code: c.SoHopDong,
        projectName: c.TenDuAn, // This is actually Project Code often in the excel data
        projectId: c.TenDuAn, // Using same as name for linking
        sideAName: c.BenA,
        sideARep: c.NguoiDaiDienBenA,
        sideAPosition: '',
        sideAMst: '',
        sideAStaff: '',
        sideBName: c.BenB || 'CIC',
        sideBRep: c.NguoiDaiDienBenB,
        sideBPosition: '',
        sideBMst: '',
        sideBBank: '',
        packageName: c.LoaiHopDong,
        signedDate: parseExcelDate(c.NgayKy),
        startDate: parseExcelDate(c.NgayHieuLuc),
        endDate: parseExcelDate(c.NgayHetHan),
        duration: '',
        totalValue: total,
        paidValue: paid,
        remainingValue: total - paid,
        wipValue: 0,
        vatIncluded: true,
        advancePayment: 0,
        status: mapContractStatus(c.TrangThai),
        contractType: 'Output',
        capitalSource: c.NguonVon === 'Vốn đầu tư công' ? 'StateBudget' : 'NonStateBudget',
        constructionType: c.LoaiCongTrinh,
        deliveryMethod: '',
        penaltyRate: '',
        maxPenalty: '',
        disputeResolution: '',
        warrantyPeriod: '',
        fileUrl: c.File,
        mainTasks: c.TaskCongViec ? [c.TaskCongViec] : [],
        fileFormats: '',
        acceptanceStandard: '',
        lawApplied: '',
        location: '',
        personnel: [],
        paymentMilestones: [],
        transactions: [],
        content: c.TaskCongViec,
        driveLink: c.Link || c.Folder
    };
});






const type = process.argv[2];
const HEADER = `import { Project, Contract, Customer, ContractStatus, ProjectStatus } from '../types';\n\n`;

function writeFile(filename, varName, data) {
    const content = HEADER + `export const ${varName} = ` + JSON.stringify(data, null, 2) + ';';
    const filePath = path.join(__dirname, '../constants_data', filename);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Written to ${filePath}`);
}

if (type === 'customers') {
    writeFile('customers.ts', 'CUSTOMERS', CUSTOMERS);
} else if (type === 'projects') {
    writeFile('projects.ts', 'PROJECTS', PROJECTS);
} else if (type === 'contracts') {
    writeFile('contracts.ts', 'CONTRACTS', CONTRACTS);
} else {
    // Write all
    writeFile('customers.ts', 'CUSTOMERS', CUSTOMERS);
    writeFile('projects.ts', 'PROJECTS', PROJECTS);
    writeFile('contracts.ts', 'CONTRACTS', CONTRACTS);
}


