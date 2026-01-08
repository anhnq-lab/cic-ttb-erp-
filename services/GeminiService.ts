import { PROJECTS, TASKS, EMPLOYEES } from '../constants';

export interface GeminiResponse {
    text: string;
    sources?: any[];
}

// Simulate AI processing delay and streaming
export const GeminiService = {
    chat: async (query: string, messageHistory: any[]): Promise<string> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const lowerQuery = query.toLowerCase();
        let response = '';

        // 1. PROJECT SEARCH INTENT
        if (lowerQuery.includes('dự án') || lowerQuery.includes('project')) {
            const matchedProjects = PROJECTS.filter(p =>
                lowerQuery.includes(p.name.toLowerCase()) ||
                lowerQuery.includes(p.code.toLowerCase())
            );

            if (matchedProjects.length > 0) {
                const p = matchedProjects[0];
                response = `### Thông tin Dự án: ${p.name}
**Mã dự án**: \`${p.code}\`
**Trạng thái**: ${p.status}
**Tiến độ**: ${p.progress}%
**Ngân sách**: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.budget)}

**Mô tả**:
Dự án này đang được quản lý bởi **${p.manager}**. Hiện tại đang trong giai đoạn **${p.constructionType}**.

**Các công việc gần đây**:
${TASKS.filter(t => t.projectId === p.id).slice(0, 3).map(t => `- [x] ${t.name}`).join('\n')}
`;
            } else {
                response = `Tôi không tìm thấy dự án nào khớp với yêu cầu của bạn. 
Hiện tại hệ thống có các dự án tiêu biểu như:
${PROJECTS.slice(0, 3).map(p => `- **${p.name}** (${p.code})`).join('\n')}
`;
            }
        }

        // 2. PERSONNEL SEARCH INTENT
        else if (lowerQuery.includes('nhân sự') || lowerQuery.includes('ai là') || lowerQuery.includes('liên hệ')) {
            if (lowerQuery.includes('bim')) {
                const bimTeam = EMPLOYEES.filter(e => e.role.includes('BIM'));
                response = `### Đội ngũ BIM Modelers
Dưới đây là danh sách các chuyên gia BIM của chúng ta:

| Tên | Vai trò | Phòng ban |
|-----|---------|-----------|
${bimTeam.map(e => `| ${e.name} | ${e.role} | ${e.department} |`).join('\n')}
`;
            } else {
                response = `Hệ thống nhân sự hiện có **${EMPLOYEES.length}** thành viên. Bạn có thể hỏi cụ thể về bộ phận BIM, QA/QC hoặc tên cụ thể.`;
            }
        }

        // 3. KNOWLEDGE / SOP INTENT
        else if (lowerQuery.includes('quy trình') || lowerQuery.includes('nghiệm thu') || lowerQuery.includes('checklist')) {
            response = `### Quy trình Nghiệm thu (SOP)
Dựa trên kho tri thức nội bộ, quy trình nghiệm thu bao gồm các bước sau:

1. **Chuẩn bị**: Kiểm tra bản vẽ shopdrawing đã được phê duyệt.
2. **Kiểm tra hiện trường**:
   - Sử dụng Checklist Mẫu (CL-001, CL-002...).
   - Chụp ảnh hiện trạng.
3. **Ký biên bản**: Mời TVGS nghiệm thu và ký biên bản số.

> **Lưu ý**: Tuyệt đối không nghiệm thu nếu thiếu hồ sơ vật liệu đầu vào.
`;
        }

        // 4. DEFAULT GENERAL CHAT
        else {
            response = `Chào bạn! Tôi là **CIC Gemini Assistant**. Tôi có thể giúp gì cho bạn hôm nay?
Bạn có thể hỏi tôi về:
- *Thông tin dự án (tiến độ, ngân sách)*
- *Nhân sự và phòng ban*
- *Quy trình làm việc và biểu mẫu*
`;
        }

        return response;
    },

    // Mock Streaming: Returns a generator or simply we simulate chunks in UI,
    // but here we just return full text for simplicity in "Frontend-Only" phase 1 of AI.
    // For advanced feel, we can split text into chunks.
    streamResponse: async function* (query: string) {
        const fullResponse = await this.chat(query, []);
        const chunkSize = 10;

        for (let i = 0; i < fullResponse.length; i += chunkSize) {
            await new Promise(resolve => setTimeout(resolve, 30)); // Typing effect
            yield fullResponse.slice(i, i + chunkSize);
        }
    }
};
