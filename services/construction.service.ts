import { supabase } from '../utils/supabaseClient';

export interface ConstructionLog {
    id: string;
    project_id: string;
    log_date: string;
    weather?: string;
    temperature?: number;
    workers_count?: number;
    equipment_used?: string[];
    work_completed?: string;
    issues?: string;
    photos?: string[];
    created_at?: string;
    updated_at?: string;
    logged_by?: string;
    logged_by_name?: string;
}

export interface QualityInspection {
    id: string;
    project_id: string;
    inspection_date: string;
    inspection_type: 'Vật liệu đầu vào' | 'Nghiệm thu công việc' | 'Nghiệm thu giai đoạn' | string;
    location?: string;
    inspector_id?: string;
    inspector_name?: string;
    result: 'passed' | 'failed' | 'pending' | 'conditional';
    findings?: string;
    actions_required?: string;
    deadline?: string;
    is_resolved?: boolean;
    resolved_date?: string;
    photos?: string[];
    report_url?: string;
    created_at?: string;
    updated_at?: string;
}

export class ConstructionService {
    // ========== CONSTRUCTION LOGS ==========

    static async getLogs(projectId: string): Promise<ConstructionLog[]> {
        try {
            const { data, error } = await supabase
                .from('construction_logs')
                .select('*')
                .eq('project_id', projectId)
                .order('log_date', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching construction logs:', error);
            return [];
        }
    }

    static async getLogById(id: string): Promise<ConstructionLog | null> {
        try {
            const { data, error } = await supabase
                .from('construction_logs')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching construction log:', error);
            return null;
        }
    }

    static async createLog(log: Partial<ConstructionLog>): Promise<ConstructionLog | null> {
        try {
            const { data, error } = await supabase
                .from('construction_logs')
                .insert(log)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating construction log:', error);
            return null;
        }
    }

    static async updateLog(id: string, updates: Partial<ConstructionLog>): Promise<ConstructionLog | null> {
        try {
            const { data, error } = await supabase
                .from('construction_logs')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating construction log:', error);
            return null;
        }
    }

    static async deleteLog(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('construction_logs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting construction log:', error);
            return false;
        }
    }

    // ========== QUALITY INSPECTIONS ==========

    static async getInspections(projectId: string): Promise<QualityInspection[]> {
        try {
            const { data, error } = await supabase
                .from('quality_inspections')
                .select('*')
                .eq('project_id', projectId)
                .order('inspection_date', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching inspections:', error);
            return [];
        }
    }

    static async getInspectionById(id: string): Promise<QualityInspection | null> {
        try {
            const { data, error } = await supabase
                .from('quality_inspections')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching inspection:', error);
            return null;
        }
    }

    static async createInspection(inspection: Partial<QualityInspection>): Promise<QualityInspection | null> {
        try {
            const { data, error } = await supabase
                .from('quality_inspections')
                .insert(inspection)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating inspection:', error);
            return null;
        }
    }

    static async updateInspection(id: string, updates: Partial<QualityInspection>): Promise<QualityInspection | null> {
        try {
            const { data, error } = await supabase
                .from('quality_inspections')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating inspection:', error);
            return null;
        }
    }

    static async deleteInspection(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('quality_inspections')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting inspection:', error);
            return false;
        }
    }

    // ========== ANALYTICS ==========

    static async getConstructionSummary(projectId: string) {
        try {
            const [logs, inspections] = await Promise.all([
                this.getLogs(projectId),
                this.getInspections(projectId)
            ]);

            // Calculate safe working days (no accidents/issues reported in logs)
            // This is a simplification; normally 'issues' field would be parsed or a separate field used
            const safeDays = logs.filter(l => !l.issues).length;

            const inspectionsByResult = inspections.reduce((acc, ins) => {
                acc[ins.result] = (acc[ins.result] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const totalWorkers = logs.reduce((sum, log) => sum + (log.workers_count || 0), 0);
            const avgWorkers = logs.length > 0 ? Math.round(totalWorkers / logs.length) : 0;

            return {
                totalLogs: logs.length,
                totalInspections: inspections.length,
                safeDays,
                inspectionsByResult,
                avgWorkers,
                latestLog: logs[0] || null,
                latestInspection: inspections[0] || null
            };
        } catch (error) {
            console.error('Error getting construction summary:', error);
            return null;
        }
    }
}
