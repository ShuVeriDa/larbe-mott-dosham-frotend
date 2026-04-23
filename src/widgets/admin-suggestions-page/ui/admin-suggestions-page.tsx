"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useAuthStatus } from "@/shared/lib/auth";
import type { FC } from "react";
import { useAdminSuggestionsPage } from "../model/use-admin-suggestions-page";
import {
	AdminSuggestionsEmpty,
	AdminSuggestionsNoResults,
} from "./admin-suggestions-empty";
import { AdminSuggestionsError } from "./admin-suggestions-error";
import { AdminSuggestionsHeader } from "./admin-suggestions-header";
import { AdminSuggestionsList } from "./admin-suggestions-list";
import {
	AdminSuggestionsForbidden,
	AdminSuggestionsLoginRequired,
} from "./admin-suggestions-login-required";
import { AdminSuggestionsPagination } from "./admin-suggestions-pagination";
import { AdminSuggestionsReviewDialog } from "./admin-suggestions-review-dialog";
import { AdminSuggestionsSkeleton } from "./admin-suggestions-skeleton";
import { AdminSuggestionsStats } from "./admin-suggestions-stats";
import { AdminSuggestionsToolbar } from "./admin-suggestions-toolbar";

interface AdminSuggestionsPageProps {
	lang: Locale;
	dict: Dictionary["adminSuggestions"];
	groupsDict: Dictionary["history"]["groups"];
}

export const AdminSuggestionsPage: FC<AdminSuggestionsPageProps> = ({
	lang,
	dict,
	groupsDict,
}) => {
	const authStatus = useAuthStatus();
	const state = useAdminSuggestionsPage({ dict });

	const showLoginRequired = authStatus === "ready" && !state.isAuthenticated;
	const showForbidden =
		authStatus === "ready" && state.isAuthenticated && !state.canReview;
	const showInitialLoading =
		authStatus !== "ready" ||
		(state.isAuthenticated &&
			state.canReview &&
			state.isLoading &&
			state.items.length === 0);

	const hasItems = state.items.length > 0;
	const showNoResults =
		!state.isLoading &&
		!state.isError &&
		!hasItems &&
		state.hasFilters;
	const showEmpty =
		!state.isLoading &&
		!state.isError &&
		!hasItems &&
		!state.hasFilters &&
		state.totalCount === 0;

	return (
		<article className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 pb-16">
			<AdminSuggestionsHeader dict={dict.header} />

			{showLoginRequired ? (
				<AdminSuggestionsLoginRequired dict={dict.loginRequired} lang={lang} />
			) : showForbidden ? (
				<AdminSuggestionsForbidden dict={dict.forbidden} />
			) : (
				<>
					<AdminSuggestionsStats
						dict={dict.stats}
						data={state.stats}
						isLoading={state.statsLoading}
					/>
					<AdminSuggestionsToolbar
						dict={dict.toolbar}
						searchValue={state.searchInput}
						onSearchChange={state.onSearchChange}
						statusFilter={state.statusFilter}
						onStatusFilterChange={state.onStatusFilterChange}
						sort={state.sort}
						onSortChange={state.onSortChange}
					/>

					{showInitialLoading ? (
						<AdminSuggestionsSkeleton />
					) : state.isError ? (
						<AdminSuggestionsError
							dict={dict.error}
							onRetry={() => {
								state.retry();
							}}
						/>
					) : showEmpty ? (
						<AdminSuggestionsEmpty dict={dict.empty} />
					) : showNoResults ? (
						<AdminSuggestionsNoResults
							dict={dict.noResults}
							onReset={state.resetFilters}
						/>
					) : (
						<>
							<AdminSuggestionsList
								items={state.items}
								dict={dict.card}
								groupsDict={groupsDict}
								lang={lang}
								canReview={state.canReview}
								onReview={state.openReview}
								isFetching={state.isFetching && !state.isLoading}
							/>
							<AdminSuggestionsPagination
								dict={dict.pagination}
								page={state.page}
								totalPages={state.totalPages}
								totalCount={state.totalCount}
								pageSize={state.pageSize}
								onChange={state.goPage}
							/>
						</>
					)}
				</>
			)}

			<AdminSuggestionsReviewDialog
				target={state.reviewTarget}
				dict={dict.reviewDialog}
				saving={state.isReviewing}
				onClose={state.closeReview}
				onSubmit={state.submitReview}
			/>
		</article>
	);
};
