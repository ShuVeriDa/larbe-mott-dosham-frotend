import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import { AdminUsersPage } from "@/widgets/admin-users-page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SITE_URL = "https://dosham.app";

type PageProps = {
	params: Promise<{ lang: string }>;
};

const localizedPath = (lang: string) => `/${lang}/admin/users`;

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const title = dict.adminUsers.meta.title;
	const description = dict.adminUsers.meta.description;
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

	return <AdminUsersPage lang={lang} dict={dict.adminUsers} />;
}
