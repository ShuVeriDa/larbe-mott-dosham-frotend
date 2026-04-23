import type { Dictionary } from "@/i18n/dictionaries";

type StatusDict = Dictionary["admin"]["pipeline"]["status"];

export const formatRelativeTime = (
	iso: string | null | undefined,
	dict: StatusDict,
): string => {
	if (!iso) return dict.justNow;
	const then = new Date(iso).getTime();
	if (Number.isNaN(then)) return dict.justNow;
	const diff = Math.max(0, Date.now() - then);
	const seconds = Math.floor(diff / 1000);
	if (seconds < 45) return dict.justNow;
	if (seconds < 90) return dict.secondsAgo.replace("{seconds}", `${seconds}`);
	const minutes = Math.floor(seconds / 60);
	if (minutes < 90) return dict.minutesAgo.replace("{minutes}", `${minutes}`);
	const hours = Math.floor(minutes / 60);
	return dict.hoursAgo.replace("{hours}", `${hours}`);
};

export const formatDuration = (seconds: number | null | undefined): string => {
	if (seconds === null || seconds === undefined) return "—";
	if (seconds < 10) return `${seconds.toFixed(1)}s`;
	return `${Math.round(seconds)}s`;
};

export const formatSize = (mb: number | null | undefined): string => {
	if (mb === null || mb === undefined) return "—";
	if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`;
	return `${mb.toFixed(1)} MB`;
};

export const formatNumber = (value: number | null | undefined): string => {
	if (value === null || value === undefined) return "—";
	return new Intl.NumberFormat("ru-RU").format(value);
};
