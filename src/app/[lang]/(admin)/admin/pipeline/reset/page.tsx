import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import { buildAdminMetadata } from "@/shared/lib/admin-metadata";
import { AdminPipelineResetPage } from "@/widgets/admin-pipeline-reset-page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ lang: string }> };

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};
	const dict = await getDictionary(lang);
	return buildAdminMetadata({
		title: dict.admin.pipelineReset.meta.title,
		description: dict.admin.pipelineReset.meta.description,
		lang,
		pathSuffix: "/pipeline/reset",
	});
};

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	return (
		<AdminPipelineResetPage
			lang={lang}
			dict={dict.admin.pipelineReset}
			pipelineDict={dict.admin.pipeline}
			commonDict={dict.admin.common}
		/>
	);
}
