const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5160/api';

export interface UserSession {
  userId: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Employee' | string;
  mustChangePassword?: boolean;
}

export const authService = {
  // Store authentication data
  setSession(token: string, user: UserSession) {
    localStorage.setItem('nb_token', token);
    localStorage.setItem('nb_user', JSON.stringify(user));
  },

  getToken(): string | null {
    return localStorage.getItem('nb_token');
  },

  getUser(): UserSession | null {
    const raw = localStorage.getItem('nb_user');
    return raw ? JSON.parse(raw) : null;
  },

  clearSession() {
    localStorage.removeItem('nb_token');
    localStorage.removeItem('nb_user');
  },

  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },

  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Invalid email or password.');
    }

    return response.json();
  },

  async changePassword(newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/Auth/change-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to change password.');
    }

    return response.json();
  }
};