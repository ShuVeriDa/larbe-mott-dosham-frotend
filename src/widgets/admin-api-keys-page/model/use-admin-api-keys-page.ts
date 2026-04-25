"use client";

import { useCurrentUser } from "@/entities/user";
import {
	type ApiKey,
	type ApiKeyRoleUi,
	type ApiKeyStatus,
	type ApiKeyWithSecret,
	useAdminApiKeys,
	useCreateApiKey,
	useUpdateApiKey,
} from "@/features/admin-api-keys";
import type { Dictionary } from "@/i18n/dictionaries";
import { useDebounce } from "@/shared/lib";
import { useAuthStatus, useIsAuthenticated } from "@/shared/lib/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	API_TO_UI_ROLE,
	UI_TO_API_ROLE,
	computeStats,
	getKeyStatus,
} from "../lib/format";

export type SortBy =
	| "name"
	| "prefix"
	| "role"
	| "status"
	| "createdAt"
	| "lastUsedAt";
export type SortDir = "asc" | "desc";

export type RoleFilter = "" | ApiKeyRoleUi;
export type StatusFilter = "" | ApiKeyStatus;

export const PAGE_SIZE = 20;

interface UseAdminApiKeysPageOptions {
	dict: Dictionary["admin"]["apiKeys"];
}

interface SortValue {
	primary: string | number;
	fallback: number;
}

const sortValue = (key: ApiKey, column: SortBy): SortValue => {
	switch (column) {
		case "name":
			return { primary: key.name.toLowerCase(), fallback: 0 };
		case "prefix":
			return { primary: key.prefix.toLowerCase(), fallback: 0 };
		case "role":
			return { primary: key.role, fallback: 0 };
		case "status":
			return { primary: getKeyStatus(key), fallback: 0 };
		case "createdAt":
			return {
				primary: "",
				fallback: new Date(key.createdAt).getTime() || 0,
			};
		case "lastUsedAt":
			return {
				primary: "",
				fallback: key.lastUsedAt ? new Date(key.lastUsedAt).getTime() : 0,
			};
	}
};

