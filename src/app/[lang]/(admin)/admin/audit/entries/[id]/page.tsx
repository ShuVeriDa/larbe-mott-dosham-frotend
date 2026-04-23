import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import { buildAdminMetadata } from "@/shared/lib/admin-metadata";
import { AdminAuditEntryPage } from "@/widgets/admin-audit-entry-page";
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
		title: dict.admin.auditEntry.meta.title,
		description: dict.admin.auditEntry.meta.description,
		lang,
		pathSuffix: `/audit/entries/${id}`,
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
		<AdminAuditEntryPage
			id={id}
			lang={lang}
			dict={dict.admin.auditEntry}
			auditDict={dict.admin.audit}
			commonDict={dict.admin.common}
		/>
	);
}
