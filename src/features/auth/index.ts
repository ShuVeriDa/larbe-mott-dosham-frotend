export type {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ResetPasswordPhoneDto,
  OAuthExchangeDto,
  OAuthProvider,
  AuthResponse,
  ForgotPasswordResponse,
} from "./types";

export { authApi } from "./api";

export {
  authKeys,
  useSessions,
  useLogin,
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useResetPasswordPhone,
  useOAuthExchange,
  useRevokeSession,
  useRevokeAllSessions,
} from "./queries";

export { AuthCard } from "./ui/auth-card";
export { OAuthCallback } from "./ui/oauth-callback";
