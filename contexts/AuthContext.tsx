/**
 * Authentication Context
 * Real Supabase authentication implementation
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

// User profile extended with employee info
export interface UserProfile {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role?: string;
    department?: string;
    employeeId?: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TIMEOUT PROTECTION: Force loading to false after 5 seconds max
        const LOADING_TIMEOUT = 5000;
        const timeoutId = setTimeout(() => {
            if (loading) {
                console.warn('⏰ TIMEOUT: Loading took too long, forcing loading = false');
                setLoading(false);
            }
        }, LOADING_TIMEOUT);

        // 1. Check active session
        const initSession = async () => {
            console.log('🔄 AuthContext: initSession started');
            try {
                if (!supabase) {
                    console.warn('⚠️ Supabase client not initialized - using unauthenticated mode');
                    setLoading(false);
                    clearTimeout(timeoutId);
                    return;
                }

                // Check existing session first
                const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('❌ Session check error:', sessionError);
                    setLoading(false);
                    clearTimeout(timeoutId);
                    return;
                }

                // If session exists, use it
                if (existingSession) {
                    console.log('✅ Found existing session for', existingSession.user.email);
                    setSession(existingSession);
                    setUser(existingSession.user);
                    await fetchProfile(existingSession.user);
                    setLoading(false);
                    clearTimeout(timeoutId);
                    return;
                }

                // AUTO-LOGIN FOR DEVELOPMENT (only if no existing session)
                const isDevelopment = import.meta.env.DEV;
                if (isDevelopment) {
                    console.log('🔧 DEV MODE: No session found, attempting auto-login...');
                    const autoLoginEmail = 'admin@cic.com.vn';
                    const autoLoginPassword = 'admin123';

                    const { error: signInError } = await supabase.auth.signInWithPassword({
                        email: autoLoginEmail,
                        password: autoLoginPassword
                    });

                    if (signInError) {
                        console.warn('⚠️ DEV MODE: Auto-login failed:', signInError.message);
                    } else {
                        console.log('✅ DEV MODE: Auto-login successful!');
                        // Session will be updated by onAuthStateChange
                    }
                }

                // If no session after auto-login attempt
                if (!existingSession) {
                    console.log('ℹ️ No active session found');
                }
            } catch (error) {
                console.error('❌ Session init error:', error);
            } finally {
                setLoading(false);
                clearTimeout(timeoutId);
                console.log('🏁 AuthContext: initSession finished, loading = false');
            }
        };

        if (supabase) {
            initSession();

            // 2. Listen for auth changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
                console.log('🔑 Auth State Changed:', _event, newSession?.user?.email);
                setSession(newSession);
                setUser(newSession?.user ?? null);

                if (newSession?.user) {
                    await fetchProfile(newSession.user);
                } else {
                    setProfile(null);
                }
                setLoading(false);
                clearTimeout(timeoutId);
            });

            return () => {
                subscription.unsubscribe();
                clearTimeout(timeoutId);
            };
        } else {
            console.warn('⚠️ Supabase unavailable - auth listeners skipped');
            setLoading(false);
            clearTimeout(timeoutId);
        }
    }, []);

    const fetchProfile = async (currentUser: User) => {
        try {
            // First try to get from 'employees' table if we have one (mapped by email)
            const { data: employeeData, error } = await supabase
                .from('employees')
                .select('*')
                .eq('email', currentUser.email)
                .single();

            if (employeeData && !error) {
                setProfile({
                    id: currentUser.id,
                    email: currentUser.email || '',
                    name: employeeData.name,
                    avatar: employeeData.avatar,
                    role: employeeData.role,
                    department: employeeData.department,
                    employeeId: employeeData.id
                });
            } else {
                // Fallback to metadata
                setProfile({
                    id: currentUser.id,
                    email: currentUser.email || '',
                    name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
                    role: currentUser.user_metadata?.role || 'User',
                    avatar: currentUser.user_metadata?.avatar_url
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) setLoading(false);
        return { error };
    };

    const signUp = async (email: string, password: string, name: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    role: 'User' // Default role
                }
            }
        });
        if (error) setLoading(false);
        return { error };
    };

    const signOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
    };

    const value: AuthContextType = {
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!session?.user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
