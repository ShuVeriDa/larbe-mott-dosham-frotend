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

export const formatSearchQueriesNumber = (
	value: number,
	lang: Locale,
): string => new Intl.NumberFormat(localeFor(lang)).format(Math.round(value));

export const formatSearchQueriesPct = (
	count: number,
	total: number,
): string => {
	if (!Number.isFinite(total) || total <= 0) return "0%";
	return `${((count / total) * 100).toFixed(1)}%`;
};

export const formatPctFromValue = (value: number): string => {
	if (!Number.isFinite(value)) return "0%";
	return `${value.toFixed(1)}%`;
};

export const formatDecimal = (value: number, lang: Locale): string =>
	new Intl.NumberFormat(localeFor(lang), {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	}).format(value);

export const interpolate = (
	template: string,
	values: Record<string, string>,
): string => template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

export const computePeriodDays = (from?: string, to?: string): number => {
	if (!from || !to) return 0;
	const fromMs = Date.parse(from);
	const toMs = Date.parse(to);
	if (!Number.isFinite(fromMs) || !Number.isFinite(toMs)) return 0;
	const diff = Math.round((toMs - fromMs) / (24 * 60 * 60 * 1000)) + 1;
	return Math.max(0, diff);
};
