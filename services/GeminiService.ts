import { GoogleGenerativeAI } from '@google/generative-ai';
import { PROJECTS, TASKS, EMPLOYEES } from '../constants';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Context builder for the AI
const buildContext = () => {
    return `
You are an intelligent assistant for the CIC TTB ERP system (BIM Center).
Current Data Context:
- Projects: ${PROJECTS.length} active projects including ${PROJECTS.map(p => p.name).join(', ')}.
- Employees: ${EMPLOYEES.length} staff members.
- Key Personnel: ${EMPLOYEES.slice(0, 5).map(e => `${e.name} (${e.role})`).join(', ')}.

Your capabilities:
1. Construct concise, helpful answers about projects, contracts, and personnel.
2. If asked about specific data not in your context, politely explain you are limited to the ERP data.
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
    chat: async (query: string, messageHistory: any[]): Promise<string> => {
        if (!API_KEY) {
            console.warn('Gemini API Key missing. Using mock response.');
            return mockChat(query);
        }

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const history = messageHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const chat = model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: buildContext() }] // Prime the model with context
                    },
                    {
                        role: 'model',
                        parts: [{ text: "Đã hiểu. Tôi sẵn sàng hỗ trợ thông tin về dự án, nhân sự và quy trình của CIC." }]
                    },
                    ...history
                ]
            });

            const result = await chat.sendMessage(query);
            return result.response.text();

        } catch (error) {
            console.error('Gemini API Error:', error);
            return "Xin lỗi, hiện tại tôi không thể kết nối với hệ thống AI. Vui lòng thử lại sau.";
        }
    },

    streamResponse: async function* (query: string) {
        if (!API_KEY) {
            const response = await mockChat(query);
            yield response;
            return;
        }

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

