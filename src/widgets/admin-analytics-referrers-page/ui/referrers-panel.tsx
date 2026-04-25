"use client";

import type { AnalyticsTopReferrerItem } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	AdminEmptyState,
	AdminErrorState,
	AdminTableSkeleton,
} from "@/shared/ui/admin";
import { formatNumber } from "@/widgets/admin-analytics-overview-page/lib/format";
import type { FC } from "react";
import { interpolate } from "../lib/categorize";
import { ReferrerRow } from "./referrer-row";

interface ReferrersPanelProps {
	dict: Dictionary["admin"]["analytics"]["referrers"];
	lang: Locale;
	items: AnalyticsTopReferrerItem[];
	loadedCount: number;
	totalForRange: number | undefined;
	uniqueHostsForRange: number | undefined;
	maxCount: number;
	search: string;
	onSearchChange: (next: string) => void;
	hasMore: boolean;
	onLoadMore: () => void;
	loading: boolean;
	loadingMore: boolean;
	error: boolean;
	onRetry: () => void;
}

export const ReferrersPanel: FC<ReferrersPanelProps> = ({
	dict,
	lang,
	items,
	loadedCount,
	totalForRange,
	uniqueHostsForRange,
	maxCount,
	search,
	onSearchChange,
	hasMore,
	onLoadMore,
	loading,
	loadingMore,
	error,
	onRetry,
}) => {
	const totalDomains = uniqueHostsForRange ?? loadedCount;

	const renderBody = () => {
		if (error) {
			return (
				<div className="p-4">
					<AdminErrorState
						title={dict.errors.listTitle}
						retryLabel={dict.errors.retry}
						onRetry={onRetry}
					/>
				</div>
			);
		}

		if (loading && items.length === 0) {
			return (
				<div className="p-2">
					<AdminTableSkeleton rows={6} className="border-0 rounded-md" />
				</div>
			);
		}

		if (items.length === 0) {
			return (
				<AdminEmptyState
					icon="🔍"
					title={dict.list.emptyTitle}
					description={dict.list.emptyDescription}
					className="border-0"
				/>
			);
		}

		const totalForPct =
			totalForRange && totalForRange > 0
				? totalForRange
				: items.reduce((sum, r) => sum + r.count, 0);

		return (
			<ul className="flex flex-col gap-1 p-2">
				{items.map((item, idx) => (
					<ReferrerRow
						key={`${item.key || "(direct)"}-${idx}`}
						item={item}
						rank={idx + 1}
						maxCount={maxCount}
						totalForPercent={totalForPct}
						directLabel={dict.list.directLabel}
						openExternalTemplate={dict.list.openExternal}
						badgeDict={dict.badges}
						lang={lang}
					/>
				))}
			</ul>
		);
	};

	return (
		<section
			className={cn(
				"bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden",
			)}
		>
			<header
				className={cn(
					"flex flex-wrap justify-between items-center gap-3 p-4",
					"border-b border-[var(--border)]",
				)}
			>
				<h2 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
					{dict.list.title}
					<span
						className={cn(
							"text-xs font-semibold tabular-nums px-2 py-0.5 rounded-full",
							"bg-[var(--accent-dim)] text-[var(--accent)]",
						)}
					>
						{formatNumber(items.length, lang)}
					</span>
				</h2>

				<div className="relative max-w-[280px] flex-1 min-w-[180px]">
					<span
						aria-hidden="true"
						className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none"
					>
						🔍
					</span>
					<input
						type="search"
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={dict.list.searchPlaceholder}
						aria-label={dict.list.searchLabel}
						className={cn(
							"w-full pl-8 pr-3 py-2 h-9 text-sm",
							"bg-[var(--bg-raised)] border border-[var(--border)] rounded-md",
							"text-[var(--text)] outline-none focus:border-[var(--accent)]",
						)}
					/>
				</div>
			</header>

			{renderBody()}

			<footer
				className={cn(
					"flex flex-wrap justify-between items-center gap-3 p-4",
					"border-t border-[var(--border)]",
				)}
			>
				<p className="text-xs text-[var(--text-muted)]">
					{interpolate(dict.list.shownInfo, {
						shown: formatNumber(items.length, lang),
						total: formatNumber(totalDomains, lang),
					})}
				</p>
				{hasMore ? (
					<button
						type="button"
						onClick={onLoadMore}
						disabled={loadingMore}
						className={cn(
							"inline-flex items-center gap-2 px-3 h-8 rounded-md text-xs font-semibold",
							"bg-[var(--accent)] text-[var(--accent-on)]",
							"hover:shadow-[0_0_12px_var(--accent-glow)]",
							"hover:-translate-y-px transition-all",
							"disabled:opacity-50 disabled:cursor-not-allowed",
						)}
					>
						{loadingMore ? dict.list.loadingMore : dict.list.loadMore}
					</button>
				) : null}
			</footer>
		</section>
	);
};
