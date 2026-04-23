export type ApiKeyRole = "readonly" | "editor" | "full" | "admin";
export type ApiKeyStatus = "active" | "revoked" | "expired";

export interface ApiKey {
	id: string;
	name: string;
	prefix: string;
	role: ApiKeyRole;
	status: ApiKeyStatus;
	createdAt: string;
	lastUsedAt: string | null;
	createdBy: string | null;
}

export interface ApiKeyWithSecret extends ApiKey {
	secret: string;
}

export interface ApiKeyListQuery {
	q?: string;
	role?: ApiKeyRole | "";
	status?: ApiKeyStatus | "";
	page?: number;
	limit?: number;
	sortBy?: "createdAt" | "lastUsedAt" | "name";
	sortDir?: "asc" | "desc";
}

export interface ApiKeyListResponse {
	data: ApiKey[];
	total: number;
	page: number;
	limit: number;
	pages: number;
}

export interface ApiKeyStats {
	total: number;
	active: number;
	revoked: number;
	expired: number;
}

export interface CreateApiKeyDto {
	name: string;
	role: ApiKeyRole;
}

export interface UpdateApiKeyDto {
	name?: string;
	role?: ApiKeyRole;
}
