import { apiClient } from "@/shared/api";
import type {
	AdminUserActivityQuery,
	AdminUserActivityResponse,
	AdminUserDeleteResponse,
	AdminUserDetail,
	AdminUserDetailedStats,
	AdminUserExportQuery,
	AdminUserListItem,
	AdminUserListQuery,
	AdminUserListResponse,
	AdminUserResetPasswordResponse,
	AdminUserRevokeAllResponse,
	AdminUserSessionItem,
	AdminUsersStats,
	BlockAdminUserDto,
	UpdateAdminUserDto,
} from "./types";

const buildListParams = (
	query: AdminUserListQuery,
): Record<string, string | number> => {
	const params: Record<string, string | number> = {};
	if (query.q?.trim()) params.q = query.q.trim();
	if (query.role) params.role = query.role;
	if (query.status) params.status = query.status;
	if (query.page) params.page = query.page;
	if (query.limit) params.limit = query.limit;
	if (query.sortBy) params.sortBy = query.sortBy;
	if (query.sortDir) params.sortDir = query.sortDir;
	return params;
};

export const adminUsersApi = {
	async getList(query: AdminUserListQuery): Promise<AdminUserListResponse> {
		const { data } = await apiClient.get<AdminUserListResponse>(
			"/admin/users",
			{ params: buildListParams(query) },
		);
		return data;
	},

	async getStats(): Promise<AdminUsersStats> {
		const { data } = await apiClient.get<AdminUsersStats>(
			"/admin/users/stats",
		);
		return data;
	},

	async update(
		id: string,
		dto: UpdateAdminUserDto,
	): Promise<AdminUserListItem> {
		const { data } = await apiClient.patch<AdminUserListItem>(
			`/admin/users/${id}`,
			dto,
		);
		return data;
	},

	async block(
		id: string,
		dto: BlockAdminUserDto = {},
	): Promise<AdminUserListItem> {
		const { data } = await apiClient.patch<AdminUserListItem>(
			`/admin/users/${id}/block`,
			dto,
		);
		return data;
	},

	async unblock(id: string): Promise<AdminUserListItem> {
		const { data } = await apiClient.patch<AdminUserListItem>(
			`/admin/users/${id}/unblock`,
		);
		return data;
	},

	async getById(id: string): Promise<AdminUserDetail> {
		const { data } = await apiClient.get<AdminUserDetail>(
			`/admin/users/${id}`,
		);
		return data;
	},

	async getDetailedStats(id: string): Promise<AdminUserDetailedStats> {
		const { data } = await apiClient.get<AdminUserDetailedStats>(
			`/admin/users/${id}/stats`,
		);
		return data;
	},

	async getActivity(
		id: string,
		query: AdminUserActivityQuery = {},
	): Promise<AdminUserActivityResponse> {
		const params: Record<string, number> = {};
		if (query.limit) params.limit = query.limit;
		if (query.offset) params.offset = query.offset;
		const { data } = await apiClient.get<AdminUserActivityResponse>(
			`/admin/users/${id}/activity`,
			{ params },
		);
		return data;
	},

	async getSessions(id: string): Promise<AdminUserSessionItem[]> {
		const { data } = await apiClient.get<AdminUserSessionItem[]>(
			`/admin/users/${id}/sessions`,
		);
		return data;
	},

	async revokeSession(id: string, sessionId: string): Promise<void> {
		await apiClient.delete(`/admin/users/${id}/sessions/${sessionId}`);
	},

	async revokeAllSessions(id: string): Promise<AdminUserRevokeAllResponse> {
		const { data } = await apiClient.delete<AdminUserRevokeAllResponse>(
			`/admin/users/${id}/sessions`,
		);
		return data;
	},

	async resetPassword(id: string): Promise<AdminUserResetPasswordResponse> {
		const { data } = await apiClient.post<AdminUserResetPasswordResponse>(
			`/admin/users/${id}/reset-password`,
		);
		return data;
	},

	async remove(id: string): Promise<AdminUserDeleteResponse> {
		const { data } = await apiClient.delete<AdminUserDeleteResponse>(
			`/admin/users/${id}`,
		);
		return data;
	},

	async exportCsv(query: AdminUserExportQuery): Promise<Blob> {
		const params: Record<string, string> = { format: "csv" };
		if (query.q?.trim()) params.q = query.q.trim();
		if (query.role) params.role = query.role;
		if (query.status) params.status = query.status;
		const { data } = await apiClient.get<Blob>("/admin/users/export", {
			params,
			responseType: "blob",
		});
		return data;
	},
};
