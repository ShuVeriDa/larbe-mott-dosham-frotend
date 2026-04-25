import { LOCALES, getDictionary, hasLocale } from "@/i18n/dictionaries";
import { buildAdminMetadata } from "@/shared/lib/admin-metadata";
import { AdminAnalyticsSearchQueriesPage } from "@/widgets/admin-analytics-search-queries-page";
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
		title: dict.admin.analyticsSearchQueries.meta.title,
		description: dict.admin.analyticsSearchQueries.meta.description,
		lang,
		pathSuffix: "/analytics/search-queries",
	});
};

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	return (
		<AdminAnalyticsSearchQueriesPage
			lang={lang}
			dict={dict.admin.analyticsSearchQueries}
			tabsDict={dict.admin.analytics.tabs}
			toolbarDict={dict.admin.analytics.toolbar}
			realtimeDict={dict.admin.analytics.realtime}
			commonDict={dict.admin.common}
		/>
	);
}
