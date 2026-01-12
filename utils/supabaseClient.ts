import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if configuration is available
const hasConfig = Boolean(supabaseUrl && supabaseAnonKey);

// Create Supabase client
export const supabase = hasConfig
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    })
    : null;

// Flag to indicate if we're in mock mode (no Supabase config)
export const IS_MOCK_MODE = !hasConfig;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
    return hasConfig;
};

// Log configuration status
if (!hasConfig) {
    console.warn('⚠️ Supabase not configured. Using mock mode. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env file.');
} else {
    console.log('✅ Supabase configured successfully');
}

export default supabase;
