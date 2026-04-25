import { LOCALES, getDictionary, hasLocale } from "@/i18n/dictionaries";
import { buildAdminMetadata } from "@/shared/lib/admin-metadata";
import { AdminAnalyticsPagesPage } from "@/widgets/admin-analytics-pages-page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};
	const dict = await getDictionary(lang);
	return buildAdminMetadata({
		title: dict.admin.analyticsPages.meta.title,
		description: dict.admin.analyticsPages.meta.description,
		lang,
		pathSuffix: "/analytics/pages",
	});
};

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	return (
		<AdminAnalyticsPagesPage
			lang={lang}
			dict={dict.admin.analyticsPages}
			tabsDict={dict.admin.analytics.tabs}
			toolbarDict={dict.admin.analytics.toolbar}
			realtimeDict={dict.admin.analytics.realtime}
			commonDict={dict.admin.common}
		/>
	);
}
