import { API_URL } from "@/shared/config";
import type { OAuthProvider } from "../types";

export const buildOAuthInitUrl = (
	provider: OAuthProvider,
	returnTo: string,
): string => {
	const url = new URL(`${API_URL}/auth/${provider}`);
	url.searchParams.set("returnTo", returnTo);
	return url.toString();
};
