
export interface User {
  id: string;
  name: string;
  email: string;
  isSubscribed: boolean;
  trialCount: number;
  planExpiresAt?: string; // ISO date string
  lastPaymentDate?: string; // ISO date string
  paymentMethod?: string; // 'card', 'paypal', etc.
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UserWithPassword extends User {
  password: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface PlanInfo {
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
}

export interface PaymentDetails {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  email?: string;
}
