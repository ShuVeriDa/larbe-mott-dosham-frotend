"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { AdminForbidden, AdminLoginRequired } from "@/shared/ui/admin";
import type { FC } from "react";
import { useAdminApiKeysPage } from "../model/use-admin-api-keys-page";
import { AdminApiKeysCards } from "./admin-api-keys-cards";
import { AdminApiKeysCreateDialog } from "./admin-api-keys-create-dialog";
import { AdminApiKeysEditDialog } from "./admin-api-keys-edit-dialog";
import { AdminApiKeysHeader } from "./admin-api-keys-header";
import { AdminApiKeysPagination } from "./admin-api-keys-pagination";
import { AdminApiKeysRevokeDialog } from "./admin-api-keys-revoke-dialog";
import {
	AdminApiKeysEmpty,
	AdminApiKeysError,
	AdminApiKeysNoResults,
	AdminApiKeysSkeleton,
} from "./admin-api-keys-states";
import { AdminApiKeysStats } from "./admin-api-keys-stats";
import { AdminApiKeysTable } from "./admin-api-keys-table";
import { AdminApiKeysToolbar } from "./admin-api-keys-toolbar";

interface AdminApiKeysPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["apiKeys"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminApiKeysPage: FC<AdminApiKeysPageProps> = ({
	lang,
	dict,
	commonDict,
}) => {
	const state = useAdminApiKeysPage({ dict });

	const showLoginRequired =
		state.authStatus === "ready" && !state.isAuthenticated;
	const showForbidden =
		state.authStatus === "ready" && state.isAuthenticated && !state.isAdmin;
	const showInitialLoading =
		state.authStatus !== "ready" ||
		(state.isAuthenticated &&
			state.isAdmin &&
			state.isLoading &&
			state.allKeys.length === 0);

	const hasItems = state.items.length > 0;
	const showEmpty =
		!state.isLoading &&
		!state.isError &&
		state.allKeys.length === 0 &&
		!state.hasFilters;
	const showNoResults =
		!state.isLoading &&
		!state.isError &&
		state.allKeys.length > 0 &&
		!hasItems;

	return (
		<article className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 pb-16">
			<AdminApiKeysHeader dict={dict.header} onCreate={state.openCreate} />

			{showLoginRequired ? (
				<AdminLoginRequired
					lang={lang}
					title={commonDict.loginRequiredTitle}
					description={commonDict.loginRequiredText}
					ctaLabel={commonDict.loginRequiredCta}
				/>
			) : showForbidden ? (
				<AdminForbidden
					title={commonDict.forbiddenTitle}
					description={commonDict.forbiddenText}
				/>
			) : (
				<>
					<AdminApiKeysStats
						dict={dict.stats}
						data={state.stats}
						loading={state.isLoading && state.allKeys.length === 0}
					/>
					<AdminApiKeysToolbar
						dict={dict.toolbar}
						rolesDict={dict.roles}
						statusesDict={dict.statuses}
						searchValue={state.searchInput}
						onSearchChange={state.onSearchChange}
						roleValue={state.roleFilter}
						onRoleChange={state.onRoleChange}
						statusValue={state.statusFilter}
						onStatusChange={state.onStatusChange}
					/>

					{showInitialLoading ? (
						<AdminApiKeysSkeleton />
					) : state.isError ? (
						<AdminApiKeysError
							dict={dict.error}
							onRetry={() => {
								state.retry();
							}}
						/>
					) : showEmpty ? (
						<AdminApiKeysEmpty dict={dict.empty} />
					) : showNoResults ? (
						<AdminApiKeysNoResults
							dict={dict.noResults}
							onReset={state.resetFilters}
						/>
					) : (
						<>
							<AdminApiKeysTable
								dict={dict}
								items={state.items}
								sortBy={state.sortBy}
								sortDir={state.sortDir}
								onSortChange={state.onSortChange}
								onEdit={state.openEdit}
								onRevoke={state.requestRevoke}
								isFetching={state.isFetching && !state.isLoading}
							/>
							<AdminApiKeysCards
								dict={dict}
								items={state.items}
								onEdit={state.openEdit}
								onRevoke={state.requestRevoke}
								isFetching={state.isFetching && !state.isLoading}
							/>
							<AdminApiKeysPagination
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

			<AdminApiKeysCreateDialog
				open={state.createOpen}
				dict={dict.create}
				rolesDict={dict.roles}
				roleDescriptions={dict.roleDescriptions}
				toastsDict={dict.toasts}
				createdKey={state.createdKey}
				saving={state.isCreating}
				onClose={state.closeCreate}
				onSubmit={state.submitCreate}
			/>

			<AdminApiKeysEditDialog
				apiKey={state.editTarget}
				dict={dict.edit}
				rolesDict={dict.roles}
				roleDescriptions={dict.roleDescriptions}
				saving={state.isSavingEdit}
				onClose={state.closeEdit}
				onSubmit={state.submitEdit}
			/>

			<AdminApiKeysRevokeDialog
				apiKey={state.revokeTarget}
				dict={dict.revokeDialog}
				loading={state.isRevoking}
				onCancel={state.cancelRevoke}
				onConfirm={state.confirmRevoke}
			/>
		</article>
	);
};
