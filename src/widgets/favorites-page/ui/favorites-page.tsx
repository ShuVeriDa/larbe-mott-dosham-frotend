"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useAuthStatus } from "@/shared/lib/auth";
import type { FC } from "react";
import { useFavoritesPage } from "../model/use-favorites-page";
import { FavoriteRemoveDialog } from "./favorite-remove-dialog";
import { FavoritesEmpty } from "./favorites-empty";
import { FavoritesError } from "./favorites-error";
import { FavoritesHeader } from "./favorites-header";
import { FavoritesList } from "./favorites-list";
import { FavoritesLoginRequired } from "./favorites-login-required";
import { FavoritesNoResults } from "./favorites-no-results";
import { FavoritesSkeleton } from "./favorites-skeleton";
import { FavoritesToolbar } from "./favorites-toolbar";

interface FavoritesPageProps {
	lang: Locale;
	dict: Dictionary["favoritesPage"];
}

export const FavoritesPage: FC<FavoritesPageProps> = ({ lang, dict }) => {
	const authStatus = useAuthStatus();
	const {
		isAuthenticated,
		isLoading,
		isError,
		totalCount,
		visibleCount,
		items,
		hasAnyItems,
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
	} = useFavoritesPage({ dict });

	const showLoginRequired = authStatus === "ready" && !isAuthenticated;
	const showInitialLoading =
		authStatus !== "ready" || (isAuthenticated && isLoading && !hasAnyItems);
	const showHeaderToolbar = isAuthenticated && (hasAnyItems || isLoading);
	const showFiltersEmpty =
		hasAnyItems && visibleCount === 0 && !isLoading && !isError;
	const showEmptyState =
		isAuthenticated && !isLoading && !isError && !hasAnyItems;

	const removeDialogWord = removeDialogEntry
		? removeDialogEntry.entry.wordAccented || removeDialogEntry.entry.word
		: "";

	return (
		<section className="max-w-3xl w-full mx-auto px-4 sm:px-6 pt-8 pb-20">
			{showHeaderToolbar && (
				<>
					<FavoritesHeader
						dict={dict.header}
						lang={lang}
						count={totalCount}
					/>
					<FavoritesToolbar
						dict={dict.toolbar}
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						levelFilter={levelFilter}
						onLevelFilterChange={setLevelFilter}
						sortMode={sortMode}
						onSortModeChange={setSortMode}
						disabled={!hasAnyItems}
					/>
				</>
			)}

			{showLoginRequired ? (
				<FavoritesLoginRequired dict={dict.loginRequired} lang={lang} />
			) : showInitialLoading ? (
				<FavoritesSkeleton />
			) : isError ? (
				<FavoritesError dict={dict.error} onRetry={retry} />
			) : showEmptyState ? (
				<FavoritesEmpty dict={dict.empty} lang={lang} />
			) : showFiltersEmpty ? (
				<FavoritesNoResults dict={dict.noResults} onReset={resetFilters} />
			) : (
				<FavoritesList
					items={items}
					dict={dict.item}
					lang={lang}
					removingIds={removingIds}
					onRemove={openRemoveDialog}
				/>
			)}

			<FavoriteRemoveDialog
				open={!!removeDialogEntry}
				word={removeDialogWord}
				dict={dict.removeDialog}
				onOpenChange={open => (open ? null : closeRemoveDialog())}
				onConfirm={confirmRemove}
			/>
		</section>
	);
};
