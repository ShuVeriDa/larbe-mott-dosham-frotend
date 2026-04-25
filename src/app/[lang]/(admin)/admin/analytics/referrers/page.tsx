import { LOCALES, getDictionary, hasLocale } from "@/i18n/dictionaries";
import { buildAdminMetadata } from "@/shared/lib/admin-metadata";
import { AdminAnalyticsReferrersPage } from "@/widgets/admin-analytics-referrers-page";
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
		title: dict.admin.analytics.referrers.meta.title,
		description: dict.admin.analytics.referrers.meta.description,
		lang,
		pathSuffix: "/analytics/referrers",
	});
};

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	return (
		<AdminAnalyticsReferrersPage
			lang={lang}
			analyticsDict={dict.admin.analytics}
			dict={dict.admin.analytics.referrers}
			commonDict={dict.admin.common}
		/>
	);
}
