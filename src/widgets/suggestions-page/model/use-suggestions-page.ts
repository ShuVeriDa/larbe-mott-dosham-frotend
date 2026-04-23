"use client";

import {
	type Suggestion,
	type SuggestionStatus,
	useMySuggestions,
} from "@/features/suggestions";
import { useIsAuthenticated } from "@/shared/lib/auth";
import { useMemo, useState } from "react";

export type SuggestionStatusFilter = "all" | Lowercase<SuggestionStatus>;
export type SuggestionSort = "date-desc" | "date-asc";

/** Client-side list cap while there's no server filter by status. */
const LIST_LIMIT = 200;

interface SuggestionStatusCounts {
	total: number;
	pending: number;
	approved: number;
	rejected: number;
}

interface UseSuggestionsPageResult {
	isAuthenticated: boolean;
	isLoading: boolean;
	isError: boolean;
	hasAnyItems: boolean;
	items: Suggestion[];
	counts: SuggestionStatusCounts;
	visibleCount: number;
	searchQuery: string;
	setSearchQuery: (q: string) => void;
	statusFilter: SuggestionStatusFilter;
	setStatusFilter: (f: SuggestionStatusFilter) => void;
	sort: SuggestionSort;
	setSort: (s: SuggestionSort) => void;
	resetFilters: () => void;
	retry: () => void;
}

const statusMatches = (
	status: SuggestionStatus,
	filter: SuggestionStatusFilter,
): boolean => filter === "all" || status.toLowerCase() === filter;

const haystack = (s: Suggestion): string =>
	[
		s.entry?.word ?? "",
		s.field,
		s.oldValue ?? "",
		s.newValue,
		s.comment ?? "",
		s.reviewComment ?? "",
	]
		.join(" ")
		.toLowerCase();

export const useSuggestionsPage = (): UseSuggestionsPageResult => {
	const isAuthenticated = useIsAuthenticated();
	const params = useMemo(() => ({ limit: LIST_LIMIT }), []);
	const query = useMySuggestions(isAuthenticated ? params : undefined);

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] =
		useState<SuggestionStatusFilter>("all");
	const [sort, setSort] = useState<SuggestionSort>("date-desc");

	const rawItems = useMemo<Suggestion[]>(
		() => query.data?.data ?? [],
		[query.data],
	);

	const counts = useMemo<SuggestionStatusCounts>(() => {
		const result = { total: 0, pending: 0, approved: 0, rejected: 0 };
		for (const s of rawItems) {
			result.total += 1;
			if (s.status === "PENDING") result.pending += 1;
			else if (s.status === "APPROVED") result.approved += 1;
			else if (s.status === "REJECTED") result.rejected += 1;
		}
		return result;
	}, [rawItems]);

	const items = useMemo(() => {
		const needle = searchQuery.trim().toLowerCase();
		const filtered = rawItems.filter(
			s =>
				statusMatches(s.status, statusFilter) &&
				(!needle || haystack(s).includes(needle)),
		);
		const sorted = [...filtered].sort((a, b) => {
			const cmp = a.createdAt.localeCompare(b.createdAt);
			return sort === "date-asc" ? cmp : -cmp;
		});
		return sorted;
	}, [rawItems, searchQuery, statusFilter, sort]);

	return {
		isAuthenticated,
		isLoading: query.isLoading,
		isError: query.isError,
		hasAnyItems: rawItems.length > 0,
		items,
		counts,
		visibleCount: items.length,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sort,
		setSort,
		resetFilters: () => {
			setSearchQuery("");
			setStatusFilter("all");
		},
		retry: () => {
			query.refetch();
		},
	};
};
