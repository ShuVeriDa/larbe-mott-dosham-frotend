"use client";

import type { RoleName, UserStatus } from "@/entities/user";
import type {
	AdminUserListItem,
	UpdateAdminUserDto,
} from "@/features/admin-users";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	Button,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import { type FC, type FormEvent, useId, useState } from "react";
import { primaryRole } from "../lib/format";

interface AdminUsersEditDialogProps {
	user: AdminUserListItem | null;
	dict: Dictionary["adminUsers"]["editDialog"];
	rolesDict: Dictionary["adminUsers"]["roles"];
	statusesDict: Dictionary["adminUsers"]["statuses"];
	saving: boolean;
	onClose: () => void;
	onSubmit: (dto: UpdateAdminUserDto) => void;
}

const ROLE_OPTIONS: RoleName[] = ["USER", "EDITOR", "ADMIN"];
const STATUS_OPTIONS: UserStatus[] = ["active", "inactive", "blocked"];

interface FormState {
	name: string;
	username: string;
	email: string;
	role: RoleName;
	status: UserStatus;
}

const toFormState = (user: AdminUserListItem): FormState => ({
	name: user.name,
	username: user.username,
	email: user.email,
	role: primaryRole(user),
	status: user.status,
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
	if (form.status !== original.status) dto.status = form.status;
	return dto;
};

interface EditDialogFormProps {
	user: AdminUserListItem;
	dict: Dictionary["adminUsers"]["editDialog"];
	rolesDict: Dictionary["adminUsers"]["roles"];
	statusesDict: Dictionary["adminUsers"]["statuses"];
	saving: boolean;
	onClose: () => void;
	onSubmit: (dto: UpdateAdminUserDto) => void;
}

const EditDialogForm: FC<EditDialogFormProps> = ({
	user,
	dict,
	rolesDict,
	statusesDict,
	saving,
	onClose,
	onSubmit,
}) => {
	const nameId = useId();
	const usernameId = useId();
	const emailId = useId();
	const roleId = useId();
	const statusId = useId();

	const [original] = useState<FormState>(() => toFormState(user));
	const [form, setForm] = useState<FormState>(original);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const dto = buildDto(form, original);
		if (Object.keys(dto).length === 0) {
			onClose();
			return;
		}
		onSubmit(dto);
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>
					{dict.titleWithName.replace("{name}", user.name)}
				</DialogTitle>
			</DialogHeader>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
				<div className="flex flex-col gap-1">
					<label htmlFor={nameId} className="text-xs text-muted-foreground">
						{dict.name}
					</label>
					<Input
						id={nameId}
						value={form.name}
						onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
						disabled={saving}
						required
						maxLength={64}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label
						htmlFor={usernameId}
						className="text-xs text-muted-foreground"
					>
						{dict.username}
					</label>
					<Input
						id={usernameId}
						value={form.username}
						onChange={(e) =>
							setForm((s) => ({ ...s, username: e.target.value }))
						}
						disabled={saving}
						required
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor={emailId} className="text-xs text-muted-foreground">
						{dict.email}
					</label>
					<Input
						id={emailId}
						type="email"
						value={form.email}
						onChange={(e) =>
							setForm((s) => ({ ...s, email: e.target.value }))
						}
						disabled={saving}
						required
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor={roleId} className="text-xs text-muted-foreground">
						{dict.role}
					</label>
					<Select
						value={form.role}
						onValueChange={(v) =>
							setForm((s) => ({ ...s, role: v as RoleName }))
						}
						disabled={saving}
					>
						<SelectTrigger id={roleId} className="w-full h-10">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{ROLE_OPTIONS.map((role) => (
								<SelectItem key={role} value={role}>
									{rolesDict[role]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor={statusId} className="text-xs text-muted-foreground">
						{dict.status}
					</label>
					<Select
						value={form.status}
						onValueChange={(v) =>
							setForm((s) => ({ ...s, status: v as UserStatus }))
						}
						disabled={saving}
					>
						<SelectTrigger id={statusId} className="w-full h-10">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{STATUS_OPTIONS.map((status) => (
								<SelectItem key={status} value={status}>
									{statusesDict[status]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="secondary"
						onClick={onClose}
						disabled={saving}
					>
						{dict.cancel}
					</Button>
					<Button type="submit" variant="primary" disabled={saving}>
						{saving ? dict.saving : dict.save}
					</Button>
				</DialogFooter>
			</form>
		</>
	);
};

export const AdminUsersEditDialog: FC<AdminUsersEditDialogProps> = ({
	user,
	dict,
	rolesDict,
	statusesDict,
	saving,
	onClose,
	onSubmit,
}) => (
	<Dialog open={!!user} onOpenChange={(o) => (o ? null : onClose())}>
		<DialogContent>
			{user && (
				<EditDialogForm
					key={user.id}
					user={user}
					dict={dict}
					rolesDict={rolesDict}
					statusesDict={statusesDict}
					saving={saving}
					onClose={onClose}
					onSubmit={onSubmit}
				/>
			)}
		</DialogContent>
	</Dialog>
);
