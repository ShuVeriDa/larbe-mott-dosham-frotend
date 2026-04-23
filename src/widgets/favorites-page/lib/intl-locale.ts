import type { Locale } from "@/i18n/dictionaries";

/**
 * Map our app locale to a BCP-47 tag understood by `Intl.*`. Chechen falls
 * back to Russian formatting since browser CLDR data for `ce` is incomplete.
 */
export const toIntlLocale = (lang: Locale): string =>
	lang === "en" ? "en-US" : "ru-RU";
