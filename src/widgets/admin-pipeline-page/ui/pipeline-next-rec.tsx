"use client";

import { useUnifiedLog } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

interface Props {
	dict: Dictionary["admin"]["pipeline"];
	disabled: boolean;
	onRun: (slug: string) => void;
}

export const PipelineNextRec: FC<Props> = ({ dict, disabled, onRun }) => {
	const query = useUnifiedLog();
	const next = query.data?.nextRecommended ?? null;

	if (query.isLoading) {
		return (
			<div className="h-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] animate-pulse mb-8" />
		);
	}

	if (!next) {
		return (
			<div className="flex items-center gap-4 p-4 px-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl mb-8">
				<span className="text-xl" aria-hidden>
					✓
				</span>
				<div className="flex-1 min-w-0">
					<div className="text-xs text-[var(--text-muted)] font-medium">
						{dict.nextRec.title}
					</div>
					<div className="text-sm font-semibold text-[var(--text-secondary)]">
						{dict.nextRec.empty}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-4 p-4 px-5 bg-[var(--accent-dim)] border border-[var(--border-accent)] rounded-2xl mb-8 flex-wrap">
			<span className="text-xl" aria-hidden>
				💡
			</span>
			<div className="flex-1 min-w-0">
				<div className="text-xs text-[var(--text-muted)] font-medium">
					{dict.nextRec.title}
				</div>
				<div className="text-sm font-semibold text-[var(--accent)] truncate">
					{next.title}
				</div>
			</div>
			<button
				type="button"
				disabled={disabled}
				onClick={() => onRun(next.slug)}
				className="btn btn-sm btn-primary disabled:opacity-40"
			>
				{dict.nextRec.run}
			</button>
		</div>
	);
};
