"use client";

import type { PipelineRunResult } from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatNumber } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineLoad"];
	lang: Locale;
	result: PipelineRunResult | null;
	error: string | null;
}

export const LoadResultInline: FC<Props> = ({ dict, lang, result, error }) => {
	if (!result && !error) return null;

	if (error) {
		return (
			<div
				className={cn(
					"px-5 py-4 rounded-2xl text-sm leading-relaxed mb-6",
					"bg-[var(--danger-dim)] text-[var(--danger)] border border-[var(--danger)]/20",
				)}
				role="alert"
			>
				<div className="font-semibold text-sm mb-1">{dict.result.titleErr}</div>
				<div className="break-words">{error}</div>
			</div>
		);
	}

	if (!result) return null;

	const items: Array<{ value: string; label: string }> = [
		{
			value: formatNumber(result.loaded ?? 0, lang),
			label: dict.result.loaded,
		},
		{
			value: formatNumber(result.skipped ?? 0, lang),
			label: dict.result.skipped,
		},
		{
			value: formatNumber(result.totalInFile ?? null, lang),
			label: dict.result.totalInFile,
		},
		{
			value: `${(result.elapsedSeconds ?? 0).toFixed(1)} ${dict.units.sec}`,
			label: dict.result.elapsed,
		},
	];

	return (
		<div
			className={cn(
				"px-5 py-4 rounded-2xl text-sm leading-relaxed mb-6",
				"bg-[var(--success-dim)] text-[var(--success)] border border-[var(--success)]/20",
			)}
		>
			<div className="font-semibold text-sm mb-2">{dict.result.titleOk}</div>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
				{items.map((item) => (
					<div key={item.label} className="text-center">
						<div className="text-xl font-bold tabular-nums">{item.value}</div>
						<div className="text-xs opacity-80">{item.label}</div>
					</div>
				))}
			</div>
		</div>
	);
};
