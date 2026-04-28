import { SITE_URL } from "@/shared/config";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";

interface Props {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineReset"];
}

export const AdminPipelineResetJsonLd: FC<Props> = ({ lang, dict }) => {
	const payload = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: dict.meta.title,
		description: dict.meta.description,
		url: `${SITE_URL}/${lang}/admin/pipeline/reset`,
		isPartOf: {
			"@type": "WebApplication",
			name: "Dosham Admin",
			applicationCategory: "BusinessApplication",
		},
	};
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD for SEO
			dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
		/>
	);
};
