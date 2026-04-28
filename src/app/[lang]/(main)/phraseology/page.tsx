import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import { PhraseologyExploreSection } from "@/widgets/phraseology-explore-section";
import { PhraseologyHero } from "@/widgets/phraseology-hero";
import { PhraseologyResults } from "@/widgets/phraseology-results";
import type { Metadata } from "next";
import { SITE_URL } from "@/shared/config";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{ lang: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const generateMetadata = async ({
	params,
	searchParams,
}: PageProps): Promise<Metadata> => {
	const [{ lang }, sp] = await Promise.all([params, searchParams]);
	const rawQ = sp.q;
	const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ)?.trim() ?? "";

	const dict = hasLocale(lang) ? await getDictionary(lang) : null;
	const phraseology = dict?.phraseology;

	const canonicalPath = q
		? `/${lang}/phraseology?q=${encodeURIComponent(q)}`
		: `/${lang}/phraseology`;

	const title = q
		? `${q} — ${phraseology?.hero.title ?? "Phraseology"}`
		: (phraseology?.hero.title ?? "Phraseology");

	const description = phraseology?.hero.subtitle ?? "Chechen phraseology search";

	const localizedPath = (l: string) =>
		`/${l}/phraseology${q ? `?q=${encodeURIComponent(q)}` : ""}`;

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
		},
		// Do not index per-query pages to avoid thin / duplicate search results.
		robots: q ? { index: false, follow: true } : { index: true, follow: true },
	};
};

export default async function PhraseologyPage({
	params,
	searchParams,
}: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [dict, sp] = await Promise.all([getDictionary(lang), searchParams]);
	const rawQ = sp.q;
	const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ)?.trim() ?? "";

	return (
		<div className="max-w-[800px] w-full mx-auto px-6">
			{q ? (
				<PhraseologyResults phraseology={dict.phraseology} lang={lang} />
			) : (
				<>
					<PhraseologyHero phraseology={dict.phraseology} lang={lang} />
					<PhraseologyExploreSection
						explore={dict.phraseology.explore}
						lang={lang}
					/>
				</>
			)}
		</div>
	);
}
