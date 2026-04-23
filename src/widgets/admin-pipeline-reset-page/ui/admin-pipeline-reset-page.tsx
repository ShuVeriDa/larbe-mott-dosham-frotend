"use client";

import { useResetPipelineStatus } from "@/features/admin-pipeline-reset";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Breadcrumb, PageHeader } from "@/shared/ui/admin";
import type { FC } from "react";
import { useResetFlow } from "../model/use-reset-flow";
import { AdminPipelineResetJsonLd } from "./admin-pipeline-reset-json-ld";
import { AlternativeCard } from "./alternative-card";
import { DangerPanel } from "./danger-panel";
import { FinalConfirmModal } from "./final-confirm-modal";
import { PipelineBusyBanner } from "./pipeline-busy-banner";
import { ResetLogPanel } from "./reset-log-panel";
import { ResetResultBanner } from "./reset-result-banner";
import { StateCards } from "./state-cards";

interface AdminPipelineResetPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineReset"];
	pipelineDict: Dictionary["admin"]["pipeline"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminPipelineResetPage: FC<AdminPipelineResetPageProps> = ({
	lang,
	dict,
	pipelineDict,
}) => {
	const flow = useResetFlow({ dict, expectedPhrase: dict.confirm.phrase });

	const statusQuery = useResetPipelineStatus();
	const isRunning = statusQuery.data?.isRunning === true;
	const alreadyReset = flow.result !== null;

	return (
		<article className="max-w-[1100px] mx-auto">
			<AdminPipelineResetJsonLd lang={lang} dict={dict} />

			<Breadcrumb
				items={[
					{
						label: pipelineDict.header.title,
						href: `/${lang}/admin/pipeline`,
					},
					{ label: dict.header.title },
				]}
			/>

			<PageHeader title={dict.header.title} subtitle={dict.header.subtitle} />

			<PipelineBusyBanner dict={dict.busy} />

			<AlternativeCard lang={lang} dict={dict.alternative} />

			<section aria-label={dict.whatDeleted}>
				<h2 className="text-lg font-semibold text-[var(--text)] mb-4">
					{dict.whatDeleted}
				</h2>

				<StateCards
					dict={dict.stateCards}
					resetDict={dict.resetDone}
					reset={alreadyReset}
				/>
			</section>

			<ResetResultBanner
				result={flow.result}
				errorMessage={flow.errorMessage}
				dict={dict.result}
			/>

			{!alreadyReset ? (
				<DangerPanel
					dict={dict}
					phrase={flow.phrase}
					onPhraseChange={flow.setPhrase}
					canSubmit={flow.canSubmit}
					isPending={flow.isPending}
					disabled={isRunning}
					onSubmit={flow.openModal}
				/>
			) : null}

			<ResetLogPanel dict={dict.log} toastsDict={dict.toasts} />

			<FinalConfirmModal
				open={flow.modalOpen}
				onOpenChange={(next) => (next ? flow.openModal() : flow.closeModal())}
				dict={dict.finalModal}
				onConfirm={flow.execute}
				isPending={flow.isPending}
			/>
		</article>
	);
};
