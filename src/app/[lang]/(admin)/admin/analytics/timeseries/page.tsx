import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import { buildAdminMetadata } from "@/shared/lib/admin-metadata";
import { AdminAnalyticsTimeseriesPage } from "@/widgets/admin-analytics-timeseries-page";
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
		title: dict.admin.analytics.timeseries.meta.title,
		description: dict.admin.analytics.timeseries.meta.description,
		lang,
		pathSuffix: "/analytics/timeseries",
	});
};

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	return (
		<AdminAnalyticsTimeseriesPage
			lang={lang}
			dict={dict.admin.analytics}
			commonDict={dict.admin.common}
		/>
	);
}
