import { apiClient } from "@/shared/api";
import type {
	AuditEntryHistoryResponse,
	AuditListResponse,
	AuditQuery,
	AuditRevertResponse,
	AuditStats,
} from "./types";

const buildParams = (query: AuditQuery) => {
	const params: Record<string, string | number> = {};
	if (query.q?.trim()) params.q = query.q.trim();
	if (query.action) params.action = query.action;
	if (query.actorType) params.actorType = query.actorType;
	if (query.period) params.period = query.period;
	if (query.page) params.page = query.page;
	if (query.limit) params.limit = query.limit;
	return params;
};

export const adminAuditApi = {
	async getList(query: AuditQuery): Promise<AuditListResponse> {
		const { data } = await apiClient.get<AuditListResponse>(
			"/admin/audit/recent",
			{ params: buildParams(query) },
		);
		return data;
	},

	async getStats(): Promise<AuditStats> {
		const { data } = await apiClient.get<AuditStats>("/admin/audit/stats");
		return data;
	},

	async getForEntry(entryId: number): Promise<AuditEntryHistoryResponse> {
		const { data } = await apiClient.get<AuditEntryHistoryResponse>(
			`/admin/audit/entries/${entryId}`,
		);
		return data;
	},

	async revertEntryLog(
		entryId: number,
		logId: string,
	): Promise<AuditRevertResponse> {
		const { data } = await apiClient.post<AuditRevertResponse>(
			`/admin/audit/entries/${entryId}/revert/${logId}`,
		);
		return data;
	},

	async exportCsv(query: AuditQuery): Promise<Blob> {
		const response = await apiClient.get("/admin/audit/export", {
			params: buildParams(query),
			responseType: "blob",
		});
		return response.data as Blob;
	},
};
