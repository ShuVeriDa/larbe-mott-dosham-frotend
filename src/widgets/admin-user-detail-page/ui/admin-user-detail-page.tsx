"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useAuthStatus } from "@/shared/lib/auth";
import type { FC } from "react";
import { useAdminUserDetail } from "../model/use-admin-user-detail";
import { ActivityCard } from "./activity-card";
import { BanDialog } from "./ban-dialog";
import { DangerZoneCard } from "./danger-zone-card";
import { DeleteDialog } from "./delete-dialog";
import { DetailBreadcrumb } from "./detail-breadcrumb";
import { DetailHeader } from "./detail-header";
import { DetailSkeleton } from "./detail-skeleton";
import {
	DetailError,
	DetailForbidden,
	DetailLoginRequired,
	DetailNotFound,
} from "./detail-states";
import { InfoCard } from "./info-card";
import { ProfileCard } from "./profile-card";
import { SessionsCard } from "./sessions-card";
import { StatsCard } from "./stats-card";

interface AdminUserDetailPageProps {
	id: string;
	lang: Locale;
	dict: Dictionary["adminUserDetail"];
	adminUsersDict: Dictionary["adminUsers"];
}

export const AdminUserDetailPage: FC<AdminUserDetailPageProps> = ({
	id,
	lang,
	dict,
	adminUsersDict,
}) => {
	const authStatus = useAuthStatus();
	const state = useAdminUserDetail({ id, lang, dict });

	const showLoginRequired =
		authStatus === "ready" && !state.isAuthenticated;
	const showForbidden =
		authStatus === "ready" && state.isAuthenticated && !state.isAdmin;
	const showInitialLoading =
		authStatus !== "ready" ||
		(state.authReady && state.isLoading && !state.user);

	return (
		<article className="max-w-[1060px] mx-auto px-4 sm:px-6 py-6 pb-20">
			<DetailBreadcrumb
				lang={lang}
				dict={dict.breadcrumb}
				currentName={state.user?.name ?? null}
			/>

			{showLoginRequired ? (
				<DetailLoginRequired lang={lang} dict={dict.loginRequired} />
			) : showForbidden ? (
				<DetailForbidden dict={dict.forbidden} />
			) : showInitialLoading ? (
				<DetailSkeleton />
			) : state.isError || !state.user ? (
				state.isError ? (
					<DetailError
						dict={dict.error}
						onRetry={() => {
							state.refetch();
						}}
					/>
				) : (
					<DetailNotFound lang={lang} dict={dict.notFound} />
				)
			) : (
				<>
					<DetailHeader
						user={state.user}
						lang={lang}
						dict={dict.header}
						rolesDict={adminUsersDict.roles}
						statusesDict={adminUsersDict.statuses}
					/>

					<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
						<div>
							<ProfileCard
								user={state.user}
								dict={dict.profile}
								rolesDict={adminUsersDict.roles}
								isEditing={state.isEditing}
								isSaving={state.isSavingEdit}
								onStartEdit={state.startEdit}
								onCancel={state.cancelEdit}
								onSubmit={state.submitEdit}
							/>
							<ActivityCard
								items={state.activity}
								isLoading={state.activityLoading}
								lang={lang}
								dict={dict.activity}
							/>
							<DangerZoneCard
								user={state.user}
								dict={dict.dangerZone}
								isSelf={state.isSelf}
								onBan={state.openBanDialog}
								onUnban={state.unblock}
								onResetPassword={state.resetPassword}
								onDelete={state.openDeleteDialog}
								isBlocking={state.isBlocking}
								isUnblocking={state.isUnblocking}
								isResetting={state.isResettingPassword}
								isDeleting={state.isDeleting}
							/>
						</div>

						<div>
							<InfoCard user={state.user} lang={lang} dict={dict.info} />
							<StatsCard
								stats={state.stats}
								isLoading={state.statsLoading}
								lang={lang}
								dict={dict.stats}
							/>
							<SessionsCard
								sessions={state.sessions}
								isLoading={state.sessionsLoading}
								lang={lang}
								dict={dict.sessions}
								onRevoke={state.revokeSession}
								onRevokeAll={state.revokeAllSessions}
								isRevoking={state.isRevokingSession}
								isRevokingAll={state.isRevokingAll}
							/>
						</div>
					</div>
				</>
			)}

			<BanDialog
				open={state.banDialogOpen}
				user={state.user}
				dict={dict.banDialog}
				loading={state.isBlocking}
				onCancel={state.closeBanDialog}
				onConfirm={state.confirmBlock}
			/>

			<DeleteDialog
				open={state.deleteDialogOpen}
				user={state.user}
				dict={dict.deleteDialog}
				loading={state.isDeleting}
				onCancel={state.closeDeleteDialog}
				onConfirm={state.confirmDelete}
			/>
		</article>
	);
};
