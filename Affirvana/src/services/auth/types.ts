export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    balance: number;
  } | null;
  error?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}