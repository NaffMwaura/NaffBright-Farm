import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';

// Layouts
import AdminLayout from './components/layout/admin/AdminLayout';
import EmployeeLayout from './components/layout/employee/EmployeeLayout';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import CowsManagement from './pages/admin/CowsManagement';
import ProductionAdmin from './pages/admin/ProductionAdmin';
import SalesManagement from './pages/admin/SalesManagement';
import FinanceReports from './pages/admin/FinanceReports';
import InventoryAdmin from './pages/admin/InventoryAdmin';
import ExpensesAdmin from './pages/admin/ExpensesAdmin';
import StaffManagement from './pages/admin/StaffManagement';
import StaffMessages from './pages/admin/StaffMessages';

// Employee Pages
import EmployeeOverview from './pages/employee/EmployeeOverview';
import MilkingShiftLog from './pages/employee/MilkingShiftLog';
import EmployeeHealth from './pages/employee/EmployeeHealth';
import MyWorkSchedule from './pages/employee/MyWorkSchedule';
import SubmitTimesheet from './pages/employee/SubmitTimesheet';
import EmployeeInquiries from './pages/employee/EmployeeInquiries';

import { authService } from './services/AuthService';

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
            <Route index element={<EmployeeOverview />} />
            <Route path="milking" element={<MilkingShiftLog />} />
            <Route path="health" element={<EmployeeHealth />} />
            <Route path="schedule" element={<MyWorkSchedule />} />
            <Route path="timesheets" element={<SubmitTimesheet />} />
            <Route path="messages" element={<EmployeeInquiries />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}