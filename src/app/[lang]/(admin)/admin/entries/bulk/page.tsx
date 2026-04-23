import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import { buildAdminMetadata } from "@/shared/lib/admin-metadata";
import { AdminEntriesBulkPage } from "@/widgets/admin-entries-bulk-page";
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
		title: dict.admin.entriesBulk.meta.title,
		description: dict.admin.entriesBulk.meta.description,
		lang,
		pathSuffix: "/entries/bulk",
	});
};

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	return (
		<AdminEntriesBulkPage
			lang={lang}
			dict={dict.admin.entriesBulk}
			entriesDict={dict.admin.entries}
			commonDict={dict.admin.common}
		/>
	);
}
