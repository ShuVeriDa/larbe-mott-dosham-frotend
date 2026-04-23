"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { PageHeader } from "@/shared/ui/admin";
import type { FC } from "react";
import { usePipelineActions } from "../model/use-pipeline-actions";
import { AdminPipelineJsonLd } from "./admin-pipeline-json-ld";
import { PipelineActionsGrid } from "./pipeline-actions-grid";
import { PipelineConfirmModal } from "./pipeline-confirm-modal";
import { PipelineDictTable } from "./pipeline-dict-table";
import { PipelineLogTimeline } from "./pipeline-log-timeline";
import { PipelineNextRec } from "./pipeline-next-rec";
import { PipelineStatsGrid } from "./pipeline-stats-grid";
import { PipelineStatusBanner } from "./pipeline-status-banner";

interface AdminPipelinePageProps {
	lang: Locale;
	dict: Dictionary["admin"]["pipeline"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminPipelinePage: FC<AdminPipelinePageProps> = ({
	lang,
	dict,
	commonDict,
}) => {
	const actions = usePipelineActions({ dict });

	const onRunRecommended = (slug: string) => {
		switch (slug) {
			case "load":
				actions.confirmLoad(0);
				return;
			case "improve":
				actions.confirmImprove();
				return;
			case "parse":
				void actions.runParse(null);
				return;
			default:
				void actions.runUnify(slug);
		}
	};

	return (
		<main className="max-w-[1280px] mx-auto">
			<AdminPipelineJsonLd lang={lang} dict={dict} />

			<PageHeader title={dict.header.title} subtitle={dict.header.subtitle} />

			<PipelineStatusBanner dict={dict} commonDict={commonDict} />

			<PipelineStatsGrid dict={dict} />

			<PipelineNextRec
				dict={dict}
				disabled={actions.isRunning}
				onRun={onRunRecommended}
			/>

			<PipelineActionsGrid dict={dict} actions={actions} />

			<PipelineDictTable dict={dict} commonDict={commonDict} actions={actions} />

			<PipelineLogTimeline dict={dict} commonDict={commonDict} />

			<PipelineConfirmModal
				open={actions.pendingConfirm !== null}
				title={actions.pendingConfirm?.title ?? ""}
				text={actions.pendingConfirm?.text ?? ""}
				confirmLabel={actions.pendingConfirm?.confirm ?? ""}
				cancelLabel={actions.pendingConfirm?.cancel ?? ""}
				tone={actions.pendingConfirm?.tone ?? "warning"}
				isPending={actions.isRunning}
				onConfirm={() => {
					void actions.proceed();
				}}
				onCancel={actions.cancel}
			/>
		</main>
	);
};
