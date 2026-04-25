"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Breadcrumb, PageHeader } from "@/shared/ui/admin";
import type { FC } from "react";
import { useParsePage } from "../model/use-parse-page";
import { ParseActionBar } from "./parse-action-bar";
import { ParseConfirmModal } from "./parse-confirm-modal";
import { ParseDictTable } from "./parse-dict-table";
import { ParseJsonLd } from "./parse-json-ld";
import { ParseLogPanel } from "./parse-log-panel";
import { ParseOutputFiles } from "./parse-output-files";
import { ParseProgress } from "./parse-progress";
import { ParseResultInline } from "./parse-result-inline";
import { ParseStatsGrid } from "./parse-stats-grid";
import { ParseStatusBanner } from "./parse-status-banner";

interface AdminPipelineParsePageProps {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineParse"];
	pipelineDict: Dictionary["admin"]["pipeline"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminPipelineParsePage: FC<AdminPipelineParsePageProps> = ({
	lang,
	dict,
	pipelineDict,
	commonDict,
}) => {
	const page = useParsePage({ dict });

	const runFromBar = () => {
		page.openConfirm(page.selectedSlug || null);
	};
	const runFromRow = (slug: string) => {
		page.openConfirm(slug);
	};

	return (
		<main className="max-w-[1280px] mx-auto">
			<ParseJsonLd lang={lang} dict={dict} />

			<Breadcrumb
				items={[
					{
						label: dict.header.breadcrumb.pipeline,
						href: `/${lang}/admin/pipeline`,
					},
					{ label: dict.header.breadcrumb.current },
				]}
			/>

			<PageHeader title={dict.header.title} subtitle={dict.header.subtitle} />

			<ParseStatusBanner
				pipelineDict={pipelineDict}
				commonDict={commonDict}
			/>

			<ParseStatsGrid
				dict={dict.stats}
				total={page.stats.total}
				parsed={page.stats.parsed}
				pendingSlugs={page.stats.pending}
				loading={page.statusQuery.isLoading}
			/>

			<ParseActionBar
				dict={dict.actionBar}
				dictionaries={page.dictionaries}
				selectedSlug={page.selectedSlug}
				onSelect={page.setSelectedSlug}
				onRun={runFromBar}
				disabled={page.isRunning}
			/>

			<ParseProgress
				dict={dict.progress}
				slug={page.runningSlug}
				active={page.isRunning}
			/>

			<ParseResultInline dict={dict.result} result={page.result} />

			<ParseDictTable
				dict={dict.dictionaries}
				commonDict={commonDict}
				dictionaries={page.dictionaries}
				isLoading={page.statusQuery.isLoading}
				isError={page.statusQuery.isError}
				onRetry={() => page.statusQuery.refetch()}
				onRefresh={() => page.statusQuery.refetch()}
				onRun={runFromRow}
				runningSlug={page.runningSlug}
				disabled={page.isRunning}
			/>

			<ParseOutputFiles
				dict={dict.output}
				statusDict={pipelineDict.status}
				commonDict={commonDict}
				files={page.parsedFilesQuery.data}
				isLoading={page.parsedFilesQuery.isLoading}
				isError={page.parsedFilesQuery.isError}
				onRetry={() => page.parsedFilesQuery.refetch()}
			/>

			<ParseLogPanel dict={dict.log} toastsDict={dict.toasts} />

			<ParseConfirmModal
				dict={dict.confirm}
				open={page.pending !== null}
				text={page.pending?.text ?? ""}
				isPending={page.isRunning}
				onConfirm={() => {
					void page.proceed();
				}}
				onCancel={page.closeConfirm}
			/>
		</main>
	);
};
