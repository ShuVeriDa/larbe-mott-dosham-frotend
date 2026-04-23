import type { SuggestionStatus } from "@/features/suggestions";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface StatusBadgeProps {
	status: SuggestionStatus;
	dict: Dictionary["adminSuggestionDetail"]["header"];
	size?: "sm" | "lg";
}

const toneClass: Record<SuggestionStatus, string> = {
	PENDING: "bg-warning-dim text-warning",
	APPROVED: "bg-success-dim text-success",
	REJECTED: "bg-danger-dim text-danger",
};

export const StatusBadge: FC<StatusBadgeProps> = ({
	status,
	dict,
	size = "sm",
}) => {
	const label =
		status === "PENDING"
			? dict.statusPending
			: status === "APPROVED"
				? dict.statusApproved
				: dict.statusRejected;

	return (
		<span
			className={cn(
				"inline-flex items-center font-semibold tracking-[0.02em]",
				size === "lg"
					? "px-3 py-1 rounded-sm text-sm"
					: "px-2 py-0.5 rounded-xs text-xs",
				toneClass[status],
			)}
		>
			{label}
		</span>
	);
};
