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
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordResponse {
  message: string;
  /** Only returned in dev mode (email flow) */
  token?: string;
  /** Only returned in dev mode (phone OTP flow) */
  code?: string;
}

export { UserSession };
