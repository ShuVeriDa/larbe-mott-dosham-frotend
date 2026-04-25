import type { DictionarySearchResult } from "@/entities/dictionary";
import { apiClient } from "@/shared/api";
import type {
	AdjacentEntries,
	AdminEntriesFilterQuery,
	AdminEntriesFilterResponse,
	AdminEntriesProblemsResponse,
	AdminEntriesQuery,
	AdminEntriesResponse,
	AdminEntriesSearchResponse,
	AdminEntriesStats,
	AdminEntriesStatsRaw,
	AdminEntryFullResponse,
	AdminEntryListItem,
	BatchFetchEntry,
	BulkDeletePayload,
	BulkDeleteResponse,
	BulkUpdatePayload,
	BulkUpdateResponse,
	ExportFormat,
} from "./types";

const DEFAULT_LIMIT = 10;

const buildSearchParams = (
	query: AdminEntriesQuery,
): Record<string, string | number | string[]> => {
	const page = query.page && query.page > 0 ? query.page : 1;
	const limit = query.limit && query.limit > 0 ? query.limit : DEFAULT_LIMIT;
	const offset = (page - 1) * limit;

	const params: Record<string, string | number | string[]> = {
		q: query.q?.trim() ?? "",
		limit,
		offset,
	};
	if (query.pos) params.pos = query.pos;
	if (query.source) params.source = query.source;
	if (query.nounClass) params.nounClass = query.nounClass;
	if (query.entryType) params.entryType = query.entryType;
	if (query.cefr) params.level = query.cefr;
	else if (query.level && query.level.length > 0) params.level = query.level;
	if (query.sort) params.sort = query.sort;
	return params;
};

const buildExportParams = (
	query: AdminEntriesQuery,
	format: ExportFormat,
): Record<string, string | string[]> => {
	const params: Record<string, string | string[]> = { format };
	if (query.q?.trim()) params.q = query.q.trim();
	if (query.pos) params.pos = query.pos;
	if (query.source) params.source = query.source;
	if (query.nounClass) params.nounClass = query.nounClass;
	if (query.cefr) params.level = query.cefr;
	else if (query.level && query.level.length > 0) params.level = query.level;
	return params;
};

const buildFilterParams = (
	query: AdminEntriesFilterQuery,
): Record<string, string | number> => {
	const params: Record<string, string | number> = {};
	if (query.pos) params.pos = query.pos;
	if (query.nounClass) params.nounClass = query.nounClass;
	if (query.source) params.source = query.source;
	if (query.level) params.level = query.level;
	if (query.limit) params.limit = query.limit;
	return params;
};

const toListItem = (raw: DictionarySearchResult): AdminEntryListItem => {
	const firstTranslation = raw.meanings?.[0]?.translation;
	return {
		...raw,
		translationPreview: firstTranslation,
		meaningsCount: Array.isArray(raw.meanings) ? raw.meanings.length : 0,
		cefrLevel: raw.wordLevel,
	};
};

export const adminEntriesApi = {
	async getList(query: AdminEntriesQuery): Promise<AdminEntriesResponse> {
		const params = buildSearchParams(query);
		const { data } = await apiClient.get<{
			data: DictionarySearchResult[];
			meta: { total: number; limit: number; offset: number };
		}>("/dictionary/search", { params });
		const limit = data.meta.limit || DEFAULT_LIMIT;
		const page = Math.floor((data.meta.offset ?? 0) / Math.max(limit, 1)) + 1;
		const pages = Math.max(1, Math.ceil(data.meta.total / Math.max(limit, 1)));
		return {
			data: data.data.map(toListItem),
			total: data.meta.total,
			page,
			limit,
			pages,
		};
	},

	async getStats(): Promise<AdminEntriesStats> {
		const { data } = await apiClient.get<AdminEntriesStatsRaw>(
			"/admin/entries/stats",
		);
		return {
			total: data.total,
			nouns: data.byPos.noun,
			verbs: data.byPos.verb,
			adjectives: data.byPos.adj,
			adverbs: data.byPos.adv,
			other: data.byPos.other,
			sourcesCount: data.sourcesCount,
			updatedToday: data.updatedToday,
		};
	},

	async getById(id: string | number): Promise<AdminEntryFullResponse> {
		const { data } = await apiClient.get<AdminEntryFullResponse>(
			`/dictionary/${id}`,
		);
		return data;
	},

	async update(
		id: string | number,
		payload: Partial<AdminEntryFullResponse>,
	): Promise<AdminEntryFullResponse> {
		const { data } = await apiClient.patch<AdminEntryFullResponse>(
			`/dictionary/${id}`,
			payload,
		);
		return data;
	},

	async remove(
		id: string | number,
	): Promise<{ deleted: boolean; id: number }> {
		const { data } = await apiClient.delete<{ deleted: boolean; id: number }>(
			`/dictionary/${id}`,
		);
		return data;
	},

	async getAdjacent(id: string | number): Promise<AdjacentEntries> {
		const { data } = await apiClient.get<AdjacentEntries>(
			`/admin/entries/${id}/adjacent`,
		);
		return data;
	},

	async bulkUpdate(payload: BulkUpdatePayload): Promise<BulkUpdateResponse> {
		const data: Record<string, unknown> = {};
		for (const op of payload.operations) {
			if (!op.field) continue;
			data[op.field] = op.value;
		}
		const body = {
			entries: payload.entryIds.map((id) => ({ id, data: { ...data } })),
		};
		const { data: res } = await apiClient.patch<BulkUpdateResponse>(
			"/dictionary/bulk/update",
			body,
		);
		return res;
	},

	async bulkDelete(payload: BulkDeletePayload): Promise<BulkDeleteResponse> {
		const { data } = await apiClient.delete<BulkDeleteResponse>(
			"/admin/entries/bulk",
			{ data: payload },
		);
		return data;
	},

	async exportEntries(
		query: AdminEntriesQuery,
		format: ExportFormat = "json",
	): Promise<Blob> {
		const { data } = await apiClient.get<Blob>("/admin/entries/export", {
			params: buildExportParams(query, format),
			responseType: "blob",
		});
		return data;
	},

	async searchForBulk(
		q: string,
		limit = 15,
	): Promise<AdminEntriesSearchResponse> {
		const { data } = await apiClient.get<AdminEntriesSearchResponse>(
			"/dictionary/search",
			{ params: { q, limit } },
		);
		return data;
	},

	async filterForBulk(
		query: AdminEntriesFilterQuery,
	): Promise<AdminEntriesFilterResponse> {
		const { data } = await apiClient.get<AdminEntriesFilterResponse>(
			"/admin/entries",
			{ params: buildFilterParams(query) },
		);
		return data;
	},

	async findProblems(
		type: string,
		limit = 100,
	): Promise<AdminEntriesProblemsResponse> {
		const { data } = await apiClient.get<AdminEntriesProblemsResponse>(
			"/admin/quality/problems",
			{ params: { type, limit } },
		);
		return data;
	},

	async batchFetch(ids: number[]): Promise<BatchFetchEntry[]> {
		const { data } = await apiClient.post<BatchFetchEntry[]>(
			"/admin/entries/batch-fetch",
			{ ids },
		);
		return data;
	},
};
