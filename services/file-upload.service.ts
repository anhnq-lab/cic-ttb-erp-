import { supabase } from '../utils/supabaseClient';

/**
 * File Upload Service
 * Quản lý upload file đính kèm cho tasks lên Supabase Storage
 */

const STORAGE_BUCKET = 'task-attachments';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'application/vnd.ms-excel', // XLS
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/zip',
    'application/x-zip-compressed',
];

const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'png', 'jpg', 'jpeg', 'zip'];

interface FileValidationResult {
    valid: boolean;
    error?: string;
}

interface TaskAttachment {
    id: string;
    task_id: string;
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number;
    uploaded_by: string;
    uploaded_at: string;
    deleted_at?: string;
}

export const FileUploadService = {
    /**
     * Validate file trước khi upload
     */
    validateFile(file: File): FileValidationResult {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `File quá lớn. Kích thước tối đa: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
            };
        }

        // Check file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            // Fallback: check extension
            const extension = file.name.split('.').pop()?.toLowerCase();
            if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
                return {
                    valid: false,
                    error: `Loại file không hợp lệ. Chỉ chấp nhận: ${ALLOWED_EXTENSIONS.join(', ')}`
                };
            }
        }

        // Check file name length
        if (file.name.length > 255) {
            return {
                valid: false,
                error: 'Tên file quá dài (tối đa 255 ký tự)'
            };
        }

        return { valid: true };
    },

    /**
     * Upload file đính kèm lên Supabase Storage
     */
    async uploadTaskAttachment(
        taskId: string,
        file: File,
        uploadedBy: string
    ): Promise<TaskAttachment> {
        // Validate file
        const validation = this.validateFile(file);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        try {
            // Generate unique file name
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 8);
            const extension = file.name.split('.').pop();
            const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const storagePath = `${taskId}/${timestamp}-${randomStr}-${safeFileName}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(storagePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('[FileUpload] Upload error:', uploadError);
                throw new Error(`Lỗi upload file: ${uploadError.message}`);
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(storagePath);

            // Save attachment record to database
            const { data: attachment, error: dbError } = await supabase
                .from('task_attachments')
                .insert([{
                    task_id: taskId,
                    file_name: file.name,
                    file_url: publicUrl,
                    file_type: file.type,
                    file_size: file.size,
                    uploaded_by: uploadedBy
                }])
                .select()
                .single();

            if (dbError) {
                // Rollback: delete uploaded file
                await supabase.storage
                    .from(STORAGE_BUCKET)
                    .remove([storagePath]);

                console.error('[FileUpload] Database error:', dbError);
                throw new Error(`Lỗi lưu thông tin file: ${dbError.message}`);
            }

            console.log(`✅ File uploaded successfully: ${file.name}`);
            return attachment as TaskAttachment;
        } catch (error: any) {
            console.error('[FileUpload] Error:', error);
            throw error;
        }
    },

    /**
     * Upload nhiều files cùng lúc
     */
    async uploadMultipleAttachments(
        taskId: string,
        files: File[],
        uploadedBy: string
    ): Promise<TaskAttachment[]> {
        const results: TaskAttachment[] = [];
        const errors: string[] = [];

        for (const file of files) {
            try {
                const attachment = await this.uploadTaskAttachment(taskId, file, uploadedBy);
                results.push(attachment);
            } catch (error: any) {
                errors.push(`${file.name}: ${error.message}`);
            }
        }

        if (errors.length > 0) {
            console.warn('[FileUpload] Some files failed:', errors);
        }

        return results;
    },

    /**
     * Lấy danh sách attachments của task
     */
    async getTaskAttachments(taskId: string): Promise<TaskAttachment[]> {
        const { data, error } = await supabase
            .from('task_attachments')
            .select('*')
            .eq('task_id', taskId)
            .is('deleted_at', null)
            .order('uploaded_at', { ascending: false });

        if (error) {
            console.error('[FileUpload] Error fetching attachments:', error);
            throw error;
        }

        return data as TaskAttachment[];
    },

    /**
     * Lấy URL download của attachment
     */
    async getAttachmentUrl(attachmentId: string): Promise<string> {
        const { data, error } = await supabase
            .from('task_attachments')
            .select('file_url')
            .eq('id', attachmentId)
            .single();

        if (error) {
            console.error('[FileUpload] Error fetching attachment URL:', error);
            throw error;
        }

        return data.file_url;
    },

    /**
     * Xóa attachment (soft delete)
     */
    async deleteAttachment(attachmentId: string, deletedBy: string): Promise<void> {
        const { error } = await supabase
            .from('task_attachments')
            .update({
                deleted_at: new Date().toISOString(),
                deleted_by: deletedBy
            })
            .eq('id', attachmentId);

        if (error) {
            console.error('[FileUpload] Error deleting attachment:', error);
            throw error;
        }

        console.log(`✅ Attachment ${attachmentId} soft deleted`);
    },

    /**
     * Xóa vĩnh viễn attachment (hard delete - chỉ cho admin)
     */
    async permanentlyDeleteAttachment(attachmentId: string): Promise<void> {
        // Get file URL to delete from storage
        const { data: attachment, error: fetchError } = await supabase
            .from('task_attachments')
            .select('file_url')
            .eq('id', attachmentId)
            .single();

        if (fetchError) {
            throw fetchError;
        }

        // Extract storage path from URL
        const url = new URL(attachment.file_url);
        const pathParts = url.pathname.split('/');
        const storagePath = pathParts.slice(pathParts.indexOf(STORAGE_BUCKET) + 1).join('/');

        // Delete from storage
        const { error: storageError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([storagePath]);

        if (storageError) {
            console.error('[FileUpload] Error deleting from storage:', storageError);
        }

        // Delete from database
        const { error: dbError } = await supabase
            .from('task_attachments')
            .delete()
            .eq('id', attachmentId);

        if (dbError) {
            console.error('[FileUpload] Error deleting from database:', dbError);
            throw dbError;
        }

        console.log(`✅ Attachment ${attachmentId} permanently deleted`);
    },

    /**
     * Khôi phục attachment đã xóa
     */
    async restoreAttachment(attachmentId: string): Promise<void> {
        const { error } = await supabase
            .from('task_attachments')
            .update({
                deleted_at: null,
                deleted_by: null
            })
            .eq('id', attachmentId);

        if (error) {
            console.error('[FileUpload] Error restoring attachment:', error);
            throw error;
        }

        console.log(`✅ Attachment ${attachmentId} restored`);
    },

    /**
     * Format file size cho hiển thị
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Lấy icon cho file type
     */
    getFileIcon(fileName: string): string {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const iconMap: Record<string, string> = {
            pdf: '📄',
            doc: '📝',
            docx: '📝',
            xls: '📊',
            xlsx: '📊',
            png: '🖼️',
            jpg: '🖼️',
            jpeg: '🖼️',
            zip: '📦',
        };
        return iconMap[extension || ''] || '📎';
    }
};

export default FileUploadService;
