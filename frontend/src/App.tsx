import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import AdminLayout from './components/layout/admin/AdminLayout';
import EmployeeLayout from './components/layout/employee/EmployeeLayout';

// Admin Page Components
import AdminOverview from './pages/admin/AdminOverview';
import CowsManagement from './pages/admin/CowsManagement';
import ProductionAdmin from './pages/admin/ProductionAdmin';
import SalesManagement from './pages/admin/SalesManagement';
import FinanceReports from './pages/admin/FinanceReports';
import InventoryAdmin from './pages/admin/InventoryAdmin';
import ExpensesAdmin from './pages/admin/ExpensesAdmin';
import StaffManagement from './pages/admin/StaffManagement';
import StaffMessages from './pages/admin/StaffMessages';

import { authService } from './services/AuthService';

// Temporary placeholder for Employee station home
const EmployeeHome = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Worker Shift Station</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400">
      Today's assigned shift duties, quick milking inputs, and notices.
    </p>
  </div>
);

// Route Guard
function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: string }) {
  const token = authService.getToken();
  const user = authService.getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.mustChangePassword) {
    return <Navigate to={`/dashboard/reset?password=true&userId=${user.userId}`} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'Admin' ? '/dashboard/admin' : '/dashboard/employee'} replace />;
  }

  return <>{children}</>;
}

// Smart dispatcher for "/dashboard"
function DashboardDispatcher() {
  const token = authService.getToken();
  const user = authService.getUser();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.mustChangePassword) return <Navigate to={`/dashboard/reset?password=true&userId=${user.userId}`} replace />;

  return user.role === 'Admin' 
    ? <Navigate to="/dashboard/admin" replace /> 
    : <Navigate to="/dashboard/employee" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/reset" element={<ResetPassword />} />
          <Route path="/dashboard" element={<DashboardDispatcher />} />

          {/* ADMIN PORTAL */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRole="Admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="cows" element={<CowsManagement />} />
            <Route path="production" element={<ProductionAdmin />} />
            <Route path="sales" element={<SalesManagement />} />
            <Route path="finance" element={<FinanceReports />} />
            <Route path="inventory" element={<InventoryAdmin />} />
            <Route path="expenses" element={<ExpensesAdmin />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="messages" element={<StaffMessages />} />
          </Route>

          {/* EMPLOYEE PORTAL */}
          <Route
            path="/dashboard/employee"
            element={
              <ProtectedRoute allowedRole="Employee">
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<EmployeeHome />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}