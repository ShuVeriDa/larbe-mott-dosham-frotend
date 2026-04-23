import type { AdminUserActivityType } from "@/features/admin-users";

export const ACTIVITY_ICON: Record<AdminUserActivityType, string> = {
	login: "🔑",
	edit: "✏️",
	favorite: "⭐",
	suggestion: "💬",
	ban: "🚫",
};

export const ACTIVITY_TONE: Record<AdminUserActivityType, string> = {
	login: "bg-primary-dim text-primary",
	edit: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
	favorite: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
	suggestion: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	ban: "bg-red-500/10 text-red-600 dark:text-red-400",
};
