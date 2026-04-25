"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineLoad"]["progress"];
	active: boolean;
	progress: number;
	stepIndex: number;
}

export const LoadProgress: FC<Props> = ({
	dict,
	active,
	progress,
	stepIndex,
}) => {
	if (!active) return null;
	const pct = Math.min(Math.max(progress, 0), 100);
	const label =
		pct >= 100 ? dict.done : (dict.steps[stepIndex] ?? dict.label);
	const done = pct >= 100;

	return (
		<div className="mb-6" aria-live="polite">
			<div className="flex items-center justify-between mb-2">
				<span className="text-sm font-medium text-[var(--text)]">{label}</span>
				<span className="text-sm font-semibold text-[var(--accent)] tabular-nums">
					{Math.round(pct)}%
				</span>
			</div>
			<div className="h-2 bg-[var(--surface-active)] rounded-full overflow-hidden">
				<div
					className={cn(
						"h-full rounded-full transition-[width] duration-500 ease-out",
						done ? "bg-[var(--success)]" : "bg-[var(--accent)]",
					)}
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
};
