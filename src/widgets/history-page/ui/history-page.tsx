"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useAuthStatus } from "@/shared/lib/auth";
import type { FC } from "react";
import { useHistoryPage } from "../model/use-history-page";
import { HistoryClearDialog } from "./history-clear-dialog";
import { HistoryEmpty } from "./history-empty";
import { HistoryError } from "./history-error";
import { HistoryGroup } from "./history-group";
import { HistoryHeader } from "./history-header";
import { HistoryLoginRequired } from "./history-login-required";
import { HistoryNoResults } from "./history-no-results";
import { HistorySkeleton } from "./history-skeleton";
import { HistoryToolbar } from "./history-toolbar";

interface HistoryPageProps {
	lang: Locale;
	dict: Dictionary["history"];
}

export const HistoryPage: FC<HistoryPageProps> = ({ lang, dict }) => {
	const authStatus = useAuthStatus();
	const {
		isAuthenticated,
		isLoading,
		isError,
		totalCount,
		visibleCount,
		groups,
		hasAnyItems,
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
	} = useHistoryPage({ lang, dict });

	const showLoginRequired = authStatus === "ready" && !isAuthenticated;
	const showInitialLoading =
		authStatus !== "ready" || (isAuthenticated && isLoading && !hasAnyItems);
	const showHeaderToolbar = isAuthenticated && (hasAnyItems || isLoading);
	const showFiltersEmpty =
		hasAnyItems && visibleCount === 0 && !isLoading && !isError;
	const showEmptyState =
		isAuthenticated && !isLoading && !isError && !hasAnyItems;

	return (
		<section className="max-w-3xl w-full mx-auto px-4 sm:px-6 pt-8 pb-20">
			{showHeaderToolbar && (
				<>
					<HistoryHeader
						dict={dict.header}
						lang={lang}
						count={totalCount}
						disabled={!hasAnyItems || isLoading}
						onClearAll={openClearDialog}
					/>
					<HistoryToolbar
						dict={dict.toolbar}
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						langFilter={langFilter}
						onLangFilterChange={setLangFilter}
						disabled={!hasAnyItems}
					/>
				</>
			)}

			{showLoginRequired ? (
				<HistoryLoginRequired dict={dict.loginRequired} lang={lang} />
			) : showInitialLoading ? (
				<HistorySkeleton />
			) : isError ? (
				<HistoryError dict={dict.error} onRetry={retry} />
			) : showEmptyState ? (
				<HistoryEmpty dict={dict.empty} lang={lang} />
			) : showFiltersEmpty ? (
				<HistoryNoResults dict={dict.noResults} onReset={resetFilters} />
			) : (
				<div>
					{groups.map(group => (
						<HistoryGroup
							key={group.key}
							group={group}
							itemDict={dict.item}
							lang={lang}
							removingIds={removingIds}
							onRemove={removeItem}
						/>
					))}
				</div>
			)}

			<HistoryClearDialog
				open={clearDialogOpen}
				dict={dict.clearDialog}
				onOpenChange={open => (open ? openClearDialog() : closeClearDialog())}
				onConfirm={confirmClearAll}
			/>
		</section>
	);
};
