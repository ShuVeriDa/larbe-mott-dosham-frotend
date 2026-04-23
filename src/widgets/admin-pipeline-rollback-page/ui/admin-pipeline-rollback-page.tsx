"use client";

import {
	usePipelineFullStatus,
	useUnifiedLog,
} from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	AdminErrorState,
	AdminTableSkeleton,
	Breadcrumb,
	PageHeader,
} from "@/shared/ui/admin";
import type { FC } from "react";
import { formatNumber, interpolate } from "../lib/format";
import { useRollbackPage } from "../model/use-rollback-page";
import { ConfirmModal } from "./confirm-modal";
import { CurrentStateCard } from "./current-state-card";
import { DangerZoneReset } from "./danger-zone-reset";
import { RollbackActionPanel } from "./rollback-action-panel";
import { RollbackLog } from "./rollback-log";
import { SnapshotTimeline } from "./snapshot-timeline";
import { WarningBanner } from "./warning-banner";

interface Props {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineRollback"];
	pipelineDict: Dictionary["admin"]["pipeline"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminPipelineRollbackPage: FC<Props> = ({
	lang,
	dict,
	pipelineDict,
	commonDict,
}) => {
	const statusQuery = usePipelineFullStatus();
	const unifiedLogQuery = useUnifiedLog();

	const steps = unifiedLogQuery.data?.steps ?? [];
	const orderedSteps = [...steps].sort((a, b) => b.step - a.step);
	const lastStep = steps.length ? steps[steps.length - 1] : null;
	const currentStep = lastStep?.step ?? null;

	const isBusy = statusQuery.data?.isRunning === true;

	const {
		selectedStep,
		selectedEntry,
		confirm,
		result,
		isRollingBack,
		isResetting,
		selectStep,
		requestRollbackConfirm,
		requestResetConfirm,
		closeConfirm,
		executeRollback,
		executeReset,
		dismissResult,
	} = useRollbackPage({ steps });

	const busy = isBusy || isRollingBack || isResetting;

	return (
		<article className="max-w-[1100px] mx-auto">
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

			<CurrentStateCard
				lang={lang}
				dict={dict.currentState}
				status={statusQuery.data}
				lastStep={lastStep}
				isLoading={statusQuery.isLoading || unifiedLogQuery.isLoading}
			/>

			<WarningBanner message={dict.warning} />

			{isBusy ? (
				<div className="mb-6 px-5 py-3 rounded-2xl bg-[var(--info-dim)] border border-[var(--info)] text-sm text-[var(--info)]">
					{dict.busy}
				</div>
			) : null}

			<RollbackActionPanel
				lang={lang}
				dict={dict.action}
				selected={selectedEntry}
				status={statusQuery.data}
				lastStep={lastStep}
				disabled={busy}
				isLoading={isRollingBack}
				onRun={requestRollbackConfirm}
			/>

			{result ? (
				<div
					role="status"
					className={cn(
						"px-5 py-4 rounded-2xl text-sm leading-relaxed mb-6 flex justify-between items-start gap-3",
						result.kind === "rollback" &&
							"bg-[var(--warning-dim)] text-[var(--warning)] border border-[var(--warning)]",
						result.kind === "reset" &&
							"bg-[var(--danger-dim)] text-[var(--danger)] border border-[var(--danger)]",
						result.kind === "error" &&
							"bg-[var(--danger-dim)] text-[var(--danger)] border border-[var(--danger)]",
					)}
				>
					<span className="flex-1">
						{result.kind === "rollback"
							? result.payload.rolledBackTo === 0
								? dict.result.rollbackToZero
								: interpolate(dict.result.rollbackOk, {
										step: result.payload.rolledBackTo,
										label: result.label,
										count: formatNumber(result.payload.currentEntries, lang),
									})
							: result.kind === "reset"
								? dict.result.resetOk
								: interpolate(dict.result.error, {
										message: result.message,
									})}
					</span>
					<button
						type="button"
						onClick={dismissResult}
						className="text-xs opacity-70 hover:opacity-100"
						aria-label="×"
					>
						✕
					</button>
				</div>
			) : null}

			{unifiedLogQuery.isLoading ? (
				<AdminTableSkeleton rows={4} className="mb-8" />
			) : unifiedLogQuery.isError ? (
				<AdminErrorState
					className="mb-8"
					title={commonDict.error}
					retryLabel={commonDict.retry}
					onRetry={() => unifiedLogQuery.refetch()}
				/>
			) : (
				<SnapshotTimeline
					lang={lang}
					dict={dict.timeline}
					steps={orderedSteps}
					currentStep={currentStep}
					selectedStep={selectedStep}
					disabled={busy}
					onSelect={selectStep}
				/>
			)}

			<DangerZoneReset
				dict={dict.danger}
				disabled={busy}
				isLoading={isResetting}
				onReset={requestResetConfirm}
			/>

			<RollbackLog
				lang={lang}
				dict={dict.operationLog}
				levelsDict={pipelineDict.log.levels}
			/>

			<ConfirmModal
				open={confirm?.kind === "rollback"}
				title={
					confirm?.kind === "rollback"
						? interpolate(dict.confirmRollback.title, { step: confirm.step })
						: ""
				}
				text={
					confirm?.kind === "rollback"
						? interpolate(dict.confirmRollback.text, {
								label: confirm.entry.title || confirm.entry.slug,
								count: formatNumber(confirm.entry.totalUnifiedEntries, lang),
							})
						: ""
				}
				confirmLabel={dict.confirmRollback.confirm}
				cancelLabel={dict.confirmRollback.cancel}
				tone="warning"
				isPending={isRollingBack}
				onConfirm={() =>
					confirm?.kind === "rollback" && executeRollback(confirm.entry)
				}
				onCancel={closeConfirm}
			/>

			<ConfirmModal
				open={confirm?.kind === "reset"}
				title={dict.confirmReset.title}
				text={dict.confirmReset.text}
				confirmLabel={dict.confirmReset.confirm}
				cancelLabel={dict.confirmReset.cancel}
				tone="danger"
				isPending={isResetting}
				onConfirm={executeReset}
				onCancel={closeConfirm}
			/>
		</article>
	);
};
