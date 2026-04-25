import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { adminEntriesApi } from "./api";
import type {
	AdminEntriesFilterQuery,
	AdminEntriesQuery,
	AdminEntryFullResponse,
	BulkDeletePayload,
	BulkUpdatePayload,
} from "./types";

export const adminEntriesKeys = {
	all: ["admin", "entries"] as const,
	stats: () => [...adminEntriesKeys.all, "stats"] as const,
	list: (query: AdminEntriesQuery) =>
		[...adminEntriesKeys.all, "list", query] as const,
	detail: (id: string | number) =>
		[...adminEntriesKeys.all, "detail", id] as const,
	adjacent: (id: string | number) =>
		[...adminEntriesKeys.all, "adjacent", id] as const,
	search: (q: string) => [...adminEntriesKeys.all, "search", q] as const,
	filter: (query: AdminEntriesFilterQuery) =>
		[...adminEntriesKeys.all, "filter", query] as const,
	problems: (type: string) =>
		[...adminEntriesKeys.all, "problems", type] as const,
	batchFetch: (ids: number[]) =>
		[...adminEntriesKeys.all, "batch-fetch", ids] as const,
};

interface Options {
	enabled?: boolean;
}

export const useAdminEntries = (
	query: AdminEntriesQuery,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminEntriesKeys.list(query),
		queryFn: () => adminEntriesApi.getList(query),
		enabled: options.enabled ?? true,
		placeholderData: keepPreviousData,
		staleTime: 30 * 1000,
	});

export const useAdminEntriesStats = (options: Options = {}) =>
	useQuery({
		queryKey: adminEntriesKeys.stats(),
		queryFn: adminEntriesApi.getStats,
		enabled: options.enabled ?? true,
		staleTime: 60 * 1000,
	});

export const useAdminEntry = (id: string | number, options: Options = {}) =>
	useQuery({
		queryKey: adminEntriesKeys.detail(id),
		queryFn: () => adminEntriesApi.getById(id),
		enabled: (options.enabled ?? true) && id != null && id !== "",
		staleTime: 15 * 1000,
	});

export const useAdjacentAdminEntries = (
	id: string | number,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminEntriesKeys.adjacent(id),
		queryFn: () => adminEntriesApi.getAdjacent(id),
		enabled: (options.enabled ?? true) && id != null && id !== "",
		staleTime: 60 * 1000,
	});

export const useUpdateAdminEntry = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string | number;
			payload: Partial<AdminEntryFullResponse>;
		}) => adminEntriesApi.update(id, payload),
		onSuccess: (_, vars) => {
			qc.invalidateQueries({ queryKey: adminEntriesKeys.detail(vars.id) });
			qc.invalidateQueries({ queryKey: adminEntriesKeys.all });
		},
	});
};

export const useDeleteAdminEntry = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id }: { id: string | number }) =>
			adminEntriesApi.remove(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminEntriesKeys.all });
		},
	});
};

export const useBulkUpdateAdminEntries = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: BulkUpdatePayload) =>
			adminEntriesApi.bulkUpdate(payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminEntriesKeys.all });
		},
	});
};

export const useBulkDeleteAdminEntries = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: BulkDeletePayload) =>
			adminEntriesApi.bulkDelete(payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminEntriesKeys.all });
		},
	});
};

export const useBulkSearchAdminEntries = (q: string, options: Options = {}) =>
	useQuery({
		queryKey: adminEntriesKeys.search(q),
		queryFn: () => adminEntriesApi.searchForBulk(q, 15),
		enabled: (options.enabled ?? true) && q.trim().length >= 1,
		staleTime: 30 * 1000,
	});

export const useBulkFilterAdminEntries = () =>
	useMutation({
		mutationFn: (query: AdminEntriesFilterQuery) =>
			adminEntriesApi.filterForBulk(query),
	});

export const useBulkFindProblems = () =>
	useMutation({
		mutationFn: ({ type, limit }: { type: string; limit?: number }) =>
			adminEntriesApi.findProblems(type, limit),
	});

export const useBatchFetchAdminEntries = (
	ids: number[],
	options: Options = {},
) =>
	useQuery({
		queryKey: adminEntriesKeys.batchFetch(ids),
		queryFn: () => adminEntriesApi.batchFetch(ids),
		enabled: (options.enabled ?? true) && ids.length > 0,
		staleTime: 0,
	});
