"use client";

import {
	type FavoriteRecord,
	favoritesKeys,
	useFavorites,
	useFavoritesSessionStore,
	useToggleFavorite,
} from "@/features/favorites";
import type { Dictionary } from "@/i18n/dictionaries";
import { useIsAuthenticated } from "@/shared/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

/** Must match the CSS slide-out animation duration. */
export const FAVORITE_REMOVE_ANIMATION_MS = 280;

export type FavoritesLevelFilter = "all" | "A" | "B" | "C";
export type FavoritesSortMode = "date-desc" | "date-asc" | "alpha";

const matchesLevel = (
	level: string | undefined,
	filter: FavoritesLevelFilter,
): boolean => filter === "all" || level === filter;

const firstTranslation = (record: FavoriteRecord): string =>
	record.entry.meanings?.[0]?.translation?.trim() ?? "";

const sortFavorites = (
	list: readonly FavoriteRecord[],
	mode: FavoritesSortMode,
): FavoriteRecord[] => {
	const copy = [...list];
	if (mode === "alpha") {
		return copy.sort((a, b) =>
			a.entry.word.localeCompare(b.entry.word, "ru"),
		);
	}
	return copy.sort((a, b) => {
		const diff = b.createdAt.localeCompare(a.createdAt);
		return mode === "date-desc" ? diff : -diff;
	});
};

interface UseFavoritesPageOptions {
	dict: Dictionary["favoritesPage"];
}

interface UseFavoritesPageResult {
	isAuthenticated: boolean;
	isLoading: boolean;
	isError: boolean;
	totalCount: number;
	visibleCount: number;
	items: readonly FavoriteRecord[];
	hasAnyItems: boolean;
	searchQuery: string;
	setSearchQuery: (q: string) => void;
	levelFilter: FavoritesLevelFilter;
	setLevelFilter: (f: FavoritesLevelFilter) => void;
	sortMode: FavoritesSortMode;
	setSortMode: (m: FavoritesSortMode) => void;
	resetFilters: () => void;
	removeDialogEntry: FavoriteRecord | null;
	openRemoveDialog: (record: FavoriteRecord) => void;
	closeRemoveDialog: () => void;
	confirmRemove: () => void;
	removingIds: ReadonlySet<number>;
	retry: () => void;
}

export const useFavoritesPage = ({
	dict,
}: UseFavoritesPageOptions): UseFavoritesPageResult => {
	const isAuthenticated = useIsAuthenticated();
	const qc = useQueryClient();

	const query = useFavorites();
	const setFavoritedSession = useFavoritesSessionStore(s => s.setFavorited);

	const [searchQuery, setSearchQuery] = useState("");
	const [levelFilter, setLevelFilter] = useState<FavoritesLevelFilter>("all");
	const [sortMode, setSortMode] = useState<FavoritesSortMode>("date-desc");
	const [removeDialogEntry, setRemoveDialogEntry] =
		useState<FavoriteRecord | null>(null);
	const [removingIds, setRemovingIds] = useState<ReadonlySet<number>>(
		() => new Set(),
	);
	const removeTimers = useRef(new Map<number, number>());

	const items = useMemo<readonly FavoriteRecord[]>(
		() => query.data ?? [],
		[query.data],
	);

	const filteredItems = useMemo(() => {
		const needle = searchQuery.trim().toLowerCase();
		const filtered = items.filter(record => {
			if (!matchesLevel(record.entry.wordLevel, levelFilter)) return false;
			if (!needle) return true;
			const word = record.entry.word.toLowerCase();
			const accented = record.entry.wordAccented?.toLowerCase() ?? "";
			const meaning = firstTranslation(record).toLowerCase();
			return (
				word.includes(needle) ||
				accented.includes(needle) ||
				meaning.includes(needle)
			);
		});
		return sortFavorites(filtered, sortMode);
	}, [items, searchQuery, levelFilter, sortMode]);

	const toggleMutation = useToggleFavorite();

	const confirmRemove = useCallback(() => {
		const target = removeDialogEntry;
		if (!target) return;
		setRemoveDialogEntry(null);

		const entryId = target.entryId;
		const word = target.entry.wordAccented || target.entry.word;

		if (removingIds.has(entryId)) return;

		// Snapshot the previous list so we can roll back on error.
		const previousList =
			qc.getQueryData<FavoriteRecord[]>(favoritesKeys.list()) ?? null;

		setRemovingIds(prev => {
			const next = new Set(prev);
			next.add(entryId);
			return next;
		});

		const timerId = window.setTimeout(() => {
			removeTimers.current.delete(entryId);

			// Optimistic cache + session update.
			qc.setQueryData<FavoriteRecord[]>(favoritesKeys.list(), prev =>
				prev ? prev.filter(r => r.entryId !== entryId) : prev,
			);
			setFavoritedSession(entryId, false);

			setRemovingIds(prev => {
				if (!prev.has(entryId)) return prev;
				const next = new Set(prev);
				next.delete(entryId);
				return next;
			});

			toggleMutation.mutate(entryId, {
				onSuccess: data => {
					// `useToggleFavorite` already invalidates the list and syncs
					// `check(entryId)`. If the server reports favorited=true we
					// were out of sync — the invalidation-driven refetch will
					// restore the missing row on its own.
					if (data.favorited) {
						qc.invalidateQueries({ queryKey: favoritesKeys.all });
					}
					toast.success(
						dict.toasts.itemRemoved.replace("{word}", word),
					);
				},
				onError: () => {
					// Roll back the optimistic removal, then let the shared
					// query invalidate to re-sync with the server.
					if (previousList) {
						qc.setQueryData<FavoriteRecord[]>(
							favoritesKeys.list(),
							previousList,
						);
					}
					setFavoritedSession(entryId, true);
					qc.invalidateQueries({ queryKey: favoritesKeys.all });
					toast.error(dict.toasts.removeError);
				},
			});
		}, FAVORITE_REMOVE_ANIMATION_MS);

		removeTimers.current.set(entryId, timerId);
	}, [
		dict.toasts,
		qc,
		removeDialogEntry,
		removingIds,
		setFavoritedSession,
		toggleMutation,
	]);

	const openRemoveDialog = useCallback(
		(record: FavoriteRecord) => setRemoveDialogEntry(record),
		[],
	);
	const closeRemoveDialog = useCallback(() => setRemoveDialogEntry(null), []);

	const resetFilters = useCallback(() => {
		setSearchQuery("");
		setLevelFilter("all");
	}, []);

	const retry = useCallback(() => {
		query.refetch();
	}, [query]);

	return {
		isAuthenticated,
		isLoading: query.isLoading,
		isError: query.isError,
		totalCount: items.length,
		visibleCount: filteredItems.length,
		items: filteredItems,
		hasAnyItems: items.length > 0,
		searchQuery,
		setSearchQuery,
		levelFilter,
		setLevelFilter,
		sortMode,
		setSortMode,
		resetFilters,
		removeDialogEntry,
		openRemoveDialog,
		closeRemoveDialog,
		confirmRemove,
		removingIds,
		retry,
	};
};
