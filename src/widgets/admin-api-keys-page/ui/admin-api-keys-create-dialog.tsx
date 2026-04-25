"use client";

import type {
	ApiKeyRoleUi,
	ApiKeyWithSecret,
} from "@/features/admin-api-keys";
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
import { AlertTriangleIcon, CheckIcon, CopyIcon } from "lucide-react";
import { type FC, type FormEvent, useId, useState } from "react";
import { dateTimeLocalToIso } from "../lib/format";

interface AdminApiKeysCreateDialogProps {
	open: boolean;
	dict: Dictionary["admin"]["apiKeys"]["create"];
	rolesDict: Dictionary["admin"]["apiKeys"]["roles"];
	roleDescriptions: Dictionary["admin"]["apiKeys"]["roleDescriptions"];
	toastsDict: Dictionary["admin"]["apiKeys"]["toasts"];
	createdKey: ApiKeyWithSecret | null;
	saving: boolean;
	onClose: () => void;
	onSubmit: (input: {
		name: string;
		role: ApiKeyRoleUi;
		expiresAt: string | null;
	}) => void;
}

const ROLE_OPTIONS: ApiKeyRoleUi[] = ["readonly", "editor", "admin"];

interface CreateFormProps {
	dict: Dictionary["admin"]["apiKeys"]["create"];
	rolesDict: Dictionary["admin"]["apiKeys"]["roles"];
	roleDescriptions: Dictionary["admin"]["apiKeys"]["roleDescriptions"];
	saving: boolean;
	onClose: () => void;
	onSubmit: (input: {
		name: string;
		role: ApiKeyRoleUi;
		expiresAt: string | null;
	}) => void;
}

const CreateForm: FC<CreateFormProps> = ({
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

	const [name, setName] = useState("");
	const [role, setRole] = useState<ApiKeyRoleUi>("readonly");
	const [expiresAt, setExpiresAt] = useState("");

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit({
			name,
			role,
			expiresAt: dateTimeLocalToIso(expiresAt),
		});
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>{dict.title}</DialogTitle>
				<DialogDescription>{dict.subtitle}</DialogDescription>
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
						placeholder={dict.namePlaceholder}
						disabled={saving}
						maxLength={100}
						required
						autoFocus
					/>
					<span className="text-[0.7rem] text-[var(--text-muted)]">
						{dict.nameHint}
					</span>
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
						{saving ? dict.submitting : dict.submit}
					</Button>
				</DialogFooter>
			</form>
		</>
	);
};

interface SecretPanelProps {
	dict: Dictionary["admin"]["apiKeys"]["create"];
	toastsDict: Dictionary["admin"]["apiKeys"]["toasts"];
	createdKey: ApiKeyWithSecret;
	onClose: () => void;
}

const SecretPanel: FC<SecretPanelProps> = ({
	dict,
	toastsDict,
	createdKey,
	onClose,
}) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(createdKey.key);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			window.alert(toastsDict.copyError);
		}
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>{dict.secretTitle}</DialogTitle>
				<DialogDescription>{dict.secretSubtitle}</DialogDescription>
			</DialogHeader>
			<div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border-accent)] rounded-md p-3">
				<code className="font-mono text-sm text-[var(--accent)] flex-1 break-all select-all">
					{createdKey.key}
				</code>
				<Button
					type="button"
					variant="secondary"
					size="sm"
					onClick={handleCopy}
					aria-label={dict.copy}
				>
					{copied ? (
						<>
							<CheckIcon />
							{dict.copied}
						</>
					) : (
						<>
							<CopyIcon />
							{dict.copy}
						</>
					)}
				</Button>
			</div>
			<div className="flex items-center gap-2 text-xs text-[var(--warning)]">
				<AlertTriangleIcon className="size-4 shrink-0" aria-hidden />
				{dict.secretWarning}
			</div>
			<DialogFooter>
				<Button type="button" variant="primary" onClick={onClose}>
					{dict.close}
				</Button>
			</DialogFooter>
		</>
	);
};

export const AdminApiKeysCreateDialog: FC<AdminApiKeysCreateDialogProps> = ({
	open,
	dict,
	rolesDict,
	roleDescriptions,
	toastsDict,
	createdKey,
	saving,
	onClose,
	onSubmit,
}) => (
	<Dialog open={open} onOpenChange={(o) => (o ? null : onClose())}>
		<DialogContent>
			{createdKey ? (
				<SecretPanel
					dict={dict}
					toastsDict={toastsDict}
					createdKey={createdKey}
					onClose={onClose}
				/>
			) : (
				<CreateForm
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
