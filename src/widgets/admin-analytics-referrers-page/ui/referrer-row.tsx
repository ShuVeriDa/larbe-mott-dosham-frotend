"use client";

import type {
	AnalyticsReferrerCategory,
	AnalyticsTopReferrerItem,
} from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { formatNumber } from "@/widgets/admin-analytics-overview-page";
import type { FC } from "react";
import {
	cleanHost,
	externalUrl,
	interpolate,
	isDirectKey,
} from "../lib/categorize";
import { Favicon } from "./favicon";

interface ReferrerRowProps {
	item: AnalyticsTopReferrerItem;
	rank: number;
	maxCount: number;
	totalForPercent: number;
	directLabel: string;
	openExternalTemplate: string;
	badgeDict: Dictionary["admin"]["analytics"]["referrers"]["badges"];
	lang: Locale;
}

const BAR_BG_BY_CAT: Record<AnalyticsReferrerCategory, string> = {
	search: "bg-[var(--info-dim)] border-[var(--info)]",
	social: "bg-[var(--purple-dim)] border-[var(--purple)]",
	direct: "bg-[var(--surface-active)] border-[var(--text-muted)]",
	other: "bg-[var(--warning-dim)] border-[var(--warning)]",
};

const BADGE_BY_CAT: Record<AnalyticsReferrerCategory, string> = {
	search: "bg-[var(--info-dim)] text-[var(--info)]",
	social: "bg-[var(--purple-dim)] text-[var(--purple)]",
	direct: "bg-[var(--surface-active)] text-[var(--text-muted)]",
	other: "bg-[var(--warning-dim)] text-[var(--warning)]",
};

export const ReferrerRow: FC<ReferrerRowProps> = ({
	item,
	rank,
	maxCount,
	totalForPercent,
	directLabel,
	openExternalTemplate,
	badgeDict,
	lang,
}) => {
	const direct = isDirectKey(item.key);
	const displayHost = direct ? directLabel : cleanHost(item.key);
	const url = externalUrl(item.key);
	const widthPct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
	const pct =
		totalForPercent > 0
			? ((item.count / totalForPercent) * 100).toFixed(1)
			: "0.0";

	return (
		<li
			className={cn(
				"relative grid items-center gap-3 px-3 py-3 rounded-md overflow-hidden",
				"hover:bg-[var(--surface-hover)] transition-colors",
				"grid-cols-[32px_20px_1fr_56px_84px_36px]",
				"sm:grid-cols-[32px_20px_1fr_56px_84px_36px]",
				"max-sm:grid-cols-[24px_20px_1fr_72px_32px]",
			)}
		>
			<span
				aria-hidden="true"
				className={cn(
					"absolute top-[3px] bottom-[3px] left-[3px] z-0 rounded-l-md border-r-2",
					"transition-[width] duration-700 ease-out",
					BAR_BG_BY_CAT[item.category],
				)}
				style={{ width: `${Math.max(2, widthPct)}%` }}
			/>

			<span className="relative z-10 font-mono text-xs font-semibold tabular-nums text-[var(--text-faint)]">
				#{String(rank).padStart(2, "0")}
			</span>

			<span className="relative z-10 max-sm:hidden">
				<Favicon host={item.key} />
			</span>
			<span className="relative z-10 sm:hidden">
				<Favicon host={item.key} size={20} />
			</span>

			<span className="relative z-10 flex items-center gap-2 min-w-0 text-sm font-medium text-[var(--text)] font-mono">
				<span className="truncate">{displayHost}</span>
				<span
					className={cn(
						"text-[0.6rem] uppercase tracking-wider font-semibold",
						"px-1.5 py-px rounded-sm whitespace-nowrap max-sm:hidden",
						BADGE_BY_CAT[item.category],
					)}
				>
					{badgeDict[item.category]}
				</span>
			</span>

			<span className="relative z-10 text-xs text-right tabular-nums text-[var(--text-muted)] max-sm:hidden">
				{pct}%
			</span>

			<span className="relative z-10 text-sm text-right font-semibold tabular-nums text-[var(--text)]">
				{formatNumber(item.count, lang)}
			</span>

			{url ? (
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer nofollow"
					title={interpolate(openExternalTemplate, {
						host: cleanHost(item.key),
					})}
					aria-label={interpolate(openExternalTemplate, {
						host: cleanHost(item.key),
					})}
					className={cn(
						"relative z-10 inline-flex items-center justify-center",
						"w-7 h-7 rounded-sm border border-[var(--border)]",
						"text-[var(--text-muted)] hover:text-[var(--accent)]",
						"hover:border-[var(--accent)] hover:bg-[var(--accent-dim)]",
						"transition-colors",
					)}
				>
					<span aria-hidden="true">↗</span>
				</a>
			) : (
				<span aria-hidden="true" className="relative z-10 text-center opacity-30">
					—
				</span>
			)}
		</li>
	);
};
