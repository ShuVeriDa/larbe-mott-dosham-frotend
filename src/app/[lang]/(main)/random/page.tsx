import { fetchStatsServer } from "@/entities/dictionary/server";
import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import { RandomHero } from "@/widgets/random-hero";
import { parseLevelParam, RandomPage } from "@/widgets/random-page";
import type { Metadata } from "next";
import { SITE_URL } from "@/shared/config";
import { notFound } from "next/navigation";

// Random content is regenerated client-side on every shuffle; no need to cache
// the page shell beyond the default. Keep it dynamic so the stats count used in
// the subtitle stays fresh.
export const revalidate = 1800;

type PageProps = {
	params: Promise<{ lang: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const localizedPath = (lang: string, level?: string) =>
	level ? `/${lang}/random?level=${level}` : `/${lang}/random`;

export const generateStaticParams = async () =>
	LOCALES.map(lang => ({ lang }));

export const generateMetadata = async ({
	params,
	searchParams,
}: PageProps): Promise<Metadata> => {
	const [{ lang }, sp] = await Promise.all([params, searchParams]);
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const rawLevel = sp.level;
	const levelValue = Array.isArray(rawLevel) ? rawLevel[0] : rawLevel;
	const level = parseLevelParam(levelValue);

	const title = dict.random.meta.title;
	const description = dict.random.meta.description;
	const canonicalPath = localizedPath(lang, level === "ALL" ? undefined : level);

	return {
		title,
		description,
		alternates: {
			canonical: canonicalPath,
			languages: {
				ru: localizedPath("ru", level === "ALL" ? undefined : level),
				en: localizedPath("en", level === "ALL" ? undefined : level),
				"ce-RU": localizedPath("che", level === "ALL" ? undefined : level),
				"x-default": localizedPath("ru", level === "ALL" ? undefined : level),
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

export default async function RandomPageRoute({
	params,
	searchParams,
}: PageProps) {
	const [{ lang }, sp] = await Promise.all([params, searchParams]);
	if (!hasLocale(lang)) notFound();

	const [dict, stats] = await Promise.all([
		getDictionary(lang),
		fetchStatsServer(),
	]);

	const rawLevel = sp.level;
	const levelValue = Array.isArray(rawLevel) ? rawLevel[0] : rawLevel;
	const initialLevel = parseLevelParam(levelValue);

	const canonicalUrl = `${SITE_URL}${localizedPath(lang, initialLevel === "ALL" ? undefined : initialLevel)}`;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: dict.random.meta.title,
		description: dict.random.meta.description,
		url: canonicalUrl,
		inLanguage: [lang === "che" ? "ce" : lang],
		isPartOf: {
			"@type": "WebSite",
			name: "Дошам",
			url: SITE_URL,
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is required for SEO
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			<RandomHero random={dict.random} totalCount={stats?.total} />

			<RandomPage
				random={dict.random}
				wordLevelContent={dict.wordLevel}
				initialLevel={initialLevel}
				lang={lang}
			/>
		</>
	);
}
