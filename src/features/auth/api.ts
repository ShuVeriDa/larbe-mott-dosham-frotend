import type { UserSession } from "@/entities/user";
import { apiClient } from "@/shared/api";
import type {
	AuthResponse,
	ForgotPasswordDto,
	ForgotPasswordResponse,
	LoginDto,
	RegisterDto,
	ResetPasswordDto,
	ResetPasswordPhoneDto,
} from "./types";

export const authApi = {
	async login(dto: LoginDto): Promise<AuthResponse> {
		const { data } = await apiClient.post<AuthResponse>("/auth/login", dto);
		return data;
	},

	async register(dto: RegisterDto): Promise<AuthResponse> {
		const { data } = await apiClient.post<AuthResponse>("/auth/register", dto);
		return data;
	},

	async refreshToken(): Promise<AuthResponse> {
		const { data } = await apiClient.post<AuthResponse>(
			"/auth/login/access-token",
		);
		return data;
	},

	async logout(): Promise<boolean> {
		const { data } = await apiClient.post<boolean>("/auth/logout");
		return data;
	},

	async forgotPassword(
		dto: ForgotPasswordDto,
	): Promise<ForgotPasswordResponse> {
		const { data } = await apiClient.post<ForgotPasswordResponse>(
			"/auth/forgot-password",
			dto,
		);
		return data;
	},

	async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
		const { data } = await apiClient.post<{ message: string }>(
			"/auth/reset-password",
			dto,
		);
		return data;
	},

	async resetPasswordPhone(
		dto: ResetPasswordPhoneDto,
	): Promise<{ message: string }> {
		const { data } = await apiClient.post<{ message: string }>(
			"/auth/reset-password/phone",
			dto,
		);
		return data;
	},

	async getSessions(): Promise<UserSession[]> {
		const { data } = await apiClient.get<UserSession[]>("/auth/sessions");
		return data;
	},

	async revokeSession(id: string): Promise<{ message: string }> {
		const { data } = await apiClient.delete<{ message: string }>(
			`/auth/sessions/${id}`,
		);
		return data;
	},

	async revokeAllSessions(): Promise<{ count: number }> {
		const { data } = await apiClient.delete<{ count: number }>(
			"/auth/sessions",
		);
		return data;
	},
};
