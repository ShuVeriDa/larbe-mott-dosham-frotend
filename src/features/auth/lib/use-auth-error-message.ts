"use client";

import { isApiError } from "@/shared/api";
import type { Dictionary } from "@/i18n/dictionaries";

type AuthErrors = Dictionary["auth"]["errors"];

export const useAuthErrorMessage = (errors: AuthErrors) => {
	return (error: unknown): string => {
		if (!isApiError(error)) return errors.generic;

		if (error.statusCode === 0) return errors.offline;
		if (error.statusCode === 429) return errors.rateLimit;
		if (error.statusCode >= 500) return errors.server;

		if (error.statusCode === 401) return errors.invalidCredentials;

		if (error.statusCode === 409) {
			const text = error.messages.join(" ").toLowerCase();
			if (text.includes("email")) return errors.emailTaken;
			if (text.includes("username")) return errors.usernameTaken;
			return errors.generic;
		}

		return error.messages[0] ?? errors.generic;
	};
};
