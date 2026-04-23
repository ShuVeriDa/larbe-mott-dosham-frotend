"use client";

import { useResetPipelineStatus } from "@/features/admin-pipeline-reset";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

interface PipelineBusyBannerProps {
	dict: Dictionary["admin"]["pipelineReset"]["busy"];
}

export const PipelineBusyBanner: FC<PipelineBusyBannerProps> = ({ dict }) => {
	const statusQuery = useResetPipelineStatus();
	const status = statusQuery.data;

	if (!status?.isRunning) return null;

	return (
		<div
			role="alert"
			className="flex items-start gap-3 mb-6 bg-[var(--warning-dim)] border border-[var(--warning)] rounded-2xl p-4 text-sm"
		>
			<span className="text-lg" aria-hidden>
				⏳
			</span>
			<div>
				<div className="font-semibold text-[var(--warning)]">{dict.title}</div>
				<div className="text-xs text-[var(--text-secondary)] mt-1">
					{dict.description.replace(
						"{operation}",
						status.currentOperation ?? "—",
					)}
				</div>
			</div>
		</div>
	);
};
