"use client";

import type { AnalyticsSearchQueryItem } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC } from "react";
import {
	formatSearchQueriesNumber,
	formatSearchQueriesPct,
} from "../lib/format-search-queries";

interface SearchQueriesToplistRowProps {
	item: AnalyticsSearchQueryItem;
	rank: number;
	maxCount: number;
	totalSearches: number;
	lang: Locale;
	dict: Dictionary["admin"]["analyticsSearchQueries"]["toplist"];
}

export const SearchQueriesToplistRow: FC<SearchQueriesToplistRowProps> = ({
	item,
	rank,
	maxCount,
	totalSearches,
	lang,
	dict,
}) => {
	const barWidth = Math.max(
		0,
		Math.min(100, (item.count / Math.max(maxCount, 1)) * 100),
	);
	const pct = formatSearchQueriesPct(item.count, totalSearches);
	const count = formatSearchQueriesNumber(item.count, lang);
	const zero = !item.hasResults;

	return (
		<div
			className={cn(
				"relative grid items-center gap-3 px-3 py-3 rounded-md overflow-hidden",
				"transition-colors",
				"grid-cols-[24px_1fr_auto_auto] sm:grid-cols-[32px_1fr_56px_88px_84px]",
				zero
					? "bg-[var(--danger-dim)] hover:bg-[rgba(248,113,113,0.15)]"
					: "hover:bg-[var(--surface-hover)]",
			)}
			style={{ minHeight: 44 }}
		>
			<div
				aria-hidden="true"
				className={cn(
					"absolute top-[3px] bottom-[3px] left-[3px] z-0 pointer-events-none",
					"rounded-l-sm transition-[width] duration-700 ease-out border-r-2",
					zero
						? "bg-[rgba(248,113,113,0.08)] border-[var(--danger)]"
						: "bg-[var(--accent-dim)] border-[var(--accent)]",
				)}
				style={{ width: `${barWidth}%` }}
			/>
			<div
				className={cn(
					"relative z-[1] text-xs font-mono font-semibold tabular-nums",
					"text-[var(--text-faint)]",
				)}
			>
				#{String(rank).padStart(2, "0")}
			</div>
			<div
				className={cn(
					"relative z-[1] flex items-center gap-2 min-w-0",
					"text-sm font-medium text-[var(--text)]",
				)}
			>
				<span
					className="font-semibold tracking-tight overflow-hidden text-ellipsis whitespace-nowrap"
					title={item.query}
				>
					{item.query}
				</span>
				{zero ? (
					<span
						className={cn(
							"shrink-0 inline-flex items-center px-1.5 py-[1px] rounded-sm",
							"bg-[var(--danger)] text-white text-[0.6rem] font-bold uppercase tracking-wider",
						)}
					>
						{dict.noResultsBadge}
					</span>
				) : null}
			</div>
			<div
				className={cn(
					"relative z-[1] hidden sm:block text-xs tabular-nums text-right",
					"text-[var(--text-muted)] min-w-[44px]",
				)}
			>
				{pct}
			</div>
			<div
				className={cn(
					"relative z-[1] text-sm font-semibold tabular-nums text-right",
					"text-[var(--text)] min-w-[70px]",
				)}
			>
				{count}
			</div>
			<div className="relative z-[1] flex justify-end items-center gap-1">
				{zero ? (
					<Link
						href={`/${lang}/admin/entries/new?word=${encodeURIComponent(item.query)}`}
						aria-label={dict.addToDictionary}
						title={dict.addToDictionary}
						className={cn(
							"inline-flex items-center justify-center w-7 h-7 rounded-sm",
							"bg-transparent border border-[var(--border)] text-[var(--text-muted)]",
							"hover:border-[var(--success)] hover:text-[var(--success)] hover:bg-[var(--success-dim)]",
							"transition-colors",
						)}
					>
						+
					</Link>
				) : null}
				<Link
					href={`/${lang}/search?q=${encodeURIComponent(item.query)}`}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={dict.openSearch}
					title={dict.openSearch}
					className={cn(
						"inline-flex items-center justify-center w-7 h-7 rounded-sm",
						"bg-transparent border border-[var(--border)] text-[var(--text-muted)]",
						"hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]",
						"transition-colors",
					)}
				>
					↗
				</Link>
			</div>
		</div>
	);
};
