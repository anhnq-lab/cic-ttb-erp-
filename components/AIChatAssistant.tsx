import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, ChevronRight, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { GeminiService } from '../services/GeminiService';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isStreaming?: boolean;
}

const SUGGESTION_CHIPS = [
    "Dự án Cầu Thủ Thiêm 4 đang thế nào?",
    "Ai là quản lý dự án P-007?",
    "Quy trình nghiệm thu cốt thép?",
    "Tổng ngân sách các dự án?"
];

// Simple Markdown Formatter
const formatMessage = (text: string) => {
    let formatted = text;
    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Code
    formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
    // Headers (###)
    formatted = formatted.replace(/### (.*?)(\n|$)/g, '<h3 class="font-bold text-lg mb-2 mt-3 text-indigo-700">$1</h3>');
    // Lists
    formatted = formatted.replace(/- (.*?)(\n|$)/g, '<li class="ml-4 list-disc">$1</li>');
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br/>');

    return formatted;
};

const AIChatAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Xin chào! Tôi là **CIC Gemini Assistant**. \nBạn cần tra cứu thông tin gì về dự án hay nhân sự hôm nay?', sender: 'bot', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        // 1. User Message
        const userMsg: Message = { id: Date.now().toString(), text: textToSend, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // 2. AI Processing mock
            // In a real app with streaming, we would consume the generator
            // For this Frontend-Only Refactor, we simulate the "wait" then "stream"

            const fullResponse = await GeminiService.chat(textToSend, []);
            setIsTyping(false);

            // 3. Streaming Effect Simulation
            const words = fullResponse.split(' ');
            let currentText = '';
            const botMsgId = (Date.now() + 1).toString();

            setMessages(prev => [...prev, { id: botMsgId, text: '', sender: 'bot', timestamp: new Date(), isStreaming: true }]);

            for (let i = 0; i < words.length; i++) {
                // Add word with matching punctuation spacing roughly
                currentText += words[i] + ' ';

                // Update specific message
                setMessages(prev => prev.map(m =>
                    m.id === botMsgId ? { ...m, text: currentText } : m
                ));

                // Typing delay
                await new Promise(r => setTimeout(r, 30));
            }

            // Finish
            setMessages(prev => prev.map(m =>
                m.id === botMsgId ? { ...m, isStreaming: false, text: fullResponse } : m
            ));

        } catch (e) {
            console.error(e);
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Xin lỗi, tôi gặp sự cố kết nối.', sender: 'bot', timestamp: new Date() }]);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 animate-bounce-slow group"
                >
                    <Sparkles size={24} className="text-white group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={`fixed z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-10 transition-all duration-300
                    ${isExpanded ? 'bottom-6 right-6 w-[800px] h-[80vh] max-w-[calc(100vw-48px)]' : 'bottom-6 right-6 w-96 h-[500px] max-w-[calc(100vw-48px)]'}
                `}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-4 flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 relative backdrop-blur-sm">
                                <Sparkles size={20} className="text-amber-400" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">CIC Gemini Assistant</h3>
                                <p className="text-[10px] text-indigo-200 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-1.5 text-indigo-200 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start items-start gap-3'}`}>
                                {msg.sender === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
                                        <Sparkles size={14} className="text-indigo-600" />
                                    </div>
                                )}

                                <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${msg.sender === 'user'
                                    ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-tr-none'
                                    : 'bg-white border border-gray-100 text-slate-700 rounded-tl-none'
                                    }`}>
                                    {msg.sender === 'bot' ? (
                                        <div
                                            className="prose prose-sm max-w-none text-slate-700 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                                        />
                                    ) : (
                                        <p className="whitespace-pre-line">{msg.text}</p>
                                    )}

                                    <p className={`text-[9px] mt-1 text-right italic ${msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
                                    <Loader2 size={14} className="text-indigo-600 animate-spin" />
                                </div>
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions Area */}
                    {messages.length === 1 && (
                        <div className="px-4 pb-2 bg-slate-50 flex gap-2 overflow-x-auto no-scrollbar">
                            {SUGGESTION_CHIPS.map((chip, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(chip)}
                                    className="whitespace-nowrap px-3 py-1.5 bg-white border border-indigo-100 rounded-full text-xs text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors shadow-sm"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all shadow-inner"
                                placeholder="Hỏi Gemini về dự án của bạn..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={isTyping}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isTyping}
                                className="absolute right-2 top-2 p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-gray-400 mt-2 flex justify-center items-center gap-1">
                            Powered by <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Google Gemini</span> (Mock Mode)
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatAssistant;
