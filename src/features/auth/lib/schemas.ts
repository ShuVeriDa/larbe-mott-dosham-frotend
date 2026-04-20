import type { Dictionary } from "@/i18n/dictionaries";
import { z } from "zod";

type AuthErrors = Dictionary["auth"]["errors"];

export const loginSchema = (errors: AuthErrors) =>
	z.object({
		username: z.string().trim().min(1, { message: errors.required }),
		password: z.string().min(1, { message: errors.required }),
	});

export type LoginValues = z.infer<ReturnType<typeof loginSchema>>;

export const registerSchema = (errors: AuthErrors) =>
	z.object({
		name: z.string().trim().min(1, { message: errors.required }),
		username: z.string().trim().min(1, { message: errors.required }),
		email: z
			.string()
			.trim()
			.min(1, { message: errors.required })
			.email({ message: errors.invalidEmail }),
		password: z
			.string()
			.min(1, { message: errors.required })
			.min(8, { message: errors.passwordTooShort }),
		terms: z.literal("on", { message: errors.termsRequired }),
	});

export type RegisterValues = z.infer<ReturnType<typeof registerSchema>>;

export const resetSchema = (errors: AuthErrors) =>
	z.object({
		email: z
			.string()
			.trim()
			.min(1, { message: errors.required })
			.email({ message: errors.invalidEmail }),
	});

export type ResetValues = z.infer<ReturnType<typeof resetSchema>>;
