"use client";

import type {
	MergeLogEntry,
	PipelineFullStatus,
} from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatNumber, interpolate } from "../lib/format";

interface Props {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineRollback"]["action"];
	selected: MergeLogEntry | null;
	status: PipelineFullStatus | undefined;
	lastStep: MergeLogEntry | null;
	disabled: boolean;
	isLoading: boolean;
	onRun: () => void;
}

export const RollbackActionPanel: FC<Props> = ({
	lang,
	dict,
	selected,
	status,
	lastStep,
	disabled,
	isLoading,
	onRun,
}) => {
	const hasSelection = !!selected;
	const currentEntries = status?.unified.entries ?? 0;

	const title = hasSelection
		? interpolate(dict.selectedTitle, { step: selected.step })
		: dict.idleTitle;

	const desc = hasSelection
		? interpolate(dict.selectedDesc, { label: selected.title || selected.slug })
		: dict.idleDesc;

	return (
		<section
			aria-live="polite"
			className={cn(
				"border rounded-2xl p-6 mb-8 text-center transition-colors",
				hasSelection
					? "border-[var(--warning)] bg-[var(--warning-dim)]"
					: "border-[var(--border)] bg-[var(--surface)]",
			)}
		>
			<div
				className={cn(
					"w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4",
					hasSelection
						? "bg-[var(--warning-dim)] text-[var(--warning)]"
						: "bg-[var(--surface-active)] text-[var(--text-muted)]",
				)}
				aria-hidden
			>
				⏪
			</div>
			<h2 className="text-lg font-bold text-[var(--text)] mb-1">{title}</h2>
			<p className="text-sm text-[var(--text-muted)] max-w-[480px] mx-auto mb-4">
				{desc}
			</p>

			{hasSelection && lastStep ? (
				<div className="flex items-center justify-center gap-4 mb-5 flex-wrap">
					<div className="text-center">
						<div className="text-lg font-bold text-[var(--text)] tabular-nums">
							{formatNumber(currentEntries, lang)}
						</div>
						<div className="text-xs text-[var(--text-muted)]">
							{interpolate(dict.fromLabel, { step: lastStep.step })}
						</div>
					</div>
					<span className="text-[var(--text-faint)] text-xl" aria-hidden>
						→
					</span>
					<div className="text-center">
						<div className="text-lg font-bold text-[var(--warning)] tabular-nums">
							{formatNumber(selected.totalUnifiedEntries, lang)}
						</div>
						<div className="text-xs text-[var(--text-muted)]">
							{interpolate(dict.toLabel, {
								step: selected.step,
								label: selected.title || selected.slug,
							})}
						</div>
					</div>
				</div>
			) : null}

			<button
				type="button"
				onClick={onRun}
				disabled={disabled || !hasSelection || isLoading}
				className="btn btn-md btn-warning disabled:opacity-40"
			>
				{dict.run}
			</button>
			<div className="text-xs text-[var(--text-faint)] mt-3 font-mono">
				{dict.endpoint}
			</div>
		</section>
	);
};
