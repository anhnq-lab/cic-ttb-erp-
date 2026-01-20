/**
 * Knowledge Service - Supabase Implementation
 * Managed by Antigravity
 */

import { supabase } from '../utils/supabaseClient';
import { LessonLearned } from '../types';

export interface PolicySection {
    id: string;
    sectionId: string;
    title: string;
    icon: string;
    content: any[];
    version: string;
    effectiveDate: string;
}

export const KnowledgeService = {
    // LESSONS LEARNED
    getLessonsLearned: async (): Promise<LessonLearned[]> => {
        const { data, error } = await supabase
            .from('lessons_learned')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching lessons learned:', error);
            return [];
        }
        return data.map(item => ({
            id: item.id,
            projectId: item.project_id,
            title: item.summary,
            category: item.category,
            tags: item.tags || [],
            content: item.detail || '',
            solution: item.action || '',
            author: item.author_name || '',
            created_at: item.created_at
        }));
    },

    createLessonLearned: async (lesson: Omit<LessonLearned, 'id'>): Promise<LessonLearned | null> => {
        const payload = {
            project_id: lesson.projectId,
            category: lesson.category,
            summary: lesson.title,
            detail: lesson.content,
            action: lesson.solution,
            author_name: lesson.author,
            tags: lesson.tags,
            date: new Date().toISOString().split('T')[0]
        };

        const { data, error } = await supabase
            .from('lessons_learned')
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error('Error creating lesson learned:', error);
            return null;
        }

        return {
            id: data.id,
            projectId: data.project_id,
            title: data.summary,
            category: data.category,
            tags: data.tags || [],
            content: data.detail || '',
            solution: data.action || '',
            author: data.author_name || '',
            created_at: data.created_at
        };
    },

    // POLICIES
    getPolicies: async (): Promise<PolicySection[]> => {
        const { data, error } = await supabase
            .from('organization_policies')
            .select('*')
            .order('section_id', { ascending: true });

        if (error) {
            console.error('Error fetching policies:', error);
            return [];
        }

        return data.map(item => ({
            id: item.id,
            sectionId: item.section_id,
            title: item.title,
            icon: item.icon,
            content: item.content,
            version: item.version,
            effectiveDate: item.effective_date
        }));
    },

    getPolicyBySection: async (sectionId: string): Promise<PolicySection | null> => {
        const { data, error } = await supabase
            .from('organization_policies')
            .select('*')
            .eq('section_id', sectionId)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            sectionId: data.section_id,
            title: data.title,
            icon: data.icon,
            content: data.content,
            version: data.version,
            effectiveDate: data.effective_date
        };
    }
};
