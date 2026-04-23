import { apiClient } from "@/shared/api";
import { API_URL } from "@/shared/config";
import type {
	QualityProblemsQuery,
	QualityProblemsResponse,
	QualitySourceStat,
	QualityStats,
} from "./types";

const buildProblemsParams = (
	query: QualityProblemsQuery,
): Record<string, string | number> => {
	const params: Record<string, string | number> = {};
	if (query.type) params.type = query.type;
	if (query.source) params.source = query.source;
	if (query.q?.trim()) params.q = query.q.trim();
	if (query.page) params.page = query.page;
	if (query.limit) params.limit = query.limit;
	if (query.sortBy) params.sortBy = query.sortBy;
	if (query.sortDir) params.sortDir = query.sortDir;
	return params;
};

export const adminQualityApi = {
	async getStats(): Promise<QualityStats> {
		const { data } = await apiClient.get<QualityStats>("/admin/quality/stats");
		return data;
	},

	async getStatsBySource(): Promise<QualitySourceStat[]> {
		const { data } = await apiClient.get<QualitySourceStat[]>(
			"/admin/quality/stats-by-source",
		);
		return data;
	},

	async getProblems(
		query: QualityProblemsQuery,
	): Promise<QualityProblemsResponse> {
		const { data } = await apiClient.get<QualityProblemsResponse>(
			"/admin/quality/problems",
			{ params: buildProblemsParams(query) },
		);
		return data;
	},

	async exportProblems(query: QualityProblemsQuery): Promise<Blob> {
		const { data } = await apiClient.get<Blob>(
			"/admin/quality/problems/export",
			{
				params: buildProblemsParams(query),
				responseType: "blob",
			},
		);
		return data;
	},

	buildExportUrl(query: QualityProblemsQuery): string {
		const usp = new URLSearchParams();
		Object.entries(buildProblemsParams(query)).forEach(([k, v]) => {
			usp.set(k, String(v));
		});
		const qs = usp.toString();
		return `${API_URL}/admin/quality/problems/export${qs ? `?${qs}` : ""}`;
	},
};
