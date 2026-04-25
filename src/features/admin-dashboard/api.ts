import { apiClient } from "@/shared/api";
import type { AdminDashboardStats } from "./types";

interface QualityStatsRaw {
	total: number;
	pendingSuggestions: number;
}

interface UserStatsRaw {
	total: number;
}

export const adminDashboardApi = {
	async getStats(): Promise<AdminDashboardStats> {
		const [statsRes, usersRes] = await Promise.all([
			apiClient.get<QualityStatsRaw>("/admin/quality/stats"),
			apiClient
				.get<UserStatsRaw>("/admin/users/stats")
				.catch(() => ({ data: { total: 0 } as UserStatsRaw })),
		]);
		return {
			sidebar: {
				entries: statsRes.data.total,
				suggestions: statsRes.data.pendingSuggestions,
				users: usersRes.data.total,
			},
		};
	},
};
