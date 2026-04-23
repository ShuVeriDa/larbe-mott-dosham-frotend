"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineRollback"]["danger"];
	disabled: boolean;
	isLoading: boolean;
	onReset: () => void;
}

export const DangerZoneReset: FC<Props> = ({
	dict,
	disabled,
	isLoading,
	onReset,
}) => (
	<>
		<h2 className="text-lg font-semibold text-[var(--text)] mb-4">
			{dict.sectionTitle}
		</h2>
		<section className="border border-[var(--danger)] rounded-2xl p-6 mb-8 bg-[var(--danger-dim)]">
			<header className="flex items-center gap-3 mb-3">
				<span className="text-xl" aria-hidden>
					💥
				</span>
				<h3 className="text-md font-bold text-[var(--danger)]">{dict.title}</h3>
			</header>
			<p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
				{dict.description}
			</p>
			<ul className="text-xs text-[var(--text-muted)] mb-5 leading-loose list-disc pl-5 space-y-0.5">
				<li>{dict.list.unified}</li>
				<li>{dict.list.snapshots}</li>
				<li>{dict.list.log}</li>
				<li>{dict.list.parsed}</li>
				<li>{dict.list.db}</li>
			</ul>
			<button
				type="button"
				onClick={onReset}
				disabled={disabled || isLoading}
				className="btn btn-md btn-danger disabled:opacity-40"
			>
				{dict.cta}
			</button>
			<div className="text-xs text-[var(--danger)] opacity-60 mt-3 font-mono">
				{dict.endpoint}
			</div>
		</section>
	</>
);
