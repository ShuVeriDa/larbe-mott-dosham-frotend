import type { ResetResult } from "@/features/admin-pipeline-reset";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatNumber, formatSizeMb } from "../lib";

interface ResetResultBannerProps {
	result: ResetResult | null;
	errorMessage: string | null;
	dict: Dictionary["admin"]["pipelineReset"]["result"];
}

export const ResetResultBanner: FC<ResetResultBannerProps> = ({
	result,
	errorMessage,
	dict,
}) => {
	if (errorMessage) {
		return (
			<div
				role="alert"
				className={cn(
					"p-4 rounded-2xl text-sm leading-relaxed mb-6",
					"bg-[var(--danger-dim)] text-[var(--danger)] border border-[rgba(248,113,113,0.25)]",
				)}
			>
				{dict.error.replace("{message}", errorMessage)}
			</div>
		);
	}

	if (!result) return null;

	const text = dict.success
		.replace("{entries}", formatNumber(result.unifiedEntries))
		.replace("{snapshots}", formatNumber(result.deletedSnapshots))
		.replace("{freed}", formatSizeMb(result.freedMb));

	return (
		<div
			role="status"
			className={cn(
				"p-4 rounded-2xl text-sm leading-relaxed mb-6",
				"bg-[var(--danger-dim)] text-[var(--danger)] border border-[rgba(248,113,113,0.15)]",
			)}
		>
			{text}
		</div>
	);
};
