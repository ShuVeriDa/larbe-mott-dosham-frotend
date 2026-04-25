"use client";

import type { AnalyticsSearchQueryItem } from "@/features/admin-analytics";
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
import {
	formatSearchQueriesNumber,
	interpolate,
} from "../lib/format-search-queries";
import {
	SEARCH_QUERIES_LIMIT_OPTIONS,
	type SearchQueriesLimit,
} from "../model/use-search-queries-page-state";
import { SearchQueriesToplistRow } from "./search-queries-toplist-row";
import { SearchQueriesToplistSkeleton } from "./search-queries-toplist-skeleton";

interface SearchQueriesToplistProps {
	lang: Locale;
	dict: Dictionary["admin"]["analyticsSearchQueries"]["toplist"];
	commonDict: Dictionary["admin"]["common"];
	items: AnalyticsSearchQueryItem[];
	total: number;
	maxCount: number;
	totalSearches: number;
	search: string;
	onSearchChange: (value: string) => void;
	debouncedSearch: string;
	limit: SearchQueriesLimit;
	onLimitChange: (value: SearchQueriesLimit) => void;
	onlyZeroResults: boolean;
	onToggleZeroResults: (next: boolean) => void;
	onLoadMore: () => void;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	isLoading: boolean;
	isError: boolean;
	onRetry: () => void;
}

export const SearchQueriesToplist: FC<SearchQueriesToplistProps> = ({
	lang,
	dict,
	commonDict,
	items,
	total,
	maxCount,
	totalSearches,
	search,
	onSearchChange,
	debouncedSearch,
	limit,
	onLimitChange,
	onlyZeroResults,
	onToggleZeroResults,
	onLoadMore,
	hasNextPage,
	isFetchingNextPage,
	isLoading,
	isError,
	onRetry,
}) => {

	const filterActive = debouncedSearch.trim().length > 0;
	const isEmpty = !isLoading && !isError && items.length === 0;

	const emptyTitle = filterActive
		? dict.emptyFilteredTitle
		: onlyZeroResults
			? dict.emptyZeroTitle
			: dict.emptyTitle;
	const emptyText = filterActive
		? dict.emptyFilteredText
		: onlyZeroResults
			? dict.emptyZeroText
			: dict.emptyText;
	const emptyIcon = filterActive ? "🔍" : onlyZeroResults ? "✨" : "📭";

	return (
		<section
			className={cn(
				"bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden",
			)}
			aria-label={dict.title}
		>
			<header
				className={cn(
					"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
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
						{formatSearchQueriesNumber(items.length, lang)}
					</span>
				</h2>
				<div className="flex flex-col sm:flex-row gap-3 sm:items-center">
					<button
						type="button"
						onClick={() => onToggleZeroResults(!onlyZeroResults)}
						aria-pressed={onlyZeroResults}
						className={cn(
							"inline-flex items-center gap-2 px-3 h-9 rounded-md",
							"text-xs font-medium transition-colors",
							onlyZeroResults
								? "border border-[var(--danger)] bg-[var(--danger-dim)] text-[var(--danger)]"
								: "border border-[var(--border)] bg-[var(--bg-raised)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text)]",
						)}
					>
						<span
							aria-hidden="true"
							className={cn(
								"w-4 h-4 rounded-[3px] flex items-center justify-center text-[10px] border-[1.5px]",
								onlyZeroResults
									? "bg-[var(--danger)] border-[var(--danger)] text-white"
									: "bg-[var(--bg)] border-[var(--border)] text-transparent",
							)}
						>
							✓
						</span>
						{dict.onlyZeroResults}
					</button>
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
				</div>
			</header>

			{isLoading ? (
				<SearchQueriesToplistSkeleton />
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
						{emptyIcon}
					</div>
					<div className="text-base font-semibold text-[var(--text)] mb-1">
						{emptyTitle}
					</div>
					<p className="text-sm">{emptyText}</p>
				</div>
			) : (
				<div className="p-2">
					{items.map((item, idx) => (
						<SearchQueriesToplistRow
							key={`${item.query}-${idx}`}
							item={item}
							rank={idx + 1}
							maxCount={maxCount}
							totalSearches={totalSearches}
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
						shown: formatSearchQueriesNumber(items.length, lang),
						total: formatSearchQueriesNumber(total, lang),
					})}
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs text-[var(--text-muted)]">
						{dict.showLabel}
					</span>
					<Select
						value={String(limit)}
						onValueChange={(value) => {
							const next = Number(value) as SearchQueriesLimit;
							if (SEARCH_QUERIES_LIMIT_OPTIONS.includes(next)) onLimitChange(next);
						}}
					>
						<SelectTrigger size="sm" aria-label={dict.showLabel} className="text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{SEARCH_QUERIES_LIMIT_OPTIONS.map((opt) => (
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
