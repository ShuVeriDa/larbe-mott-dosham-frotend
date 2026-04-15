import "server-only";

const dictionaries = {
	che: () => import("../dictionaries/che.json").then(m => m.default),
	ru: () => import("../dictionaries/ru.json").then(m => m.default),
	en: () => import("../dictionaries/en.json").then(m => m.default),
};

export const LOCALES = ["che", "ru", "en"] as const;
export const DEFAULT_LOCALE = "ru" as const;

export type Locale = (typeof LOCALES)[number];

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["ru"]>>;

export const hasLocale = (locale: string): locale is Locale =>
	LOCALES.includes(locale as Locale);

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
	dictionaries[locale]();
