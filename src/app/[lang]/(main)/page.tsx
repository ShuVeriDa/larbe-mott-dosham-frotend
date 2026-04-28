import { fetchStatsServer } from "@/entities/dictionary/server";
import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import {
	ApiSection,
	FeaturesSection,
	MorphologySection,
	SearchBar,
	SourcesSection,
	WordOfDay,
} from "@/widgets";
import { Hero } from "@/widgets/hero/ui/hero";
import { StatsBand } from "@/widgets/stats-band";
import type { Metadata } from "next";
import { SITE_URL } from "@/shared/config";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{ lang: string }>;
};

export const generateStaticParams = async () =>
	LOCALES.map(lang => ({ lang }));

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const canonicalPath = `/${lang}`;

	return {
		alternates: {
			canonical: canonicalPath,
			languages: {
				ru: "/ru",
				en: "/en",
				"ce-RU": "/che",
				"x-default": "/ru",
			},
		},
		openGraph: {
			url: `${SITE_URL}${canonicalPath}`,
			locale: lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "ce_RU",
		},
	};
};

export default async function Home({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [dict, stats] = await Promise.all([
		getDictionary(lang),
		fetchStatsServer(),
	]);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Мотт Ларбе Дошам",
		url: SITE_URL,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${SITE_URL}/${lang}/search?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is required for SEO
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<div className="flex flex-col items-center justify-center">
				<Hero dict={dict} locale={lang}>
					<SearchBar search={dict.search} lang={lang} />
					<div
						className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-faint text-xs"
						aria-hidden="true"
					>
						<div className="scroll-cue-line" />
					</div>
				</Hero>
				<WordOfDay wordOfDay={dict.wordOfDay} wordLevelContent={dict.wordLevel} />
				<StatsBand statsBand={dict.statsBand} />
				<FeaturesSection features={dict.features} />
				<MorphologySection morphology={dict.morphology} />
				<SourcesSection
					sources={dict.sources}
					count={stats?.totalSources ?? 0}
				/>
				<ApiSection apiSection={dict.apiSection} locale={lang} />
			</div>
		</>
	);
}
