/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService } from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_URL ;

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

export const employeeService = {
  // Cows (for dropdown selection)
  getCows: () => request<any[]>('/Cows'),

  // Milking Shift Entries
  logMilkRecord: (data: { cowId: string; quantityLitres: number; shift: string; date?: string }) =>
    request<any>('/Production/milk-record', { method: 'POST', body: JSON.stringify(data) }),

  // Health & Treatments
  getHealthRecords: () => request<any[]>('/HealthRecords'),
  recordTreatment: (data: {
    cowId: string;
    diagnosis: string;
    treatment: string;
    vetName: string;
    treatmentCost: number;
    date?: string;
  }) => request<any>('/HealthRecords', { method: 'POST', body: JSON.stringify(data) }),

  // Work Schedule
  getMySchedule: () => request<any[]>('/WorkSchedule/my-schedule'),

  // Timesheets
  getMyTimesheets: () => request<any[]>('/Timesheets/my-timesheets'),
  submitTimesheet: (data: { hoursWorked: number; tasksCompleted: string; workDate?: string }) =>
    request<any>('/Timesheets/submit', { method: 'POST', body: JSON.stringify(data) }),

  // Messages (Reports to Admin & Broadcast Instructions)
  getMessages: () => request<any[]>('/Messages'),
  sendMessage: (data: { messageType: 'Report' | 'Inquiry'; subject: string; content: string }) =>
    request<any>('/Messages', { method: 'POST', body: JSON.stringify(data) }),
  markMessageRead: (id: string) =>
    request<any>(`/Messages/${id}/read`, { method: 'PATCH' }),
};