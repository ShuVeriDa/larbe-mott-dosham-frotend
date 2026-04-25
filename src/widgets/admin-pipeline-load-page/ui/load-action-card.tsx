"use client";

import { usePipelineFullStatus } from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { formatNumber } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineLoad"];
	lang: Locale;
	disabled: boolean;
	onRun: () => void;
}

export const LoadActionCard: FC<Props> = ({ dict, lang, disabled, onRun }) => {
	const statusQuery = usePipelineFullStatus();
	const total = statusQuery.data?.unified.entries ?? null;
	const noUnified = total === null || total === 0;

	return (
		<section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-6 text-center">
			<div className="w-16 h-16 rounded-2xl bg-[var(--success-dim)] text-[var(--success)] flex items-center justify-center text-2xl mx-auto mb-4">
				🗄
			</div>
			<h2 className="text-lg font-bold text-[var(--text)] mb-1">
				{dict.action.title}
			</h2>
			<p className="text-sm text-[var(--text-muted)] max-w-[480px] mx-auto mb-5">
				{dict.action.desc}
			</p>

			<div className="flex items-center justify-center gap-6 mb-5 flex-wrap">
				<div className="text-center">
					<div className="text-lg font-bold text-[var(--text)] tabular-nums">
						{formatNumber(total, lang)}
					</div>
					<div className="text-xs text-[var(--text-muted)]">
						{dict.action.fromLabel}
					</div>
				</div>
				<div className="text-[var(--text-faint)] text-xl hidden sm:block">→</div>
				<div className="text-center">
					<div className="text-lg font-bold text-[var(--text)]">
						{dict.action.toValue}
					</div>
					<div className="text-xs text-[var(--text-muted)]">
						{dict.action.toLabel}
					</div>
				</div>
			</div>

			<button
				type="button"
				onClick={onRun}
				disabled={disabled || noUnified}
				className="btn btn-lg btn-primary disabled:opacity-40 disabled:pointer-events-none"
			>
				{dict.action.run}
			</button>
			<div className="text-xs text-[var(--text-faint)] mt-3 font-mono">
				{noUnified ? dict.action.disabledNoUnified : dict.action.endpoint}
			</div>
		</section>
	);
};
