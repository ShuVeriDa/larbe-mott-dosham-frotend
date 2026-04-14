export type {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ResetPasswordPhoneDto,
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
  useRevokeSession,
  useRevokeAllSessions,
} from "./queries";
