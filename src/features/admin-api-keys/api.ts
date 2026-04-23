import { apiClient } from "@/shared/api";
import type {
	ApiKey,
	ApiKeyListQuery,
	ApiKeyListResponse,
	ApiKeyStats,
	ApiKeyWithSecret,
	CreateApiKeyDto,
	UpdateApiKeyDto,
} from "./types";

const buildParams = (query: ApiKeyListQuery) => {
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

export const adminApiKeysApi = {
	async getList(query: ApiKeyListQuery): Promise<ApiKeyListResponse> {
		const { data } = await apiClient.get<ApiKeyListResponse>(
			"/admin/api-keys",
			{ params: buildParams(query) },
		);
		return data;
	},

	async getStats(): Promise<ApiKeyStats> {
		const { data } = await apiClient.get<ApiKeyStats>(
			"/admin/api-keys/stats",
		);
		return data;
	},

	async create(dto: CreateApiKeyDto): Promise<ApiKeyWithSecret> {
		const { data } = await apiClient.post<ApiKeyWithSecret>(
			"/admin/api-keys",
			dto,
		);
		return data;
	},

	async update(id: string, dto: UpdateApiKeyDto): Promise<ApiKey> {
		const { data } = await apiClient.patch<ApiKey>(
			`/admin/api-keys/${id}`,
			dto,
		);
		return data;
	},

	async revoke(id: string): Promise<ApiKey> {
		const { data } = await apiClient.post<ApiKey>(
			`/admin/api-keys/${id}/revoke`,
		);
		return data;
	},
};
