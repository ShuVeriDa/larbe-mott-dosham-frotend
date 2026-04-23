import type { Locale } from "@/i18n/dictionaries";

const intlLocale: Record<Locale, string> = {
	ru: "ru-RU",
	en: "en-US",
	che: "ru-RU",
};

export const formatMonthYear = (iso: string, lang: Locale): string => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return new Intl.DateTimeFormat(intlLocale[lang], {
		month: "long",
		year: "numeric",
	}).format(d);
};

export const formatDateTime = (iso: string, lang: Locale): string => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return new Intl.DateTimeFormat(intlLocale[lang], {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(d);
};
