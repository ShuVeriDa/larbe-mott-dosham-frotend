import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import { AdminSuggestionsPage } from "@/widgets/admin-suggestions-page";
import type { Metadata } from "next";
import { SITE_URL } from "@/shared/config";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{ lang: string }>;
};

const localizedPath = (lang: string) => `/${lang}/admin/suggestions`;

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const title = dict.adminSuggestions.meta.title;
	const description = dict.adminSuggestions.meta.description;
	const canonicalPath = localizedPath(lang);

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
			locale: lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "ce_RU",
		},
		twitter: {
			card: "summary",
			title,
			description,
		},
		robots: { index: false, follow: false },
	};
};

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const dict = await getDictionary(lang);

	return (
		<AdminSuggestionsPage
			lang={lang}
			dict={dict.adminSuggestions}
			groupsDict={dict.history.groups}
		/>
	);
}
