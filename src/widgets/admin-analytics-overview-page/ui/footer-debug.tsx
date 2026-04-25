"use client";

import type { AnalyticsAggregatorStatus } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatLastRun, formatNumber } from "../lib/format";

interface FooterDebugProps {
	dict: Dictionary["admin"]["analytics"]["footer"];
	queueSize: number | undefined;
	aggregator: AnalyticsAggregatorStatus | undefined;
	daysWithData: number | undefined;
	onRecompute: () => void;
	recomputing?: boolean;
	lang: Locale;
}

const queueClass = (size: number | undefined): string => {
	if (size === undefined) return "text-[var(--text-muted)]";
	if (size >= 10000) return "text-[var(--danger)]";
	if (size >= 100) return "text-[var(--warning)]";
	return "text-[var(--success)]";
};

const aggregatorState = (
	aggregator: AnalyticsAggregatorStatus | undefined,
): { label: keyof Dictionary["admin"]["analytics"]["footer"]; color: string } => {
	if (!aggregator || !aggregator.lastRunAt) {
		return { label: "aggregatorDown", color: "text-[var(--danger)]" };
	}
	const ts = new Date(aggregator.lastRunAt).getTime();
	if (!Number.isFinite(ts)) {
		return { label: "aggregatorDown", color: "text-[var(--danger)]" };
	}
	const ageHours = (Date.now() - ts) / 1000 / 3600;
	if (ageHours >= 6) {
		return { label: "aggregatorDown", color: "text-[var(--danger)]" };
	}
	if (ageHours >= 2) {
		return { label: "aggregatorStale", color: "text-[var(--warning)]" };
	}
	return { label: "aggregatorActive", color: "text-[var(--success)]" };
};

export const FooterDebug: FC<FooterDebugProps> = ({
	dict,
	queueSize,
	aggregator,
	daysWithData,
	onRecompute,
	recomputing,
	lang,
}) => {
	const aggState = aggregatorState(aggregator);
	const lastRun = formatLastRun(
		aggregator?.lastRunAt ?? null,
		lang,
		dict.never,
	);

	return (
		<div
			className={cn(
				"mt-8 px-4 py-3 rounded-md font-mono text-xs",
				"bg-[var(--surface)] border border-dashed border-[var(--border)]",
				"text-[var(--text-muted)] flex flex-wrap items-center gap-4",
			)}
		>
			<div className="flex items-center gap-2">
				<strong className="text-[var(--text-secondary)] font-semibold">
					{dict.queueLabel}
				</strong>
				<span className={queueClass(queueSize)}>
					{queueSize === undefined ? "—" : formatNumber(queueSize, lang)}
				</span>
				<span>{dict.queuePending}</span>
			</div>

			<div className="flex items-center gap-2">
				<strong className="text-[var(--text-secondary)] font-semibold">
					{dict.aggregatorLabel}
				</strong>
				<span className={aggState.color}>{dict[aggState.label]}</span>
				<span>· {dict.lastRun}: {lastRun}</span>
			</div>

			<div className="flex items-center gap-2">
				<strong className="text-[var(--text-secondary)] font-semibold">
					{dict.daysWithDataLabel}
				</strong>
				<span>
					{daysWithData === undefined ? "—" : formatNumber(daysWithData, lang)}
				</span>
			</div>

			<div className="ml-auto">
				<button
					type="button"
					onClick={onRecompute}
					disabled={recomputing}
					className={cn(
						"inline-flex items-center gap-2 px-3 py-1.5 rounded-md",
						"text-xs font-semibold text-[var(--text-secondary)]",
						"hover:bg-[var(--surface-hover)] hover:text-[var(--text)]",
						"disabled:opacity-50 disabled:cursor-not-allowed",
					)}
				>
					{dict.recompute}
				</button>
			</div>
		</div>
	);
};
