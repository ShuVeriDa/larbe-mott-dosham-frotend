import type { Metadata } from "next";

const SITE_URL = "https://dosham.app";

interface BuildAdminMetadataArgs {
	title: string;
	description: string;
	lang: string;
	pathSuffix: string;
}

const localeFor = (lang: string) =>
	lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "ce_RU";

const localizedPath = (lang: string, suffix: string) =>
	`/${lang}/admin${suffix}`;

export const buildAdminMetadata = ({
	title,
	description,
	lang,
	pathSuffix,
}: BuildAdminMetadataArgs): Metadata => {
	const canonicalPath = localizedPath(lang, pathSuffix);
	return {
		title,
		description,
		alternates: {
			canonical: canonicalPath,
			languages: {
				ru: localizedPath("ru", pathSuffix),
				en: localizedPath("en", pathSuffix),
				"ce-RU": localizedPath("che", pathSuffix),
				"x-default": localizedPath("ru", pathSuffix),
			},
		},
		openGraph: {
			title,
			description,
			url: `${SITE_URL}${canonicalPath}`,
			type: "website",
			locale: localeFor(lang),
		},
		twitter: {
			card: "summary",
			title,
			description,
		},
		robots: { index: false, follow: false },
	};
};
