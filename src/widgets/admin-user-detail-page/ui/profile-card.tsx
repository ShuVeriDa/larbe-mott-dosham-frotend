"use client";

import type { RoleName } from "@/entities/user";
import type {
	AdminUserDetail,
	UpdateAdminUserDto,
} from "@/features/admin-users";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { Button, Input } from "@/shared/ui";
import { type FC, type FormEvent, useEffect, useId, useState } from "react";
import { primaryRole } from "../lib/format";

const ROLE_OPTIONS: Array<{ value: RoleName; icon: string }> = [
	{ value: "USER", icon: "👤" },
	{ value: "EDITOR", icon: "✏️" },
	{ value: "ADMIN", icon: "⚡" },
];

interface FormState {
	name: string;
	username: string;
	email: string;
	role: RoleName;
}

const toFormState = (user: AdminUserDetail): FormState => ({
	name: user.name,
	username: user.username,
	email: user.email,
	role: primaryRole(user),
});

const buildDto = (
	form: FormState,
	original: FormState,
): UpdateAdminUserDto => {
	const dto: UpdateAdminUserDto = {};
	if (form.name.trim() && form.name !== original.name)
		dto.name = form.name.trim();
	if (form.username.trim() && form.username !== original.username)
		dto.username = form.username.trim();
	if (form.email.trim() && form.email !== original.email)
		dto.email = form.email.trim();
	if (form.role !== original.role) dto.role = form.role;
	return dto;
};

interface ProfileCardProps {
	user: AdminUserDetail;
	dict: Dictionary["adminUserDetail"]["profile"];
	rolesDict: Dictionary["adminUsers"]["roles"];
	isEditing: boolean;
	isSaving: boolean;
	onStartEdit: () => void;
	onCancel: () => void;
	onSubmit: (dto: UpdateAdminUserDto) => void;
}

export const ProfileCard: FC<ProfileCardProps> = ({
	user,
	dict,
	rolesDict,
	isEditing,
	isSaving,
	onStartEdit,
	onCancel,
	onSubmit,
}) => {
	const nameId = useId();
	const usernameId = useId();
	const emailId = useId();
	const roleName = useId();

	const [original, setOriginal] = useState<FormState>(() => toFormState(user));
	const [form, setForm] = useState<FormState>(original);

	useEffect(() => {
		if (!isEditing) {
			const next = toFormState(user);
			setOriginal(next);
			setForm(next);
		}
	}, [isEditing, user]);

	const handleCancel = () => {
		setForm(original);
		onCancel();
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(buildDto(form, original));
	};

	return (
		<section className="rounded-lg border border-border bg-surface overflow-hidden mb-6">
			<div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
				<h2 className="text-sm font-semibold text-foreground">{dict.title}</h2>
				{!isEditing && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onStartEdit}
					>
						✏️ {dict.edit}
					</Button>
				)}
			</div>
			<form
				className="p-5 flex flex-col gap-5"
				onSubmit={handleSubmit}
				noValidate
			>
				<div className="flex flex-col gap-2">
					<label
						htmlFor={nameId}
						className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
					>
						{dict.name}
					</label>
					<Input
						id={nameId}
						value={form.name}
						onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
						disabled={!isEditing || isSaving}
						required
						maxLength={64}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor={usernameId}
						className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
					>
						{dict.username}
					</label>
					<Input
						id={usernameId}
						value={form.username}
						className="font-mono"
						onChange={(e) =>
							setForm((s) => ({ ...s, username: e.target.value }))
						}
						disabled={!isEditing || isSaving}
						minLength={2}
						maxLength={16}
						required
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor={emailId}
						className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
					>
						{dict.email}
					</label>
					<Input
						id={emailId}
						type="email"
						value={form.email}
						onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
						disabled={!isEditing || isSaving}
						required
					/>
				</div>

				<div className="flex flex-col gap-2">
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						{dict.role}
					</span>
					<div
						role="radiogroup"
						aria-label={dict.role}
						className="grid grid-cols-3 gap-2"
					>
						{ROLE_OPTIONS.map((opt) => {
							const inputId = `${roleName}-${opt.value}`;
							const checked = form.role === opt.value;
							return (
								<label
									key={opt.value}
									htmlFor={inputId}
									className={cn(
										"relative flex flex-col items-center gap-1 px-2 py-3 rounded-md border text-xs font-medium transition-colors cursor-pointer text-center",
										checked
											? "border-primary bg-primary-dim text-primary"
											: "border-border text-muted-foreground hover:border-edge-hover hover:text-foreground",
										(!isEditing || isSaving) &&
											"opacity-60 cursor-not-allowed pointer-events-none",
									)}
								>
									<input
										id={inputId}
										type="radio"
										name={roleName}
										value={opt.value}
										checked={checked}
										disabled={!isEditing || isSaving}
										onChange={() =>
											setForm((s) => ({ ...s, role: opt.value }))
										}
										className="sr-only"
									/>
									<span className="text-base" aria-hidden>
										{opt.icon}
									</span>
									<span>{rolesDict[opt.value]}</span>
								</label>
							);
						})}
					</div>
				</div>

				{isEditing && (
					<div className="flex gap-3 pt-5 border-t border-border">
						<Button type="submit" variant="primary" size="md" disabled={isSaving}>
							{isSaving ? dict.saving : dict.save}
						</Button>
						<Button
							type="button"
							variant="secondary"
							size="md"
							onClick={handleCancel}
							disabled={isSaving}
						>
							{dict.cancel}
						</Button>
					</div>
				)}
			</form>
		</section>
	);
};
