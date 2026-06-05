import api from './api';
import type { TokenTransaction, ApiResponse } from '../types';

interface AllocatePayload {
  receiver_id: string;
  amount: number;
  reason?: string;
}

export const tokenService = {
  async allocate(payload: AllocatePayload): Promise<TokenTransaction> {
    const { data } = await api.post<ApiResponse<TokenTransaction>>('/api/tokens/allocate', payload);
    return data.data;
  },

  async getBalance(userId: string): Promise<number> {
    const { data } = await api.get<ApiResponse<{ token_balance: number }>>(`/api/tokens/balance/${userId}`);
    return data.data.token_balance;
  },

  async getTransactions(params?: { userId?: string }): Promise<TokenTransaction[]> {
    const { data } = await api.get<ApiResponse<TokenTransaction[]>>('/api/tokens/transactions', { params });
    return data.data;
  },

  async getTransactionById(id: string): Promise<TokenTransaction> {
    const { data } = await api.get<ApiResponse<TokenTransaction>>(`/api/tokens/transactions/${id}`);
    return data.data;
  },
};
