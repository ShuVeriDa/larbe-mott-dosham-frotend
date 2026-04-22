import type { DictionaryEntry } from "@/entities/dictionary";
import type { FC } from "react";

const SITE_URL = "https://dosham.app";

interface StructuredDataProps {
	entry: DictionaryEntry;
	lang: string;
}

export const StructuredData: FC<StructuredDataProps> = ({ entry, lang }) => {
	const translations = entry.meanings
		.map(m => m.translation)
		.filter(Boolean);

	const payload = {
		"@context": "https://schema.org",
		"@type": "DefinedTerm",
		name: entry.word,
		inLanguage: "ce",
		url: `${SITE_URL}/${lang}/entry/${entry.id}`,
		description: translations.join("; "),
		alternateName: entry.variants,
		inDefinedTermSet: {
			"@type": "DefinedTermSet",
			name: "Мотт Ларбе Дошам",
			url: `${SITE_URL}/${lang}/search`,
		},
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
			dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
		/>
	);
};
