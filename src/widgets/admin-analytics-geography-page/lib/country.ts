import type { Locale } from "@/i18n/dictionaries";

const ISO_RE = /^[A-Z]{2}$/;

const FLAG_CODE_OFFSET = 127397;

export const isoToFlag = (iso: string): string => {
	const upper = iso.toUpperCase();
	if (!ISO_RE.test(upper)) return "🏳";
	return upper.replace(/./g, (char) =>
		String.fromCodePoint(FLAG_CODE_OFFSET + char.charCodeAt(0)),
	);
};

const localeFor = (lang: Locale): string => {
	switch (lang) {
		case "en":
			return "en";
		case "ru":
			return "ru";
		default:
			return "ru";
	}
};

const cache = new Map<string, Intl.DisplayNames>();

const getDisplayNames = (lang: Locale): Intl.DisplayNames => {
	const key = localeFor(lang);
	let dn = cache.get(key);
	if (!dn) {
		dn = new Intl.DisplayNames([key], { type: "region" });
		cache.set(key, dn);
	}
	return dn;
};

export const countryName = (iso: string, lang: Locale): string => {
	const upper = iso.toUpperCase();
	if (!ISO_RE.test(upper)) return iso;
	try {
		return getDisplayNames(lang).of(upper) ?? upper;
	} catch {
		return upper;
	}
};

export const isValidIso = (iso: string | null | undefined): iso is string =>
	!!iso && ISO_RE.test(iso.toUpperCase());
