const API_BASE = '/api';

interface LoginData {
  email: string;
  password: string;
}

interface ContactData {
  name: string;
  email: string;
  message: string;
}

interface ApiResponse<T> {
  data?: T;
  token?: string;
  user?: { id: number; email: string };
  success?: boolean;
  error?: string;
}

export const api = {
  async getProducts(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getServices(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/services`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  async getMembers(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/members`);
    if (!res.ok) throw new Error('Failed to fetch members');
    return res.json();
  },

  async login(data: LoginData): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async contact(data: ContactData): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Contact submit failed');
    return res.json();
  },
};
