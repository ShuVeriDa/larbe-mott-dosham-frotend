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

export const formatTime = (iso: string, locale = "ru-RU"): string => {
	try {
		return new Date(iso).toLocaleTimeString(locale, {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	} catch {
		return iso;
	}
};
