import type { Locale } from "@/i18n/dictionaries";

export const toIntlLocale = (lang: Locale): string => {
	switch (lang) {
		case "ru":
			return "ru-RU";
		case "en":
			return "en-US";
		case "che":
			return "ce-RU";
	}
};

const DAY_MS = 86_400_000;

const sameDay = (a: Date, b: Date): boolean =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();

/** Card timestamp: "Today, 14:32" / "8 April, 10:15". */
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

/** Short review stamp: "8 April". */
export const formatShortDate = (iso: string, lang: Locale): string => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return new Intl.DateTimeFormat(toIntlLocale(lang), {
		day: "numeric",
		month: "long",
	}).format(d);
};

export const getUserInitials = (name: string): string => {
	const trimmed = name.trim();
	if (!trimmed) return "?";
	const parts = trimmed.split(/\s+/).filter(Boolean);
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[1][0]).toUpperCase();
};
