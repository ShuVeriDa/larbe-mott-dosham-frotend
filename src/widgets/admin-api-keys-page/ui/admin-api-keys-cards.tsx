"use client";

import type { ApiKey } from "@/features/admin-api-keys";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { BanIcon, PencilIcon } from "lucide-react";
import type { FC } from "react";
import { formatDate, getKeyStatus } from "../lib/format";
import { KeyIcon } from "./key-icon";
import { RoleBadge } from "./role-badge";
import { StatusBadge } from "./status-badge";

interface AdminApiKeysCardsProps {
	dict: Dictionary["admin"]["apiKeys"];
	items: ApiKey[];
	onEdit: (key: ApiKey) => void;
	onRevoke: (key: ApiKey) => void;
	isFetching?: boolean;
}

export const AdminApiKeysCards: FC<AdminApiKeysCardsProps> = ({
	dict,
	items,
	onEdit,
	onRevoke,
	isFetching,
}) => (
	<div
		className={cn(
			"md:hidden flex flex-col gap-3 transition-opacity",
			isFetching && "opacity-60",
		)}
	>
		{items.map((key) => {
			const status = getKeyStatus(key);
			const disabled = status !== "active";
			return (
				<article
					key={key.id}
					className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4"
				>
					<div className="flex items-center gap-3 mb-3">
						<KeyIcon seed={key.id} size="md" />
						<div className="min-w-0">
							<div className="font-semibold text-[var(--text)] text-base truncate">
								{key.name}
							</div>
							<div className="font-mono text-xs text-[var(--text-muted)] truncate">
								{key.prefix}
							</div>
						</div>
					</div>
					<div className="flex flex-wrap gap-3 items-center">
						<RoleBadge role={key.role} dict={dict.roles} />
						<StatusBadge status={status} dict={dict.statuses} />
						<span className="text-xs text-[var(--text-muted)]">
							{dict.columns.createdAt}: {formatDate(key.createdAt) ?? "—"}
						</span>
						<span className="text-xs text-[var(--text-muted)]">
							{dict.columns.lastUsed}: {formatDate(key.lastUsedAt) ?? "—"}
						</span>
					</div>
					<div className="flex gap-2 mt-3 pt-3 border-t border-[var(--border)]">
						<Button
							type="button"
							variant="secondary"
							size="sm"
							className="flex-1"
							disabled={disabled}
							onClick={() => onEdit(key)}
						>
							<PencilIcon />
							{dict.actions.edit}
						</Button>
						<Button
							type="button"
							variant="secondary"
							size="sm"
							className="flex-1"
							disabled={disabled}
							onClick={() => onRevoke(key)}
						>
							<BanIcon />
							{dict.actions.revoke}
						</Button>
					</div>
				</article>
			);
		})}
	</div>
);
