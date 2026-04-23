import type {
	AdminUserListItem,
	AdminUserRoleFilter,
} from "@/features/admin-users";
import type { RoleName } from "@/entities/user";

export const getInitials = (name: string): string => {
	const parts = name.trim().split(/\s+/);
	const initials = parts
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase() ?? "")
		.join("");
	return initials || "?";
};

export const avatarToneClass = (seed: string | number): string => {
	const tones = [
		"bg-primary-dim text-primary",
		"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
		"bg-amber-500/10 text-amber-600 dark:text-amber-400",
		"bg-blue-500/10 text-blue-600 dark:text-blue-400",
		"bg-red-500/10 text-red-600 dark:text-red-400",
	];
	const value =
		typeof seed === "number"
			? seed
			: Array.from(seed).reduce((acc, c) => acc + c.charCodeAt(0), 0);
	return tones[Math.abs(value) % tones.length];
};

export const formatDate = (iso: string | null | undefined): string | null => {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	const dd = String(d.getDate()).padStart(2, "0");
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	return `${dd}.${mm}.${d.getFullYear()}`;
};

const ROLE_RANK: Record<RoleName, number> = {
	ADMIN: 3,
	EDITOR: 2,
	USER: 1,
};

export const primaryRole = (
	user: Pick<AdminUserListItem, "roles">,
): RoleName => {
	if (!user.roles?.length) return "USER";
	return user.roles
		.map((r) => r.role.name)
		.sort((a, b) => ROLE_RANK[b] - ROLE_RANK[a])[0];
};

export const isRoleFilter = (value: string): value is AdminUserRoleFilter =>
	value === "" || value === "ADMIN" || value === "EDITOR" || value === "USER";

export const triggerCsvDownload = (blob: Blob, filename: string): void => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
};
