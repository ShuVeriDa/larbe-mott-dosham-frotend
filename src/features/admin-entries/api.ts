import { apiClient } from "@/shared/api";
import type {
	AdminEntriesQuery,
	AdminEntriesResponse,
	AdminEntriesStats,
	AdminEntryFullResponse,
	BulkUpdatePayload,
	BulkUpdateResponse,
} from "./types";

const buildParams = (
	query: AdminEntriesQuery,
): Record<string, string | number> => {
	const params: Record<string, string | number> = {};
	if (query.q?.trim()) params.q = query.q.trim();
	if (query.pos) params.pos = query.pos;
	if (query.source) params.source = query.source;
	if (query.cefr) params.cefr = query.cefr;
	if (query.nounClass) params.nounClass = query.nounClass;
	if (query.problem) params.problem = query.problem;
	if (query.page) params.page = query.page;
	if (query.limit) params.limit = query.limit;
	if (query.sortBy) params.sortBy = query.sortBy;
	if (query.sortDir) params.sortDir = query.sortDir;
	return params;
};

export const adminEntriesApi = {
	async getList(query: AdminEntriesQuery): Promise<AdminEntriesResponse> {
		const { data } = await apiClient.get<AdminEntriesResponse>(
			"/admin/dictionary/entries",
			{ params: buildParams(query) },
		);
		return data;
	},

	async getStats(): Promise<AdminEntriesStats> {
		const { data } = await apiClient.get<AdminEntriesStats>(
			"/admin/dictionary/entries/stats",
		);
		return data;
	},

	async getById(id: string | number): Promise<AdminEntryFullResponse> {
		const { data } = await apiClient.get<AdminEntryFullResponse>(
			`/admin/dictionary/entries/${id}`,
		);
		return data;
	},

	async update(
		id: string | number,
		payload: Partial<AdminEntryFullResponse>,
	): Promise<AdminEntryFullResponse> {
		const { data } = await apiClient.patch<AdminEntryFullResponse>(
			`/admin/dictionary/entries/${id}`,
			payload,
		);
		return data;
	},

	async remove(id: string | number): Promise<{ deleted: boolean }> {
		const { data } = await apiClient.delete<{ deleted: boolean }>(
			`/admin/dictionary/entries/${id}`,
		);
		return data;
	},

	async bulkUpdate(payload: BulkUpdatePayload): Promise<BulkUpdateResponse> {
		const { data } = await apiClient.patch<BulkUpdateResponse>(
			"/admin/dictionary/bulk/update",
			payload,
		);
		return data;
	},

	async exportCsv(query: AdminEntriesQuery): Promise<Blob> {
		const { data } = await apiClient.get<Blob>(
			"/admin/dictionary/entries/export",
			{
				params: { ...buildParams(query), format: "csv" },
				responseType: "blob",
			},
		);
		return data;
	},
};
