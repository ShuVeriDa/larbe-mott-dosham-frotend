import { userKeys } from "@/entities/user";
import { setAccessToken } from "@/shared/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./api";
import type {
	ForgotPasswordDto,
	LoginDto,
	RegisterDto,
	ResetPasswordDto,
	ResetPasswordPhoneDto,
} from "./types";

export const authKeys = {
	all: ["auth"] as const,
	sessions: () => [...authKeys.all, "sessions"] as const,
};

export function useSessions() {
	return useQuery({
		queryKey: authKeys.sessions(),
		queryFn: authApi.getSessions,
	});
}

export function useLogin() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (dto: LoginDto) => authApi.login(dto),
		onSuccess: data => {
			setAccessToken(data.accessToken);
			client.setQueryData(userKeys.me(), data.user);
		},
	});
}

export function useRegister() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (dto: RegisterDto) => authApi.register(dto),
		onSuccess: data => {
			setAccessToken(data.accessToken);
			client.setQueryData(userKeys.me(), data.user);
		},
	});
}

export function useLogout() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: authApi.logout,
		onSuccess: () => {
			setAccessToken(null);
			client.clear();
		},
	});
}

export function useForgotPassword() {
	return useMutation({
		mutationFn: (dto: ForgotPasswordDto) => authApi.forgotPassword(dto),
	});
}

export function useResetPassword() {
	return useMutation({
		mutationFn: (dto: ResetPasswordDto) => authApi.resetPassword(dto),
	});
}

export function useResetPasswordPhone() {
	return useMutation({
		mutationFn: (dto: ResetPasswordPhoneDto) => authApi.resetPasswordPhone(dto),
	});
}

export function useRevokeSession() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => authApi.revokeSession(id),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: authKeys.sessions() });
		},
	});
}

export function useRevokeAllSessions() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: authApi.revokeAllSessions,
		onSuccess: () => {
			client.invalidateQueries({ queryKey: authKeys.sessions() });
		},
	});
}
