import { fetchStatsServer } from "@/entities/dictionary/server";
import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import { AboutPage } from "@/widgets";
import type { Metadata } from "next";
import { SITE_URL } from "@/shared/config";
import { notFound } from "next/navigation";
export const revalidate = 3600;

type PageProps = {
	params: Promise<{ lang: string }>;
};

const localizedPath = (lang: string) => `/${lang}/about`;

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const title = dict.about.meta.title;
	const description = dict.about.meta.description;
	const canonicalPath = localizedPath(lang);

	return {
		title,
		description,
		alternates: {
			canonical: canonicalPath,
			languages: {
				ru: localizedPath("ru"),
				en: localizedPath("en"),
				"ce-RU": localizedPath("che"),
				"x-default": localizedPath("ru"),
			},
		},
		openGraph: {
			title,
			description,
			url: `${SITE_URL}${canonicalPath}`,
			type: "website",
			locale: lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "ce_RU",
		},
		twitter: {
			card: "summary",
			title,
			description,
		},
		robots: { index: true, follow: true },
	};
};

export const generateStaticParams = async () =>
	LOCALES.map(lang => ({ lang }));

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [dict, stats] = await Promise.all([
		getDictionary(lang),
		fetchStatsServer(),
	]);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: dict.about.meta.title,
		description: dict.about.meta.description,
		url: `${SITE_URL}${localizedPath(lang)}`,
		inLanguage: [lang === "che" ? "ce" : lang],
	};

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is required for SEO
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<AboutPage
				about={dict.about}
				lang={lang}
				total={stats?.total ?? null}
			/>
		</>
	);
}
