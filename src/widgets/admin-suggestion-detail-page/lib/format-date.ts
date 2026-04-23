import type { Locale } from "@/i18n/dictionaries";

const LOCALE_MAP: Record<Locale, string> = {
	ru: "ru-RU",
	en: "en-US",
	che: "ru-RU",
};

export const formatDateTime = (iso: string, lang: Locale): string => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return new Intl.DateTimeFormat(LOCALE_MAP[lang], {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(d);
};

export const formatDateShort = (iso: string, lang: Locale): string => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return new Intl.DateTimeFormat(LOCALE_MAP[lang], {
		day: "numeric",
		month: "long",
	}).format(d);
};
