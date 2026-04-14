import type { User, UserSession } from "@/entities/user";

// ---------------------------------------------------------------------------
// Request DTOs
// ---------------------------------------------------------------------------

export interface LoginDto {
  username: string; // email OR username
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  name: string;
}

export interface ForgotPasswordDto {
  email?: string;
  phone?: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface ResetPasswordPhoneDto {
  phone: string;
  code: string;
  newPassword: string;
}

// ---------------------------------------------------------------------------
// Response DTOs
// ---------------------------------------------------------------------------

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ForgotPasswordResponse {
  message: string;
  /** Only returned in dev mode */
  token?: string;
}

export { UserSession };
