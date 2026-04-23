"use client";

import type { User } from "@/entities/user";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button, Input } from "@/shared/ui";
import type { FC } from "react";
import { usePersonalForm } from "../model/use-personal-form";

interface FieldProps {
	id: string;
	label: string;
	required?: boolean;
	error?: string;
	hint?: string;
	children: React.ReactNode;
}

const Field: FC<FieldProps> = ({ id, label, required, error, hint, children }) => (
	<div className="flex flex-col gap-2">
		<label htmlFor={id} className="text-sm font-medium text-subtle">
			{label}
			{required && <span className="text-danger ml-1">*</span>}
		</label>
		{children}
		{error ? (
			<p id={`${id}-error`} className="text-xs text-danger" aria-live="polite">
				{error}
			</p>
		) : hint ? (
			<p id={`${id}-hint`} className="text-xs text-muted">
				{hint}
			</p>
		) : null}
	</div>
);

interface PersonalTabProps {
	user: User;
	dict: Dictionary["profile"]["personal"];
}

export const PersonalTab: FC<PersonalTabProps> = ({ user, dict }) => {
	const { values, errors, setField, submit, reset, isPending, dirty } =
		usePersonalForm(user, dict);

	return (
		<form
			className="flex flex-col gap-5"
			onSubmit={e => {
				e.preventDefault();
				void submit();
			}}
			noValidate
		>
			<div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
				<Field id="profile-name" label={dict.nameLabel} required error={errors.name}>
					<Input
						id="profile-name"
						type="text"
						value={values.name}
						disabled={isPending}
						error={!!errors.name}
						autoComplete="name"
						onChange={e => setField("name", e.target.value)}
					/>
				</Field>
				<Field
					id="profile-username"
					label={dict.usernameLabel}
					required
					error={errors.username}
					hint={dict.usernameHint}
				>
					<Input
						id="profile-username"
						type="text"
						value={values.username}
						disabled={isPending}
						error={!!errors.username}
						autoComplete="username"
						onChange={e => setField("username", e.target.value)}
					/>
				</Field>
			</div>

			<Field id="profile-email" label={dict.emailLabel} required error={errors.email}>
				<Input
					id="profile-email"
					type="email"
					value={values.email}
					disabled={isPending}
					error={!!errors.email}
					autoComplete="email"
					onChange={e => setField("email", e.target.value)}
				/>
			</Field>

			<div className="flex gap-3 mt-2 max-sm:flex-col">
				<Button
					type="submit"
					size="md"
					disabled={isPending || !dirty}
					className="max-sm:w-full"
				>
					{dict.save}
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="md"
					disabled={isPending || !dirty}
					onClick={reset}
					className="max-sm:w-full"
				>
					{dict.cancel}
				</Button>
			</div>
		</form>
	);
};
