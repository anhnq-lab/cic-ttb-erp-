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
        // 1. Check active session
        const initSession = async () => {
            try {
                // AUTO-LOGIN FOR DEVELOPMENT
                const isDevelopment = import.meta.env.DEV;
                const autoLoginEmail = 'admin@cic.com.vn';
                const autoLoginPassword = 'admin123';

                if (isDevelopment) {
                    console.log('🔧 DEV MODE: Checking for auto-login...');

                    // Check if already logged in
                    const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();

                    if (!existingSession && !sessionError) {
                        console.log('🔐 DEV MODE: Auto-logging in as admin...');
                        const { error: signInError } = await supabase.auth.signInWithPassword({
                            email: autoLoginEmail,
                            password: autoLoginPassword
                        });

                        if (signInError) {
                            console.warn('⚠️  DEV MODE: Auto-login failed, creating account...', signInError.message);
                            // If user doesn't exist, try to create it
                            const { error: signUpError } = await supabase.auth.signUp({
                                email: autoLoginEmail,
                                password: autoLoginPassword,
                                options: {
                                    data: {
                                        full_name: 'Admin User',
                                        role: 'Admin'
                                    }
                                }
                            });
                            if (signUpError) {
                                console.error('❌ DEV MODE: Auto signup failed:', signUpError);
                            } else {
                                console.log('✅ DEV MODE: Account created, please verify email if needed');
                            }
                        } else {
                            console.log('✅ DEV MODE: Auto-login successful!');
                        }
                        // Fetch session again after login
                        const { data: { session: newSession } } = await supabase.auth.getSession();
                        setSession(newSession);
                        setUser(newSession?.user ?? null);
                        if (newSession?.user) {
                            await fetchProfile(newSession.user);
                        }
                        setLoading(false);
                        return;
                    } else if (existingSession) {
                        console.log('✅ DEV MODE: Already logged in as', existingSession.user.email);
                    }
                }

                // Normal session check for production
                const { data: { session: existingSession }, error } = await supabase.auth.getSession();

                if (error) throw error;

                setSession(existingSession);
                setUser(existingSession?.user ?? null);

                if (existingSession?.user) {
                    await fetchProfile(existingSession.user);
                }
            } catch (error) {
                console.error('Session check error:', error);
            } finally {
                setLoading(false);
            }
        };

        initSession();

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);

            if (newSession?.user) {
                await fetchProfile(newSession.user);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
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
