"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import type { ImproveRunner } from "../model/use-improve-runner";

interface Props {
	dict: Dictionary["admin"]["pipelineImprove"];
	runner: ImproveRunner;
}

const nf = new Intl.NumberFormat("ru-RU");

export const ImproveRunAction: FC<Props> = ({ dict, runner }) => {
	const showProgress =
		runner.phase === "running" || runner.phase === "done";
	const showResult = runner.phase === "done" && runner.result;

	return (
		<>
			<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-6 text-center">
				<div
					className="w-16 h-16 rounded-2xl bg-[var(--warning-dim)] text-[var(--warning)] flex items-center justify-center text-3xl mx-auto mb-4"
					aria-hidden
				>
					🧹
				</div>
				<div className="text-lg font-bold text-[var(--text)] mb-1">
					{dict.action.title}
				</div>
				<p className="text-sm text-[var(--text-muted)] max-w-[520px] mx-auto mb-5">
					{dict.action.description}
				</p>
				<button
					type="button"
					onClick={runner.openConfirm}
					disabled={runner.isPending}
					className="btn btn-lg btn-warning disabled:opacity-40"
				>
					{dict.action.run}
				</button>
				<div className="text-xs text-[var(--text-faint)] mt-3 font-mono">
					{dict.action.endpoint}
				</div>
			</div>

			{showProgress ? (
				<div className="mb-6">
					<div className="flex items-center justify-between mb-2 gap-3">
						<span className="text-sm font-medium text-[var(--text)]">
							{runner.stepLabel}
						</span>
						<span className="text-sm font-semibold text-[var(--accent)] tabular-nums">
							{Math.round(runner.progress)}%
						</span>
					</div>
					<div className="h-2 bg-[var(--surface-active)] rounded-full overflow-hidden">
						<div
							className={cn(
								"h-full rounded-full transition-[width] duration-500",
								runner.phase === "done"
									? "bg-[var(--success)]"
									: "bg-[var(--warning)]",
							)}
							style={{ width: `${runner.progress}%` }}
						/>
					</div>
				</div>
			) : null}

			{showResult && runner.result ? (
				<div className="bg-[var(--success-dim)] text-[var(--success)] border border-[var(--success-dim)] px-5 py-4 rounded-2xl mb-6">
					<div className="text-sm font-semibold mb-2">
						{dict.result.title}
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
						<ResultItem
							label={dict.result.cleaned}
							value={nf.format(runner.result.cleaned)}
						/>
						<ResultItem
							label={dict.result.fixedExamples}
							value={nf.format(runner.result.fixedExamples)}
						/>
						<ResultItem
							label={dict.result.removedEmpty}
							value={nf.format(runner.result.removedEmpty)}
						/>
						<ResultItem
							label={dict.result.elapsed}
							value={`${runner.result.elapsedSeconds.toFixed(1)}s`}
						/>
					</div>
				</div>
			) : null}
		</>
	);
};

const ResultItem: FC<{ label: string; value: string }> = ({ label, value }) => (
	<div className="text-center">
		<div className="text-xl font-bold tabular-nums">{value}</div>
		<div className="text-xs opacity-80">{label}</div>
	</div>
);
