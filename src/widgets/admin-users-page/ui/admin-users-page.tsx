"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useAuthStatus } from "@/shared/lib/auth";
import type { FC } from "react";
import { useAdminUsersPage } from "../model/use-admin-users-page";
import { AdminUsersBlockDialog } from "./admin-users-block-dialog";
import { AdminUsersCards } from "./admin-users-cards";
import { AdminUsersEditDialog } from "./admin-users-edit-dialog";
import {
	AdminUsersEmpty,
	AdminUsersNoResults,
} from "./admin-users-empty";
import { AdminUsersError } from "./admin-users-error";
import { AdminUsersHeader } from "./admin-users-header";
import {
	AdminUsersForbidden,
	AdminUsersLoginRequired,
} from "./admin-users-login-required";
import { AdminUsersPagination } from "./admin-users-pagination";
import { AdminUsersSkeleton } from "./admin-users-skeleton";
import { AdminUsersStats } from "./admin-users-stats";
import { AdminUsersTable } from "./admin-users-table";
import { AdminUsersToolbar } from "./admin-users-toolbar";

interface AdminUsersPageProps {
	lang: Locale;
	dict: Dictionary["adminUsers"];
}

export const AdminUsersPage: FC<AdminUsersPageProps> = ({ lang, dict }) => {
	const authStatus = useAuthStatus();
	const state = useAdminUsersPage({ dict });

	const showLoginRequired =
		authStatus === "ready" && !state.isAuthenticated;
	const showForbidden =
		authStatus === "ready" && state.isAuthenticated && !state.isAdmin;
	const showInitialLoading =
		authStatus !== "ready" ||
		(state.isAuthenticated && state.isAdmin && state.isLoading && !state.items.length);

	const hasItems = state.items.length > 0;
	const showNoResults =
		!state.isLoading &&
		!state.isError &&
		hasItems === false &&
		state.hasFilters;
	const showEmpty =
		!state.isLoading &&
		!state.isError &&
		hasItems === false &&
		!state.hasFilters &&
		state.totalCount === 0;

	return (
		<article className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 pb-16">
			<AdminUsersHeader dict={dict.header} />

			{showLoginRequired ? (
				<AdminUsersLoginRequired dict={dict.loginRequired} lang={lang} />
			) : showForbidden ? (
				<AdminUsersForbidden dict={dict.forbidden} />
			) : (
				<>
					<AdminUsersStats
						dict={dict.stats}
						data={state.stats}
						isLoading={state.statsLoading}
					/>
					<AdminUsersToolbar
						dict={dict.toolbar}
						searchValue={state.searchInput}
						onSearchChange={state.onSearchChange}
						roleValue={state.roleFilter}
						onRoleChange={state.onRoleChange}
						statusValue={state.statusFilter}
						onStatusChange={state.onStatusChange}
						onExport={state.exportCsv}
						exporting={state.exporting}
					/>

					{showInitialLoading ? (
						<AdminUsersSkeleton />
					) : state.isError ? (
						<AdminUsersError
							dict={dict.error}
							onRetry={() => {
								state.retry();
							}}
						/>
					) : showEmpty ? (
						<AdminUsersEmpty dict={dict.empty} />
					) : showNoResults ? (
						<AdminUsersNoResults
							dict={dict.noResults}
							onReset={state.resetFilters}
						/>
					) : (
						<>
							<AdminUsersTable
								dict={dict}
								items={state.items}
								sortBy={state.sortBy}
								sortDir={state.sortDir}
								onSortChange={state.onSortChange}
								onEdit={state.openEdit}
								onToggleBlock={state.requestBlockOrUnblock}
								currentUserId={state.currentUserId}
								isFetching={state.isFetching && !state.isLoading}
							/>
							<AdminUsersCards
								dict={dict}
								items={state.items}
								onEdit={state.openEdit}
								onToggleBlock={state.requestBlockOrUnblock}
								currentUserId={state.currentUserId}
								isFetching={state.isFetching && !state.isLoading}
							/>
							<AdminUsersPagination
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

			<AdminUsersEditDialog
				user={state.editTarget}
				dict={dict.editDialog}
				rolesDict={dict.roles}
				statusesDict={dict.statuses}
				saving={state.isSavingEdit}
				onClose={state.closeEdit}
				onSubmit={state.submitEdit}
			/>

			<AdminUsersBlockDialog
				user={state.blockTarget ?? state.unblockTarget}
				mode={state.blockTarget ? "block" : "unblock"}
				dict={dict.blockDialog}
				loading={state.isBlocking || state.isUnblocking}
				onCancel={() => {
					state.cancelBlock();
					state.cancelUnblock();
				}}
				onConfirmBlock={state.confirmBlock}
				onConfirmUnblock={state.confirmUnblock}
			/>
		</article>
	);
};
