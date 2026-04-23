import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";

interface Props {
	lang: Locale;
	dict: Dictionary["admin"]["pipeline"];
}

export const AdminPipelineJsonLd: FC<Props> = ({ lang, dict }) => {
	const json = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: dict.header.title,
		description: dict.header.subtitle,
		inLanguage: lang,
		isAccessibleForFree: false,
		isPartOf: {
			"@type": "WebSite",
			name: "Dosham Admin",
		},
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is safe static content
			dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
		/>
	);
};
