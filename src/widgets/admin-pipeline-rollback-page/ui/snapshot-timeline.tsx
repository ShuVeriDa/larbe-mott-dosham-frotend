"use client";

import type { MergeLogEntry } from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatDateTime, formatMb, formatNumber, interpolate } from "../lib/format";

interface Props {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineRollback"]["timeline"];
	steps: MergeLogEntry[];
	currentStep: number | null;
	selectedStep: number | null;
	disabled: boolean;
	onSelect: (step: number) => void;
}

export const SnapshotTimeline: FC<Props> = ({
	lang,
	dict,
	steps,
	currentStep,
	selectedStep,
	disabled,
	onSelect,
}) => {
	if (!steps.length) {
		return (
			<div className="border border-dashed border-[var(--border)] rounded-2xl p-8 text-center text-sm text-[var(--text-muted)] mb-8">
				{dict.empty}
			</div>
		);
	}

	return (
		<>
			<div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
				<h2 className="text-lg font-semibold text-[var(--text)]">
					{dict.title}
				</h2>
				<span className="text-xs text-[var(--text-muted)]">{dict.helper}</span>
			</div>

			<ol className="relative mb-8" role="list">
				{steps.map((entry, idx) => {
					const isCurrent = entry.step === currentStep;
					const isSelected = entry.step === selectedStep;
					const isLast = idx === steps.length - 1;
					const disabledItem = disabled || isCurrent || !entry.snapshotExists;

					return (
						<li key={entry.step} className="flex gap-4 py-2 relative">
							<div className="shrink-0 w-12 flex justify-center pt-0.5 relative">
								<div
									className={cn(
										"w-3.5 h-3.5 rounded-full border-[3px] relative z-[1] transition-colors",
										isCurrent
											? "bg-[var(--accent)] border-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)]"
											: isSelected
												? "bg-[var(--warning)] border-[var(--warning)]"
												: "bg-[var(--bg)] border-[var(--border)]",
									)}
									aria-hidden
								/>
								{!isLast ? (
									<span
										className="absolute left-1/2 top-[22px] bottom-[-8px] w-[2px] -translate-x-1/2 bg-[var(--border)]"
										aria-hidden
									/>
								) : null}
							</div>

							<button
								type="button"
								onClick={() => onSelect(entry.step)}
								disabled={disabledItem}
								aria-pressed={isSelected}
								className={cn(
									"flex-1 min-w-0 text-left border rounded-2xl px-5 py-4 transition-colors",
									isCurrent &&
										"border-[var(--border-accent)] bg-[var(--accent-dim)] cursor-default",
									isSelected &&
										"border-[var(--warning)] bg-[var(--warning-dim)]",
									!isCurrent &&
										!isSelected &&
										"border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]",
									disabledItem && !isCurrent && "opacity-60 cursor-not-allowed",
								)}
							>
								<div className="flex items-center justify-between gap-3 mb-2">
									<span
										className={cn(
											"text-xs font-bold px-2 py-0.5 rounded-full tabular-nums",
											isCurrent
												? "bg-[var(--accent)] text-[var(--accent-on)]"
												: isSelected
													? "bg-[var(--warning)] text-black"
													: "bg-[var(--surface-active)] text-[var(--text-muted)]",
										)}
									>
										{interpolate(dict.stepBadge, { step: entry.step })}
									</span>
									{isCurrent ? (
										<span className="text-xs font-medium text-[var(--accent)] bg-[var(--accent-dim)] px-1.5 py-0.5 rounded">
											{dict.currentTag}
										</span>
									) : !entry.snapshotExists ? (
										<span className="text-xs font-medium text-[var(--danger)]">
											{dict.missingFile}
										</span>
									) : null}
								</div>
								<div
									className={cn(
										"text-sm font-semibold mb-2",
										isCurrent ? "text-[var(--accent)]" : "text-[var(--text)]",
									)}
								>
									{entry.title || entry.slug}
								</div>
								<div className="flex gap-4 flex-wrap text-xs text-[var(--text-muted)]">
									<span>
										{dict.recordsLabel}:{" "}
										<span className="text-[var(--text)] font-medium font-mono">
											{formatNumber(entry.totalUnifiedEntries, lang)}
										</span>
									</span>
									<span>
										{dict.sizeLabel}:{" "}
										<span className="text-[var(--text)] font-medium font-mono">
											{formatMb(entry.snapshotSizeMb, lang)}
										</span>
									</span>
									<span>{formatDateTime(entry.timestamp, lang)}</span>
								</div>
							</button>
						</li>
					);
				})}
			</ol>
		</>
	);
};
