import { fetchStatsServer } from "@/entities/dictionary/server";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
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
import { notFound } from "next/navigation";

export default async function Home({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [dict, stats] = await Promise.all([
		getDictionary(lang),
		fetchStatsServer(),
	]);

	return (
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
	);
}
