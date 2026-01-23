import { GoogleGenerativeAI } from '@google/generative-ai';
import { PROJECTS, TASKS, EMPLOYEES } from '../constants';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Context builder for the AI
const buildContext = (projects: any[] = [], employees: any[] = []) => {
    // If no real data passed, fallback to imported constants (or empty)
    const pList = projects.length > 0 ? projects : PROJECTS;
    const eList = employees.length > 0 ? employees : EMPLOYEES;

    return `
You are an intelligent assistant for the CIC TTB ERP system (BIM Center).
Current Data Context:
- Projects: ${pList.length} active projects. ${pList.slice(0, 10).map(p => `- ${p.name} (Code: ${p.code}, Status: ${p.status})`).join('\n')}
- Employees: ${eList.length} staff members. ${eList.slice(0, 5).map(e => `- ${e.name} (${e.role})`).join('\n')}

Your capabilities:
1. Construct concise, helpful answers about projects, contracts, and personnel based on the context above.
2. If asked about specific data not in your context, politely explain you are limited to the provided ERP data.
3. Use Vietnamese language.
`;
};

// Fallback logic for when API is missing
const mockChat = async (query: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('dự án') || lowerQuery.includes('project')) {
        return `[MOCK] Hệ thống có ${PROJECTS.length} dự án. Dự án gần nhất là ${PROJECTS[0].name}. (Vui lòng cấu hình VITE_GEMINI_API_KEY để có câu trả lời thông minh hơn)`;
    }
    if (lowerQuery.includes('nhân sự') || lowerQuery.includes('ai là')) {
        return `[MOCK] Hệ thống có ${EMPLOYEES.length} nhân sự. (Vui lòng cấu hình VITE_GEMINI_API_KEY để có câu trả lời thông minh hơn)`;
    }
    return `Chào bạn! Tôi là CIC Gemini Assistant (Mock Mode). Vui lòng thêm API Key để kích hoạt trí tuệ nhân tạo thực sự.`;
};

export const GeminiService = {
    chat: async (query: string, messageHistory: any[], contextData?: { projects?: any[], employees?: any[] }): Promise<string> => {
        if (!API_KEY || API_KEY.includes('PLACEHOLDER')) {
            console.warn('Gemini API Key missing or invalid. Using mock response.');
            return mockChat(query);
        }

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

            const history = messageHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const chat = model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: buildContext(contextData?.projects, contextData?.employees) }]
                    },
                    {
                        role: 'model',
                        parts: [{ text: "Đã hiểu. Tôi sẵn sàng hỗ trợ thông tin về dự án, nhân sự và quy trình của CIC dựa trên dữ liệu thực tế." }]
                    },
                    ...history
                ]
            });

            const result = await chat.sendMessage(query);
            return result.response.text();

        } catch (error: any) {
            console.error('------- GEMINI API ERROR -------');
            console.error('Message:', error.message);
            console.error('Full Error:', error);
            if (error.response) {
                console.error('API Response:', error.response);
            }
            console.error('--------------------------------');
            return `Xin lỗi, hiện tại tôi không thể kết nối với hệ thống AI. (Lỗi: ${error.message || 'Unknown'})`;
        }
    },

    streamResponse: async function* (query: string) {
        if (!API_KEY || API_KEY.includes('PLACEHOLDER')) {
            const response = await mockChat(query);
            yield response;
            return;
        }

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const chat = model.startChat({
                history: [
                    { role: 'user', parts: [{ text: buildContext() }] },
                    { role: 'model', parts: [{ text: "Sẵn sàng." }] }
                ]
            });

            const result = await chat.sendMessageStream(query);
            for await (const chunk of result.stream) {
                yield chunk.text();
            }
        } catch (error) {
            yield "Lỗi kết nối AI.";
        }
    }
};

