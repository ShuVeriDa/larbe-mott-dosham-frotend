import type { Locale } from "@/i18n/dictionaries";
import { toIntlLocale } from "./intl-locale";

const DAY_MS = 86_400_000;

const sameDay = (a: Date, b: Date): boolean =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();

/** Relative-ish timestamp for cards: "Today, 14:32" / "8 April, 10:15". */
export const formatCardDate = (
	iso: string,
	lang: Locale,
	todayLabel: string,
	yesterdayLabel: string,
	now: Date = new Date(),
): string => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";

	const locale = toIntlLocale(lang);
	const time = new Intl.DateTimeFormat(locale, {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(d);

	if (sameDay(d, now)) return `${todayLabel}, ${time}`;
	const yesterday = new Date(now.getTime() - DAY_MS);
	if (sameDay(d, yesterday)) return `${yesterdayLabel}, ${time}`;

	const sameYear = d.getFullYear() === now.getFullYear();
	return new Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "long",
		year: sameYear ? undefined : "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(d);
};

/** Short review-stamp format: "8 April". */
export const formatShortDate = (iso: string, lang: Locale): string => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return new Intl.DateTimeFormat(toIntlLocale(lang), {
		day: "numeric",
		month: "long",
	}).format(d);
};
