"use client";

import type { AnalyticsPageItem } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import type { FC } from "react";
import { PAGES_LIMIT_OPTIONS, type PagesLimit } from "../model/use-pages-page-state";
import { formatPagesNumber } from "../lib/format-pages";
import { PagesToplistRow } from "./pages-toplist-row";
import { PagesToplistSkeleton } from "./pages-toplist-skeleton";

interface PagesToplistProps {
	lang: Locale;
	dict: Dictionary["admin"]["analyticsPages"]["toplist"];
	commonDict: Dictionary["admin"]["common"];
	items: AnalyticsPageItem[];
	total: number;
	maxCount: number;
	totalPageviews: number;
	search: string;
	onSearchChange: (value: string) => void;
	debouncedSearch: string;
	limit: PagesLimit;
	onLimitChange: (value: PagesLimit) => void;
	onLoadMore: () => void;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	isLoading: boolean;
	isError: boolean;
	onRetry: () => void;
}

const interpolate = (template: string, values: Record<string, string>): string =>
	template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

export const PagesToplist: FC<PagesToplistProps> = ({
	lang,
	dict,
	commonDict,
	items,
	total,
	maxCount,
	totalPageviews,
	search,
	onSearchChange,
	debouncedSearch,
	limit,
	onLimitChange,
	onLoadMore,
	hasNextPage,
	isFetchingNextPage,
	isLoading,
	isError,
	onRetry,
}) => {

	const isEmpty = !isLoading && !isError && items.length === 0;
	const filterActive = debouncedSearch.trim().length > 0;

	return (
		<section
			className={cn(
				"bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden",
			)}
			aria-label={dict.title}
		>
			<header
				className={cn(
					"flex flex-wrap items-center justify-between gap-3",
					"px-5 py-4 border-b border-[var(--border)]",
				)}
			>
				<h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text)]">
					{dict.title}
					<span
						className={cn(
							"text-xs font-semibold tabular-nums px-2 py-[2px] rounded-full",
							"bg-[var(--accent-dim)] text-[var(--accent)]",
						)}
					>
						{formatPagesNumber(total, lang)}
					</span>
				</h2>
				<div className="relative max-w-[280px] flex-1 min-w-[180px]">
					<span
						aria-hidden="true"
						className={cn(
							"absolute left-2.5 top-1/2 -translate-y-1/2",
							"text-[var(--text-muted)] text-sm pointer-events-none",
						)}
					>
						🔍
					</span>
					<input
						type="search"
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={dict.searchPlaceholder}
						aria-label={dict.searchAriaLabel}
						className={cn(
							"w-full pl-8 pr-3 h-9 text-sm",
							"bg-[var(--bg-raised)] border border-[var(--border)] rounded-md",
							"text-[var(--text)] outline-none",
							"focus:border-[var(--accent)] transition-colors",
						)}
					/>
				</div>
			</header>

			{isLoading ? (
				<PagesToplistSkeleton />
			) : isError ? (
				<div role="alert" className="p-10 text-center">
					<div className="text-3xl mb-3 opacity-60" aria-hidden="true">
						⚠️
					</div>
					<div className="text-base font-semibold text-[var(--text)] mb-2">
						{commonDict.error}
					</div>
					<button
						type="button"
						onClick={onRetry}
						className={cn(
							"inline-flex items-center gap-2 px-3 py-2 h-8 rounded-md",
							"bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--text)]",
							"hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)]",
						)}
					>
						{commonDict.retry}
					</button>
				</div>
			) : isEmpty ? (
				<div className="p-12 text-center text-[var(--text-muted)]">
					<div
						className="text-[2.5rem] mb-3 opacity-40"
						aria-hidden="true"
					>
						{filterActive ? "🔍" : "📭"}
					</div>
					<div className="text-base font-semibold text-[var(--text)] mb-1">
						{filterActive ? dict.emptyFilteredTitle : dict.emptyTitle}
					</div>
					<p className="text-sm">
						{filterActive ? dict.emptyFilteredText : dict.emptyText}
					</p>
				</div>
			) : (
				<div className="p-2">
					{items.map((item, idx) => (
						<PagesToplistRow
							key={`${item.key}-${idx}`}
							item={item}
							rank={idx + 1}
							maxCount={maxCount}
							totalPageviews={totalPageviews}
							lang={lang}
							dict={dict}
						/>
					))}
				</div>
			)}

			<footer
				className={cn(
					"flex flex-wrap items-center justify-between gap-3",
					"px-5 py-4 border-t border-[var(--border)]",
				)}
			>
				<div className="text-xs text-[var(--text-muted)]">
					{interpolate(dict.shownOf, {
						shown: formatPagesNumber(items.length, lang),
						total: formatPagesNumber(total, lang),
					})}
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs text-[var(--text-muted)]">
						{dict.showLabel}
					</span>
					<Select
						value={String(limit)}
						onValueChange={(value) => {
							const next = Number(value) as PagesLimit;
							if (PAGES_LIMIT_OPTIONS.includes(next)) onLimitChange(next);
						}}
					>
						<SelectTrigger size="sm" aria-label={dict.showLabel} className="text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PAGES_LIMIT_OPTIONS.map((opt) => (
								<SelectItem key={opt} value={String(opt)}>
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<button
						type="button"
						onClick={onLoadMore}
						disabled={!hasNextPage || isFetchingNextPage}
						className={cn(
							"inline-flex items-center gap-2 px-3 py-2 h-8 rounded-md",
							"bg-[var(--accent)] text-[var(--accent-on)] text-xs font-semibold",
							"hover:translate-y-[-1px] hover:shadow-[var(--shadow-glow-sm)]",
							"disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none",
							"transition-all",
						)}
					>
						{isFetchingNextPage ? dict.loadingMore : dict.loadMore}
					</button>
				</div>
			</footer>
		</section>
	);
};
