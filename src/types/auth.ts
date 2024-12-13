import { Database } from './supabase';

export type User = Database['public']['Tables']['users']['Row'];

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error?: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  user: User;
}
