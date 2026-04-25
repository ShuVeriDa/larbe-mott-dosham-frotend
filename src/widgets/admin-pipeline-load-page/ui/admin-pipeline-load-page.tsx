"use client";

import { usePipelineFullStatus } from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Breadcrumb, PageHeader } from "@/shared/ui/admin";
import type { FC } from "react";
import { useLoadActions } from "../model";
import { LoadActionCard } from "./load-action-card";
import { LoadConfirmModal } from "./load-confirm-modal";
import { LoadDbInfo } from "./load-db-info";
import { LoadHistoryTable } from "./load-history-table";
import { LoadJsonLd } from "./load-json-ld";
import { LoadLogPanel } from "./load-log-panel";
import { LoadProgress } from "./load-progress";
import { LoadResultInline } from "./load-result-inline";
import { LoadSkippedSample } from "./load-skipped-sample";
import { LoadStatCards } from "./load-stat-cards";
import { LoadStatusBanner } from "./load-status-banner";

interface Props {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineLoad"];
	pipelineDict: Dictionary["admin"]["pipeline"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminPipelineLoadPage: FC<Props> = ({ lang, dict, pipelineDict }) => {
	const statusQuery = usePipelineFullStatus();
	const totalInUnified = statusQuery.data?.unified.entries ?? null;

	const actions = useLoadActions({ dict, totalInUnified });

	return (
		<main className="max-w-[1100px] mx-auto">
			<LoadJsonLd lang={lang} dict={dict} />

			<Breadcrumb
				items={[
					{
						label: pipelineDict.header.title,
						href: `/${lang}/admin/pipeline`,
					},
					{ label: dict.breadcrumb.current },
				]}
			/>

			<PageHeader title={dict.header.title} subtitle={dict.header.subtitle} />

			<LoadStatusBanner
				dict={dict.status}
				isLoadRunning={actions.isRunning}
				lastError={actions.lastError}
			/>

			<LoadStatCards dict={dict} lang={lang} lastResult={actions.lastResult} />

			<LoadActionCard
				dict={dict}
				lang={lang}
				disabled={actions.isRunning}
				onRun={actions.askLoad}
			/>

			<LoadProgress
				dict={dict.progress}
				active={actions.isRunning}
				progress={actions.progress}
				stepIndex={actions.stepIndex}
			/>

			<LoadResultInline
				dict={dict}
				lang={lang}
				result={actions.lastResult}
				error={actions.lastError}
			/>

			<LoadDbInfo dict={dict} lang={lang} />

			<LoadSkippedSample dict={dict} lang={lang} result={actions.lastResult} />

			<LoadHistoryTable dict={dict} lang={lang} />

			<LoadLogPanel dict={dict.log} lang={lang} />

			<LoadConfirmModal
				open={actions.confirmOpen}
				title={dict.confirm.title}
				body={actions.confirmBody}
				confirmLabel={dict.confirm.confirm}
				cancelLabel={dict.confirm.cancel}
				onConfirm={() => {
					void actions.proceed();
				}}
				onCancel={actions.cancel}
			/>
		</main>
	);
};
