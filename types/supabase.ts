/**
 * Supabase Database Types
 * Auto-generated based on schema
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            employees: {
                Row: {
                    id: string
                    user_id: string | null
                    code: string
                    name: string
                    email: string
                    phone: string | null
                    avatar: string | null
                    role: string | null
                    department: string | null
                    status: 'Chính thức' | 'Nghỉ phép' | 'Thử việc'
                    join_date: string | null
                    dob: string | null
                    degree: string | null
                    certificates: string | null
                    graduation_year: string | null
                    skills: string[] | null
                    profile_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['employees']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['employees']['Insert']>
            }
            customers: {
                Row: {
                    id: string
                    code: string
                    name: string
                    short_name: string | null
                    type: 'Client' | 'Partner' | 'Subcontractor'
                    category: 'RealEstate' | 'StateBudget' | 'Consulting' | 'Construction' | 'Other'
                    tax_code: string | null
                    address: string | null
                    representative: string | null
                    contact_person: string | null
                    email: string | null
                    phone: string | null
                    website: string | null
                    bank_account: string | null
                    bank_name: string | null
                    status: 'Active' | 'Inactive'
                    tier: 'VIP' | 'Gold' | 'Standard'
                    total_project_value: number
                    logo: string | null
                    rating: number | null
                    evaluation: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['customers']['Insert']>
            }
            projects: {
                Row: {
                    id: string
                    code: string
                    name: string
                    client: string | null
                    customer_id: string | null
                    location: string | null
                    manager_id: string | null
                    manager: string | null
                    project_group: string | null
                    construction_type: string | null
                    construction_level: string | null
                    scale: string | null
                    capital_source: 'StateBudget' | 'NonStateBudget'
                    status: string
                    progress: number
                    budget: number
                    spent: number
                    deadline: string | null
                    members_count: number
                    thumbnail: string | null
                    service_type: string | null
                    area: string | null
                    unit_price: string | null
                    phase: string | null
                    scope: string | null
                    status_detail: string | null
                    failure_reason: string | null
                    folder_url: string | null
                    completed_at: string | null
                    deliverables: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['projects']['Insert']>
            }
            contracts: {
                Row: {
                    id: string
                    project_id: string | null
                    code: string
                    signed_date: string | null
                    package_name: string | null
                    project_name: string | null
                    location: string | null
                    contract_type: string | null
                    law_applied: string | null
                    side_a_name: string | null
                    side_a_rep: string | null
                    side_a_position: string | null
                    side_a_mst: string | null
                    side_a_staff: string | null
                    side_b_name: string
                    side_b_rep: string | null
                    side_b_position: string | null
                    side_b_mst: string | null
                    side_b_bank: string | null
                    total_value: number
                    vat_included: boolean
                    advance_payment: number
                    paid_value: number
                    remaining_value: number
                    wip_value: number
                    duration: string | null
                    start_date: string | null
                    end_date: string | null
                    warranty_period: string | null
                    main_tasks: string[] | null
                    file_formats: string | null
                    delivery_method: string | null
                    acceptance_standard: string | null
                    penalty_rate: string | null
                    max_penalty: string | null
                    dispute_resolution: string | null
                    status: string
                    file_url: string | null
                    drive_link: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['contracts']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['contracts']['Insert']>
            }
            tasks: {
                Row: {
                    id: string
                    project_id: string | null
                    code: string | null
                    name: string
                    assignee_id: string | null
                    assignee_name: string | null
                    assignee_avatar: string | null
                    assignee_role: string | null
                    reviewer_id: string | null
                    status: string
                    priority: 'Cao' | 'Trung bình' | 'Thấp'
                    start_date: string | null
                    due_date: string | null
                    progress: number
                    tags: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['tasks']['Insert']>
            }
            crm_contacts: {
                Row: {
                    id: string
                    customer_id: string | null
                    name: string
                    position: string | null
                    email: string | null
                    phone: string | null
                    is_primary: boolean
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['crm_contacts']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['crm_contacts']['Insert']>
            }
            crm_activities: {
                Row: {
                    id: string
                    customer_id: string | null
                    type: 'Meeting' | 'Call' | 'Email' | 'Meal' | 'Note'
                    date: string | null
                    title: string | null
                    description: string | null
                    created_by: string | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['crm_activities']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['crm_activities']['Insert']>
            }
            crm_opportunities: {
                Row: {
                    id: string
                    customer_id: string | null
                    name: string
                    value: number
                    stage: 'New' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost'
                    probability: number
                    expected_close_date: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['crm_opportunities']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['crm_opportunities']['Insert']>
            }
        }
    }
}

// Helper types for Supabase Client
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
