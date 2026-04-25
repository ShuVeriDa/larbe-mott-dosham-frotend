"use client";

import type { PipelineStatusDictionary } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import type { FC } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineParse"]["actionBar"];
	dictionaries: PipelineStatusDictionary[];
	selectedSlug: string;
	onSelect: (slug: string) => void;
	onRun: () => void;
	disabled: boolean;
}

const ALL = "__all__";

export const ParseActionBar: FC<Props> = ({
	dict,
	dictionaries,
	selectedSlug,
	onSelect,
	onRun,
	disabled,
}) => {
	return (
		<section
			aria-labelledby="parse-action-heading"
			className="flex items-center gap-3 p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl mb-6 flex-wrap"
		>
			<div
				className="w-11 h-11 rounded-xl bg-[var(--accent-dim)] text-[var(--accent)] flex items-center justify-center text-xl shrink-0"
				aria-hidden
			>
				📥
			</div>
			<div className="flex-1 min-w-[180px]">
				<h2
					id="parse-action-heading"
					className="text-sm font-semibold text-[var(--text)]"
				>
					{dict.label}
				</h2>
				<div className="text-xs text-[var(--text-muted)] font-mono">
					{dict.desc}
				</div>
			</div>
			<div className="flex items-center gap-3 flex-wrap">
				<Select
					value={selectedSlug === "" ? ALL : selectedSlug}
					onValueChange={(value) => onSelect(value === ALL ? "" : value)}
					disabled={disabled}
				>
					<SelectTrigger
						id="parse-slug-select"
						aria-label={dict.label}
						className="h-10 min-w-[200px]"
					>
						<SelectValue placeholder={dict.selectAll} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>{dict.selectAll}</SelectItem>
						{dictionaries.map((d) => (
							<SelectItem key={d.slug} value={d.slug}>
								{d.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<button
					type="button"
					onClick={onRun}
					disabled={disabled}
					className="btn btn-md btn-primary disabled:opacity-40"
				>
					{dict.run}
				</button>
			</div>
		</section>
	);
};
