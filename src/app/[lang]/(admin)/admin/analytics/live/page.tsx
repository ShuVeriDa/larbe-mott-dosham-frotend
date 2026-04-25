import { LOCALES, getDictionary, hasLocale } from "@/i18n/dictionaries";
import { buildAdminMetadata } from "@/shared/lib/admin-metadata";
import { AdminAnalyticsLivePage } from "@/widgets/admin-analytics-live-page";
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
		title: dict.admin.analyticsLive.meta.title,
		description: dict.admin.analyticsLive.meta.description,
		lang,
		pathSuffix: "/analytics/live",
	});
};

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	return (
		<AdminAnalyticsLivePage
			lang={lang}
			dict={dict.admin.analyticsLive}
			tabsDict={dict.admin.analytics.tabs}
		/>
	);
}