export const useAdminApiKeysPage = ({ dict }: UseAdminApiKeysPageOptions) => {
	const authStatus = useAuthStatus();
	const isAuthenticated = useIsAuthenticated();
	const { data: currentUser } = useCurrentUser();
	const isAdmin =
		!!currentUser?.isAdmin ||
		!!currentUser?.roles?.some(
			(r) => r.role.name === "ADMIN" || r.role.name === "EDITOR",
		);

	const [searchInput, setSearchInput] = useState("");
	const debouncedSearch = useDebounce(searchInput, 300);
	const [roleFilter, setRoleFilter] = useState<RoleFilter>("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState<SortBy>("createdAt");
	const [sortDir, setSortDir] = useState<SortDir>("desc");

	const [editTarget, setEditTarget] = useState<ApiKey | null>(null);
	const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
	const [createOpen, setCreateOpen] = useState(false);
	const [createdKey, setCreatedKey] = useState<ApiKeyWithSecret | null>(null);

	const listQuery = useAdminApiKeys({
		enabled: authStatus === "ready" && isAuthenticated && isAdmin,
	});

	const createMutation = useCreateApiKey();
	const updateMutation = useUpdateApiKey();

	const allKeys = useMemo(() => listQuery.data ?? [], [listQuery.data]);

	const stats = useMemo(() => computeStats(allKeys), [allKeys]);

	const filtered = useMemo(() => {
		const q = debouncedSearch.trim().toLowerCase();
		const filtered = allKeys.filter((key) => {
			if (q) {
				const haystack = `${key.name} ${key.prefix} ${key.keyMask}`.toLowerCase();
				if (!haystack.includes(q)) return false;
			}
			if (roleFilter && API_TO_UI_ROLE[key.role] !== roleFilter) return false;
			if (statusFilter && getKeyStatus(key) !== statusFilter) return false;
			return true;
		});
		const sorted = [...filtered].sort((a, b) => {
			const va = sortValue(a, sortBy);
			const vb = sortValue(b, sortBy);
			if (va.primary && vb.primary) {
				const cmp = String(va.primary).localeCompare(String(vb.primary));
				return sortDir === "asc" ? cmp : -cmp;
			}
			const diff = va.fallback - vb.fallback;
			return sortDir === "asc" ? diff : -diff;
		});
		return sorted;
	}, [allKeys, debouncedSearch, roleFilter, sortBy, sortDir, statusFilter]);

	const totalCount = filtered.length;
	const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);

	useEffect(() => {
		if (page > totalPages) setPage(totalPages);
	}, [page, totalPages]);

	const pageItems = useMemo(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return filtered.slice(start, start + PAGE_SIZE);
	}, [filtered, safePage]);

	const hasFilters =
		!!debouncedSearch.trim() || !!roleFilter || !!statusFilter;

	const onSearchChange = useCallback((value: string) => {
		setSearchInput(value);
		setPage(1);
	}, []);

	const onRoleChange = useCallback((value: RoleFilter) => {
		setRoleFilter(value);
		setPage(1);
	}, []);

	const onStatusChange = useCallback((value: StatusFilter) => {
		setStatusFilter(value);
		setPage(1);
	}, []);

	const resetFilters = useCallback(() => {
		setSearchInput("");
		setRoleFilter("");
		setStatusFilter("");
		setPage(1);
	}, []);

	const onSortChange = useCallback((column: SortBy) => {
		setPage(1);
		setSortBy((prev) => {
			if (prev === column) {
				setSortDir((d) => (d === "asc" ? "desc" : "asc"));
				return prev;
			}
			setSortDir(column === "createdAt" || column === "lastUsedAt" ? "desc" : "asc");
			return column;
		});
	}, []);

	const goPage = useCallback(
		(target: number) => {
			if (target < 1 || target > totalPages) return;
			setPage(target);
		},
		[totalPages],
	);

	const openCreate = useCallback(() => {
		setCreatedKey(null);
		setCreateOpen(true);
	}, []);

	const closeCreate = useCallback(() => {
		setCreateOpen(false);
		setCreatedKey(null);
	}, []);

	const submitCreate = useCallback(
		async (input: {
			name: string;
			role: ApiKeyRoleUi;
			expiresAt: string | null;
		}) => {
			const name = input.name.trim();
			if (!name) {
				toast.warning(dict.toasts.nameRequired);
				return;
			}
			try {
				const created = await createMutation.mutateAsync({
					name,
					role: UI_TO_API_ROLE[input.role],
					expiresAt: input.expiresAt ?? undefined,
				});
				setCreatedKey(created);
				toast.success(dict.toasts.created);
			} catch {
				toast.error(dict.toasts.createError);
			}
		},
		[createMutation, dict.toasts],
	);

	const openEdit = useCallback((key: ApiKey) => setEditTarget(key), []);
	const closeEdit = useCallback(() => setEditTarget(null), []);

	const submitEdit = useCallback(
		async (input: {
			name: string;
			role: ApiKeyRoleUi;
			expiresAt: string | null | undefined;
		}) => {
			if (!editTarget) return;
			const name = input.name.trim();
			if (!name) {
				toast.warning(dict.toasts.nameRequired);
				return;
			}
			try {
				await updateMutation.mutateAsync({
					id: editTarget.id,
					dto: {
						name,
						role: UI_TO_API_ROLE[input.role],
						expiresAt: input.expiresAt,
					},
				});
				toast.success(dict.toasts.updated);
				setEditTarget(null);
			} catch {
				toast.error(dict.toasts.updateError);
			}
		},
		[dict.toasts, editTarget, updateMutation],
	);

	const requestRevoke = useCallback((key: ApiKey) => setRevokeTarget(key), []);
	const cancelRevoke = useCallback(() => setRevokeTarget(null), []);

	const confirmRevoke = useCallback(async () => {
		if (!revokeTarget) return;
		try {
			await updateMutation.mutateAsync({
				id: revokeTarget.id,
				dto: { isActive: false },
			});
			toast.success(dict.toasts.revoked);
			setRevokeTarget(null);
		} catch {
			toast.error(dict.toasts.revokeError);
		}
	}, [dict.toasts, revokeTarget, updateMutation]);

	return {
		authStatus,
		isAuthenticated,
		isAdmin,

		allKeys,
		items: pageItems,
		stats,
		totalCount,
		totalPages,
		page: safePage,
		pageSize: PAGE_SIZE,

		isLoading: listQuery.isLoading,
		isFetching: listQuery.isFetching,
		isError: listQuery.isError,
		retry: listQuery.refetch,

		searchInput,
		onSearchChange,
		roleFilter,
		onRoleChange,
		statusFilter,
		onStatusChange,
		hasFilters,
		resetFilters,

		sortBy,
		sortDir,
		onSortChange,

		goPage,

		createOpen,
		createdKey,
		openCreate,
		closeCreate,
		submitCreate,
		isCreating: createMutation.isPending,

		editTarget,
		openEdit,
		closeEdit,
		submitEdit,
		isSavingEdit: updateMutation.isPending && editTarget !== null,

		revokeTarget,
		requestRevoke,
		cancelRevoke,
		confirmRevoke,
		isRevoking: updateMutation.isPending && revokeTarget !== null,
	};
};

export type UseAdminApiKeysPageResult = ReturnType<typeof useAdminApiKeysPage>;
