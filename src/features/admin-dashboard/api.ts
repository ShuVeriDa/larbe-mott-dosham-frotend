import { apiClient } from "@/shared/api";
import type {
	AdminDashboardStats,
	AdminProblemsQuery,
	AdminProblemsResponse,
} from "./types";

export const adminDashboardApi = {
	async getStats(): Promise<AdminDashboardStats> {
		const { data } = await apiClient.get<AdminDashboardStats>(
			"/admin/dashboard",
		);
		return data;
	},

	async getProblems(
		query: AdminProblemsQuery,
	): Promise<AdminProblemsResponse> {
		const params: Record<string, string | number> = {};
		if (query.type) params.type = query.type;
		if (query.source) params.source = query.source;
		if (query.q?.trim()) params.q = query.q.trim();
		if (query.page) params.page = query.page;
		if (query.limit) params.limit = query.limit;
		if (query.sortBy) params.sortBy = query.sortBy;
		if (query.sortDir) params.sortDir = query.sortDir;
		const { data } = await apiClient.get<AdminProblemsResponse>(
			"/admin/dictionary/quality/problems",
			{ params },
		);
		return data;
	},
};
