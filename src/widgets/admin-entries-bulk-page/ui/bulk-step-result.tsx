"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { StatCard } from "@/shared/ui/admin";
import Link from "next/link";
import type { FC } from "react";
import type { BulkWizard } from "../model";

interface Props {
	wizard: BulkWizard;
	lang: Locale;
	dict: Dictionary["admin"]["entriesBulk"];
}

const formatDuration = (ms: number | undefined): string => {
	if (ms === undefined || ms === null) return "—";
	if (ms < 1000) return `${Math.round(ms)} ms`;
	return `${(ms / 1000).toFixed(1)} s`;
};

export const BulkStepResult: FC<Props> = ({ wizard, lang, dict }) => {
	const { result, resultError, isApplying } = wizard;
	const fieldsChanged = wizard.resolvedOps.length;

	if (isApplying && !result && !resultError) {
		return (
			<section aria-labelledby="step-4-heading" className="text-center py-12">
				<h2 id="step-4-heading" className="sr-only">
					{dict.steps.result}
				</h2>
				<div
					className="inline-block w-10 h-10 rounded-full border-4 border-[var(--accent-dim)] border-t-[var(--accent)] animate-spin mb-4"
					aria-hidden
				/>
				<p className="text-sm text-[var(--text-secondary)]">
					{dict.result.running}
				</p>
			</section>
		);
	}

	if (resultError) {
		return (
			<section
				aria-labelledby="step-4-heading"
				className="p-6 border-2 border-[var(--danger)] rounded-xl bg-[var(--danger-dim)]"
			>
				<h2
					id="step-4-heading"
					className="text-xl font-bold text-[var(--text)] mb-2 flex items-center gap-2"
				>
					<span aria-hidden>❌</span>
					{dict.result.errorTitle}
				</h2>
				<p className="text-sm text-[var(--text-secondary)] mb-2">
					{dict.result.errorDesc}
				</p>
				<pre className="text-xs text-[var(--danger)] mb-6 whitespace-pre-wrap break-words">
					{resultError}
				</pre>
				<div className="flex gap-3 flex-wrap">
					<button
						type="button"
						onClick={() => wizard.goToStep(3)}
						className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md text-sm font-semibold bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors"
					>
						{dict.preview.back}
					</button>
					<button
						type="button"
						onClick={wizard.reset}
						className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md text-sm font-semibold bg-[var(--accent)] text-[var(--accent-on)] hover:brightness-105 transition-[filter]"
					>
						{dict.result.newUpdate}
					</button>
				</div>
			</section>
		);
	}

	if (!result) return null;

	return (
		<section
			aria-labelledby="step-4-heading"
			className="p-6 border-2 border-[var(--success)] rounded-xl bg-[var(--success-dim)] text-center"
		>
			<div className="text-5xl mb-3" aria-hidden>
				✅
			</div>
			<h2
				id="step-4-heading"
				className="text-xl font-bold text-[var(--text)] mb-2"
			>
				{dict.result.title}
			</h2>
			<p className="text-sm text-[var(--text-secondary)] mb-5">
				{dict.result.description}
			</p>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-left">
				<StatCard
					tone="success"
					label={dict.result.stats.updated}
					value={result.updated}
				/>
				<StatCard
					tone="info"
					label={dict.result.stats.fields}
					value={fieldsChanged}
				/>
				<StatCard
					tone="danger"
					label={dict.result.stats.failed}
					value={result.failed}
				/>
				<StatCard
					tone="total"
					label={dict.result.stats.elapsed}
					value={formatDuration(result.durationMs)}
				/>
			</div>

			<div className="flex gap-3 justify-center flex-wrap">
				<Link
					href={`/${lang}/admin/entries`}
					className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md text-sm font-semibold bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors"
				>
					{dict.result.backToList}
				</Link>
				<Link
					href={`/${lang}/admin/audit`}
					className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors"
				>
					{dict.result.auditLog}
				</Link>
				<button
					type="button"
					onClick={wizard.reset}
					className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md text-sm font-semibold bg-[var(--accent)] text-[var(--accent-on)] hover:brightness-105 transition-[filter]"
				>
					{dict.result.newUpdate}
				</button>
			</div>
		</section>
	);
};
