import { apiClient } from "@/shared/api";
import type {
	ApiKey,
	ApiKeyWithSecret,
	CreateApiKeyDto,
	DeleteApiKeyResponse,
	UpdateApiKeyDto,
} from "./types";

export const adminApiKeysApi = {
	async getList(): Promise<ApiKey[]> {
		const { data } = await apiClient.get<ApiKey[]>("/admin/api-keys");
		return data;
	},

	async create(dto: CreateApiKeyDto): Promise<ApiKeyWithSecret> {
		const body: Record<string, unknown> = { name: dto.name };
		if (dto.role) body.role = dto.role;
		if (dto.expiresAt) body.expiresAt = dto.expiresAt;
		const { data } = await apiClient.post<ApiKeyWithSecret>(
			"/admin/api-keys",
			body,
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

	async remove(id: string): Promise<DeleteApiKeyResponse> {
		const { data } = await apiClient.delete<DeleteApiKeyResponse>(
			`/admin/api-keys/${id}`,
		);
		return data;
	},
};
