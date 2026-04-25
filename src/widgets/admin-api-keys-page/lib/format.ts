import type {
	ApiKey,
	ApiKeyRoleApi,
	ApiKeyRoleUi,
	ApiKeyStatus,
} from "@/features/admin-api-keys";

export const API_TO_UI_ROLE: Record<ApiKeyRoleApi, ApiKeyRoleUi> = {
	USER: "readonly",
	EDITOR: "editor",
	ADMIN: "admin",
};

export const UI_TO_API_ROLE: Record<ApiKeyRoleUi, ApiKeyRoleApi> = {
	readonly: "USER",
	editor: "EDITOR",
	admin: "ADMIN",
};

export const getKeyStatus = (key: ApiKey, nowMs = Date.now()): ApiKeyStatus => {
	if (!key.isActive) return "revoked";
	if (key.expiresAt && new Date(key.expiresAt).getTime() < nowMs)
		return "expired";
	return "active";
};

export const formatDate = (iso: string | null | undefined): string | null => {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	const dd = String(d.getDate()).padStart(2, "0");
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	return `${dd}.${mm}.${d.getFullYear()}`;
};

export const formatDateTimeLocalInput = (
	iso: string | null | undefined,
): string => {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const dateTimeLocalToIso = (value: string): string | null => {
	if (!value) return null;
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return null;
	return d.toISOString();
};

export const iconToneClass = (seed: string | number): string => {
	const tones = [
		"bg-[var(--accent-dim)] text-[var(--accent)]",
		"bg-[var(--success-dim)] text-[var(--success)]",
		"bg-[var(--warning-dim)] text-[var(--warning)]",
		"bg-[var(--info-dim)] text-[var(--info)]",
		"bg-[var(--danger-dim)] text-[var(--danger)]",
	];
	const value =
		typeof seed === "number"
			? seed
			: Array.from(seed).reduce((acc, c) => acc + c.charCodeAt(0), 0);
	return tones[Math.abs(value) % tones.length];
};

export interface KeyStats {
	total: number;
	active: number;
	revoked: number;
	expired: number;
}

export const computeStats = (keys: ApiKey[]): KeyStats => {
	const now = Date.now();
	const stats: KeyStats = { total: keys.length, active: 0, revoked: 0, expired: 0 };
	for (const key of keys) {
		const status = getKeyStatus(key, now);
		stats[status] += 1;
	}
	return stats;
};
