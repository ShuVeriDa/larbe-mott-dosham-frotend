import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { adminAuditApi } from "./api";
import type { AuditQuery } from "./types";

export const adminAuditKeys = {
	all: ["admin", "audit"] as const,
	stats: () => [...adminAuditKeys.all, "stats"] as const,
	list: (query: AuditQuery) =>
		[...adminAuditKeys.all, "list", query] as const,
	entry: (id: string | number) =>
		[...adminAuditKeys.all, "entry", id] as const,
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
		staleTime: 30 * 1000,
	});

export const useAdminAuditStats = (options: Options = {}) =>
	useQuery({
		queryKey: adminAuditKeys.stats(),
		queryFn: adminAuditApi.getStats,
		enabled: options.enabled ?? true,
		staleTime: 60 * 1000,
	});

export const useAdminAuditForEntry = (
	id: string | number,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminAuditKeys.entry(id),
		queryFn: () => adminAuditApi.getForEntry(id),
		enabled: (options.enabled ?? true) && id != null && id !== "",
		staleTime: 15 * 1000,
	});

export const useRevertAudit = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ auditId }: { auditId: string }) =>
			adminAuditApi.revert(auditId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminAuditKeys.all });
		},
	});
};
