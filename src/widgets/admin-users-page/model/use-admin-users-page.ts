"use client";

import { useCurrentUser } from "@/entities/user";
import {
	type AdminUserListItem,
	type AdminUserRoleFilter,
	type AdminUserSortBy,
	type AdminUserSortDir,
	type AdminUserStatusFilter,
	adminUsersApi,
	useAdminUsers,
	useAdminUsersStats,
	useBlockAdminUser,
	useUnblockAdminUser,
	useUpdateAdminUser,
} from "@/features/admin-users";
import type { Dictionary } from "@/i18n/dictionaries";
import { useIsAuthenticated } from "@/shared/lib/auth";
import { useDebounce } from "@/shared/lib";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { UpdateAdminUserDto } from "@/features/admin-users";
import { triggerCsvDownload } from "../lib/format";

const PAGE_SIZE = 20;

interface UseAdminUsersPageOptions {
	dict: Dictionary["adminUsers"];
}

export const useAdminUsersPage = ({ dict }: UseAdminUsersPageOptions) => {
	const isAuthenticated = useIsAuthenticated();
	const { data: currentUser } = useCurrentUser();
	const isAdmin = !!currentUser?.isAdmin;

	const [searchInput, setSearchInput] = useState("");
	const debouncedSearch = useDebounce(searchInput, 300);

	const [roleFilter, setRoleFilter] = useState<AdminUserRoleFilter>("");
	const [statusFilter, setStatusFilter] = useState<AdminUserStatusFilter>("");
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState<AdminUserSortBy>("createdAt");
	const [sortDir, setSortDir] = useState<AdminUserSortDir>("desc");

	const [editTarget, setEditTarget] = useState<AdminUserListItem | null>(null);
	const [blockTarget, setBlockTarget] = useState<AdminUserListItem | null>(
		null,
	);
	const [unblockTarget, setUnblockTarget] =
		useState<AdminUserListItem | null>(null);
	const [exporting, setExporting] = useState(false);

	const listQuery = useMemo(
		() => ({
			q: debouncedSearch || undefined,
			role: roleFilter || undefined,
			status: statusFilter || undefined,
			page,
			limit: PAGE_SIZE,
			sortBy,
			sortDir,
		}),
		[debouncedSearch, page, roleFilter, sortBy, sortDir, statusFilter],
	);

	const list = useAdminUsers(listQuery, { enabled: isAuthenticated && isAdmin });
	const stats = useAdminUsersStats({ enabled: isAuthenticated && isAdmin });

	const updateMutation = useUpdateAdminUser();
	const blockMutation = useBlockAdminUser();
	const unblockMutation = useUnblockAdminUser();

	const items = list.data?.data ?? [];
	const totalCount = list.data?.total ?? 0;
	const totalPages = list.data?.pages ?? 0;
	const hasFilters =
		!!debouncedSearch || !!roleFilter || !!statusFilter;

	const onSearchChange = useCallback((value: string) => {
		setSearchInput(value);
		setPage(1);
	}, []);

	const onRoleChange = useCallback((value: AdminUserRoleFilter) => {
		setRoleFilter(value);
		setPage(1);
	}, []);

	const onStatusChange = useCallback((value: AdminUserStatusFilter) => {
		setStatusFilter(value);
		setPage(1);
	}, []);

	const resetFilters = useCallback(() => {
		setSearchInput("");
		setRoleFilter("");
		setStatusFilter("");
		setPage(1);
	}, []);

	const onSortChange = useCallback((column: AdminUserSortBy) => {
		setPage(1);
		setSortBy((prev) => {
			if (prev === column) {
				setSortDir((d) => (d === "asc" ? "desc" : "asc"));
				return prev;
			}
			setSortDir("asc");
			return column;
		});
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

	const openEdit = useCallback(
		(user: AdminUserListItem) => setEditTarget(user),
		[],
	);
	const closeEdit = useCallback(() => setEditTarget(null), []);

	const submitEdit = useCallback(
		async (dto: UpdateAdminUserDto) => {
			if (!editTarget) return;
			try {
				await updateMutation.mutateAsync({ id: editTarget.id, dto });
				toast.success(dict.toasts.updated);
				setEditTarget(null);
			} catch {
				toast.error(dict.toasts.updateError);
			}
		},
		[dict.toasts, editTarget, updateMutation],
	);

	const requestBlockOrUnblock = useCallback(
		(user: AdminUserListItem) => {
			if (currentUser && user.id === currentUser.id) {
				toast.error(dict.toasts.noSelfBan);
				return;
			}
			if (user.status === "blocked") {
				setUnblockTarget(user);
			} else {
				setBlockTarget(user);
			}
		},
		[currentUser, dict.toasts.noSelfBan],
	);

	const cancelBlock = useCallback(() => setBlockTarget(null), []);
	const cancelUnblock = useCallback(() => setUnblockTarget(null), []);

	const confirmBlock = useCallback(
		async (banReason: string) => {
			if (!blockTarget) return;
			try {
				await blockMutation.mutateAsync({
					id: blockTarget.id,
					dto: banReason ? { banReason } : undefined,
				});
				toast.success(dict.toasts.blocked);
				setBlockTarget(null);
			} catch {
				toast.error(dict.toasts.blockError);
			}
		},
		[blockMutation, blockTarget, dict.toasts],
	);

	const confirmUnblock = useCallback(async () => {
		if (!unblockTarget) return;
		try {
			await unblockMutation.mutateAsync({ id: unblockTarget.id });
			toast.success(dict.toasts.unblocked);
			setUnblockTarget(null);
		} catch {
			toast.error(dict.toasts.unblockError);
		}
	}, [dict.toasts, unblockMutation, unblockTarget]);

	const exportCsv = useCallback(async () => {
		if (exporting) return;
		setExporting(true);
		toast.info(dict.toasts.exportStarted);
		try {
			const blob = await adminUsersApi.exportCsv({
				q: debouncedSearch || undefined,
				role: roleFilter || undefined,
				status: statusFilter || undefined,
			});
			const today = new Date().toISOString().slice(0, 10);
			triggerCsvDownload(blob, `users-export-${today}.csv`);
		} catch {
			toast.error(dict.toasts.exportError);
		} finally {
			setExporting(false);
		}
	}, [
		debouncedSearch,
		dict.toasts.exportError,
		dict.toasts.exportStarted,
		exporting,
		roleFilter,
		statusFilter,
	]);

	return {
		isAuthenticated,
		isAdmin,
		currentUserId: currentUser?.id,
		items,
		totalCount,
		totalPages,
		page,
		pageSize: PAGE_SIZE,
		isLoading: list.isLoading,
		isFetching: list.isFetching,
		isError: list.isError,
		hasFilters,
		stats: stats.data,
		statsLoading: stats.isLoading,
		searchInput,
		onSearchChange,
		roleFilter,
		onRoleChange,
		statusFilter,
		onStatusChange,
		sortBy,
		sortDir,
		onSortChange,
		resetFilters,
		goPage,
		retry: list.refetch,
		editTarget,
		openEdit,
		closeEdit,
		submitEdit,
		isSavingEdit: updateMutation.isPending,
		blockTarget,
		unblockTarget,
		requestBlockOrUnblock,
		cancelBlock,
		cancelUnblock,
		confirmBlock,
		confirmUnblock,
		isBlocking: blockMutation.isPending,
		isUnblocking: unblockMutation.isPending,
		exportCsv,
		exporting,
	};
};

export type UseAdminUsersPageResult = ReturnType<typeof useAdminUsersPage>;
