import type { Locale } from "@/i18n/dictionaries";
import type {
	AnalyticsGranularity,
	AnalyticsMetric,
} from "@/features/admin-analytics";

const localeFor = (lang: Locale): string => {
	switch (lang) {
		case "en":
			return "en-US";
		case "ru":
			return "ru-RU";
		default:
			return "ru-RU";
	}
};

export const formatNumber = (value: number, lang: Locale = "ru"): string =>
	new Intl.NumberFormat(localeFor(lang)).format(Math.round(value));

export const formatDuration = (
	totalSeconds: number,
	dict: { minutesShort: string; secondsShort: string } = {
		minutesShort: "м",
		secondsShort: "с",
	},
): string => {
	const safe = Math.max(0, Math.round(totalSeconds));
	const minutes = Math.floor(safe / 60);
	const seconds = safe % 60;
	return `${minutes}${dict.minutesShort} ${seconds}${dict.secondsShort}`;
};

export const formatPercent = (ratio: number): string =>
	`${Math.round(ratio * 100)}%`;

export interface MetricDelta {
	sign: "up" | "down" | "neutral";
	pct: number | null;
}

export const computeDelta = (
	current: number,
	previous: number,
): MetricDelta => {
	if (!Number.isFinite(previous) || previous === 0) {
		return { sign: "neutral", pct: null };
	}
	const pct = Math.round(((current - previous) / previous) * 100);
	if (pct === 0) return { sign: "neutral", pct: 0 };
	return { sign: pct > 0 ? "up" : "down", pct: Math.abs(pct) };
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const granularityForRange = (
	from: string,
	to: string,
): AnalyticsGranularity => {
	const fromMs = new Date(from).getTime();
	const toMs = new Date(to).getTime();
	if (!Number.isFinite(fromMs) || !Number.isFinite(toMs)) return "day";
	const days = Math.max(1, Math.round((toMs - fromMs) / DAY_MS));
	if (days <= 60) return "day";
	if (days <= 365) return "week";
	return "month";
};

export const SPARKLINE_METRICS: readonly AnalyticsMetric[] = [
	"uniqueVisitors",
	"sessions",
	"pageviews",
	"totalEvents",
	"avgSessionSec",
	"bounceRate",
] as const;

export const faviconUrl = (host: string): string =>
	`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=32`;

const FALLBACK_PALETTE = [
	"#38bdf8",
	"#f87171",
	"#fbbf24",
	"#34d399",
	"#a78bfa",
	"#f472b6",
	"#60a5fa",
	"#fb923c",
];

export const colorForKey = (key: string): string => {
	let hash = 0;
	for (let i = 0; i < key.length; i++) {
		hash = (hash * 31 + key.charCodeAt(i)) | 0;
	}
	const idx = Math.abs(hash) % FALLBACK_PALETTE.length;
	return FALLBACK_PALETTE[idx];
};

export const initialFor = (key: string): string => {
	const trimmed = key.trim();
	return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : "?";
};

export const formatLastRun = (
	iso: string | null,
	lang: Locale,
	neverLabel: string,
): string => {
	if (!iso) return neverLabel;
	const ts = new Date(iso).getTime();
	if (!Number.isFinite(ts)) return neverLabel;
	return new Intl.DateTimeFormat(localeFor(lang), {
		dateStyle: "short",
		timeStyle: "short",
	}).format(ts);
};
