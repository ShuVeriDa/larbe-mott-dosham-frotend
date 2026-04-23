import type { Dictionary } from "@/i18n/dictionaries";

type TimeDict = Dictionary["admin"]["pipelineUnify"]["time"];

export const formatRelativeTime = (iso: string, dict: TimeDict): string => {
	const then = new Date(iso).getTime();
	if (Number.isNaN(then)) return iso;
	const diff = Math.max(0, Date.now() - then);
	const sec = Math.floor(diff / 1000);
	if (sec < 5) return dict.justNow;
	if (sec < 60) return dict.secondsAgo.replace("{count}", String(sec));
	const min = Math.floor(sec / 60);
	if (min < 60) return dict.minutesAgo.replace("{count}", String(min));
	const hr = Math.floor(min / 60);
	if (hr < 24) return dict.hoursAgo.replace("{count}", String(hr));
	const d = Math.floor(hr / 24);
	return dict.daysAgo.replace("{count}", String(d));
};
