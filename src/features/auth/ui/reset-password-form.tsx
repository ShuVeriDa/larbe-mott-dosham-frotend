"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { Button, Input } from "@/shared/ui";
import { Check, LockKeyhole } from "lucide-react";
import { type FC, useActionState } from "react";
import { toast } from "sonner";
import { resetSchema } from "../lib/schemas";
import { useAuthErrorMessage } from "../lib/use-auth-error-message";
import { useForgotPassword } from "../queries";
import { FormField } from "./form-field";

interface ResetPasswordFormProps {
	dict: Dictionary["auth"];
	onBack: () => void;
}

type FormState = {
	fieldErrors: Partial<Record<"email", string>>;
	done: boolean;
};

const emptyState: FormState = { fieldErrors: {}, done: false };

export const ResetPasswordForm: FC<ResetPasswordFormProps> = ({
	dict,
	onBack,
}) => {
	const forgot = useForgotPassword();
	const pickMessage = useAuthErrorMessage(dict.errors);

	const [state, formAction, isPending] = useActionState<FormState, FormData>(
		async (_prev, formData) => {
			const parsed = resetSchema(dict.errors).safeParse({
				email: formData.get("email"),
			});

			if (!parsed.success) {
				const fieldErrors: FormState["fieldErrors"] = {};
				for (const issue of parsed.error.issues) {
					const key = issue.path[0] as "email";
					if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
				}
				return { fieldErrors, done: false };
			}

			try {
				await forgot.mutateAsync(parsed.data);
				return { fieldErrors: {}, done: true };
			} catch (error) {
				toast.error(pickMessage(error));
				return { fieldErrors: {}, done: false };
			}
		},
		emptyState,
	);

	if (state.done) {
		return (
			<div
				className="flex flex-col items-center gap-4 py-6 text-center"
				role="status"
				aria-live="polite"
			>
				<div className="flex size-14 items-center justify-center rounded-full bg-success-dim text-success">
					<Check size={24} strokeWidth={2.5} />
				</div>
				<div className="flex flex-col gap-1">
					<h3 className="text-lg font-semibold text-foreground">
						{dict.reset.success.title}
					</h3>
					<p className="max-w-[280px] text-sm text-muted">
						{dict.reset.success.text}
					</p>
				</div>
				<button
					type="button"
					onClick={onBack}
					className="mt-2 text-sm font-medium text-primary hover:underline"
				>
					{dict.reset.back}
				</button>
			</div>
		);
	}

	return (
		<form action={formAction} className="flex flex-col gap-5" noValidate>
			<div className="flex flex-col items-center gap-3 text-center">
				<div className="flex size-12 items-center justify-center rounded-full bg-primary-dim text-primary">
					<LockKeyhole size={22} />
				</div>
				<h3 className="text-lg font-semibold text-foreground">
					{dict.reset.title}
				</h3>
				<p className="text-sm text-muted">{dict.reset.subtitle}</p>
			</div>

			<FormField
				htmlFor="reset-email"
				label={dict.reset.emailLabel}
				error={state.fieldErrors.email}
			>
				<Input
					id="reset-email"
					name="email"
					type="email"
					autoComplete="email"
					placeholder={dict.reset.emailPlaceholder}
					error={!!state.fieldErrors.email}
					disabled={isPending}
					aria-invalid={!!state.fieldErrors.email}
					aria-describedby={
						state.fieldErrors.email ? "reset-email-error" : undefined
					}
				/>
			</FormField>

			<Button type="submit" size="lg" disabled={isPending}>
				{isPending ? dict.reset.submitting : dict.reset.submit}
			</Button>

			<div className="text-center">
				<button
					type="button"
					onClick={onBack}
					className="text-sm font-medium text-primary hover:underline"
				>
					{dict.reset.back}
				</button>
			</div>
		</form>
	);
};
