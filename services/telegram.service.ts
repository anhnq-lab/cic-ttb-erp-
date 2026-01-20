import { supabase } from '../utils/supabaseClient';

/**
 * Telegram Bot Configuration and Service
 * Gửi thông báo tự động qua Telegram khi có task mới, cập nhật, hoặc hoàn thành
 */

export const TELEGRAM_CONFIG = {
    BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
    CHAT_ID: import.meta.env.VITE_TELEGRAM_CHAT_ID || '',
    ENABLED: import.meta.env.VITE_TELEGRAM_NOTIFICATIONS_ENABLED === 'true',
    API_URL: 'https://api.telegram.org/bot',
};

interface TelegramMessage {
    chat_id: string;
    text: string;
    parse_mode: 'HTML' | 'Markdown';
    disable_notification?: boolean;
}

export const TelegramBot = {
    /**
     * Gửi message tới Telegram
     */
    async sendMessage(text: string, chatId?: string, silent = false): Promise<boolean> {
        if (!TELEGRAM_CONFIG.ENABLED) {
            console.log('[Telegram] Notifications disabled in config');
            return false;
        }

        if (!TELEGRAM_CONFIG.BOT_TOKEN) {
            console.error('[Telegram] BOT_TOKEN not configured');
            return false;
        }

        try {
            const url = `${TELEGRAM_CONFIG.API_URL}${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;

            const message: TelegramMessage = {
                chat_id: chatId || TELEGRAM_CONFIG.CHAT_ID,
                text: text,
                parse_mode: 'HTML',
                disable_notification: silent,
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message),
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('[Telegram] Failed to send message:', error);
                return false;
            }

            const result = await response.json();
            console.log('[Telegram] Message sent successfully:', result.result.message_id);
            return true;
        } catch (error) {
            console.error('[Telegram] Error sending message:', error);
            return false;
        }
    },

    /**
     * Test connection với Telegram Bot
     */
    async testConnection(): Promise<boolean> {
        if (!TELEGRAM_CONFIG.BOT_TOKEN) {
            console.error('[Telegram] BOT_TOKEN not configured');
            return false;
        }

        try {
            const url = `${TELEGRAM_CONFIG.API_URL}${TELEGRAM_CONFIG.BOT_TOKEN}/getMe`;
            const response = await fetch(url);

            if (!response.ok) {
                console.error('[Telegram] Bot connection failed');
                return false;
            }

            const result = await response.json();
            console.log('[Telegram] Bot connected:', result.result.username);
            return true;
        } catch (error) {
            console.error('[Telegram] Connection test failed:', error);
            return false;
        }
    },
};

/**
 * Notification Service
 * Gửi các loại thông báo khác nhau
 */
export const NotificationService = {
    /**
     * Thông báo khi tạo task mới
     */
    async notifyTaskCreated(task: any, project: any, assignee: any): Promise<void> {
        const message = `
🆕 <b>CÔNG VIỆC MỚI</b>

📋 <b>${task.name}</b>
🏗 Dự án: ${project.name}
👤 Người thực hiện: ${assignee.name}
⏰ Hạn hoàn thành: ${task.dueDate || 'Chưa xác định'}
🎯 Ưu tiên: ${task.priority}

📝 Mã task: <code>${task.code}</code>
        `.trim();

        await TelegramBot.sendMessage(message);
    },

    /**
     * Thông báo khi task được cập nhật
     */
    async notifyTaskUpdated(task: any, changes: string[], updatedBy: string): Promise<void> {
        const changesText = changes.map(c => `• ${c}`).join('\n');

        const message = `
🔄 <b>CẬP NHẬT CÔNG VIỆC</b>

📋 <b>${task.name}</b>
👤 Cập nhật bởi: ${updatedBy}

<b>Thay đổi:</b>
${changesText}

📝 Mã task: <code>${task.code}</code>
        `.trim();

        await TelegramBot.sendMessage(message, undefined, true);
    },

    /**
     * Thông báo khi task hoàn thành
     */
    async notifyTaskCompleted(task: any, completedBy: any): Promise<void> {
        const message = `
✅ <b>HOÀN THÀNH CÔNG VIỆC</b>

📋 <b>${task.name}</b>
👤 Hoàn thành bởi: ${completedBy.name}
⏱ Tiến độ: ${task.progress}%

🎉 Chúc mừng hoàn thành!

📝 Mã task: <code>${task.code}</code>
        `.trim();

        await TelegramBot.sendMessage(message);
    },

    /**
     * Thông báo deadline sắp tới
     */
    async notifyDeadlineApproaching(task: any, assignee: any, daysLeft: number): Promise<void> {
        const urgency = daysLeft <= 1 ? '🔴 KHẨN CẤP' : '⚠️ SẮP ĐẾN HẠN';

        const message = `
${urgency}

📋 <b>${task.name}</b>
👤 Người thực hiện: ${assignee.name}
⏰ Còn lại: <b>${daysLeft} ngày</b>
📅 Hạn: ${task.dueDate}
⏱ Tiến độ hiện tại: ${task.progress}%

📝 Mã task: <code>${task.code}</code>
        `.trim();

        await TelegramBot.sendMessage(message);
    },

    /**
     * Thông báo khi có comment mới
     */
    async notifyNewComment(task: any, comment: any, author: any): Promise<void> {
        const message = `
💬 <b>BÌNH LUẬN MỚI</b>

📋 Task: <b>${task.name}</b>
👤 ${author.name}:

"${comment.content}"

📝 Mã task: <code>${task.code}</code>
        `.trim();

        await TelegramBot.sendMessage(message, undefined, true);
    },

    /**
     * Thông báo khi có file đính kèm mới
     */
    async notifyNewAttachment(task: any, attachment: any, uploadedBy: any): Promise<void> {
        const message = `
📎 <b>FILE MỚI</b>

📋 Task: <b>${task.name}</b>
👤 Upload bởi: ${uploadedBy.name}
📄 File: ${attachment.file_name} (${formatFileSize(attachment.file_size)})

📝 Mã task: <code>${task.code}</code>
        `.trim();

        await TelegramBot.sendMessage(message, undefined, true);
    },
};

/**
 * Helper: Format file size
 */
function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default { TelegramBot, NotificationService };
