"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import type { FC } from "react";
import { usePasswordForm } from "../model/use-password-form";
import { PasswordField } from "./password-field";

interface SecurityTabProps {
	dict: Dictionary["profile"]["security"];
}

const SectionTitle: FC<{ children: React.ReactNode }> = ({ children }) => (
	<h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4 pb-2 border-b border-edge">
		{children}
	</h2>
);

const Field: FC<{
	id: string;
	label: string;
	error?: string;
	hint?: string;
	children: React.ReactNode;
}> = ({ id, label, error, hint, children }) => (
	<div className="flex flex-col gap-2">
		<label htmlFor={id} className="text-sm font-medium text-subtle">
			{label}
		</label>
		{children}
		{error ? (
			<p className="text-xs text-danger" aria-live="polite">
				{error}
			</p>
		) : hint ? (
			<p className="text-xs text-muted">{hint}</p>
		) : null}
	</div>
);

export const SecurityTab: FC<SecurityTabProps> = ({ dict }) => {
	const { values, errors, setField, submit, isPending } = usePasswordForm(dict);

	return (
		<section>
			<SectionTitle>{dict.title}</SectionTitle>
			<form
				className="flex flex-col gap-5"
				onSubmit={e => {
					e.preventDefault();
					void submit();
				}}
				noValidate
			>
				<Field
					id="profile-current-pw"
					label={dict.currentPasswordLabel}
					error={errors.currentPassword}
				>
					<PasswordField
						id="profile-current-pw"
						value={values.currentPassword}
						placeholder={dict.currentPasswordPlaceholder}
						autoComplete="current-password"
						disabled={isPending}
						showLabel={dict.togglePasswordShow}
						hideLabel={dict.togglePasswordHide}
						error={errors.currentPassword}
						onChange={v => setField("currentPassword", v)}
					/>
				</Field>

				<div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
					<Field
						id="profile-new-pw"
						label={dict.newPasswordLabel}
						error={errors.newPassword}
						hint={dict.newPasswordHint}
					>
						<PasswordField
							id="profile-new-pw"
							value={values.newPassword}
							placeholder={dict.newPasswordPlaceholder}
							autoComplete="new-password"
							disabled={isPending}
							showLabel={dict.togglePasswordShow}
							hideLabel={dict.togglePasswordHide}
							error={errors.newPassword}
							onChange={v => setField("newPassword", v)}
						/>
					</Field>
					<Field
						id="profile-confirm-pw"
						label={dict.confirmPasswordLabel}
						error={errors.confirmPassword}
					>
						<PasswordField
							id="profile-confirm-pw"
							value={values.confirmPassword}
							placeholder={dict.confirmPasswordPlaceholder}
							autoComplete="new-password"
							disabled={isPending}
							showLabel={dict.togglePasswordShow}
							hideLabel={dict.togglePasswordHide}
							error={errors.confirmPassword}
							onChange={v => setField("confirmPassword", v)}
						/>
					</Field>
				</div>

				<div className="flex gap-3 mt-2 max-sm:flex-col">
					<Button
						type="submit"
						size="md"
						disabled={isPending}
						className="max-sm:w-full"
					>
						{dict.submit}
					</Button>
				</div>
			</form>
		</section>
	);
};
