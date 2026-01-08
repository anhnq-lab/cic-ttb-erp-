/**
 * Protected Route Component
 * Redirects unauthenticated users to login page
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string; // For future role-based access
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { isAuthenticated, loading, profile } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Đang xác thực...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role check (for future use)
    if (requiredRole && profile?.role !== requiredRole) {
        // For now, allow access but log warning
        console.warn(`User role '${profile?.role}' does not match required role '${requiredRole}'`);
    }

    return <>{children}</>;
};

export default ProtectedRoute;
