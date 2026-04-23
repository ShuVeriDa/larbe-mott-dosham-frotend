"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Breadcrumb, PageHeader } from "@/shared/ui/admin";
import type { FC } from "react";
import { useUnifyActions } from "../model";
import { UnifiedFileInfo } from "./unified-file-info";
import { UnifyActionBar } from "./unify-action-bar";
import { UnifyConfirmModal } from "./unify-confirm-modal";
import { UnifyDedupInfo } from "./unify-dedup-info";
import { UnifyDictTable } from "./unify-dict-table";
import { UnifyNextRec } from "./unify-next-rec";
import { UnifyProgress } from "./unify-progress";
import { UnifyResultInline } from "./unify-result-inline";
import { UnifySnapshotsTable } from "./unify-snapshots-table";
import { UnifyStatCards } from "./unify-stat-cards";
import { UnifyStatusBanner } from "./unify-status-banner";
import { UnifyTimeline } from "./unify-timeline";

interface Props {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineUnify"];
	pipelineDict: Dictionary["admin"]["pipeline"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminPipelineUnifyPage: FC<Props> = ({
	lang,
	dict,
	pipelineDict,
	commonDict,
}) => {
	const actions = useUnifyActions({ dict });

	return (
		<main className="max-w-[1200px] mx-auto">
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

			<UnifyStatusBanner dict={dict} />

			<UnifyStatCards dict={dict} lang={lang} />

			<UnifyNextRec
				dict={dict}
				onRun={actions.askUnify}
				disabled={actions.busy}
			/>

			<UnifyActionBar
				dict={dict}
				onRun={actions.askUnify}
				disabled={actions.busy}
			/>

			<UnifyProgress
				dict={dict}
				active={actions.runningSlug !== null}
				slug={actions.runningSlug}
			/>

			<UnifyResultInline
				dict={dict}
				lang={lang}
				result={actions.lastResult}
				error={actions.lastError}
			/>

			<UnifyDedupInfo dict={dict} />

			<UnifiedFileInfo dict={dict} lang={lang} />

			<UnifyDictTable
				dict={dict}
				commonDict={commonDict}
				lang={lang}
				runningSlug={actions.runningSlug}
				onRun={actions.askUnify}
			/>

			<UnifySnapshotsTable
				dict={dict}
				lang={lang}
				onRollback={actions.askRollback}
				disabled={actions.busy}
			/>

			<UnifyTimeline dict={dict} lang={lang} />

			<UnifyConfirmModal
				open={actions.confirmOpen}
				title={actions.confirmLabels?.title ?? ""}
				body={actions.confirmLabels?.body ?? ""}
				confirmLabel={actions.confirmLabels?.confirm ?? ""}
				cancelLabel={actions.confirmLabels?.cancel ?? ""}
				tone={actions.confirmLabels?.tone ?? "primary"}
				onConfirm={() => {
					void actions.proceed();
				}}
				onCancel={actions.cancel}
			/>
		</main>
	);
};
