import { supabase } from '../utils/supabaseClient';

export interface LegalDocument {
    id: string;
    project_id: string;
    document_type: 'license' | 'permit' | 'approval' | 'certificate' | 'contract';
    document_name: string;
    document_number?: string;
    issuing_authority?: string;
    issued_by?: string;
    issue_date?: string;
    expiry_date?: string;
    status: 'valid' | 'expired' | 'pending' | 'rejected';
    file_url?: string;
    file_path?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}

export interface ComplianceCheck {
    id: string;
    project_id: string;
    check_type: 'safety' | 'environmental' | 'quality' | 'legal' | 'financial';
    check_name: string;
    check_date: string;
    inspector_id?: string;
    inspector_name?: string;
    inspector_organization?: string;
    status: 'passed' | 'failed' | 'pending' | 'conditional';
    score?: number;
    findings?: string;
    violations?: string[];
    recommendations?: string[];
    actions_required?: string;
    deadline?: string;
    is_resolved?: boolean;
    resolved_date?: string;
    resolved_by?: string;
    report_url?: string;
    photos?: string[];
    created_at?: string;
    updated_at?: string;
}

export class LegalService {
    // ========== LEGAL DOCUMENTS ==========

    static async getLegalDocuments(projectId: string): Promise<LegalDocument[]> {
        try {
            const { data, error } = await supabase
                .from('project_legal_documents')
                .select('*')
                .eq('project_id', projectId)
                .order('issue_date', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching legal documents:', error);
            return [];
        }
    }

    static async getLegalDocumentById(id: string): Promise<LegalDocument | null> {
        try {
            const { data, error } = await supabase
                .from('project_legal_documents')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching legal document:', error);
            return null;
        }
    }

    static async createLegalDocument(document: Partial<LegalDocument>): Promise<LegalDocument | null> {
        try {
            const { data, error } = await supabase
                .from('project_legal_documents')
                .insert(document)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating legal document:', error);
            return null;
        }
    }

    static async updateLegalDocument(id: string, updates: Partial<LegalDocument>): Promise<LegalDocument | null> {
        try {
            const { data, error } = await supabase
                .from('project_legal_documents')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating legal document:', error);
            return null;
        }
    }

    static async deleteLegalDocument(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('project_legal_documents')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting legal document:', error);
            return false;
        }
    }

    // ========== COMPLIANCE CHECKS ==========

    static async getComplianceChecks(projectId: string): Promise<ComplianceCheck[]> {
        try {
            const { data, error } = await supabase
                .from('project_compliance_checks')
                .select('*')
                .eq('project_id', projectId)
                .order('check_date', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching compliance checks:', error);
            return [];
        }
    }

    static async getComplianceCheckById(id: string): Promise<ComplianceCheck | null> {
        try {
            const { data, error } = await supabase
                .from('project_compliance_checks')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching compliance check:', error);
            return null;
        }
    }

    static async createComplianceCheck(check: Partial<ComplianceCheck>): Promise<ComplianceCheck | null> {
        try {
            const { data, error } = await supabase
                .from('project_compliance_checks')
                .insert(check)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating compliance check:', error);
            return null;
        }
    }

    static async updateComplianceCheck(id: string, updates: Partial<ComplianceCheck>): Promise<ComplianceCheck | null> {
        try {
            const { data, error } = await supabase
                .from('project_compliance_checks')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating compliance check:', error);
            return null;
        }
    }

    static async deleteComplianceCheck(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('project_compliance_checks')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting compliance check:', error);
            return false;
        }
    }

    // ========== ANALYTICS ==========

    static async getLegalSummary(projectId: string) {
        try {
            const [documents, checks] = await Promise.all([
                this.getLegalDocuments(projectId),
                this.getComplianceChecks(projectId)
            ]);

            const docsByType = documents.reduce((acc, doc) => {
                acc[doc.document_type] = (acc[doc.document_type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const docsByStatus = documents.reduce((acc, doc) => {
                acc[doc.status] = (acc[doc.status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const checksByType = checks.reduce((acc, check) => {
                acc[check.check_type] = (acc[check.check_type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const checksByStatus = checks.reduce((acc, check) => {
                acc[check.status] = (acc[check.status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const expiringDocs = documents.filter(doc => {
                if (!doc.expiry_date) return false;
                const daysUntilExpiry = Math.floor((new Date(doc.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return daysUntilExpiry > 0 && daysUntilExpiry <= 90; // Expiring in 90 days
            });

            const failedChecks = checks.filter(c => c.status === 'failed' || c.status === 'conditional');

            return {
                totalDocuments: documents.length,
                totalChecks: checks.length,
                documentsByType: docsByType,
                documentsByStatus: docsByStatus,
                checksByType: checksByType,
                checksByStatus: checksByStatus,
                expiringDocuments: expiringDocs,
                failedChecks: failedChecks,
                complianceScore: checks.length > 0
                    ? Math.round(checks.reduce((sum, c) => sum + (c.score || 0), 0) / checks.length)
                    : 0
            };
        } catch (error) {
            console.error('Error getting legal summary:', error);
            return null;
        }
    }
}
