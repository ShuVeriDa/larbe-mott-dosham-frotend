import type { Locale } from "@/i18n/dictionaries";

const localeFor = (lang: Locale): string => {
	switch (lang) {
		case "en":
			return "en-US";
		case "ru":
			return "ru-RU";
		default:
			return "ru-RU";
	}
};

export const formatPagesNumber = (value: number, lang: Locale): string =>
	new Intl.NumberFormat(localeFor(lang)).format(Math.round(value));

export const formatPagesPct = (count: number, total: number): string => {
	if (!Number.isFinite(total) || total <= 0) return "0%";
	return `${((count / total) * 100).toFixed(1)}%`;
};

export const isExternalPath = (path: string): boolean =>
	/^https?:\/\//i.test(path);
