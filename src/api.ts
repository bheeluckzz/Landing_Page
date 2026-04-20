const API_BASE = '/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
}

interface ContactData {
  name: string;
  email: string;
  message: string;
}

interface ItemData {
  year?: number;
  price?: number;
  cpuModel?: string;
  hardDiskSize?: string;
  [key: string]: any;
}

interface Item {
  id: string;
  name: string;
  year?: number;
  price?: number;
  cpuModel?: string;
  hardDiskSize?: string;
  created?: string;
  data?: ItemData;
}

interface ApiResponse<T> {
  data?: T;
  token?: string;
  user?: { id: number; email: string };
  success?: boolean;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export const api = {
  // Static data
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

  // Auth endpoints
  async login(data: LoginData): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/auth/login`, {
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

  async register(data: RegisterData): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Register failed');
    }
    return res.json();
  },

  async profile(token: string): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch profile');
    }
    return res.json();
  },

  async contact(data: ContactData): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/contact/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Contact submit failed');
    return res.json();
  },

  // Items CRUD (renamed from Objects, now matches backend exactly)
  async getItems(params?: { search?: string; page?: number; limit?: number }): Promise<{ data: Item[]; total: number; page: number; limit: number }> {
    const searchParam = params?.search ? `search=${encodeURIComponent(params.search)}` : '';
    const pageParam = params?.page ? `page=${params.page}` : 'page=1';
    const limitParam = params?.limit ? `limit=${params.limit}` : 'limit=10';
    const query = [searchParam, pageParam, limitParam].filter(Boolean).join('&');
    const url = query ? `${API_BASE}/items?${query}` : `${API_BASE}/items`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch items');
    return res.json();
  },

  async createItem(data: { name: string; data?: ItemData }): Promise<Item> {
    const res = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create item');
    }
    return res.json();
  },

  async updateItem(id: string, data: { name: string; data?: ItemData }): Promise<Item> {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update item');
    }
    return res.json();
  },

  async deleteItem(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete item');
    }
  },

  // Health check
  async health(): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  }
};

