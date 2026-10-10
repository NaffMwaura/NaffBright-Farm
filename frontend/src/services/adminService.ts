/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService } from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = authService.getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed (${response.status})`);
  }

  return response.json();
}

export const adminService = {
  // 1. Dashboard & Financial Analytics
  getDashboardKpis: () => request<any>('/Reports/dashboard-kpis'),
  getProfitAndLoss: (from?: string, to?: string) => 
    request<any>(`/Reports/profit-and-loss?startDate=${from || ''}&endDate=${to || ''}`),

  // 2. Cattle
  getCows: (status?: string) => 
    request<any[]>(`/Cows${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  createCow: (cow: any) => 
    request<any>('/Cows', { method: 'POST', body: JSON.stringify(cow) }),
  deleteCow: (id: string) => 
    request<any>(`/Cows/${id}`, { method: 'DELETE' }),

  // 3. Milk & Mala Production
  produceMala: (batch: { milkUsedLitres: number; malaProducedLitres: number }) =>
    request<any>('/Production/mala-produce', { method: 'POST', body: JSON.stringify(batch) }),

  // 4. Sales & Receipts
  getSalesSummary: () => request<any>('/Sales/summary'),
  getMilkSales: (from?: string, to?: string) => 
    request<any[]>(`/Sales/milk?startDate=${from || ''}&endDate=${to || ''}`),
  recordMilkSale: (sale: { customerName: string; litresSold: number; pricePerLitre: number; saleDate?: string }) =>
    request<any>('/Sales/milk', { method: 'POST', body: JSON.stringify(sale) }),
  getMalaSales: () => request<any[]>('/Sales/mala'),
  recordMalaSale: (sale: { customerName: string; quantityLitres: number; unitPrice: number; saleDate?: string }) =>
    request<any>('/Sales/mala', { method: 'POST', body: JSON.stringify(sale) }),
  getCowSales: () => request<any[]>('/Sales/cows'),
  recordCowSale: (sale: { cowId: string; buyerName: string; amount: number; saleDate?: string }) =>
    request<any>('/Sales/cows', { method: 'POST', body: JSON.stringify(sale) }),

  // 5. Feed Inventory
  getFeedInventory: () => request<any[]>('/FeedInventory'),
  addFeed: (feed: { feedName: string; quantityKg: number; costPerKg: number; reorderThresholdKg: number }) =>
    request<any>('/FeedInventory', { method: 'POST', body: JSON.stringify(feed) }),
  adjustFeedStock: (id: string, changeInKg: number, reason: string) =>
    request<any>(`/FeedInventory/${id}/adjust-stock`, {
      method: 'POST',
      body: JSON.stringify({ changeInKg, reason }),
    }),

  // 6. Farm Expenses
  getExpenses: (category?: string, from?: string, to?: string) =>
    request<any[]>(`/Expenses?category=${encodeURIComponent(category || '')}&startDate=${from || ''}&endDate=${to || ''}`),
  logExpense: (expense: { category: string; amount: number; description: string; date?: string }) =>
    request<any>('/Expenses', { method: 'POST', body: JSON.stringify(expense) }),
  deleteExpense: (id: string) =>
    request<any>(`/Expenses/${id}`, { method: 'DELETE' }),
  getExpenseCategoriesBreakdown: () =>
    request<any[]>('/Expenses/categories-breakdown'),

  // 7. Staff, Timesheets & Onboarding
  registerEmployee: (data: { fullName: string; phoneNumber: string; initialPassword?: string }) =>
    request<any>('/Auth/register-employee', { method: 'POST', body: JSON.stringify(data) }),
  getAllTimesheets: (status?: string) =>
    request<any[]>(`/Timesheets${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  reviewTimesheet: (id: string, status: 'Approved' | 'Rejected', payout?: number) =>
    request<any>(`/Timesheets/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status, approvedPaymentAmount: payout }),
    }),
  getAllSchedules: () => request<any[]>('/WorkSchedule'),
  assignSchedule: (schedule: { userId: string; shiftDate: string; shiftName: string; assignedDuty: string }) =>
    request<any>('/WorkSchedule', { method: 'POST', body: JSON.stringify(schedule) }),
  deleteSchedule: (id: string) =>
    request<any>(`/WorkSchedule/${id}`, { method: 'DELETE' }),

  // 8. Staff Messages
  getMessages: (type?: string) => 
    request<any[]>(`/Messages${type ? `?type=${encodeURIComponent(type)}` : ''}`),
  sendMessage: (msg: { messageType: string; subject: string; content: string }) =>
    request<any>('/Messages', { method: 'POST', body: JSON.stringify(msg) }),
  markMessageRead: (id: string) => 
    request<any>(`/Messages/${id}/read`, { method: 'PATCH' }),
};