"use client";

import { useCurrentUser } from "@/entities/user";
import {
	type AdminUserDetail,
	type UpdateAdminUserDto,
	useAdminUser,
	useAdminUserActivity,
	useAdminUserDetailedStats,
	useAdminUserSessions,
	useBlockAdminUser,
	useDeleteAdminUser,
	useResetAdminUserPassword,
	useRevokeAdminUserSession,
	useRevokeAllAdminUserSessions,
	useUnblockAdminUser,
	useUpdateAdminUser,
} from "@/features/admin-users";
import type { Dictionary } from "@/i18n/dictionaries";
import { useIsAuthenticated } from "@/shared/lib/auth";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const ACTIVITY_LIMIT = 20;

interface UseAdminUserDetailOptions {
	id: string;
	lang: string;
	dict: Dictionary["adminUserDetail"];
}

export const useAdminUserDetail = ({
	id,
	lang,
	dict,
}: UseAdminUserDetailOptions) => {
	const router = useRouter();
	const isAuthenticated = useIsAuthenticated();
	const { data: currentUser } = useCurrentUser();
	const isAdmin = !!currentUser?.isAdmin;
	const canFetch = isAuthenticated && isAdmin;

	const detail = useAdminUser(id, { enabled: canFetch });
	const stats = useAdminUserDetailedStats(id, { enabled: canFetch });
	const sessions = useAdminUserSessions(id, { enabled: canFetch });
	const activity = useAdminUserActivity(id, {
		enabled: canFetch,
		limit: ACTIVITY_LIMIT,
		offset: 0,
	});

	const updateMutation = useUpdateAdminUser();
	const blockMutation = useBlockAdminUser();
	const unblockMutation = useUnblockAdminUser();
	const deleteMutation = useDeleteAdminUser();
	const resetMutation = useResetAdminUserPassword();
	const revokeOneMutation = useRevokeAdminUserSession();
	const revokeAllMutation = useRevokeAllAdminUserSessions();

	const [isEditing, setEditing] = useState(false);
	const [banDialogOpen, setBanDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const user: AdminUserDetail | undefined = detail.data;
	const isSelf = !!currentUser && !!user && currentUser.id === user.id;

	const startEdit = useCallback(() => setEditing(true), []);
	const cancelEdit = useCallback(() => setEditing(false), []);

	const submitEdit = useCallback(
		async (dto: UpdateAdminUserDto) => {
			if (!user) return;
			if (Object.keys(dto).length === 0) {
				setEditing(false);
				return;
			}
			try {
				await updateMutation.mutateAsync({ id: user.id, dto });
				toast.success(dict.toasts.updated);
				setEditing(false);
			} catch {
				toast.error(dict.toasts.updateError);
			}
		},
		[dict.toasts, updateMutation, user],
	);

	const openBanDialog = useCallback(() => {
		if (isSelf) {
			toast.error(dict.toasts.noSelfBan);
			return;
		}
		setBanDialogOpen(true);
	}, [dict.toasts.noSelfBan, isSelf]);

	const closeBanDialog = useCallback(() => setBanDialogOpen(false), []);

	const confirmBlock = useCallback(
		async (banReason: string) => {
			if (!user) return;
			try {
				await blockMutation.mutateAsync({
					id: user.id,
					dto: banReason ? { banReason } : undefined,
				});
				toast.warning(dict.toasts.blocked);
				setBanDialogOpen(false);
			} catch {
				toast.error(dict.toasts.blockError);
			}
		},
		[blockMutation, dict.toasts, user],
	);

	const unblock = useCallback(async () => {
		if (!user) return;
		if (isSelf) {
			toast.error(dict.toasts.noSelfBan);
			return;
		}
		try {
			await unblockMutation.mutateAsync({ id: user.id });
			toast.success(dict.toasts.unblocked);
		} catch {
			toast.error(dict.toasts.unblockError);
		}
	}, [dict.toasts, isSelf, unblockMutation, user]);

	const resetPassword = useCallback(async () => {
		if (!user) return;
		try {
			await resetMutation.mutateAsync({ id: user.id });
			toast.info(dict.toasts.passwordResetSent);
		} catch {
			toast.error(dict.toasts.passwordResetError);
		}
	}, [dict.toasts, resetMutation, user]);

	const openDeleteDialog = useCallback(() => {
		if (isSelf) {
			toast.error(dict.toasts.noSelfDelete);
			return;
		}
		setDeleteDialogOpen(true);
	}, [dict.toasts.noSelfDelete, isSelf]);

	const closeDeleteDialog = useCallback(() => setDeleteDialogOpen(false), []);

	const confirmDelete = useCallback(async () => {
		if (!user) return;
		try {
			await deleteMutation.mutateAsync({ id: user.id });
			toast.success(dict.toasts.deleted);
			setDeleteDialogOpen(false);
			router.push(`/${lang}/admin/users`);
		} catch {
			toast.error(dict.toasts.deleteError);
		}
	}, [deleteMutation, dict.toasts, lang, router, user]);

	const revokeSession = useCallback(
		async (sessionId: string) => {
			if (!user) return;
			try {
				await revokeOneMutation.mutateAsync({ id: user.id, sessionId });
				toast.success(dict.toasts.sessionRevoked);
			} catch {
				toast.error(dict.toasts.sessionRevokeError);
			}
		},
		[dict.toasts, revokeOneMutation, user],
	);

	const revokeAllSessions = useCallback(async () => {
		if (!user) return;
		try {
			await revokeAllMutation.mutateAsync({ id: user.id });
			toast.success(dict.toasts.allSessionsRevoked);
		} catch {
			toast.error(dict.toasts.sessionRevokeError);
		}
	}, [dict.toasts, revokeAllMutation, user]);

	return {
		isAuthenticated,
		isAdmin,
		authReady: canFetch,
		isSelf,
		user,
		isLoading: detail.isLoading,
		isError: detail.isError,
		notFound: detail.isError,
		refetch: detail.refetch,
		stats: stats.data,
		statsLoading: stats.isLoading,
		sessions: sessions.data ?? [],
		sessionsLoading: sessions.isLoading,
		activity: activity.data?.data ?? [],
		activityLoading: activity.isLoading,
		activityTotal: activity.data?.total ?? 0,
		isEditing,
		startEdit,
		cancelEdit,
		submitEdit,
		isSavingEdit: updateMutation.isPending,
		banDialogOpen,
		openBanDialog,
		closeBanDialog,
		confirmBlock,
		isBlocking: blockMutation.isPending,
		unblock,
		isUnblocking: unblockMutation.isPending,
		resetPassword,
		isResettingPassword: resetMutation.isPending,
		deleteDialogOpen,
		openDeleteDialog,
		closeDeleteDialog,
		confirmDelete,
		isDeleting: deleteMutation.isPending,
		revokeSession,
		isRevokingSession: revokeOneMutation.isPending,
		revokeAllSessions,
		isRevokingAll: revokeAllMutation.isPending,
	};
};

export type UseAdminUserDetailResult = ReturnType<typeof useAdminUserDetail>;
