import { ProjectCost } from '../types';

export const MOCK_PROJECT_COSTS: ProjectCost[] = [
    // --- P-002 (Hạ tầng KCN Trấn Yên) ---
    {
        id: 'C-001',
        projectId: 'P-002',
        category: 'Travel',
        description: 'Vé máy bay khứ hồi HN-SG (Team Khảo sát)',
        amount: 12500000,
        date: '2024-02-15',
        spender: 'Nguyễn Văn A',
        status: 'Approved',
        notes: 'VJ Air, 3 người'
    },
    {
        id: 'C-002',
        projectId: 'P-002',
        category: 'Travel',
        description: 'Khách sạn (3 phòng x 2 đêm)',
        amount: 4200000,
        date: '2024-02-16',
        spender: 'Nguyễn Văn A',
        status: 'Approved',
        notes: 'Khách sạn Mường Thanh'
    },
    {
        id: 'C-003',
        projectId: 'P-002',
        category: 'Outsource',
        description: 'Thuê team dựng hình BIM chi tiết MEP',
        amount: 45000000,
        date: '2024-03-01',
        spender: 'Trần Thị B',
        status: 'Approved',
        notes: 'Công ty Cổ phần Địa chất 123'
    },
    {
        id: 'C-004',
        projectId: 'P-002',
        category: 'Other',
        description: 'Tiếp khách & Ăn trưa Kick-off',
        amount: 3500000,
        date: '2024-01-20',
        spender: 'Lê Văn C',
        status: 'Approved'
    },
    {
        id: 'C-005',
        projectId: 'P-002',
        category: 'Equipment',
        description: 'Mua bản quyền phần mềm Civil 3D (1 Year)',
        amount: 28000000,
        date: '2024-01-10',
        spender: 'Phạm Văn D',
        status: 'Approved',
        notes: 'License cho team Hạ tầng'
    },
    {
        id: 'C-006',
        projectId: 'P-002',
        category: 'Outsource',
        description: 'In ấn hồ sơ 3 bộ (A1)',
        amount: 1200000,
        date: '2024-04-05',
        spender: 'Team Admin',
        status: 'Pending'
    },

    // --- P-001 (Dân dụng) ---
    {
        id: 'C-010',
        projectId: 'P-001',
        category: 'Equipment',
        description: 'Nâng cấp RAM máy trạm BIM',
        amount: 8000000,
        date: '2024-01-05',
        spender: 'IT Support',
        status: 'Approved'
    },
    {
        id: 'C-011',
        projectId: 'P-001',
        category: 'Outsource',
        description: 'Thuê chuyên gia tư vấn kết cấu đặc biệt',
        amount: 15000000,
        date: '2024-02-20',
        spender: 'GĐTT',
        status: 'Approved'
    }
];
