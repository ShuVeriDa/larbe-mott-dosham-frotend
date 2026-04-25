"use client";

import type {
	AnalyticsMetric,
	AnalyticsTimeseriesSummary,
} from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatDateShort, formatMetricValue } from "../lib/format";

interface SummaryRowProps {
	dict: Dictionary["admin"]["analytics"]["timeseries"]["summary"];
	durationDict: { minutes: string; seconds: string };
	lang: Locale;
	metric: AnalyticsMetric;
	summary: AnalyticsTimeseriesSummary | undefined;
	loading: boolean;
	deltaPct: number | null;
	avgDeltaPct: number | null;
	inverseDelta: boolean;
}

const isRateMetric = (m: AnalyticsMetric): boolean =>
	m === "bounceRate" || m === "avgSessionSec";

const renderDelta = (
	pct: number | null,
	vsLabel: string,
	inverse: boolean,
): { arrow: string; text: string; color: string } => {
	if (pct === null || !Number.isFinite(pct)) {
		return {
			arrow: "—",
			text: "",
			color: "text-[var(--text-muted)]",
		};
	}
	const rounded = Math.round(pct);
	if (rounded === 0) {
		return { arrow: "—", text: `0% ${vsLabel}`, color: "text-[var(--text-muted)]" };
	}
	const isPositive = rounded > 0;
	const goodWhenUp = !inverse;
	const isGood = isPositive === goodWhenUp;
	return {
		arrow: isPositive ? "↑" : "↓",
		text: `${isPositive ? "+" : ""}${rounded}% ${vsLabel}`,
		color: isGood ? "text-[var(--success)]" : "text-[var(--danger)]",
	};
};

export const SummaryRow: FC<SummaryRowProps> = ({
	dict,
	durationDict,
	lang,
	metric,
	summary,
	loading,
	deltaPct,
	avgDeltaPct,
	inverseDelta,
}) => {
	const rate = isRateMetric(metric);
	const totalLabel = dict.total;
	const totalValue = summary
		? rate
			? formatMetricValue(metric, summary.avg, lang, durationDict)
			: metric === "uniqueVisitors" && typeof summary.distinctTotal === "number"
				? formatMetricValue(metric, summary.distinctTotal, lang, durationDict)
				: formatMetricValue(metric, summary.total, lang, durationDict)
		: "—";

	const avgValue = summary
		? formatMetricValue(metric, summary.avg, lang, durationDict)
		: "—";

	const peakValue = summary?.peak
		? formatMetricValue(metric, summary.peak.value, lang, durationDict)
		: "—";
	const minValue = summary?.min
		? formatMetricValue(metric, summary.min.value, lang, durationDict)
		: "—";

	const totalDelta = renderDelta(deltaPct, dict.vsPrevious, inverseDelta);
	const avgDelta = renderDelta(avgDeltaPct, dict.vsPrevious, inverseDelta);

	return (
		<div
			className={cn(
				"flex flex-wrap gap-6 p-5 mb-4",
				"bg-[var(--surface)] border border-[var(--border)] rounded-2xl",
				loading && "opacity-70",
			)}
		>
			<SummaryItem
				label={totalLabel}
				value={totalValue}
				deltaArrow={totalDelta.arrow}
				deltaText={totalDelta.text}
				deltaClass={totalDelta.color}
			/>
			<SummaryItem
				label={dict.avg}
				value={avgValue}
				deltaArrow={avgDelta.arrow}
				deltaText={avgDelta.text}
				deltaClass={avgDelta.color}
			/>
			<SummaryItem
				label={dict.peak}
				value={peakValue}
				deltaArrow=""
				deltaText={
					summary?.peak ? formatDateShort(summary.peak.date, lang) : ""
				}
				deltaClass="text-[var(--text-muted)]"
			/>
			<SummaryItem
				label={dict.min}
				value={minValue}
				deltaArrow=""
				deltaText={summary?.min ? formatDateShort(summary.min.date, lang) : ""}
				deltaClass="text-[var(--text-muted)]"
			/>
		</div>
	);
};

interface SummaryItemProps {
	label: string;
	value: string;
	deltaArrow: string;
	deltaText: string;
	deltaClass: string;
}

const SummaryItem: FC<SummaryItemProps> = ({
	label,
	value,
	deltaArrow,
	deltaText,
	deltaClass,
}) => (
	<div className="flex-1 min-w-[120px]">
		<div className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium mb-1">
			{label}
		</div>
		<div className="text-xl font-bold text-[var(--text)] tabular-nums tracking-tight">
			{value}
		</div>
		{deltaText ? (
			<div
				className={cn(
					"text-xs font-semibold tabular-nums mt-1",
					deltaClass,
				)}
			>
				{deltaArrow ? <span aria-hidden="true">{deltaArrow} </span> : null}
				{deltaText}
			</div>
		) : null}
	</div>
);
