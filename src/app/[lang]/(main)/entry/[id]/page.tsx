import { fetchEntryServer } from "@/entities/dictionary/server";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import { EntryPage, EntryNotFound } from "@/widgets/entry-page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SITE_URL = "https://dosham.app";

type PageProps = {
	params: Promise<{ lang: string; id: string }>;
};

const parseId = (raw: string): number | null => {
	const id = Number.parseInt(raw, 10);
	return Number.isFinite(id) && id > 0 ? id : null;
};

const buildMetaDescription = (
	template: string,
	word: string,
	meanings: string,
): string =>
	template.replace("{word}", word).replace("{meanings}", meanings);

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { lang, id: rawId } = await params;
	if (!hasLocale(lang)) return {};

	const id = parseId(rawId);
	if (id === null) return {};

	const [dict, entry] = await Promise.all([
		getDictionary(lang),
		fetchEntryServer(id).catch(() => null),
	]);

	if (!entry) {
		return {
			title: dict.entry.notFound.title,
			robots: { index: false, follow: false },
		};
	}

	const meta = dict.entry.meta;
	const canonicalPath = `/${lang}/entry/${id}`;
	const meaningsPreview = entry.meanings
		.slice(0, 2)
		.map(m => m.translation)
		.filter(Boolean)
		.join("; ");

	const title = `${entry.word} — ${meta.titleSuffix}`;
	const description = buildMetaDescription(
		meta.descriptionTemplate,
		entry.word,
		meaningsPreview || entry.word,
	);

	return {
		title,
		description,
		alternates: {
			canonical: canonicalPath,
			languages: {
				ru: `/ru/entry/${id}`,
				en: `/en/entry/${id}`,
				"ce-RU": `/che/entry/${id}`,
				"x-default": `/ru/entry/${id}`,
			},
		},
		openGraph: {
			title,
			description,
			url: `${SITE_URL}${canonicalPath}`,
			type: "article",
		},
		robots: { index: true, follow: true },
	};
};

export default async function EntryRoute({ params }: PageProps) {
	const { lang, id: rawId } = await params;
	if (!hasLocale(lang)) notFound();

	const id = parseId(rawId);
	if (id === null) notFound();

	const [dict, entry] = await Promise.all([
		getDictionary(lang),
		fetchEntryServer(id).catch(() => null),
	]);

	if (!entry) {
		return (
			<div className="max-w-[860px] w-full mx-auto px-6">
				<EntryNotFound lang={lang} dict={dict.entry.notFound} />
			</div>
		);
	}

	return (
		<div className="max-w-[860px] w-full mx-auto px-6">
			<EntryPage
				entry={entry}
				lang={lang}
				dict={dict.entry}
				wordLevelDict={dict.wordLevel}
			/>
		</div>
	);
}
