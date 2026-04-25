import type { AnalyticsSearchQueriesStats } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import {
	computePeriodDays,
	formatDecimal,
	formatPctFromValue,
	formatSearchQueriesNumber,
	interpolate,
} from "../lib/format-search-queries";

interface SearchQueriesStatsRowProps {
	lang: Locale;
	dict: Dictionary["admin"]["analyticsSearchQueries"]["stats"];
	stats?: AnalyticsSearchQueriesStats;
	loading?: boolean;
}

const noop = "—";

export const SearchQueriesStatsRow: FC<SearchQueriesStatsRowProps> = ({
	lang,
	dict,
	stats,
	loading,
}) => {
	const periodDays = stats
		? computePeriodDays(stats.range.from, stats.range.to)
		: 0;

	const cards = [
		{
			label: dict.totalSearches.label,
			value: stats
				? formatSearchQueriesNumber(stats.totalSearches, lang)
				: noop,
			sub: stats
				? interpolate(dict.totalSearches.sub, {
						days: formatSearchQueriesNumber(periodDays, lang),
					})
				: "",
			highlight: false,
		},
		{
			label: dict.uniqueQueries.label,
			value: stats
				? formatSearchQueriesNumber(stats.uniqueQueries, lang)
				: noop,
			sub: dict.uniqueQueries.sub,
			highlight: false,
		},
		{
			label: dict.zeroResults.label,
			value: stats
				? formatSearchQueriesNumber(stats.zeroResultQueries, lang)
				: noop,
			sub: stats
				? interpolate(dict.zeroResults.sub, {
						pct: formatPctFromValue(stats.zeroResultPct),
					})
				: "",
			highlight: true,
		},
		{
			label: dict.avgQueryLength.label,
			value: stats ? formatDecimal(stats.avgQueryLength, lang) : noop,
			sub: stats
				? interpolate(dict.avgQueryLength.sub, {
						median: formatSearchQueriesNumber(stats.medianQueryLength, lang),
					})
				: "",
			highlight: false,
		},
	];

	return (
		<output
			aria-live="polite"
			className={cn(
				"grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5",
			)}
		>
			{cards.map((card, idx) => (
				<div
					key={idx}
					className={cn(
						"rounded-2xl p-4 border flex flex-col gap-1",
						card.highlight
							? "bg-[var(--danger-dim)] border-[var(--danger)]"
							: "bg-[var(--surface)] border-[var(--border)]",
					)}
				>
					<div
						className={cn(
							"text-xs uppercase tracking-wider font-medium mb-1",
							card.highlight
								? "text-[var(--danger)]"
								: "text-[var(--text-muted)]",
						)}
					>
						{card.label}
					</div>
					<div
						className={cn(
							"text-xl font-bold tracking-tight tabular-nums truncate",
							card.highlight ? "text-[var(--danger)]" : "text-[var(--text)]",
							loading && "opacity-40",
						)}
					>
						{card.value}
					</div>
					{card.sub ? (
						<div
							className={cn(
								"text-xs",
								card.highlight
									? "text-[var(--danger)]"
									: "text-[var(--text-muted)]",
							)}
						>
							{card.sub}
						</div>
					) : null}
				</div>
			))}
		</output>
	);
};
