"use client";

import { useCurrentUser } from "@/entities/user";
import {
	type GetSuggestionsParams,
	type ReviewDecision,
	type Suggestion,
	type SuggestionStatus,
	suggestionKeys,
	suggestionsApi,
	useReviewSuggestion,
} from "@/features/suggestions";
import type { Dictionary } from "@/i18n/dictionaries";
import { useDebounce } from "@/shared/lib";
import { useIsAuthenticated } from "@/shared/lib/auth";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export type AdminSuggestionStatusFilter = "all" | Lowercase<SuggestionStatus>;
export type AdminSuggestionSort = "date-desc" | "date-asc";

const PAGE_SIZE = 20;

const canModerate = (
	roles: { role: { name: string } }[] | undefined,
): boolean =>
	!!roles?.some(r => r.role.name === "ADMIN" || r.role.name === "EDITOR");

const filterToStatus = (
	filter: AdminSuggestionStatusFilter,
): SuggestionStatus | undefined => {
	if (filter === "pending") return "PENDING";
	if (filter === "approved") return "APPROVED";
	if (filter === "rejected") return "REJECTED";
	return undefined;
};

interface ReviewTarget {
	suggestion: Suggestion;
	decision: ReviewDecision;
}

interface UseAdminSuggestionsPageOptions {
	dict: Dictionary["adminSuggestions"];
}

export const useAdminSuggestionsPage = ({
	dict,
}: UseAdminSuggestionsPageOptions) => {
	const isAuthenticated = useIsAuthenticated();
	const { data: currentUser } = useCurrentUser();
	const canReview =
		!!currentUser?.isAdmin || canModerate(currentUser?.roles);
	const enabled = isAuthenticated && canReview;

	const [searchInput, setSearchInput] = useState("");
	const debouncedSearch = useDebounce(searchInput, 200);

	const [statusFilter, setStatusFilter] =
		useState<AdminSuggestionStatusFilter>("all");
	const [sort, setSort] = useState<AdminSuggestionSort>("date-desc");
	const [page, setPage] = useState(1);

	const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);

	const listParams = useMemo<GetSuggestionsParams>(
		() => ({
			status: filterToStatus(statusFilter),
			order: sort === "date-asc" ? "asc" : "desc",
			q: debouncedSearch.trim() || undefined,
			limit: PAGE_SIZE,
			offset: (page - 1) * PAGE_SIZE,
		}),
		[statusFilter, sort, debouncedSearch, page],
	);

	const listQuery = useQuery({
		queryKey: suggestionKeys.list(listParams),
		queryFn: () => suggestionsApi.getAll(listParams),
		enabled,
		placeholderData: keepPreviousData,
		staleTime: 30 * 1000,
	});

	const statsQuery = useQuery({
		queryKey: suggestionKeys.stats(),
		queryFn: suggestionsApi.getStats,
		enabled,
		staleTime: 30 * 1000,
	});

	const reviewMutation = useReviewSuggestion();

	const items = listQuery.data?.data ?? [];
	const totalCount = listQuery.data?.meta.total ?? 0;
	const totalPages = totalCount > 0 ? Math.ceil(totalCount / PAGE_SIZE) : 0;
	const hasFilters = !!debouncedSearch.trim() || statusFilter !== "all";

	const onSearchChange = useCallback((value: string) => {
		setSearchInput(value);
		setPage(1);
	}, []);

	const onStatusFilterChange = useCallback(
		(value: AdminSuggestionStatusFilter) => {
			setStatusFilter(value);
			setPage(1);
		},
		[],
	);

	const onSortChange = useCallback((value: AdminSuggestionSort) => {
		setSort(value);
		setPage(1);
	}, []);

	const resetFilters = useCallback(() => {
		setSearchInput("");
		setStatusFilter("all");
		setPage(1);
	}, []);

	const goPage = useCallback(
		(target: number) => {
			if (target < 1 || (totalPages > 0 && target > totalPages)) return;
			setPage(target);
			if (typeof window !== "undefined") {
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		},
		[totalPages],
	);

	const openReview = useCallback(
		(suggestion: Suggestion, decision: ReviewDecision) =>
			setReviewTarget({ suggestion, decision }),
		[],
	);
	const closeReview = useCallback(() => setReviewTarget(null), []);

	const submitReview = useCallback(
		async (comment: string) => {
			if (!reviewTarget) return;
			const { suggestion, decision } = reviewTarget;
			const word = suggestion.entry?.word ?? "";
			try {
				await reviewMutation.mutateAsync({
					id: suggestion.id,
					dto: {
						decision,
						comment: comment.trim() || undefined,
					},
				});
				const template =
					decision === "approve"
						? dict.toasts.approved
						: dict.toasts.rejected;
				toast.success(template.replace("{word}", word));
				setReviewTarget(null);
			} catch {
				const message =
					decision === "approve"
						? dict.toasts.approveError
						: dict.toasts.rejectError;
				toast.error(message);
			}
		},
		[dict.toasts, reviewMutation, reviewTarget],
	);

	return {
		isAuthenticated,
		canReview,
		items,
		totalCount,
		totalPages,
		page,
		pageSize: PAGE_SIZE,
		isLoading: listQuery.isLoading,
		isFetching: listQuery.isFetching,
		isError: listQuery.isError,
		hasFilters,
		stats: statsQuery.data,
		statsLoading: statsQuery.isLoading,
		searchInput,
		onSearchChange,
		statusFilter,
		onStatusFilterChange,
		sort,
		onSortChange,
		resetFilters,
		goPage,
		retry: listQuery.refetch,
		reviewTarget,
		openReview,
		closeReview,
		submitReview,
		isReviewing: reviewMutation.isPending,
	};
};

export type UseAdminSuggestionsPageResult = ReturnType<
	typeof useAdminSuggestionsPage
>;
