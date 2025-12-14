import axios from 'axios';
import { AuthUser, PurchaseHistory, Sweet, SweetFormData } from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export const authApi = {
  register: (email: string, password: string, fullName?: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, fullName }),
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
};

export const sweetsApi = {
  list: () => api.get<Sweet[]>('/sweets'),
  search: (params: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) =>
    api.get<Sweet[]>('/sweets/search', { params }),
  create: (data: SweetFormData) => api.post<Sweet>('/sweets', data),
  update: (id: string, data: Partial<SweetFormData>) =>
    api.put<Sweet>(`/sweets/${id}`, data),
  remove: (id: string) => api.delete(`/sweets/${id}`),
  purchase: (id: string, quantity: number) =>
    api.post<Sweet>(`/sweets/${id}/purchase`, { quantity }),
  restock: (id: string, quantity: number) =>
    api.post<Sweet>(`/sweets/${id}/restock`, { quantity }),
  purchases: () => api.get<PurchaseHistory[]>('/sweets/purchases/history'),
};

export { api };
