"use client";

import { useUnifiedLog } from "@/features/admin-pipeline-unify";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineUnify"];
	onRun: (slug: string) => void;
	disabled?: boolean;
}

export const UnifyNextRec: FC<Props> = ({ dict, onRun, disabled }) => {
	const query = useUnifiedLog();
	const next = query.data?.nextRecommended;

	if (query.isLoading || !query.data) return null;
	if (!next) {
		return (
			<div className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--success)] bg-[var(--success-dim)] mb-8">
				<span aria-hidden className="text-xl">
					✅
				</span>
				<div className="flex-1 text-sm font-semibold text-[var(--success)]">
					{dict.nextRec.allDone}
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border-accent)] bg-[var(--accent-dim)] mb-8 flex-wrap">
			<span aria-hidden className="text-xl">
				💡
			</span>
			<div className="flex-1 min-w-0">
				<div className="text-xs text-[var(--text-muted)] font-medium">
					{dict.nextRec.label}
				</div>
				<div className="text-sm font-semibold text-[var(--accent)] truncate">
					{dict.nextRec.value.replace("{slug}", next.slug)}
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
