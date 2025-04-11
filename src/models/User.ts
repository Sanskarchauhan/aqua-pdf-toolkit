
export interface User {
  id: string;
  name: string;
  email: string;
  isSubscribed: boolean;
  trialCount: number;
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
