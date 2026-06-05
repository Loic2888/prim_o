import api from './api';
import type { User, TokenTransaction, ApiResponse } from '../types';

export const userService = {
  async getAll(params?: { companyId?: string; role?: string }): Promise<User[]> {
    const { data } = await api.get<ApiResponse<User[]>>('/api/users', { params });
    return data.data;
  },

  async getById(id: string): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`/api/users/${id}`);
    return data.data;
  },

  async update(id: string, payload: Partial<Pick<User, 'name' | 'email'>> & { current_password?: string; password?: string }): Promise<User> {
    const { data } = await api.put<ApiResponse<User>>(`/api/users/${id}`, payload);
    return data.data;
  },

  async getHistory(id: string): Promise<TokenTransaction[]> {
    const { data } = await api.get<ApiResponse<TokenTransaction[]>>(`/api/users/${id}/history`);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/users/${id}`);
  },
};
