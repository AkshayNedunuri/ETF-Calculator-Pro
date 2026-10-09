const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export const api = {
  // Health check
  async checkHealth() {
    try {
      const res = await fetch(`${API_URL}/api/health`);
      return await res.json();
    } catch (e: any) {
      return { status: 'disconnected', advice: 'Could not connect to backend server' };
    }
  },

  // Auth endpoints
  async signup(data: { name: string; email: string; password?: string }) {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok || res.status === 400 || res.status === 409) {
        return { ok: res.ok, status: res.status, ...json };
      }
    } catch (e) {
      // Fallback to Express backend if /api/auth/signup fails to reach Next.js server
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      return { ok: res.ok, status: res.status, ...json };
    } catch (e: any) {
      return { ok: false, status: 500, message: "Could not connect to database server." };
    }
  },

  async signin(data: { email: string; password?: string }) {
    try {
      const res = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      return { ok: res.ok, status: res.status, ...json };
    } catch (e: any) {
      return { ok: false, status: 500, message: "Could not reach database server." };
    }
  },

  // Password reset
  async forgotPassword(email: string) {
    const res = await fetch(`${API_URL}/api/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    return { ok: res.ok, status: res.status, ...json };
  },

  async resetPassword(token: string, password: string) {
    const res = await fetch(`${API_URL}/api/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const json = await res.json();
    return { ok: res.ok, status: res.status, ...json };
  },

  // Calculations CRUD
  async getCalculations(userEmailOrToken?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (userEmailOrToken) {
      if (userEmailOrToken.includes('@')) {
        headers['x-user-email'] = userEmailOrToken;
      } else {
        headers['Authorization'] = `Bearer ${userEmailOrToken}`;
      }
    }

    const res = await fetch(`${API_URL}/api/calculations`, { headers });
    const json = await res.json();
    return { ok: res.ok, status: res.status, data: json };
  },

  async saveCalculation(calculation: any, userEmailOrToken?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (userEmailOrToken) {
      if (userEmailOrToken.includes('@')) {
        headers['x-user-email'] = userEmailOrToken;
      } else {
        headers['Authorization'] = `Bearer ${userEmailOrToken}`;
      }
    }

    const res = await fetch(`${API_URL}/api/calculations`, {
      method: 'POST',
      headers,
      body: JSON.stringify(calculation),
    });
    const json = await res.json();
    return { ok: res.ok, status: res.status, ...json };
  },

  async deleteCalculation(id: string, userEmailOrToken?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (userEmailOrToken) {
      if (userEmailOrToken.includes('@')) {
        headers['x-user-email'] = userEmailOrToken;
      } else {
        headers['Authorization'] = `Bearer ${userEmailOrToken}`;
      }
    }

    const res = await fetch(`${API_URL}/api/calculations/${id}`, {
      method: 'DELETE',
      headers,
    });
    const json = await res.json();
    return { ok: res.ok, status: res.status, ...json };
  },
};
