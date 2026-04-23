"use client";

import {
	useResetPipelineStatus,
	useUnifiedLog,
} from "@/features/admin-pipeline-reset";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatNumber, formatSizeMb } from "../lib";
import { ConfirmInput } from "./confirm-input";
import { type ImpactItem, ImpactGrid } from "./impact-grid";

interface DangerPanelProps {
	dict: Dictionary["admin"]["pipelineReset"];
	phrase: string;
	onPhraseChange: (next: string) => void;
	canSubmit: boolean;
	isPending: boolean;
	disabled: boolean;
	onSubmit: () => void;
}

export const DangerPanel: FC<DangerPanelProps> = ({
	dict,
	phrase,
	onPhraseChange,
	canSubmit,
	isPending,
	disabled,
	onSubmit,
}) => {
	const statusQuery = useResetPipelineStatus();
	const unifiedLogQuery = useUnifiedLog();

	const status = statusQuery.data;
	const unifiedLog = unifiedLogQuery.data;

	const unifiedDetail = dict.impact.destroy.unified.detail
		.replace(
			"{path}",
			status?.unified.file ?? "dictionaries/unified.json",
		)
		.replace("{size}", formatSizeMb(status?.unified.fileSizeMb ?? null));

	const snapshotsDetail = dict.impact.destroy.snapshots.detail.replace(
		"{count}",
		formatNumber(unifiedLog?.totalSteps ?? 0),
	);

	const items: ImpactItem[] = [
		{
			kind: "destroy",
			icon: "🗑",
			title: dict.impact.destroy.unified.title,
			description: dict.impact.destroy.unified.description,
			detail: unifiedDetail,
		},
		{
			kind: "destroy",
			icon: "🗑",
			title: dict.impact.destroy.snapshots.title,
			description: dict.impact.destroy.snapshots.description,
			detail: snapshotsDetail,
		},
		{
			kind: "destroy",
			icon: "🗑",
			title: dict.impact.destroy.log.title,
			description: dict.impact.destroy.log.description,
			detail: dict.impact.destroy.log.detail,
		},
		{
			kind: "keep",
			icon: "✓",
			title: dict.impact.keep.parsed.title,
			description: dict.impact.keep.parsed.description,
			detail: dict.impact.keep.parsed.detail,
		},
		{
			kind: "keep",
			icon: "✓",
			title: dict.impact.keep.db.title,
			description: dict.impact.keep.db.description,
			detail: dict.impact.keep.db.detail.replace(
				"{count}",
				formatNumber(status?.database.entries ?? 0),
			),
		},
		{
			kind: "keep",
			icon: "✓",
			title: dict.impact.keep.sources.title,
			description: dict.impact.keep.sources.description,
			detail: dict.impact.keep.sources.detail,
		},
	];

	return (
		<section
			className={cn(
				"border-2 border-[var(--danger)] rounded-2xl overflow-hidden mb-8",
				disabled && "opacity-40 pointer-events-none",
			)}
			aria-disabled={disabled}
		>
			<header className="bg-[var(--danger-dim)] p-6 text-center">
				<div
					className="w-20 h-20 rounded-full border-2 border-[var(--danger)] bg-[var(--danger-dim)] text-[var(--danger)] text-3xl flex items-center justify-center mx-auto mb-4"
					aria-hidden
				>
					💥
				</div>
				<h2 className="text-xl font-extrabold text-[var(--danger)] mb-2">
					{dict.dangerPanel.title}
				</h2>
				<p className="text-sm text-[var(--text-secondary)] max-w-[480px] mx-auto">
					{dict.dangerPanel.subtitle}
				</p>
			</header>

			<div className="p-6">
				<ImpactGrid items={items} />
			</div>

			<div className="px-6 pb-6">
				<ConfirmInput
					value={phrase}
					onChange={onPhraseChange}
					expectedPhrase={dict.confirm.phrase}
					placeholder={dict.confirm.placeholder}
					label={dict.confirm.label}
					cta={dict.confirm.cta}
					endpoint={dict.confirm.endpoint}
					disabled={!canSubmit}
					isPending={isPending}
					onSubmit={onSubmit}
				/>
			</div>
		</section>
	);
};
