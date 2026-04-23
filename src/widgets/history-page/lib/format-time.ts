import type { Locale } from "@/i18n/dictionaries";
import { toIntlLocale } from "./intl-locale";

export const formatTime = (iso: string, lang: Locale): string =>
	new Intl.DateTimeFormat(toIntlLocale(lang), {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(new Date(iso));
