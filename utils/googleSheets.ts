
import { Project, ProjectStatus } from '../types';

// Mapping Vietnamese Headers to Typescript Properties
const HEADER_MAPPING: Record<string, keyof Project> = {
    'ID': 'id',
    'Mã Dự Án': 'code',
    'Tên Dự Án': 'name',
    'Khách Hàng': 'client',
    'Địa Điểm': 'location',
    'Quản Lý (PM)': 'manager',
    'Nguồn Vốn': 'capitalSource',
    'Nhóm Dự Án': 'projectGroup',
    'Loại Công Trình': 'constructionType',
    'Cấp Công Trình': 'constructionLevel',
    'Quy Mô': 'scale',
    'Trạng Thái': 'status',
    'Tiến Độ (%)': 'progress',
    'Ngân Sách (VNĐ)': 'budget',
    'Đã Chi (VNĐ)': 'spent',
    'Hạn Chót': 'deadline',
    'Số Thành Viên': 'members',
    'Link Ảnh (Thumb)': 'thumbnail'
};

// Define the precise order of columns for writing to Sheet
const COLUMN_ORDER: (keyof Project)[] = [
    'id', 'code', 'name', 'client', 'location', 'manager', 'capitalSource',
    'projectGroup', 'constructionType', 'constructionLevel', 'scale',
    'status', 'progress', 'budget', 'spent', 'deadline', 'members', 'thumbnail'
];

// CSV Parser that handles quoted strings containing commas
const parseCSVLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());
    return values.map(v => v.replace(/^"|"$/g, '')); // Remove surrounding quotes
};

export const fetchProjectsFromGoogleSheet = async (sheetId: string, gid: string = '0'): Promise<Project[]> => {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Lỗi kết nối mạng hoặc Sheet ID không tồn tại');
        
        const text = await response.text();

        // KIỂM TRA QUAN TRỌNG: Nếu Sheet chưa Public, Google trả về HTML trang login
        if (text.trim().startsWith('<!DOCTYPE html>') || text.includes('<html')) {
            throw new Error('PRIVATE_SHEET_DETECTED');
        }

        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length < 2) return []; // Only header or empty

        // Parse Headers
        const headers = parseCSVLine(lines[0]);
        const headerKeys = headers.map(h => HEADER_MAPPING[h] || h);

        // Parse Rows
        const projects: Project[] = lines.slice(1).map((line, index) => {
            const values = parseCSVLine(line);
            const projectObj: any = {};

            headerKeys.forEach((key, i) => {
                if (key) {
                    let value: any = values[i];
                    
                    // Type Conversion
                    if (key === 'progress' || key === 'members' || key === 'budget' || key === 'spent') {
                        value = Number(value?.replace(/\./g, '').replace(/,/g, '')) || 0;
                    }
                    
                    // Status Mapping Fallback
                    if (key === 'status') {
                        const validStatus = Object.values(ProjectStatus).includes(value as ProjectStatus);
                        if (!validStatus) value = ProjectStatus.PLANNING;
                    }

                    if (key === 'capitalSource') {
                         if (value !== 'StateBudget' && value !== 'NonStateBudget') value = 'StateBudget';
                    }

                    projectObj[key] = value;
                }
            });

            return {
                id: projectObj.id || `GS-${index}`,
                code: projectObj.code || '',
                name: projectObj.name || 'No Name',
                client: projectObj.client || '',
                location: projectObj.location || '',
                manager: projectObj.manager || '',
                capitalSource: projectObj.capitalSource || 'StateBudget',
                status: projectObj.status || ProjectStatus.PLANNING,
                progress: projectObj.progress || 0,
                budget: projectObj.budget || 0,
                spent: projectObj.spent || 0,
                deadline: projectObj.deadline || '',
                members: projectObj.members || 0,
                thumbnail: projectObj.thumbnail || `https://picsum.photos/seed/${index}/400/300`,
                projectGroup: projectObj.projectGroup,
                constructionType: projectObj.constructionType,
                constructionLevel: projectObj.constructionLevel,
                scale: projectObj.scale
            } as Project;
        });

        return projects;
    } catch (error: any) {
        if (error.message === 'PRIVATE_SHEET_DETECTED') {
            throw new Error('Sheet đang ở chế độ Riêng tư. Vui lòng chọn File > Share > Publish to web.');
        }
        console.error("Google Sheet Fetch Error:", error);
        throw error;
    }
};

export const saveProjectToGoogleSheet = async (project: Project, scriptUrl: string): Promise<boolean> => {
    try {
        // Convert Project object to array based on COLUMN_ORDER
        const rowData = COLUMN_ORDER.map(key => {
            const value = project[key];
            if (value === undefined || value === null) return '';
            return value;
        });

        // QUAN TRỌNG: Sử dụng mode 'no-cors'.
        // Điều này cho phép gửi dữ liệu đi (Opaque Request) ngay cả khi Google Apps Script redirect.
        // Nhược điểm: Không thể đọc phản hồi (response.json()), nhưng đảm bảo dữ liệu được gửi.
        await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors', 
            body: JSON.stringify(rowData),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
        });

        // Với no-cors, chúng ta luôn giả định thành công nếu không có lỗi mạng
        return true;
    } catch (error) {
        console.error("Save to Sheet Error:", error);
        return false;
    }
};
