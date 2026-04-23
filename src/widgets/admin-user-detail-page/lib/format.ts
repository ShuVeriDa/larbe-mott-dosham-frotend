import type { RoleName } from "@/entities/user";
import type { AdminUserListItem } from "@/features/admin-users";
import type { Locale } from "@/i18n/dictionaries";

const LOCALE_TO_INTL: Record<Locale, string> = {
	ru: "ru-RU",
	en: "en-US",
	che: "ru-RU",
};

export const formatDate = (
	iso: string | null | undefined,
	lang: Locale,
): string | null => {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	return new Intl.DateTimeFormat(LOCALE_TO_INTL[lang], {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(d);
};

export const formatDateTime = (
	iso: string | null | undefined,
	lang: Locale,
): string | null => {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	return new Intl.DateTimeFormat(LOCALE_TO_INTL[lang], {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(d);
};

export const formatNumber = (
	value: number | null | undefined,
	lang: Locale,
): string => {
	if (value === null || value === undefined) return "—";
	return new Intl.NumberFormat(LOCALE_TO_INTL[lang]).format(value);
};

export const getInitials = (name: string): string => {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (!parts.length) return "?";
	const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
	return initials.join("") || "?";
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

export const avatarToneClass = (seed: string): string => {
	const tones = [
		"bg-primary-dim text-primary",
		"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
		"bg-amber-500/10 text-amber-600 dark:text-amber-400",
		"bg-blue-500/10 text-blue-600 dark:text-blue-400",
		"bg-red-500/10 text-red-600 dark:text-red-400",
	];
	const value = Array.from(seed).reduce((acc, c) => acc + c.charCodeAt(0), 0);
	return tones[Math.abs(value) % tones.length];
};

export const maskIp = (ip: string | null | undefined): string => {
	if (!ip) return "—";
	const parts = ip.split(".");
	if (parts.length === 4) {
		return `${parts[0]}.${parts[1]}.xx.xx`;
	}
	return ip;
};
