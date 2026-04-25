import type { ApiKeyStatus } from "@/features/admin-api-keys";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface StatusBadgeProps {
	status: ApiKeyStatus;
	dict: Dictionary["admin"]["apiKeys"]["statuses"];
}

const DOT_CLASS: Record<ApiKeyStatus, string> = {
	active: "bg-[var(--success)]",
	revoked: "bg-[var(--danger)]",
	expired: "bg-[var(--text-muted)]",
};

const TEXT_CLASS: Record<ApiKeyStatus, string> = {
	active: "text-[var(--success)]",
	revoked: "text-[var(--danger)]",
	expired: "text-[var(--text-muted)]",
};

export const StatusBadge: FC<StatusBadgeProps> = ({ status, dict }) => (
	<span
		className={cn(
			"inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap",
			TEXT_CLASS[status],
		)}
	>
		<span
			className={cn("w-[7px] h-[7px] rounded-full", DOT_CLASS[status])}
			aria-hidden
		/>
		{dict[status]}
	</span>
);
