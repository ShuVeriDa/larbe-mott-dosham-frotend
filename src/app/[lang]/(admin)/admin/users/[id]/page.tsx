import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import { AdminUserDetailPage } from "@/widgets/admin-user-detail-page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SITE_URL = "https://dosham.app";

type PageProps = {
	params: Promise<{ lang: string; id: string }>;
};

const localizedPath = (lang: string, id: string) =>
	`/${lang}/admin/users/${id}`;

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { lang, id } = await params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const title = dict.adminUserDetail.meta.title;
	const description = dict.adminUserDetail.meta.description;
	const canonicalPath = localizedPath(lang, id);

	return {
		title,
		description,
		alternates: {
			canonical: canonicalPath,
			languages: {
				ru: localizedPath("ru", id),
				en: localizedPath("en", id),
				"ce-RU": localizedPath("che", id),
				"x-default": localizedPath("ru", id),
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
	const { lang, id } = await params;
	if (!hasLocale(lang)) notFound();

	const dict = await getDictionary(lang);

	return (
		<AdminUserDetailPage
			id={id}
			lang={lang}
			dict={dict.adminUserDetail}
			adminUsersDict={dict.adminUsers}
		/>
	);
}
