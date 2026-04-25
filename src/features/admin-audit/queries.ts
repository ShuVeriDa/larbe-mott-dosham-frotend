import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { adminAuditApi } from "./api";
import type { AuditEntryHistoryResponse, AuditQuery } from "./types";

export const adminAuditKeys = {
	all: ["admin", "audit"] as const,
	stats: () => [...adminAuditKeys.all, "stats"] as const,
	list: (query: AuditQuery) =>
		[...adminAuditKeys.all, "list", query] as const,
	entry: (entryId: number) =>
		[...adminAuditKeys.all, "entry", entryId] as const,
};

interface Options {
	enabled?: boolean;
}

export const useAdminAudit = (query: AuditQuery, options: Options = {}) =>
	useQuery({
		queryKey: adminAuditKeys.list(query),
		queryFn: () => adminAuditApi.getList(query),
		enabled: options.enabled ?? true,
		placeholderData: keepPreviousData,
		staleTime: 15 * 1000,
		refetchOnWindowFocus: true,
	});

export const useAdminAuditStats = (options: Options = {}) =>
	useQuery({
		queryKey: adminAuditKeys.stats(),
		queryFn: adminAuditApi.getStats,
		enabled: options.enabled ?? true,
		staleTime: 30 * 1000,
	});

export const useAdminAuditForEntry = (
	entryId: number,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminAuditKeys.entry(entryId),
		queryFn: () => adminAuditApi.getForEntry(entryId),
		enabled: (options.enabled ?? true) && Number.isFinite(entryId),
		staleTime: 15 * 1000,
	});

export const useExportAuditCsv = () =>
	useMutation({
		mutationFn: (query: AuditQuery) => adminAuditApi.exportCsv(query),
	});

export const useRevertAuditLog = (entryId: number) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (logId: string) =>
			adminAuditApi.revertEntryLog(entryId, logId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminAuditKeys.entry(entryId) });
			qc.invalidateQueries({ queryKey: adminAuditKeys.all });
		},
	});
};

export const useInvalidateAdminAudit = () => {
	const qc = useQueryClient();
	return () => qc.invalidateQueries({ queryKey: adminAuditKeys.all });
};

export type { AuditEntryHistoryResponse };
