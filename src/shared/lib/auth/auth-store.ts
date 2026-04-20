import { create } from "../store/create-store";

export type AuthStatus = "loading" | "ready";

type AuthState = {
	accessToken: string | null;
	status: AuthStatus;
	setAccessToken: (token: string | null) => void;
	setStatus: (status: AuthStatus) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	accessToken: null,
	status: "loading",
	setAccessToken: (token) => set({ accessToken: token }),
	setStatus: (status) => set({ status }),
}));
