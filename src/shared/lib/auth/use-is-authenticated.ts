import { useAuthStore } from "./auth-store";

export const useIsAuthenticated = () =>
	useAuthStore((s) => s.status === "ready" && s.accessToken !== null);

export const useAuthStatus = () => useAuthStore((s) => s.status);
