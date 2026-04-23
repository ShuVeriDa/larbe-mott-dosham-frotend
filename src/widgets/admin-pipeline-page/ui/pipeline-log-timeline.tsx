"use client";

import { useUnifiedLog } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { AdminTableSkeleton } from "@/shared/ui/admin";
import type { FC } from "react";
import { toast } from "sonner";
import {
	formatDuration,
	formatNumber,
	formatSize,
} from "../lib/format-relative-time";

interface Props {
	dict: Dictionary["admin"]["pipeline"];
	commonDict: Dictionary["admin"]["common"];
}

const formatTime = (iso: string, lang: string) => {
	try {
		return new Date(iso).toLocaleString(lang, {
			hour: "2-digit",
			minute: "2-digit",
			day: "2-digit",
			month: "short",
		});
	} catch {
		return iso;
	}
};

type Tone = "success" | "info" | "warning" | "error";

const DOT: Record<Tone, string> = {
	success: "border-[var(--success)] bg-[var(--success)]",
	info: "border-[var(--accent)] bg-[var(--accent)]",
	warning: "border-[var(--warning)] bg-[var(--warning)]",
	error: "border-[var(--danger)] bg-[var(--danger)]",
};

export const PipelineLogTimeline: FC<Props> = ({ dict, commonDict }) => {
	const query = useUnifiedLog();

	const steps = [...(query.data?.steps ?? [])].reverse();

	const onRefresh = () => {
		void query.refetch();
		toast.info(dict.toasts.logRefreshed);
	};

	return (
		<section aria-labelledby="pipeline-log-heading" className="mb-8">
			<div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
				<h2
					id="pipeline-log-heading"
					className="text-lg font-semibold text-[var(--text)]"
				>
					{dict.timeline.title}
				</h2>
				<button
					type="button"
					onClick={onRefresh}
					className="btn btn-sm btn-ghost"
				>
					⟳ {commonDict.refresh}
				</button>
			</div>

			{query.isLoading ? (
				<AdminTableSkeleton rows={4} />
			) : steps.length === 0 ? (
				<div className="text-sm text-[var(--text-muted)] text-center py-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
					{dict.timeline.empty}
				</div>
			) : (
				<ol className="flex flex-col gap-0">
					{steps.map((step, i) => {
						const duplicates = step.entriesFromDict - step.newWords - step.enrichedWords;
						const tone: Tone = !step.snapshotExists
							? "warning"
							: duplicates > step.enrichedWords
								? "warning"
								: "info";
						const isLast = i === steps.length - 1;

						return (
							<li
								key={step.step}
								className={cn(
									"flex gap-4 py-4 relative",
									!isLast &&
										"before:content-[''] before:absolute before:left-[15px] before:top-10 before:bottom-0 before:w-px before:bg-[var(--border)]",
								)}
							>
								<div className="shrink-0 w-8 flex justify-center pt-0.5">
									<span
										className={cn(
											"w-2.5 h-2.5 rounded-full border-2 relative z-[1]",
											DOT[tone],
										)}
										aria-hidden
									/>
								</div>
								<div className="flex-1 min-w-0">
									<div className="text-sm font-medium text-[var(--text)] mb-1">
										{dict.timeline.stepLabel
											.replace("{step}", `${step.step}`)
											.replace("{action}", step.title)}
									</div>
									<div className="text-xs text-[var(--text-muted)] flex gap-3 flex-wrap mb-2">
										<span>{formatTime(step.timestamp, "ru-RU")}</span>
										<span>
											{dict.timeline.duration.replace(
												"{seconds}",
												formatDuration(step.durationSeconds),
											)}
										</span>
										{!step.snapshotExists ? (
											<span className="text-[var(--warning)]">
												{dict.timeline.stats.missing}
											</span>
										) : null}
									</div>
									<div className="flex gap-2 flex-wrap">
										<StatChip label={dict.timeline.stats.fromDict.replace("{count}", formatNumber(step.entriesFromDict))} />
										<StatChip
											tone="new"
											label={dict.timeline.stats.new.replace(
												"{count}",
												formatNumber(step.newWords),
											)}
										/>
										<StatChip
											tone="enriched"
											label={dict.timeline.stats.enriched.replace(
												"{count}",
												formatNumber(step.enrichedWords),
											)}
										/>
										<StatChip
											tone="highlight"
											label={dict.timeline.stats.total.replace(
												"{count}",
												formatNumber(step.totalUnifiedEntries),
											)}
										/>
										{step.snapshotExists ? (
											<StatChip
												label={dict.timeline.stats.size.replace(
													"{size}",
													formatSize(step.snapshotSizeMb),
												)}
											/>
										) : null}
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

interface ChipProps {
	label: string;
	tone?: "default" | "new" | "enriched" | "highlight";
}

const CHIP: Record<NonNullable<ChipProps["tone"]>, string> = {
	default: "bg-[var(--surface)] text-[var(--text-secondary)]",
	new: "bg-[var(--success-dim)] text-[var(--success)]",
	enriched: "bg-[var(--info-dim)] text-[var(--info)]",
	highlight: "bg-[var(--accent-dim)] text-[var(--accent)]",
};

const StatChip: FC<ChipProps> = ({ label, tone = "default" }) => (
	<span
		className={cn(
			"text-xs px-2 py-0.5 rounded font-mono",
			CHIP[tone],
		)}
	>
		{label}
	</span>
);
