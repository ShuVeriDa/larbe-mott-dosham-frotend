import type { Locale } from "@/i18n/dictionaries";

const LOCALE_MAP: Record<Locale, string> = {
	che: "ru-RU",
	ru: "ru-RU",
	en: "en-US",
};

export const formatDateShort = (
	iso: string | null | undefined,
	lang: Locale,
): string => {
	if (!iso) return "—";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleDateString(LOCALE_MAP[lang], {
		day: "2-digit",
		month: "2-digit",
		year: "2-digit",
	});
};

export const formatDateTime = (
	iso: string | null | undefined,
	lang: Locale,
): string => {
	if (!iso) return "—";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleString(LOCALE_MAP[lang], {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};
