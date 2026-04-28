import {
	fetchSourcesServerSafe,
	fetchStatsServer,
} from "@/entities/dictionary/server";
import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import {
	DomainGrid,
	LevelChart,
	StatsApiHint,
	StatsError,
	StatsHero,
	StatsPageHeader,
	StatsPosGrid,
	StatsSourcesTable,
} from "@/widgets";
import type { Metadata } from "next";
import { SITE_URL } from "@/shared/config";
import { notFound } from "next/navigation";
export const revalidate = 1800;

type PageProps = {
	params: Promise<{ lang: string }>;
};

const localizedPath = (lang: string) => `/${lang}/stats`;

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const title = dict.stats.meta.title;
	const description = dict.stats.meta.description;
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

export default async function StatsPage({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [dict, stats, sources] = await Promise.all([
		getDictionary(lang),
		fetchStatsServer(),
		fetchSourcesServerSafe(),
	]);

	const statsDict = dict.stats;
	const posValues = dict.search.filters.posValues;

	const jsonLd = stats
		? {
				"@context": "https://schema.org",
				"@type": "Dataset",
				name: statsDict.meta.title,
				description: statsDict.meta.description,
				url: `${SITE_URL}${localizedPath(lang)}`,
				inLanguage: [lang === "che" ? "ce" : lang],
				variableMeasured: [
					{
						"@type": "PropertyValue",
						name: statsDict.hero.entries,
						value: stats.total,
					},
					{
						"@type": "PropertyValue",
						name: statsDict.hero.sources,
						value: stats.totalSources,
					},
				],
			}
		: null;

	return (
		<>
			{jsonLd && (
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is required for SEO
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			)}

			<div className="flex flex-col items-center">
				<StatsPageHeader header={statsDict.header} />

				{stats ? (
					<>
						<StatsHero stats={stats} labels={statsDict.hero} />
						<LevelChart
							wordLevels={stats.wordLevels}
							attested={stats.attested}
							levelsUnclassified={stats.levelsUnclassified}
							labels={statsDict.levels}
						/>
						<DomainGrid
							domains={stats.domains}
							labels={statsDict.domains}
						/>
						<StatsPosGrid
							posDistribution={stats.posDistribution}
							labels={statsDict.pos}
							posValues={posValues}
						/>
					</>
				) : (
					<StatsError error={statsDict.error} />
				)}

				{sources.length > 0 && (
					<StatsSourcesTable
						sources={sources}
						labels={statsDict.sources}
					/>
				)}

				<StatsApiHint apiHint={statsDict.apiHint} locale={lang} />
			</div>
		</>
	);
}
