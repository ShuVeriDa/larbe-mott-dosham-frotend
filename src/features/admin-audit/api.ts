import { apiClient } from "@/shared/api";
import type {
	AuditEntryTimelineResponse,
	AuditQuery,
	AuditResponse,
	AuditStats,
} from "./types";

const buildParams = (query: AuditQuery) => {
	const params: Record<string, string | number> = {};
	if (query.q?.trim()) params.q = query.q.trim();
	if (query.action) params.action = query.action;
	if (query.author) params.author = query.author;
	if (query.period) params.period = query.period;
	if (query.page) params.page = query.page;
	if (query.limit) params.limit = query.limit;
	return params;
};

export const adminAuditApi = {
	async getList(query: AuditQuery): Promise<AuditResponse> {
		const { data } = await apiClient.get<AuditResponse>(
			"/admin/audit/recent",
			{ params: buildParams(query) },
		);
		return data;
	},

	async getStats(): Promise<AuditStats> {
		const { data } = await apiClient.get<AuditStats>("/admin/audit/stats");
		return data;
	},

	async getForEntry(id: string | number): Promise<AuditEntryTimelineResponse> {
		const { data } = await apiClient.get<AuditEntryTimelineResponse>(
			`/admin/audit/entries/${id}`,
		);
		return data;
	},

	async revert(auditId: string): Promise<{ reverted: boolean }> {
		const { data } = await apiClient.post<{ reverted: boolean }>(
			`/admin/audit/revert/${auditId}`,
		);
		return data;
	},

	async exportCsv(query: AuditQuery): Promise<Blob> {
		const { data } = await apiClient.get<Blob>("/admin/audit/export", {
			params: { ...buildParams(query), format: "csv" },
			responseType: "blob",
		});
		return data;
	},
};
