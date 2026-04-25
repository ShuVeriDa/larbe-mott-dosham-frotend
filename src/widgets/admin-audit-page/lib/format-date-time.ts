import type { Locale } from "@/i18n/dictionaries";

const LOCALE_MAP: Record<Locale, string> = {
	ru: "ru-RU",
	en: "en-US",
	che: "ru-RU",
};

export const formatDayLabel = (iso: string, lang: Locale): string => {
	try {
		return new Date(iso).toLocaleDateString(LOCALE_MAP[lang], {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	} catch {
		return iso;
	}
};

export const formatTime = (iso: string, lang: Locale): string => {
	try {
		return new Date(iso).toLocaleTimeString(LOCALE_MAP[lang], {
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return iso;
	}
};

export const toDayKey = (iso: string): string => iso.slice(0, 10);

export const isSameDay = (iso: string, reference: Date): boolean =>
	toDayKey(iso) === reference.toISOString().slice(0, 10);
