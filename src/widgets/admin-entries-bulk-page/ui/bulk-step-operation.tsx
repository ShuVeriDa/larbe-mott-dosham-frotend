"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { SectionCard } from "@/shared/ui/admin";
import type { FC } from "react";
import type { BulkWizard } from "../model";
import { BulkFieldOpCard } from "./bulk-field-op-card";

interface Props {
	wizard: BulkWizard;
	dict: Dictionary["admin"]["entriesBulk"];
}

export const BulkStepOperation: FC<Props> = ({ wizard, dict }) => {
	const count = wizard.selectedIds.length;
	return (
		<section aria-labelledby="step-2-heading">
			<h2 id="step-2-heading" className="sr-only">
				{dict.steps.operation}
			</h2>

			<div className="flex items-start gap-2 px-4 py-3 mb-4 rounded-md bg-[var(--warning-dim)] border border-[var(--warning)]/30 text-[var(--warning)] text-sm">
				<span aria-hidden className="text-base leading-tight">
					⚠️
				</span>
				<p className="leading-snug">
					{dict.operation.alertWarning.replace("{count}", String(count))}
				</p>
			</div>

			<SectionCard
				title={dict.operation.title}
				actions={
					<button
						type="button"
						onClick={wizard.addOperation}
						className="h-8 px-4 rounded-sm text-xs font-semibold bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] transition-colors"
					>
						{dict.operation.addOperation}
					</button>
				}
			>
				<p className="text-xs text-[var(--text-muted)] -mt-2 mb-4">
					{dict.operation.description}
				</p>

				{wizard.operations.map((op, i) => (
					<BulkFieldOpCard
						key={op.id}
						index={i}
						op={op}
						totalOps={wizard.operations.length}
						entryCount={count}
						onChange={(patch) => wizard.updateOperation(op.id, patch)}
						onRemove={() => wizard.removeOperation(op.id)}
						dict={dict.operation}
					/>
				))}
			</SectionCard>

			<div className="flex items-start gap-2 px-4 py-3 mb-4 rounded-md bg-[var(--info-dim)] border border-[var(--info)]/30 text-[var(--info)] text-sm">
				<span aria-hidden className="text-base leading-tight">
					💡
				</span>
				<p className="leading-snug">{dict.operation.jsonAlert}</p>
			</div>

			<div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--border)] flex-wrap">
				<button
					type="button"
					onClick={() => wizard.goToStep(1)}
					className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors"
				>
					{dict.operation.back}
				</button>
				<button
					type="button"
					disabled={!wizard.canProceedFromStep2}
					onClick={() => wizard.goToStep(3)}
					className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md text-sm font-semibold bg-[var(--accent)] text-[var(--accent-on)] hover:brightness-105 hover:shadow-[0_0_12px_var(--accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed transition-[filter,box-shadow]"
				>
					{dict.operation.next}
				</button>
			</div>
		</section>
	);
};
