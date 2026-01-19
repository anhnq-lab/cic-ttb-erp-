import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const getEnv = (name: string) => {
    try {
        // @ts-ignore
        return import.meta.env[name] || process.env[name] || '';
    } catch {
        return process.env[name] || '';
    }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Check if configuration is available
const hasConfig = Boolean(supabaseUrl && supabaseAnonKey);

// Create Supabase client
console.log('Supabase URL:', supabaseUrl.slice(0, 20) + '...');
console.log('Supabase Key:', supabaseAnonKey.slice(0, 20) + '...');

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
    console.warn('⚠️ Supabase not configured. Using mock mode.');
    console.warn('Missing env vars:');
    console.warn('  VITE_SUPABASE_URL:', supabaseUrl || 'NOT SET');
    console.warn('  VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET (hidden)' : 'NOT SET');
    console.warn('Add these to .env file and restart dev server!');
} else {
    console.log('✅ Supabase configured successfully');
}

export default supabase;
