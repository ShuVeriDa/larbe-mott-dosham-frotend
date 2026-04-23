import type { Locale } from "@/i18n/dictionaries";

export const toIntlLocale = (lang: Locale): string =>
	lang === "en" ? "en-US" : "ru-RU";
