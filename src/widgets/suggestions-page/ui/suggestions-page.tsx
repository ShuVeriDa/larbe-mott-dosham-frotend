"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useAuthStatus } from "@/shared/lib/auth";
import type { FC } from "react";
import { useSuggestionsPage } from "../model/use-suggestions-page";
import { SuggestionsEmpty } from "./suggestions-empty";
import { SuggestionsError } from "./suggestions-error";
import { SuggestionsHeader } from "./suggestions-header";
import { SuggestionsList } from "./suggestions-list";
import { SuggestionsLoginRequired } from "./suggestions-login-required";
import { SuggestionsNoResults } from "./suggestions-no-results";
import { SuggestionsSkeleton } from "./suggestions-skeleton";
import { SuggestionsStats } from "./suggestions-stats";
import { SuggestionsToolbar } from "./suggestions-toolbar";

interface SuggestionsPageProps {
	lang: Locale;
	dict: Dictionary["suggestions"];
	groupsDict: Dictionary["history"]["groups"];
}

export const SuggestionsPage: FC<SuggestionsPageProps> = ({
	lang,
	dict,
	groupsDict,
}) => {
	const authStatus = useAuthStatus();
	const {
		isAuthenticated,
		isLoading,
		isError,
		hasAnyItems,
		items,
		counts,
		visibleCount,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sort,
		setSort,
		resetFilters,
		retry,
	} = useSuggestionsPage();

	const showLoginRequired = authStatus === "ready" && !isAuthenticated;
	const showInitialLoading =
		authStatus !== "ready" || (isAuthenticated && isLoading && !hasAnyItems);
	const showToolbar = isAuthenticated && (hasAnyItems || isLoading);
	const showNoResults =
		hasAnyItems && visibleCount === 0 && !isLoading && !isError;
	const showEmpty =
		isAuthenticated && !isLoading && !isError && !hasAnyItems;

	return (
		<section className="max-w-3xl w-full mx-auto px-4 sm:px-6 pt-8 pb-20">
			{showToolbar && (
				<>
					<SuggestionsHeader
						dict={dict.header}
						lang={lang}
						count={counts.total}
					/>
					<SuggestionsStats
						dict={dict.stats}
						pending={counts.pending}
						approved={counts.approved}
						rejected={counts.rejected}
					/>
					<SuggestionsToolbar
						dict={dict.toolbar}
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						statusFilter={statusFilter}
						onStatusFilterChange={setStatusFilter}
						sort={sort}
						onSortChange={setSort}
						disabled={!hasAnyItems && isLoading}
					/>
				</>
			)}

			{showLoginRequired ? (
				<SuggestionsLoginRequired dict={dict.loginRequired} lang={lang} />
			) : showInitialLoading ? (
				<SuggestionsSkeleton />
			) : isError ? (
				<SuggestionsError dict={dict.error} onRetry={retry} />
			) : showEmpty ? (
				<SuggestionsEmpty dict={dict.empty} lang={lang} />
			) : showNoResults ? (
				<SuggestionsNoResults dict={dict.noResults} onReset={resetFilters} />
			) : (
				<SuggestionsList
					items={items}
					cardDict={dict.card}
					groupsDict={groupsDict}
					lang={lang}
				/>
			)}
		</section>
	);
};
