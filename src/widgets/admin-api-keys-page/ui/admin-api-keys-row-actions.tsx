"use client";

import type { ApiKey, ApiKeyStatus } from "@/features/admin-api-keys";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import { BanIcon, PencilIcon } from "lucide-react";
import type { FC } from "react";

interface AdminApiKeysRowActionsProps {
	status: ApiKeyStatus;
	apiKey: ApiKey;
	dict: Dictionary["admin"]["apiKeys"]["actions"];
	onEdit: (key: ApiKey) => void;
	onRevoke: (key: ApiKey) => void;
}

export const AdminApiKeysRowActions: FC<AdminApiKeysRowActionsProps> = ({
	status,
	apiKey,
	dict,
	onEdit,
	onRevoke,
}) => {
	const disabled = status !== "active";
	return (
		<div className="flex gap-1 justify-end">
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label={dict.edit}
				title={dict.edit}
				disabled={disabled}
				onClick={() => onEdit(apiKey)}
			>
				<PencilIcon />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label={dict.revoke}
				title={dict.revoke}
				disabled={disabled}
				onClick={() => onRevoke(apiKey)}
				className="hover:bg-[var(--danger-dim)] hover:text-[var(--danger)]"
			>
				<BanIcon />
			</Button>
		</div>
	);
};
