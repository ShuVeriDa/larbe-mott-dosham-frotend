import { LOCALES, getDictionary, hasLocale } from "@/i18n/dictionaries";
import { buildAdminMetadata } from "@/shared/lib/admin-metadata";
import { AdminAnalyticsDevicesPage } from "@/widgets/admin-analytics-devices-page";
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
		title: dict.admin.analyticsDevices.meta.title,
		description: dict.admin.analyticsDevices.meta.description,
		lang,
		pathSuffix: "/analytics/devices",
	});
};

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	return (
		<AdminAnalyticsDevicesPage
			lang={lang}
			analyticsDict={dict.admin.analytics}
			dict={dict.admin.analyticsDevices}
		/>
	);
}
