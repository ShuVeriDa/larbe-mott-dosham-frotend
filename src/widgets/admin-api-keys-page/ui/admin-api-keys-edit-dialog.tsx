"use client";

import type { ApiKey, ApiKeyRoleUi } from "@/features/admin-api-keys";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
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
import {
	API_TO_UI_ROLE,
	dateTimeLocalToIso,
	formatDateTimeLocalInput,
} from "../lib/format";

interface AdminApiKeysEditDialogProps {
	apiKey: ApiKey | null;
	dict: Dictionary["admin"]["apiKeys"]["edit"];
	rolesDict: Dictionary["admin"]["apiKeys"]["roles"];
	roleDescriptions: Dictionary["admin"]["apiKeys"]["roleDescriptions"];
	saving: boolean;
	onClose: () => void;
	onSubmit: (input: {
		name: string;
		role: ApiKeyRoleUi;
		expiresAt: string | null | undefined;
	}) => void;
}

const ROLE_OPTIONS: ApiKeyRoleUi[] = ["readonly", "editor", "admin"];

interface EditFormProps {
	apiKey: ApiKey;
	dict: Dictionary["admin"]["apiKeys"]["edit"];
	rolesDict: Dictionary["admin"]["apiKeys"]["roles"];
	roleDescriptions: Dictionary["admin"]["apiKeys"]["roleDescriptions"];
	saving: boolean;
	onClose: () => void;
	onSubmit: (input: {
		name: string;
		role: ApiKeyRoleUi;
		expiresAt: string | null | undefined;
	}) => void;
}

const EditForm: FC<EditFormProps> = ({
	apiKey,
	dict,
	rolesDict,
	roleDescriptions,
	saving,
	onClose,
	onSubmit,
}) => {
	const nameId = useId();
	const roleId = useId();
	const expiresId = useId();

	const initialExpires = formatDateTimeLocalInput(apiKey.expiresAt);
	const [name, setName] = useState(apiKey.name);
	const [role, setRole] = useState<ApiKeyRoleUi>(API_TO_UI_ROLE[apiKey.role]);
	const [expiresAt, setExpiresAt] = useState(initialExpires);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const expiresIso = dateTimeLocalToIso(expiresAt);
		const expiresChanged = expiresAt !== initialExpires;
		onSubmit({
			name,
			role,
			expiresAt: expiresChanged ? expiresIso : undefined,
		});
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>
					{dict.titleWithName.replace("{name}", apiKey.name)}
				</DialogTitle>
				<DialogDescription>
					{dict.subtitle.replace("{prefix}", apiKey.prefix)}
				</DialogDescription>
			</DialogHeader>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
				<div className="flex flex-col gap-1">
					<label htmlFor={nameId} className="text-xs text-[var(--text-muted)]">
						{dict.name}
					</label>
					<Input
						id={nameId}
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={saving}
						maxLength={100}
						required
						autoFocus
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor={roleId} className="text-xs text-[var(--text-muted)]">
						{dict.role}
					</label>
					<Select
						value={role}
						onValueChange={(v) => setRole(v as ApiKeyRoleUi)}
						disabled={saving}
					>
						<SelectTrigger id={roleId} className="w-full h-10">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{ROLE_OPTIONS.map((r) => (
								<SelectItem key={r} value={r}>
									{rolesDict[r]} — {roleDescriptions[r]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-1">
					<label
						htmlFor={expiresId}
						className="text-xs text-[var(--text-muted)]"
					>
						{dict.expiresAt}
					</label>
					<Input
						id={expiresId}
						type="datetime-local"
						value={expiresAt}
						onChange={(e) => setExpiresAt(e.target.value)}
						disabled={saving}
					/>
					<span className="text-[0.7rem] text-[var(--text-muted)]">
						{dict.expiresAtHint}
					</span>
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

export const AdminApiKeysEditDialog: FC<AdminApiKeysEditDialogProps> = ({
	apiKey,
	dict,
	rolesDict,
	roleDescriptions,
	saving,
	onClose,
	onSubmit,
}) => (
	<Dialog open={!!apiKey} onOpenChange={(o) => (o ? null : onClose())}>
		<DialogContent>
			{apiKey && (
				<EditForm
					key={apiKey.id}
					apiKey={apiKey}
					dict={dict}
					rolesDict={rolesDict}
					roleDescriptions={roleDescriptions}
					saving={saving}
					onClose={onClose}
					onSubmit={onSubmit}
				/>
			)}
		</DialogContent>
	</Dialog>
);
