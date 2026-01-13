

console.log('App.tsx starting...');
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ContractList from './pages/ContractList';
import PolicyViewer from './pages/PolicyViewer';
import ProjectDetail from './pages/ProjectDetail';
import HRMList from './pages/HRMList';
import CRMList from './pages/CRMList';
import MyDashboard from './pages/MyDashboard';
import TaskList from './pages/TaskList';
import LoginPage from './pages/LoginPage';
import AIChatAssistant from './components/AIChatAssistant';
import KnowledgeBase from './pages/KnowledgeBase';
import Reports from './pages/Reports';
import DailyReportList from './pages/DailyReportList';

// Layout wrapper for authenticated pages
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-screen font-sans bg-gray-50 text-slate-900">
    <Sidebar />
    <div className="ml-64 flex-1 flex flex-col min-h-screen transition-all duration-300">
      {children}
    </div>
    <AIChatAssistant />
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route - Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ProjectList />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/projects/:id" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ProjectDetail />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <TaskList />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/contracts" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ContractList />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/hr" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <HRMList />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/crm" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <CRMList />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/my-dashboard" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <MyDashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/knowledge-base" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <KnowledgeBase />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/policy" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <PolicyViewer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/daily-reports" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <DailyReportList />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="/reports" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Reports />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
