"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { SectionCard } from "@/shared/ui/admin";
import type { FC } from "react";
import type { BulkWizard } from "../model";
import { BulkPreviewTable } from "./bulk-preview-table";

interface Props {
	wizard: BulkWizard;
	dict: Dictionary["admin"]["entriesBulk"];
}

export const BulkStepPreview: FC<Props> = ({ wizard, dict }) => {
	const entries = wizard.selectedIds.length;
	const fields = wizard.resolvedOps.length;
	const ops = entries * fields;

	return (
		<section aria-labelledby="step-3-heading">
			<h2 id="step-3-heading" className="sr-only">
				{dict.steps.preview}
			</h2>

			<div className="flex items-start gap-2 px-4 py-3 mb-4 rounded-md bg-[var(--warning-dim)] border border-[var(--warning)]/30 text-[var(--warning)] text-sm">
				<span aria-hidden className="text-base leading-tight">
					👀
				</span>
				<p className="leading-snug">{dict.preview.alertWarning}</p>
			</div>

			<SectionCard title={dict.preview.title}>
				<p className="text-xs text-[var(--text-muted)] -mt-2 mb-4">
					{dict.preview.summary
						.replace("{entries}", String(entries))
						.replace("{fields}", String(fields))
						.replace("{ops}", String(ops))}
				</p>
				{wizard.batchLoading ? (
					<p className="text-sm text-[var(--text-muted)] py-6 text-center">
						{dict.preview.loading}
					</p>
				) : wizard.batchError ? (
					<div className="text-sm text-[var(--danger)] py-4">
						<strong>{dict.preview.errorTitle}</strong>
						<div className="text-xs opacity-80 mt-1">{wizard.batchError}</div>
					</div>
				) : (
					<BulkPreviewTable
						rows={wizard.previewRows}
						totalEntries={entries}
						dict={dict.preview}
					/>
				)}
			</SectionCard>

			<div className="p-6 mb-6 bg-[var(--bg)] border-2 border-dashed border-[var(--border)] rounded-xl text-center">
				<p className="text-sm text-[var(--text-secondary)] mb-3">
					{dict.preview.request}
				</p>
				<code className="inline-block font-mono text-xs text-[var(--accent)] bg-[var(--surface)] px-4 py-2 rounded-md">
					PATCH /api/dictionary/bulk/update
				</code>
				<p className="text-xs text-[var(--text-faint)] mt-2">
					{entries} · {fields} · {dict.preview.transactional}
				</p>
			</div>

			<div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--border)] flex-wrap">
				<button
					type="button"
					onClick={() => wizard.goToStep(2)}
					className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors"
				>
					{dict.preview.back}
				</button>
				<button
					type="button"
					onClick={() => void wizard.applyUpdate()}
					disabled={wizard.isApplying || wizard.batchLoading || ops === 0}
					className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md text-sm font-semibold bg-[var(--warning)] text-black hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-[filter,box-shadow]"
				>
					{dict.preview.apply}
				</button>
			</div>
		</section>
	);
};
