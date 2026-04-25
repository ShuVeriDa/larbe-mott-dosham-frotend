import type { AnalyticsPageItem, AnalyticsPagesStats } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatPagesNumber, formatPagesPct } from "../lib/format-pages";

interface PagesStatsRowProps {
	lang: Locale;
	dict: Dictionary["admin"]["analyticsPages"]["stats"];
	stats?: AnalyticsPagesStats;
	topItem?: AnalyticsPageItem;
	loading?: boolean;
}

const noop = "—";

const interpolate = (template: string, values: Record<string, string>): string =>
	template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

export const PagesStatsRow: FC<PagesStatsRowProps> = ({
	lang,
	dict,
	stats,
	topItem,
	loading,
}) => {
	const cards = [
		{
			label: dict.distinctUrls.label,
			value: stats ? formatPagesNumber(stats.distinctUrls, lang) : noop,
			sub: stats
				? interpolate(dict.distinctUrls.sub, {
						count: formatPagesNumber(stats.top80pctUrls, lang),
					})
				: "",
			mono: false,
		},
		{
			label: dict.totalPageviews.label,
			value: stats ? formatPagesNumber(stats.totalPageviews, lang) : noop,
			sub: stats
				? interpolate(dict.totalPageviews.sub, {
						days: formatPagesNumber(stats.periodDays, lang),
					})
				: "",
			mono: false,
		},
		{
			label: dict.topPage.label,
			value: topItem?.key ?? noop,
			sub:
				topItem && stats
					? interpolate(dict.topPage.sub, {
							count: formatPagesNumber(topItem.count, lang),
							pct: formatPagesPct(topItem.count, stats.totalPageviews),
						})
					: "",
			mono: true,
		},
		{
			label: dict.medianViewsPerUrl.label,
			value: stats ? formatPagesNumber(stats.medianViewsPerUrl, lang) : noop,
			sub: dict.medianViewsPerUrl.sub,
			mono: false,
		},
	];

	return (
		<output
			aria-live="polite"
			className={cn(
				"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6",
			)}
		>
			{cards.map((card, idx) => (
				<div
					key={idx}
					className={cn(
						"bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4",
						"flex flex-col gap-1",
					)}
				>
					<div
						className={cn(
							"text-xs uppercase tracking-wider font-medium",
							"text-[var(--text-muted)] mb-1",
						)}
					>
						{card.label}
					</div>
					<div
						className={cn(
							"text-xl font-bold tracking-tight tabular-nums text-[var(--text)] truncate",
							card.mono && "font-mono text-base",
							loading && "opacity-40",
						)}
						title={card.mono ? card.value : undefined}
					>
						{card.value}
					</div>
					{card.sub ? (
						<div className="text-xs text-[var(--text-muted)]">{card.sub}</div>
					) : null}
				</div>
			))}
		</output>
	);
};
