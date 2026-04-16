import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import { SearchBar, WordOfDay } from "@/widgets";
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

	const dict = await getDictionary(lang);

	return (
		<div className="flex flex-col items-center justify-center">
			<Hero dict={dict} locale={lang}>
				<SearchBar search={dict.search} />
			</Hero>
			<WordOfDay wordOfDay={dict.wordOfDay} wordLevelContent={dict.wordLevel} />
			<StatsBand statsBand={dict.statsBand} />
		</div>
	);
}
