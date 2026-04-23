import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { adminEntriesApi } from "./api";
import type {
	AdminEntriesQuery,
	AdminEntryFullResponse,
	BulkUpdatePayload,
} from "./types";

export const adminEntriesKeys = {
	all: ["admin", "entries"] as const,
	stats: () => [...adminEntriesKeys.all, "stats"] as const,
	list: (query: AdminEntriesQuery) =>
		[...adminEntriesKeys.all, "list", query] as const,
	detail: (id: string | number) =>
		[...adminEntriesKeys.all, "detail", id] as const,
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

export const useAdminEntry = (
	id: string | number,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminEntriesKeys.detail(id),
		queryFn: () => adminEntriesApi.getById(id),
		enabled: (options.enabled ?? true) && id != null && id !== "",
		staleTime: 15 * 1000,
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
