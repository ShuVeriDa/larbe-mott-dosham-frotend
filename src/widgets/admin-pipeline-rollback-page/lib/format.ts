import type { Locale } from "@/i18n/dictionaries";

const LOCALE_MAP: Record<Locale, string> = {
	ru: "ru-RU",
	en: "en-US",
	che: "ru-RU",
};

export const getIntlLocale = (lang: Locale): string => LOCALE_MAP[lang];

export const formatNumber = (value: number, lang: Locale): string =>
	new Intl.NumberFormat(getIntlLocale(lang)).format(value);

export const formatMb = (mb: number | null | undefined, lang: Locale): string => {
	if (mb == null) return "—";
	return `${new Intl.NumberFormat(getIntlLocale(lang), {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	}).format(mb)} MB`;
};

export const formatDateTime = (
	iso: string | null | undefined,
	lang: Locale,
): string => {
	if (!iso) return "—";
	try {
		return new Intl.DateTimeFormat(getIntlLocale(lang), {
			day: "2-digit",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(iso));
	} catch {
		return iso;
	}
};

export const formatTime = (iso: string, lang: Locale): string => {
	try {
		return new Intl.DateTimeFormat(getIntlLocale(lang), {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		}).format(new Date(iso));
	} catch {
		return iso;
	}
};

export const interpolate = (
	template: string,
	values: Record<string, string | number>,
): string =>
	Object.entries(values).reduce(
		(acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
		template,
	);
