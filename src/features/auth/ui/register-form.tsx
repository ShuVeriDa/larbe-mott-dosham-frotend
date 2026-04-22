"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Button, Checkbox, Input } from "@/shared/ui";
import Link from "next/link";
import { type FC, useActionState, useState } from "react";
import { toast } from "sonner";
import { registerSchema } from "../lib/schemas";
import { useAuthErrorMessage } from "../lib/use-auth-error-message";
import { useRegister } from "../queries";
import { FormField } from "./form-field";
import { PasswordInput } from "./password-input";

interface RegisterFormProps {
	dict: Dictionary["auth"];
	lang: Locale;
}

type FieldKey = "name" | "username" | "email" | "password" | "terms";

type FormState = {
	fieldErrors: Partial<Record<FieldKey, string>>;
};

const emptyState: FormState = { fieldErrors: {} };

export const RegisterForm: FC<RegisterFormProps> = ({ dict, lang }) => {
	const register = useRegister();
	const pickMessage = useAuthErrorMessage(dict.errors);
	const [agreed, setAgreed] = useState(false);

	const [state, formAction, isPending] = useActionState<FormState, FormData>(
		async (_prev, formData) => {
			const parsed = registerSchema(dict.errors).safeParse({
				name: formData.get("name"),
				username: formData.get("username"),
				email: formData.get("email"),
				password: formData.get("password"),
				terms: formData.get("terms"),
			});

			if (!parsed.success) {
				const fieldErrors: FormState["fieldErrors"] = {};
				for (const issue of parsed.error.issues) {
					const key = issue.path[0] as FieldKey;
					if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
				}
				return { fieldErrors };
			}

			try {
				await register.mutateAsync({
					name: parsed.data.name,
					username: parsed.data.username,
					email: parsed.data.email,
					password: parsed.data.password,
				});
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
			id="auth-panel-register"
			role="tabpanel"
			aria-labelledby="auth-tab-register"
			action={formAction}
			className="flex flex-col gap-5"
			noValidate
		>
			<FormField
				htmlFor="reg-name"
				label={dict.register.nameLabel}
				hint={dict.register.nameHint}
				error={fieldErrors.name}
			>
				<Input
					id="reg-name"
					name="name"
					type="text"
					autoComplete="name"
					placeholder={dict.register.namePlaceholder}
					error={!!fieldErrors.name}
					disabled={isPending}
					aria-invalid={!!fieldErrors.name}
					aria-describedby={
						fieldErrors.name ? "reg-name-error" : "reg-name-hint"
					}
				/>
			</FormField>

			<FormField
				htmlFor="reg-username"
				label={dict.register.usernameLabel}
				hint={dict.register.usernameHint}
				error={fieldErrors.username}
			>
				<Input
					id="reg-username"
					name="username"
					type="text"
					autoComplete="username"
					placeholder={dict.register.usernamePlaceholder}
					error={!!fieldErrors.username}
					disabled={isPending}
					aria-invalid={!!fieldErrors.username}
					aria-describedby={
						fieldErrors.username ? "reg-username-error" : "reg-username-hint"
					}
				/>
			</FormField>

			<FormField
				htmlFor="reg-email"
				label={dict.register.emailLabel}
				error={fieldErrors.email}
			>
				<Input
					id="reg-email"
					name="email"
					type="email"
					autoComplete="email"
					placeholder={dict.register.emailPlaceholder}
					error={!!fieldErrors.email}
					disabled={isPending}
					aria-invalid={!!fieldErrors.email}
					aria-describedby={fieldErrors.email ? "reg-email-error" : undefined}
				/>
			</FormField>

			<FormField
				htmlFor="reg-password"
				label={dict.register.passwordLabel}
				hint={dict.register.passwordHint}
				error={fieldErrors.password}
			>
				<PasswordInput
					id="reg-password"
					name="password"
					autoComplete="new-password"
					placeholder={dict.register.passwordPlaceholder}
					error={!!fieldErrors.password}
					disabled={isPending}
					showLabel={dict.togglePassword.show}
					hideLabel={dict.togglePassword.hide}
					aria-invalid={!!fieldErrors.password}
					aria-describedby={
						fieldErrors.password ? "reg-password-error" : "reg-password-hint"
					}
				/>
			</FormField>

			<div className="flex flex-col gap-1">
				<label className="flex items-start gap-3 text-sm leading-snug text-subtle cursor-pointer">
					<Checkbox
						name="terms"
						checked={agreed}
						onCheckedChange={checked => setAgreed(checked === true)}
						disabled={isPending}
						className="mt-0.5"
						aria-invalid={!!fieldErrors.terms || undefined}
						aria-describedby={fieldErrors.terms ? "reg-terms-error" : undefined}
					/>
					<span>
						{dict.register.terms}{" "}
						<Link
							href={`/${lang}/terms`}
							className="font-medium text-primary hover:underline"
						>
							{dict.register.termsLink}
						</Link>{" "}
						{dict.register.and}{" "}
						<Link
							href={`/${lang}/privacy`}
							className="font-medium text-primary hover:underline"
						>
							{dict.register.privacyLink}
						</Link>
					</span>
				</label>
				{fieldErrors.terms && (
					<p
						id="reg-terms-error"
						className="pl-7 text-xs text-danger"
						aria-live="polite"
					>
						{fieldErrors.terms}
					</p>
				)}
			</div>

			<Button type="submit" size="lg" disabled={isPending}>
				{isPending ? dict.register.submitting : dict.register.submit}
			</Button>

			{/* <AuthDivider label={dict.divider} /> */}

			{/* <SocialButtons
				mode="register"
				returnTo={redirectTo}
				labels={dict.social}
			/> */}
		</form>
	);
};
