import type { Dictionary } from "@/i18n/dictionaries";

type TimeDict = Dictionary["admin"]["qualityProblems"]["time"];

export const formatRelativeTime = (iso: string, dict: TimeDict): string => {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "";
	const diffMs = Date.now() - date.getTime();
	const diffMinutes = Math.floor(diffMs / 60_000);

	if (diffMinutes < 1) return dict.justNow;
	if (diffMinutes < 60)
		return dict.minutesAgo.replace("{count}", String(diffMinutes));

	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24)
		return dict.hoursAgo.replace("{count}", String(diffHours));

	const diffDays = Math.floor(diffHours / 24);
	if (diffDays === 1) return dict.yesterday;
	if (diffDays < 7) return dict.daysAgo.replace("{count}", String(diffDays));

	const diffWeeks = Math.floor(diffDays / 7);
	if (diffWeeks === 1) return dict.weekAgo;
	return dict.weeksAgo.replace("{count}", String(diffWeeks));
};
