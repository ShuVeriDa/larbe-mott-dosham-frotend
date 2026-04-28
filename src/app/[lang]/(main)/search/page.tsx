import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import { ExploreSection } from "@/widgets/explore-section";
import { SearchHero } from "@/widgets/search-hero";
import { SearchResults } from "@/widgets/search-results";
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
	const search = dict?.search;

	const canonicalPath = q
		? `/${lang}/search?q=${encodeURIComponent(q)}`
		: `/${lang}/search`;

	const title = q
		? `${q} — ${search?.hero.title ?? "Search"}`
		: (search?.hero.title ?? "Search");

	const description = search?.hero.subtitle ?? "Dictionary search";

	return {
		title,
		description,
		alternates: {
			canonical: canonicalPath,
			languages: {
				ru: `/ru/search${q ? `?q=${encodeURIComponent(q)}` : ""}`,
				en: `/en/search${q ? `?q=${encodeURIComponent(q)}` : ""}`,
				"ce-RU": `/che/search${q ? `?q=${encodeURIComponent(q)}` : ""}`,
				"x-default": `/ru/search${q ? `?q=${encodeURIComponent(q)}` : ""}`,
			},
		},
		openGraph: {
			title,
			description,
			url: `${SITE_URL}${canonicalPath}`,
			type: "website",
		},
		// Do not index per-query result pages.
		robots: q ? { index: false, follow: true } : { index: true, follow: true },
	};
};

export default async function SearchPage({ params, searchParams }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const [dict, sp] = await Promise.all([getDictionary(lang), searchParams]);
	const rawQ = sp.q;
	const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ)?.trim() ?? "";

	return (
		<div className="max-w-[860px] w-full mx-auto px-6">
			{q ? (
				<SearchResults search={dict.search} lang={lang} />
			) : (
				<>
					<SearchHero search={dict.search} lang={lang} />
					<ExploreSection popularWords={dict.popularWords} lang={lang} />
				</>
			)}
		</div>
	);
}
