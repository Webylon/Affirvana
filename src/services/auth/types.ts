export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    balance: number;
  } | null;
  error?: string;
  message?: string;
}