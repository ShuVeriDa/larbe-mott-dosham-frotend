import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { adminUsersApi } from "./api";
import type {
	AdminUserActivityQuery,
	AdminUserListQuery,
	BlockAdminUserDto,
	UpdateAdminUserDto,
} from "./types";

export const adminUsersKeys = {
	all: ["admin", "users"] as const,
	stats: () => [...adminUsersKeys.all, "stats"] as const,
	list: (query: AdminUserListQuery) =>
		[...adminUsersKeys.all, "list", query] as const,
	detail: (id: string) => [...adminUsersKeys.all, "detail", id] as const,
	detailedStats: (id: string) =>
		[...adminUsersKeys.all, "detail", id, "stats"] as const,
	activity: (id: string, query: AdminUserActivityQuery) =>
		[...adminUsersKeys.all, "detail", id, "activity", query] as const,
	sessions: (id: string) =>
		[...adminUsersKeys.all, "detail", id, "sessions"] as const,
};

interface UseAdminUsersOptions {
	enabled?: boolean;
}

export const useAdminUsers = (
	query: AdminUserListQuery,
	options: UseAdminUsersOptions = {},
) =>
	useQuery({
		queryKey: adminUsersKeys.list(query),
		queryFn: () => adminUsersApi.getList(query),
		enabled: options.enabled ?? true,
		placeholderData: keepPreviousData,
		staleTime: 30 * 1000,
	});

export const useAdminUsersStats = (options: UseAdminUsersOptions = {}) =>
	useQuery({
		queryKey: adminUsersKeys.stats(),
		queryFn: adminUsersApi.getStats,
		enabled: options.enabled ?? true,
		staleTime: 60 * 1000,
	});

export const useUpdateAdminUser = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateAdminUserDto }) =>
			adminUsersApi.update(id, dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminUsersKeys.all });
		},
	});
};

export const useBlockAdminUser = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto?: BlockAdminUserDto }) =>
			adminUsersApi.block(id, dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminUsersKeys.all });
		},
	});
};

export const useUnblockAdminUser = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id }: { id: string }) => adminUsersApi.unblock(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminUsersKeys.all });
		},
	});
};

export const useAdminUser = (
	id: string,
	options: UseAdminUsersOptions = {},
) =>
	useQuery({
		queryKey: adminUsersKeys.detail(id),
		queryFn: () => adminUsersApi.getById(id),
		enabled: (options.enabled ?? true) && !!id,
		staleTime: 30 * 1000,
	});

export const useAdminUserDetailedStats = (
	id: string,
	options: UseAdminUsersOptions = {},
) =>
	useQuery({
		queryKey: adminUsersKeys.detailedStats(id),
		queryFn: () => adminUsersApi.getDetailedStats(id),
		enabled: (options.enabled ?? true) && !!id,
		staleTime: 30 * 1000,
	});

interface UseAdminUserActivityOptions extends UseAdminUsersOptions {
	limit?: number;
	offset?: number;
}

export const useAdminUserActivity = (
	id: string,
	options: UseAdminUserActivityOptions = {},
) => {
	const query = { limit: options.limit, offset: options.offset };
	return useQuery({
		queryKey: adminUsersKeys.activity(id, query),
		queryFn: () => adminUsersApi.getActivity(id, query),
		enabled: (options.enabled ?? true) && !!id,
		placeholderData: keepPreviousData,
		staleTime: 15 * 1000,
	});
};

export const useAdminUserSessions = (
	id: string,
	options: UseAdminUsersOptions = {},
) =>
	useQuery({
		queryKey: adminUsersKeys.sessions(id),
		queryFn: () => adminUsersApi.getSessions(id),
		enabled: (options.enabled ?? true) && !!id,
		staleTime: 15 * 1000,
	});

export const useDeleteAdminUser = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id }: { id: string }) => adminUsersApi.remove(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminUsersKeys.all });
		},
	});
};

export const useResetAdminUserPassword = () =>
	useMutation({
		mutationFn: ({ id }: { id: string }) => adminUsersApi.resetPassword(id),
	});

export const useRevokeAdminUserSession = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, sessionId }: { id: string; sessionId: string }) =>
			adminUsersApi.revokeSession(id, sessionId),
		onSuccess: (_, vars) => {
			qc.invalidateQueries({ queryKey: adminUsersKeys.sessions(vars.id) });
		},
	});
};

export const useRevokeAllAdminUserSessions = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id }: { id: string }) => adminUsersApi.revokeAllSessions(id),
		onSuccess: (_, vars) => {
			qc.invalidateQueries({ queryKey: adminUsersKeys.sessions(vars.id) });
		},
	});
};
