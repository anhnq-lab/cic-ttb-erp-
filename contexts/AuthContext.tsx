/**
 * Authentication Context
 * Mock authentication for development - Supabase will be added later
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

// User profile extended with employee info
interface UserProfile {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role?: string;
    department?: string;
    employeeId?: string;
}

interface AuthContextType {
    user: { id: string; email: string } | null;
    profile: UserProfile | null;
    session: null;
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
    const [user, setUser] = useState<{ id: string; email: string } | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for demo user in localStorage
        const checkSession = async () => {
            try {
                const demoUserStr = localStorage.getItem('demo_user');
                if (demoUserStr) {
                    const demoUser = JSON.parse(demoUserStr);
                    setProfile(demoUser);
                    setUser({ id: demoUser.id, email: demoUser.email });
                }
            } catch (error) {
                console.error('Session check error:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        // Mock sign in - accept any credentials for demo
        const mockUser = {
            id: 'user-' + Date.now(),
            email: email,
            name: email.split('@')[0],
            role: 'Admin',
            department: 'BIM'
        };
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        setUser({ id: mockUser.id, email: mockUser.email });
        setProfile(mockUser);
        setLoading(false);
        return { error: null };
    };

    const signUp = async (email: string, password: string, name: string) => {
        setLoading(true);
        const mockUser = {
            id: 'user-' + Date.now(),
            email: email,
            name: name,
            role: 'User',
            department: 'BIM'
        };
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        setUser({ id: mockUser.id, email: mockUser.email });
        setProfile(mockUser);
        setLoading(false);
        return { error: null };
    };

    const signOut = async () => {
        setLoading(true);
        localStorage.removeItem('demo_user');
        setUser(null);
        setProfile(null);
        setLoading(false);
    };

    const value: AuthContextType = {
        user,
        profile,
        session: null,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user || !!localStorage.getItem('demo_user'),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
