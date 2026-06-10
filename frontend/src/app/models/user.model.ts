export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  balance: number;
  role: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  message: string;
}

export interface WithdrawalResponse {
  message: string;
  remainingBalance: number;
}

export interface WithdrawalHistory {
  id: number;
  userId: number;
  amount: number;
  createdAt: string;
  status: string;
}

export interface ErrorResponse {
  message: string;
  timestamp?: string;
}
