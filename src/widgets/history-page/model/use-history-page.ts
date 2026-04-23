"use client";

import {
	type SearchHistoryParams,
	type SearchHistoryRecord,
	type SearchHistoryResponse,
	searchHistoryKeys,
	useClearSearchHistory,
	useDeleteSearchHistoryItem,
	useSearchHistory,
} from "@/features/search-history";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useIsAuthenticated } from "@/shared/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { type HistoryDateGroup, groupByDate } from "./group-by-date";

/** Length of the slide-out animation (must match CSS) */
export const HISTORY_REMOVE_ANIMATION_MS = 280;

/** Match the `?limit=` we ask the backend for. */
const HISTORY_LIMIT = 200;

export type HistoryLangFilter = "all" | "nah" | "ru";

interface UseHistoryPageOptions {
	lang: Locale;
	dict: Dictionary["history"];
}

interface UseHistoryPageResult {
	isAuthenticated: boolean;
	isLoading: boolean;
	isError: boolean;
	totalCount: number;
	visibleCount: number;
	groups: HistoryDateGroup[];
	hasAnyItems: boolean;
	searchQuery: string;
	setSearchQuery: (q: string) => void;
	langFilter: HistoryLangFilter;
	setLangFilter: (f: HistoryLangFilter) => void;
	resetFilters: () => void;
	clearDialogOpen: boolean;
	openClearDialog: () => void;
	closeClearDialog: () => void;
	confirmClearAll: () => void;
	removingIds: ReadonlySet<string>;
	removeItem: (id: string, query: string) => void;
	retry: () => void;
}

const matchesLang = (
	itemLang: string | undefined,
	filter: HistoryLangFilter,
): boolean => {
	if (filter === "all") return true;
	if (filter === "ru") return itemLang === "ru";
	return itemLang === "nah";
};

export const useHistoryPage = ({
	lang,
	dict,
}: UseHistoryPageOptions): UseHistoryPageResult => {
	const isAuthenticated = useIsAuthenticated();
	const qc = useQueryClient();
	const params = useMemo<SearchHistoryParams>(
		() => ({ limit: HISTORY_LIMIT }),
		[],
	);

	const query = useSearchHistory(params, isAuthenticated);
	const deleteMutation = useDeleteSearchHistoryItem();
	const clearMutation = useClearSearchHistory();

	const [searchQuery, setSearchQuery] = useState("");
	const [langFilter, setLangFilter] = useState<HistoryLangFilter>("all");
	const [clearDialogOpen, setClearDialogOpen] = useState(false);
	const [removingIds, setRemovingIds] = useState<ReadonlySet<string>>(
		() => new Set(),
	);
	const removeTimers = useRef(new Map<string, number>());

	const items = useMemo<SearchHistoryRecord[]>(
		() => query.data?.items ?? [],
		[query.data],
	);
	const totalCount = query.data?.total ?? items.length;

	const filteredItems = useMemo(() => {
		const needle = searchQuery.trim().toLowerCase();
		return items.filter(item => {
			if (!matchesLang(item.lang, langFilter)) return false;
			if (!needle) return true;
			return item.query.toLowerCase().includes(needle);
		});
	}, [items, searchQuery, langFilter]);

	const groups = useMemo(
		() =>
			groupByDate(filteredItems, {
				lang,
				groupsDict: dict.groups,
			}),
		[filteredItems, lang, dict.groups],
	);

	const removeItem = useCallback(
		(id: string, queryText: string) => {
			if (removingIds.has(id)) return;
			setRemovingIds(prev => {
				const next = new Set(prev);
				next.add(id);
				return next;
			});

			const timerId = window.setTimeout(() => {
				removeTimers.current.delete(id);

				qc.setQueryData<SearchHistoryResponse>(
					searchHistoryKeys.list(params),
					prev =>
						prev
							? {
									items: prev.items.filter(i => i.id !== id),
									total: Math.max(0, prev.total - 1),
								}
							: prev,
				);
				setRemovingIds(prev => {
					if (!prev.has(id)) return prev;
					const next = new Set(prev);
					next.delete(id);
					return next;
				});

				deleteMutation.mutate(id, {
					onSuccess: () => {
						toast.success(
							dict.toasts.itemRemoved.replace("{query}", queryText),
						);
					},
					onError: () => {
						toast.error(dict.toasts.removeError);
						qc.invalidateQueries({ queryKey: searchHistoryKeys.all });
					},
				});
			}, HISTORY_REMOVE_ANIMATION_MS);

			removeTimers.current.set(id, timerId);
		},
		[deleteMutation, dict.toasts, params, qc, removingIds],
	);

	const openClearDialog = useCallback(() => setClearDialogOpen(true), []);
	const closeClearDialog = useCallback(() => setClearDialogOpen(false), []);

	const confirmClearAll = useCallback(() => {
		setClearDialogOpen(false);

		const ids = items.map(i => i.id);
		if (ids.length === 0) return;

		setRemovingIds(new Set(ids));

		const timerId = window.setTimeout(() => {
			setRemovingIds(new Set());
			qc.setQueryData<SearchHistoryResponse>(
				searchHistoryKeys.list(params),
				{ items: [], total: 0 },
			);

			clearMutation.mutate(undefined, {
				onSuccess: () => {
					toast.success(dict.toasts.cleared);
				},
				onError: () => {
					toast.error(dict.toasts.clearError);
					qc.invalidateQueries({ queryKey: searchHistoryKeys.all });
				},
			});
		}, HISTORY_REMOVE_ANIMATION_MS);

		// Track this timer too so we don't have to special-case it on unmount.
		removeTimers.current.set("__clear__", timerId);
	}, [clearMutation, dict.toasts, items, params, qc]);

	const resetFilters = useCallback(() => {
		setSearchQuery("");
		setLangFilter("all");
	}, []);

	const retry = useCallback(() => {
		query.refetch();
	}, [query]);

	return {
		isAuthenticated,
		isLoading: query.isLoading,
		isError: query.isError,
		totalCount,
		visibleCount: filteredItems.length,
		groups,
		hasAnyItems: items.length > 0,
		searchQuery,
		setSearchQuery,
		langFilter,
		setLangFilter,
		resetFilters,
		clearDialogOpen,
		openClearDialog,
		closeClearDialog,
		confirmClearAll,
		removingIds,
		removeItem,
		retry,
	};
};
