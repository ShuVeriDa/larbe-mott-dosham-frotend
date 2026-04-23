"use client";

import { useUnifiedLog } from "@/features/admin-pipeline-unify";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ChangeEvent, FC } from "react";
import { useMemo, useState } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineUnify"];
	onRun: (slug: string) => void;
	disabled?: boolean;
}

export const UnifyActionBar: FC<Props> = ({ dict, onRun, disabled }) => {
	const query = useUnifiedLog();
	const allSlugs = useMemo(
		() => [
			...(query.data?.steps.map((s) => ({ slug: s.slug, title: s.title })) ??
				[]),
			...(query.data?.remaining ?? []),
		],
		[query.data],
	);
	const [pickedSlug, setPickedSlug] = useState<string>("");
	const first = allSlugs[0]?.slug ?? "";
	const slug = pickedSlug || first;

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setPickedSlug(e.target.value);
	};

	const canRun = slug.length > 0 && !disabled;

	return (
		<div className="flex items-center gap-3 p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl mb-6 flex-wrap">
			<div
				aria-hidden
				className="w-11 h-11 rounded-xl bg-[var(--info-dim)] text-[var(--info)] flex items-center justify-center text-xl shrink-0"
			>
				🔗
			</div>
			<div className="flex-1 min-w-[180px]">
				<div className="text-sm font-semibold text-[var(--text)]">
					{dict.actionBar.label}
				</div>
				<div className="text-xs text-[var(--text-muted)] font-mono">
					{dict.actionBar.desc}
				</div>
			</div>
			<div className="flex items-center gap-3 flex-wrap">
				<label className="sr-only" htmlFor="unify-slug-select">
					{dict.actionBar.label}
				</label>
				<select
					id="unify-slug-select"
					value={slug}
					onChange={handleChange}
					className="h-[38px] min-w-[220px] px-3 pr-8 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-md text-[var(--text)] focus:outline-2 focus:outline-[var(--accent)]"
				>
					<option value="" disabled>
						{dict.actionBar.placeholder}
					</option>
					{allSlugs.map((d) => (
						<option key={d.slug} value={d.slug}>
							{d.title}
						</option>
					))}
				</select>
				<button
					type="button"
					disabled={!canRun}
					onClick={() => canRun && onRun(slug)}
					className="btn btn-md btn-primary disabled:opacity-40"
				>
					{dict.actionBar.run}
				</button>
			</div>
		</div>
	);
};
