import type { AnalyticsMetric } from "@/features/admin-analytics";
import type { Locale } from "@/i18n/dictionaries";

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

export const formatNumber = (value: number, lang: Locale): string =>
	new Intl.NumberFormat(localeFor(lang)).format(Math.round(value));

export const formatDuration = (
	totalSeconds: number,
	short: { minutes: string; seconds: string },
): string => {
	const safe = Math.max(0, Math.round(totalSeconds));
	const minutes = Math.floor(safe / 60);
	const seconds = safe % 60;
	return `${minutes}${short.minutes} ${seconds}${short.seconds}`;
};

export const formatBounceRate = (ratio: number): string => {
	const pct = ratio <= 1 ? ratio * 100 : ratio;
	return `${pct.toFixed(1)}%`;
};

export const formatDateShort = (iso: string, lang: Locale): string => {
	const ts = new Date(iso).getTime();
	if (!Number.isFinite(ts)) return iso;
	return new Intl.DateTimeFormat(localeFor(lang), {
		day: "numeric",
		month: "short",
	}).format(ts);
};

interface DurationLabels {
	minutes: string;
	seconds: string;
}

export const formatMetricValue = (
	metric: AnalyticsMetric,
	value: number,
	lang: Locale,
	durationLabels: DurationLabels,
): string => {
	if (!Number.isFinite(value)) return "—";
	if (metric === "bounceRate") return formatBounceRate(value);
	if (metric === "avgSessionSec") return formatDuration(value, durationLabels);
	return formatNumber(value, lang);
};

export const formatMetricCompact = (
	metric: AnalyticsMetric,
	value: number,
	lang: Locale,
	durationLabels: DurationLabels,
): string => {
	if (!Number.isFinite(value)) return "—";
	if (metric === "bounceRate") return formatBounceRate(value);
	if (metric === "avgSessionSec") {
		const minutes = Math.floor(Math.max(0, value) / 60);
		return `${minutes}${durationLabels.minutes}`;
	}
	if (Math.abs(value) >= 1000) {
		return new Intl.NumberFormat(localeFor(lang), {
			notation: "compact",
			maximumFractionDigits: 1,
		}).format(value);
	}
	return formatNumber(value, lang);
};

export const computeDeltaPct = (
	current: number,
	previous: number,
): number | null => {
	if (!Number.isFinite(previous) || previous === 0) return null;
	return ((current - previous) / previous) * 100;
};
