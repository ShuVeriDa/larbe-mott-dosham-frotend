import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import { buildAdminMetadata } from "@/shared/lib/admin-metadata";
import { AdminEntryEditPage } from "@/widgets/admin-entry-edit-page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{ lang: string; id: string }>;
};

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { lang, id } = await params;
	if (!hasLocale(lang)) return {};
	const dict = await getDictionary(lang);
	return buildAdminMetadata({
		title: dict.admin.entryEdit.meta.title,
		description: dict.admin.entryEdit.meta.description,
		lang,
		pathSuffix: `/entries/${id}/edit`,
	});
};

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

export const dynamicParams = true;

export default async function Page({ params }: PageProps) {
	const { lang, id } = await params;
	if (!hasLocale(lang)) notFound();
	if (!id) notFound();
	const dict = await getDictionary(lang);
	return (
		<AdminEntryEditPage
			id={id}
			lang={lang}
			dict={dict.admin.entryEdit}
			entriesDict={dict.admin.entries}
			commonDict={dict.admin.common}
		/>
	);
}
