import { apiClient } from "@/shared/api";
import type {
	QualityProblemsQuery,
	QualityProblemsResponse,
	QualityStatsResponse,
} from "./types";

const buildParams = (
	query: QualityProblemsQuery,
): Record<string, string | number> => {
	const params: Record<string, string | number> = {};
	if (query.type) params.type = query.type;
	if (query.q?.trim()) params.q = query.q.trim();
	if (query.source) params.source = query.source;
	if (query.page) params.page = query.page;
	if (query.limit) params.limit = query.limit;
	if (query.sortBy) params.sortBy = query.sortBy;
	if (query.sortDir) params.sortDir = query.sortDir;
	if (query.include) params.include = query.include;
	return params;
};

export const adminQualityProblemsApi = {
	async getStats(): Promise<QualityStatsResponse> {
		const { data } = await apiClient.get<QualityStatsResponse>(
			"/admin/quality/stats",
		);
		return data;
	},

	async getProblems(
		query: QualityProblemsQuery,
	): Promise<QualityProblemsResponse> {
		const { data } = await apiClient.get<QualityProblemsResponse>(
			"/admin/quality/problems",
			{ params: buildParams(query) },
		);
		return data;
	},

	async exportCsv(
		query: Omit<QualityProblemsQuery, "page" | "limit" | "include">,
	): Promise<Blob> {
		const { data } = await apiClient.get<Blob>(
			"/admin/quality/problems/export",
			{
				params: buildParams(query),
				responseType: "blob",
			},
		);
		return data;
	},
};
