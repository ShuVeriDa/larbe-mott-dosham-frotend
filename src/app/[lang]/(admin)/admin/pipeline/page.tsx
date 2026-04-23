import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import { buildAdminMetadata } from "@/shared/lib/admin-metadata";
import { AdminPipelinePage } from "@/widgets/admin-pipeline-page";
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
		title: dict.admin.pipeline.meta.title,
		description: dict.admin.pipeline.meta.description,
		lang,
		pathSuffix: "/pipeline",
	});
};

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	return (
		<AdminPipelinePage
			lang={lang}
			dict={dict.admin.pipeline}
			commonDict={dict.admin.common}
		/>
	);
}
