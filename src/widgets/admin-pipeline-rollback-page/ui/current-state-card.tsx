"use client";

import type {
	MergeLogEntry,
	PipelineFullStatus,
} from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { formatDateTime, formatMb, formatNumber, interpolate } from "../lib/format";

interface Props {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineRollback"]["currentState"];
	status: PipelineFullStatus | undefined;
	lastStep: MergeLogEntry | null;
	isLoading: boolean;
}

export const CurrentStateCard: FC<Props> = ({
	lang,
	dict,
	status,
	lastStep,
	isLoading,
}) => {
	if (isLoading) {
		return (
			<div className="h-[92px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] animate-pulse mb-8" />
		);
	}

	const entries = status?.unified.entries ?? 0;
	const hasUnified = !!status?.unified.file && entries > 0;

	const valueText = hasUnified && lastStep
		? interpolate(dict.value, {
				step: lastStep.step,
				label: lastStep.title || lastStep.slug,
				count: formatNumber(entries, lang),
			})
		: dict.empty;

	const metaText =
		hasUnified &&
		interpolate(dict.meta, {
			size: formatMb(status?.unified.fileSizeMb, lang),
			date: formatDateTime(status?.unified.updatedAt, lang),
		});

	return (
		<section
			className="flex items-center gap-4 p-5 bg-[var(--accent-dim)] border border-[var(--border-accent)] rounded-2xl mb-8 flex-wrap"
			aria-label={dict.label}
		>
			<div
				className="w-12 h-12 rounded-xl bg-[var(--accent-dim)] text-[var(--accent)] flex items-center justify-center text-2xl shrink-0"
				aria-hidden
			>
				📦
			</div>
			<div className="flex-1 min-w-0">
				<div className="text-xs text-[var(--text-muted)] font-medium">
					{dict.label}
				</div>
				<div className="text-md font-bold text-[var(--accent)] truncate">
					{valueText}
				</div>
				{metaText ? (
					<div className="text-xs text-[var(--text-muted)] mt-0.5">
						{metaText}
					</div>
				) : null}
			</div>
		</section>
	);
};
