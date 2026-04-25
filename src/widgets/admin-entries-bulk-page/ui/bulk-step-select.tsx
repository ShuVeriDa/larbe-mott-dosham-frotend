"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";
import type { BulkWizard } from "../model";
import { BulkEntryChips } from "./bulk-entry-chips";
import { BulkMethodFilter } from "./bulk-method-filter";
import { BulkMethodIds } from "./bulk-method-ids";
import { BulkMethodSearch } from "./bulk-method-search";
import { BulkMethodTabs } from "./bulk-method-tabs";

interface Props {
	wizard: BulkWizard;
	lang: Locale;
	dict: Dictionary["admin"]["entriesBulk"];
}

export const BulkStepSelect: FC<Props> = ({ wizard, lang, dict }) => (
	<section aria-labelledby="step-1-heading">
		<h2 id="step-1-heading" className="sr-only">
			{dict.steps.select}
		</h2>
		<BulkMethodTabs
			method={wizard.method}
			onChange={wizard.pickMethod}
			dict={dict}
		/>

		{wizard.method === "ids" ? (
			<BulkMethodIds
				value={wizard.idsInput}
				onChange={wizard.setIdsInput}
				dict={dict.select.ids}
			/>
		) : null}

		{wizard.method === "search" ? (
			<BulkMethodSearch
				selected={wizard.selected}
				onToggle={wizard.toggleEntry}
				dict={dict.select.search}
			/>
		) : null}

		{wizard.method === "filter" ? (
			<BulkMethodFilter
				value={wizard.filter}
				onChange={(patch) =>
					wizard.setFilter((prev) => ({ ...prev, ...patch }))
				}
				onSubmit={() => void wizard.runFilter()}
				loading={wizard.filterLoading}
				dict={dict.select.filter}
			/>
		) : null}

		{wizard.method !== "ids" || wizard.selected.length > 0 ? (
			<BulkEntryChips
				selected={wizard.selected}
				overLimit={wizard.overLimit}
				onRemove={wizard.removeEntry}
				onClearAll={wizard.clearSelection}
				dict={dict.select}
			/>
		) : null}

		<div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--border)] flex-wrap">
			<Link
				href={`/${lang}/admin/entries`}
				className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors"
			>
				{dict.select.backToList}
			</Link>
			<button
				type="button"
				disabled={!wizard.canProceedFromStep1}
				onClick={() => wizard.goToStep(2)}
				className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md text-sm font-semibold bg-[var(--accent)] text-[var(--accent-on)] hover:brightness-105 hover:shadow-[0_0_12px_var(--accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed transition-[filter,box-shadow]"
			>
				{dict.select.goToOperation}
			</button>
		</div>
	</section>
);
