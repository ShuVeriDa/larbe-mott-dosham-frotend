import type { Locale } from "@/i18n/dictionaries";
import { toIntlLocale } from "./intl-locale";

/**
 * Format a favorite's `createdAt` as a localized long date (e.g. "8 апреля").
 * Includes the year when the date is not in the current year.
 */
export const formatAddedDate = (iso: string, lang: Locale): string => {
	const date = new Date(iso);
	const isSameYear = date.getFullYear() === new Date().getFullYear();

	return new Intl.DateTimeFormat(toIntlLocale(lang), {
		day: "numeric",
		month: "long",
		...(isSameYear ? {} : { year: "numeric" }),
	}).format(date);
};
