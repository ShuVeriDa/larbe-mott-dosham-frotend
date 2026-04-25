"use client";

import { useQualityStats } from "@/features/admin-quality";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Breadcrumb, PageHeader } from "@/shared/ui/admin";
import {
	PipelineStatusBanner,
} from "@/widgets/admin-pipeline-page";
import { PipelineConfirmModal } from "@/widgets/admin-pipeline-page/ui/pipeline-confirm-modal";
import type { FC } from "react";
import { useImproveRunner } from "../model/use-improve-runner";
import { ImproveAffectedEntries } from "./improve-affected-entries";
import { ImproveHistoryGrid } from "./improve-history-grid";
import { ImproveLogPanel } from "./improve-log-panel";
import { ImproveOpsGrid } from "./improve-ops-grid";
import { ImproveQualityPanel } from "./improve-quality-panel";
import { ImproveRunAction } from "./improve-run-action";
import { ImproveStatsGrid } from "./improve-stats-grid";

interface Props {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineImprove"];
	pipelineDict: Dictionary["admin"]["pipeline"];
	commonDict: Dictionary["admin"]["common"];
}

const nf = new Intl.NumberFormat("ru-RU");

export const AdminPipelineImprovePage: FC<Props> = ({
	lang,
	dict,
	pipelineDict,
	commonDict,
}) => {
	const qualityStats = useQualityStats();
	const total = qualityStats.data?.total;

	const runner = useImproveRunner({ dict, totalEntries: total });

	return (
		<article className="max-w-[1100px] mx-auto">
			<Breadcrumb
				items={[
					{
						label: dict.breadcrumb.pipeline,
						href: `/${lang}/admin/pipeline`,
					},
					{ label: dict.breadcrumb.current },
				]}
			/>
			<PageHeader title={dict.header.title} subtitle={dict.header.subtitle} />

			<PipelineStatusBanner dict={pipelineDict} commonDict={commonDict} />

			<ImproveStatsGrid
				dict={dict.stats}
				lastResult={runner.result}
				total={total}
				loading={qualityStats.isLoading && total === undefined}
			/>

			<ImproveQualityPanel dict={dict.quality} lang={lang} />

			<ImproveRunAction dict={dict} runner={runner} />

			<ImproveOpsGrid dict={dict.operations} result={runner.result} />

			<ImproveAffectedEntries
				dict={dict.affected}
				entries={runner.result?.affectedEntries ?? []}
			/>

			<ImproveHistoryGrid dict={dict.history} lang={lang} />

			<ImproveLogPanel
				dict={dict.log}
				toastLogCleared={dict.toasts.logCleared}
				levelsDict={pipelineDict.log.levels}
			/>

			<PipelineConfirmModal
				open={runner.phase === "confirm"}
				title={dict.confirm.title}
				text={dict.confirm.text.replace(
					"{count}",
					total !== undefined ? nf.format(total) : "—",
				)}
				confirmLabel={dict.confirm.confirm}
				cancelLabel={dict.confirm.cancel}
				tone="warning"
				isPending={runner.isPending}
				onConfirm={runner.confirmRun}
				onCancel={runner.cancelConfirm}
			/>
		</article>
	);
};
