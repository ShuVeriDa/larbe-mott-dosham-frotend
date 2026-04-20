"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { Button, Input } from "@/shared/ui";
import { useRouter } from "next/navigation";
import { type FC, useActionState } from "react";
import { toast } from "sonner";
import { loginSchema } from "../lib/schemas";
import { useAuthErrorMessage } from "../lib/use-auth-error-message";
import { useLogin } from "../queries";
import { FormField } from "./form-field";
import { PasswordInput } from "./password-input";

interface LoginFormProps {
	dict: Dictionary["auth"];
	redirectTo: string;
	onForgotPassword: () => void;
}

type FormState = {
	fieldErrors: Partial<Record<"username" | "password", string>>;
};

const emptyState: FormState = { fieldErrors: {} };

export const LoginForm: FC<LoginFormProps> = ({
	dict,
	redirectTo,
	onForgotPassword,
}) => {
	const router = useRouter();
	const login = useLogin();
	const pickMessage = useAuthErrorMessage(dict.errors);

	const [state, formAction, isPending] = useActionState<FormState, FormData>(
		async (_prev, formData) => {
			const parsed = loginSchema(dict.errors).safeParse({
				username: formData.get("username"),
				password: formData.get("password"),
			});

			if (!parsed.success) {
				const fieldErrors: FormState["fieldErrors"] = {};
				for (const issue of parsed.error.issues) {
					const key = issue.path[0] as keyof FormState["fieldErrors"];
					if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
				}
				return { fieldErrors };
			}

			try {
				await login.mutateAsync(parsed.data);
				router.replace(redirectTo);
				router.refresh();
				return emptyState;
			} catch (error) {
				toast.error(pickMessage(error));
				return emptyState;
			}
		},
		emptyState,
	);

	const { fieldErrors } = state;

	return (
		<form
			id="auth-panel-login"
			role="tabpanel"
			aria-labelledby="auth-tab-login"
			action={formAction}
			className="flex flex-col gap-5"
			noValidate
		>
			<FormField
				htmlFor="login-email"
				label={dict.login.emailLabel}
				error={fieldErrors.username}
			>
				<Input
					id="login-email"
					name="username"
					type="text"
					autoComplete="username"
					placeholder={dict.login.emailPlaceholder}
					error={!!fieldErrors.username}
					disabled={isPending}
					aria-invalid={!!fieldErrors.username}
					aria-describedby={
						fieldErrors.username ? "login-email-error" : undefined
					}
				/>
			</FormField>

			<FormField
				htmlFor="login-password"
				label={dict.login.passwordLabel}
				error={fieldErrors.password}
				labelAppend={
					<button
						type="button"
						onClick={onForgotPassword}
						className="text-xs text-primary hover:underline"
					>
						{dict.login.forgotPassword}
					</button>
				}
			>
				<PasswordInput
					id="login-password"
					name="password"
					autoComplete="current-password"
					placeholder={dict.login.passwordPlaceholder}
					error={!!fieldErrors.password}
					disabled={isPending}
					showLabel={dict.togglePassword.show}
					hideLabel={dict.togglePassword.hide}
					aria-invalid={!!fieldErrors.password}
					aria-describedby={
						fieldErrors.password ? "login-password-error" : undefined
					}
				/>
			</FormField>

			<Button type="submit" size="lg" disabled={isPending}>
				{isPending ? dict.login.submitting : dict.login.submit}
			</Button>

			{/* <AuthDivider label={dict.divider} /> */}

			{/* <SocialButtons
				mode="login"
				returnTo={redirectTo}
				labels={dict.social}
			/> */}
		</form>
	);
};
