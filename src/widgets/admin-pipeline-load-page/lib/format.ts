import type { Dictionary, Locale } from "@/i18n/dictionaries";

const formatters: Record<Locale, Intl.NumberFormat> = {
	ru: new Intl.NumberFormat("ru-RU"),
	en: new Intl.NumberFormat("en-US"),
	che: new Intl.NumberFormat("ru-RU"),
};

const timeFormatters: Record<Locale, Intl.DateTimeFormat> = {
	ru: new Intl.DateTimeFormat("ru-RU", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	}),
	en: new Intl.DateTimeFormat("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}),
	che: new Intl.DateTimeFormat("ru-RU", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	}),
};

const dateFormatters: Record<Locale, Intl.DateTimeFormat> = {
	ru: new Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	}),
	en: new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}),
	che: new Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	}),
};

export const formatNumber = (
	value: number | null | undefined,
	lang: Locale,
): string => {
	if (value === null || value === undefined || Number.isNaN(value)) return "—";
	return formatters[lang].format(value);
};

export const formatTime = (iso: string, lang: Locale): string => {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	return timeFormatters[lang].format(date);
};

export const formatHistoryDate = (iso: string, lang: Locale): string => {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	return dateFormatters[lang].format(date);
};

export const formatSizeMb = (mb: number | null | undefined): string => {
	if (mb === null || mb === undefined) return "—";
	if (mb < 0.1) return mb.toFixed(2);
	return mb.toFixed(1);
};

export const formatElapsed = (
	seconds: number | null | undefined,
	unit: string,
): string => {
	if (seconds === null || seconds === undefined) return "—";
	if (seconds < 10) return `${seconds.toFixed(1)} ${unit}`;
	return `${seconds.toFixed(1)} ${unit}`;
};

type StatusTimeDict = Dictionary["admin"]["pipelineLoad"]["status"]["time"];

export const formatRelativeTime = (
	iso: string | null | undefined,
	dict: StatusTimeDict,
): string => {
	if (!iso) return dict.justNow;
	const then = new Date(iso).getTime();
	if (Number.isNaN(then)) return dict.justNow;
	const diff = Math.max(0, Date.now() - then);
	const sec = Math.floor(diff / 1000);
	if (sec < 5) return dict.justNow;
	if (sec < 60) return dict.secondsAgo.replace("{count}", String(sec));
	const min = Math.floor(sec / 60);
	if (min < 60) return dict.minutesAgo.replace("{count}", String(min));
	const hr = Math.floor(min / 60);
	if (hr < 24) return dict.hoursAgo.replace("{count}", String(hr));
	const days = Math.floor(hr / 24);
	return dict.daysAgo.replace("{count}", String(days));
};
