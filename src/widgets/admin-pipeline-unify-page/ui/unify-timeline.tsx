"use client";

import { useUnifiedLog } from "@/features/admin-pipeline-unify";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { AdminEmptyState } from "@/shared/ui/admin";
import type { FC } from "react";
import { toast } from "sonner";
import { formatNumber, formatRelativeTime } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineUnify"];
	lang: Locale;
}

export const UnifyTimeline: FC<Props> = ({ dict, lang }) => {
	const query = useUnifiedLog();
	const steps = [...(query.data?.steps ?? [])].reverse();

	const pill = (className: string, text: string) => (
		<span
			className={cn(
				"text-xs px-2 py-0.5 rounded font-mono font-normal",
				className,
			)}
		>
			{text}
		</span>
	);

	return (
		<section className="mb-8">
			<div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
				<h2 className="text-lg font-semibold text-[var(--text)]">
					{dict.timeline.title}
				</h2>
				<button
					type="button"
					onClick={() => {
						void query.refetch();
						toast.info(dict.toast.logRefreshed);
					}}
					className="btn btn-sm btn-ghost"
				>
					{dict.timeline.refresh}
				</button>
			</div>

			{steps.length === 0 ? (
				<AdminEmptyState icon="📝" description={dict.timeline.empty} />
			) : (
				<ol className="flex flex-col gap-0 relative">
					{steps.map((s, idx) => {
						const dupes = Math.max(
							0,
							s.entriesFromDict - s.newWords - s.enrichedWords,
						);
						const isBase = s.step === 1;
						return (
							<li
								key={s.step}
								className="flex gap-4 py-4 relative"
							>
								{idx < steps.length - 1 ? (
									<span
										aria-hidden
										className="absolute left-[15px] top-10 bottom-0 w-px bg-[var(--border)]"
									/>
								) : null}
								<div className="shrink-0 w-8 flex justify-center pt-1">
									<span
										className={cn(
											"w-2.5 h-2.5 rounded-full border-2 relative z-10",
											isBase
												? "border-[var(--success)] bg-[var(--success)]"
												: "border-[var(--info)] bg-[var(--info)]",
										)}
										aria-hidden
									/>
								</div>
								<div className="flex-1 min-w-0">
									<div className="text-sm font-medium text-[var(--text)] mb-1">
										{dict.table.status.merged.replace(
											"{step}",
											String(s.step),
										)}
										{" — "}
										<span className="font-mono text-xs text-[var(--text-muted)]">
											unify-step {s.slug}
										</span>
									</div>
									<div className="flex gap-3 flex-wrap text-xs text-[var(--text-muted)] mb-2">
										<time dateTime={s.timestamp}>
											{formatRelativeTime(s.timestamp, dict.time)}
										</time>
										<span>
											{dict.timeline.duration.replace(
												"{seconds}",
												s.durationSeconds.toFixed(1),
											)}
										</span>
									</div>
									<div className="flex gap-3 flex-wrap">
										{pill(
											"bg-[var(--surface)] text-[var(--text-secondary)]",
											dict.timeline.stats.fromDict.replace(
												"{count}",
												formatNumber(s.entriesFromDict, lang),
											),
										)}
										{pill(
											"bg-[var(--success-dim)] text-[var(--success)]",
											dict.timeline.stats.new.replace(
												"{count}",
												formatNumber(s.newWords, lang),
											),
										)}
										{pill(
											"bg-[var(--info-dim)] text-[var(--info)]",
											dict.timeline.stats.enriched.replace(
												"{count}",
												formatNumber(s.enrichedWords, lang),
											),
										)}
										{pill(
											"bg-[var(--warning-dim)] text-[var(--warning)]",
											dict.timeline.stats.dup.replace(
												"{count}",
												formatNumber(dupes, lang),
											),
										)}
										{pill(
											"bg-[var(--accent-dim)] text-[var(--accent)]",
											dict.timeline.stats.total.replace(
												"{count}",
												formatNumber(s.totalUnifiedEntries, lang),
											),
										)}
									</div>
								</div>
							</li>
						);
					})}
				</ol>
			)}
		</section>
	);
};
