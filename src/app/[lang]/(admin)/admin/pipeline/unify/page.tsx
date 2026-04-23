import { getDictionary, hasLocale, LOCALES } from "@/i18n/dictionaries";
import { buildAdminMetadata } from "@/shared/lib/admin-metadata";
import { AdminPipelineUnifyPage } from "@/widgets/admin-pipeline-unify-page";
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
		title: dict.admin.pipelineUnify.meta.title,
		description: dict.admin.pipelineUnify.meta.description,
		lang,
		pathSuffix: "/pipeline/unify",
	});
};

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	return (
		<AdminPipelineUnifyPage
			lang={lang}
			dict={dict.admin.pipelineUnify}
			pipelineDict={dict.admin.pipeline}
			commonDict={dict.admin.common}
		/>
	);
}
