"use client";

import { useCurrentUser } from "@/entities/user";
import { useDictionaryEntry } from "@/entities/dictionary";
import {
	type ReviewDecision,
	useAdjacentSuggestions,
	useReviewSuggestion,
	useSuggestion,
} from "@/features/suggestions";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { isApiError, toApiError } from "@/shared/api";
import { useIsAuthenticated } from "@/shared/lib/auth";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface UseAdminSuggestionDetailOptions {
	id: string;
	lang: Locale;
	dict: Dictionary["adminSuggestionDetail"];
}

export const useAdminSuggestionDetail = ({
	id,
	dict,
}: UseAdminSuggestionDetailOptions) => {
	const isAuthenticated = useIsAuthenticated();
	const { data: currentUser } = useCurrentUser();

	const canReview = useMemo(() => {
		if (!currentUser) return false;
		if (currentUser.isAdmin) return true;
		return currentUser.roles.some(
			(r) => r.role.name === "ADMIN" || r.role.name === "EDITOR",
		);
	}, [currentUser]);

	const canFetch = isAuthenticated && canReview;

	const suggestionQuery = useSuggestion(canFetch ? id : "");
	const suggestion = suggestionQuery.data;
	const entryId = suggestion?.entryId ?? suggestion?.entry?.id ?? 0;

	const adjacentQuery = useAdjacentSuggestions(canFetch ? id : "");
	const entryQuery = useDictionaryEntry(canFetch && entryId ? entryId : 0);

	const reviewMutation = useReviewSuggestion();

	const [reviewComment, setReviewComment] = useState("");
	const [confirmAction, setConfirmAction] = useState<ReviewDecision | null>(
		null,
	);

	const openConfirm = useCallback((action: ReviewDecision) => {
		setConfirmAction(action);
	}, []);

	const closeConfirm = useCallback(() => {
		if (!reviewMutation.isPending) setConfirmAction(null);
	}, [reviewMutation.isPending]);

	const submitReview = useCallback(async () => {
		if (!confirmAction || !suggestion) return;
		const decision = confirmAction;
		const trimmed = reviewComment.trim();
		try {
			await reviewMutation.mutateAsync({
				id: suggestion.id,
				dto: { decision, comment: trimmed || undefined },
			});
			toast.success(
				decision === "approve" ? dict.toast.approved : dict.toast.rejected,
			);
			setConfirmAction(null);
			setReviewComment("");
		} catch (err) {
			const apiErr = isApiError(err) ? err : toApiError(err);
			toast.error(apiErr.message || dict.toast.error);
		}
	}, [
		confirmAction,
		dict.toast,
		reviewComment,
		reviewMutation,
		suggestion,
	]);

	return {
		isAuthenticated,
		canReview,
		authReady: canFetch,
		suggestion,
		isLoading: suggestionQuery.isLoading,
		isError: suggestionQuery.isError,
		error: suggestionQuery.error,
		refetch: suggestionQuery.refetch,
		adjacent: adjacentQuery.data,
		entry: entryQuery.data,
		entryLoading: entryQuery.isLoading,
		entryError: entryQuery.isError,
		reviewComment,
		setReviewComment,
		confirmAction,
		openConfirm,
		closeConfirm,
		submitReview,
		isReviewing: reviewMutation.isPending,
	};
};

export type UseAdminSuggestionDetailResult = ReturnType<
	typeof useAdminSuggestionDetail
>;
