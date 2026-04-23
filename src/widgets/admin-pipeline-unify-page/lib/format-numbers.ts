import type { Locale } from "@/i18n/dictionaries";

const formatters: Record<Locale, Intl.NumberFormat> = {
	ru: new Intl.NumberFormat("ru-RU"),
	en: new Intl.NumberFormat("en-US"),
	che: new Intl.NumberFormat("ru-RU"),
};

export const formatNumber = (value: number, lang: Locale): string =>
	formatters[lang].format(value);

export const formatSize = (mb: number | null | undefined): string => {
	if (mb === null || mb === undefined) return "—";
	if (mb < 0.1) return mb.toFixed(2);
	return mb.toFixed(1);
};
