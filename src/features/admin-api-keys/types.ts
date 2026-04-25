export type ApiKeyRoleApi = "USER" | "EDITOR" | "ADMIN";
export type ApiKeyRoleUi = "readonly" | "editor" | "admin";
export type ApiKeyStatus = "active" | "revoked" | "expired";

export interface ApiKey {
	id: string;
	name: string;
	role: ApiKeyRoleApi;
	isActive: boolean;
	expiresAt: string | null;
	createdAt: string;
	lastUsedAt: string | null;
	prefix: string;
	keyMask: string;
}

export interface ApiKeyWithSecret extends ApiKey {
	key: string;
}

export interface CreateApiKeyDto {
	name: string;
	role?: ApiKeyRoleApi;
	expiresAt?: string | null;
}

export interface UpdateApiKeyDto {
	name?: string;
	role?: ApiKeyRoleApi;
	isActive?: boolean;
	expiresAt?: string | null;
}

export interface DeleteApiKeyResponse {
	deleted: boolean;
}
