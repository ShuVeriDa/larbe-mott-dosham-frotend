"use client";

import type {
	LoadSkipReason,
	PipelineRunResult,
} from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatNumber } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineLoad"];
	lang: Locale;
	result: PipelineRunResult | null;
}

const REASON_CLASS: Record<string, string> = {
	"no word": "bg-[var(--danger-dim)] text-[var(--danger)]",
	"no meanings": "bg-[var(--danger-dim)] text-[var(--danger)]",
	"no nounClass": "bg-[var(--warning-dim)] text-[var(--warning)]",
	duplicate: "bg-[var(--info-dim)] text-[var(--info)]",
};

export const LoadSkippedSample: FC<Props> = ({ dict, lang, result }) => {
	const sample = result?.skippedSample ?? [];
	const skipped = result?.skipped ?? 0;
	const isEmpty = !result;

	const reasonLabel = (reason: string): string => {
		const key = reason as LoadSkipReason;
		return dict.skipped.reasons[key] ?? reason;
	};

	return (
		<section className="mb-8">
			<header className="flex items-center justify-between gap-3 mb-4 flex-wrap">
				<h2 className="text-lg font-semibold text-[var(--text)]">
					{dict.skipped.title}
				</h2>
			</header>
			<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
				<div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
					<span aria-hidden>⏭</span>
					<span className="text-sm font-semibold text-[var(--text)] flex-1">
						{dict.skipped.cardTitle}
					</span>
					{!isEmpty ? (
						<span className="text-xs text-[var(--warning)] bg-[var(--warning-dim)] px-2 py-0.5 rounded-full font-medium">
							{formatNumber(skipped, lang)} {dict.skipped.countSuffix}
						</span>
					) : null}
				</div>
				{isEmpty ? (
					<div className="px-5 py-8 text-sm text-[var(--text-muted)] text-center">
						{dict.skipped.emptyTitle}
					</div>
				) : sample.length === 0 ? (
					<div className="px-5 py-8 text-sm text-[var(--text-muted)] text-center">
						{dict.skipped.emptyTitle}
					</div>
				) : (
					<ul className="max-h-[280px] overflow-y-auto">
						{sample.map((item, idx) => (
							<li
								key={`${item.word}-${idx}`}
								className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border)] last:border-b-0 text-xs font-mono hover:bg-[var(--surface-hover)]"
							>
								<span className="text-[var(--text)] font-medium flex-1 min-w-0 truncate">
									{item.word}
								</span>
								<span
									className={cn(
										"inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium shrink-0",
										REASON_CLASS[item.reason] ??
											"bg-[var(--surface)] text-[var(--text-muted)]",
									)}
								>
									{reasonLabel(item.reason)}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
};
