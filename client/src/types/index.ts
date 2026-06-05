export type UserRole = 'employer' | 'employee' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  first_name: string;
  role: UserRole;
  token_balance: number;
  company_id: string | null;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  token_balance: number;
  street?: string;
  zip_code?: string;
  city?: string;
  email?: string;
  created_at: string;
}

export interface TokenTransaction {
  id: string;
  sender_id: string | null;
  receiver_id: string | null;
  amount: number;
  reason: string;
  stripe_payment_id?: string;
  created_at: string;
}

export interface Voucher {
  id: string;
  partner: string;
  title: string;
  token_cost: number;
  available: boolean;
  created_at: string;
}

export interface Redemption {
  id: string;
  user_id: string;
  voucher_id: string;
  promo_code: string;
  redeemed_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  code: number;
}

export interface AdminVoucher extends Voucher {
  redemptions: { id: string }[];
}

export interface AdminRedemption {
  id: string;
  promo_code: string;
  redeemed_at: string;
  created_at: string;
  user: { id: string; first_name: string; name: string; email: string };
  voucher: { id: string; partner: string; title: string; token_cost: number };
}
