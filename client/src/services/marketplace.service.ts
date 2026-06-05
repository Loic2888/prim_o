import api from './api';
import type { Voucher, Redemption, AdminVoucher, AdminRedemption, ApiResponse } from '../types';

export const marketplaceService = {
  async getItems(): Promise<Voucher[]> {
    const { data } = await api.get<ApiResponse<Voucher[]>>('/api/marketplace/items');
    return data.data;
  },

  async getItemById(id: string): Promise<Voucher> {
    const { data } = await api.get<ApiResponse<Voucher>>(`/api/marketplace/items/${id}`);
    return data.data;
  },

  async createItem(payload: { partner: string; title: string; token_cost: number }): Promise<Voucher> {
    const { data } = await api.post<ApiResponse<Voucher>>('/api/marketplace/items', payload);
    return data.data;
  },

  async updateItem(id: string, payload: Partial<{ partner: string; title: string; token_cost: number; available: boolean }>): Promise<Voucher> {
    const { data } = await api.put<ApiResponse<Voucher>>(`/api/marketplace/items/${id}`, payload);
    return data.data;
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/api/marketplace/items/${id}`);
  },

  async redeem(voucher_id: string): Promise<{ promo_code: string }> {
    const { data } = await api.post<ApiResponse<{ promo_code: string }>>('/api/marketplace/redeem', { voucher_id });
    return data.data;
  },

  async getOrders(): Promise<Redemption[]> {
    const { data } = await api.get<ApiResponse<Redemption[]>>('/api/marketplace/orders');
    return data.data;
  },

  async adminGetVouchers(): Promise<AdminVoucher[]> {
    const { data } = await api.get<ApiResponse<AdminVoucher[]>>('/api/marketplace/admin/vouchers');
    return data.data;
  },

  async adminGetHistory(): Promise<AdminRedemption[]> {
    const { data } = await api.get<ApiResponse<AdminRedemption[]>>('/api/marketplace/admin/history');
    return data.data;
  },
};
