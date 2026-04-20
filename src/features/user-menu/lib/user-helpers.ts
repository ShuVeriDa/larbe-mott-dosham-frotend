import type { RoleName, User } from "@/entities/user";

const ROLE_PRIORITY: Record<RoleName, number> = {
	ADMIN: 3,
	EDITOR: 2,
	USER: 1,
};

export const getPrimaryRole = (user: User): RoleName => {
	if (!user.roles || user.roles.length === 0) return "USER";
	return user.roles
		.map(r => r.role.name)
		.reduce((top, cur) =>
			ROLE_PRIORITY[cur] > ROLE_PRIORITY[top] ? cur : top,
		);
};

export const getUserInitials = (name: string): string => {
	const trimmed = name.trim();
	if (!trimmed) return "?";
	const parts = trimmed.split(/\s+/).filter(Boolean);
	if (parts.length === 1) return parts[0].slice(0, 2);
	return (parts[0][0] + parts[1][0]).trim();
};

export const canSeeAdminPanel = (role: RoleName): boolean =>
	role === "ADMIN" || role === "EDITOR";

export const isAdmin = (user: User): boolean =>
	user.isAdmin ?? user.roles?.some(r => r.role.name === "ADMIN") ?? false;
