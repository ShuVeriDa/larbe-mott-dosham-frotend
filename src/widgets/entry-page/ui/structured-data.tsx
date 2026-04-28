import type { DictionaryEntry } from "@/entities/dictionary";
import { SITE_URL } from "@/shared/config";
import type { FC } from "react";

interface StructuredDataProps {
	entry: DictionaryEntry;
	lang: string;
	breadcrumbs: { home: string; dictionary: string };
}

export const StructuredData: FC<StructuredDataProps> = ({ entry, lang, breadcrumbs }) => {
	const translations = entry.meanings
		.map(m => m.translation)
		.filter(Boolean);

	const definedTerm = {
		"@context": "https://schema.org",
		"@type": "DefinedTerm",
		name: entry.word,
		inLanguage: lang === "che" ? "ce" : lang,
		url: `${SITE_URL}/${lang}/entry/${entry.id}`,
		description: translations.join("; "),
		alternateName: entry.variants,
		inDefinedTermSet: {
			"@type": "DefinedTermSet",
			name: "Мотт Ларбе Дошам",
			url: `${SITE_URL}/${lang}/search`,
		},
	};

	const breadcrumbList = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: breadcrumbs.home,
				item: `${SITE_URL}/${lang}`,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: breadcrumbs.dictionary,
				item: `${SITE_URL}/${lang}/search`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: entry.word,
				item: `${SITE_URL}/${lang}/entry/${entry.id}`,
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
				dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTerm) }}
			/>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
			/>
		</>
	);
};
