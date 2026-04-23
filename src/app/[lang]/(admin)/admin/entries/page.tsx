import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import { buildAdminMetadata } from "@/shared/lib/admin-metadata";
import { AdminEntriesPage } from "@/widgets/admin-entries-page";
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
		title: dict.admin.entries.meta.title,
		description: dict.admin.entries.meta.description,
		lang,
		pathSuffix: "/entries",
	});
};

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	return (
		<AdminEntriesPage
			lang={lang}
			dict={dict.admin.entries}
			commonDict={dict.admin.common}
		/>
	);
}
