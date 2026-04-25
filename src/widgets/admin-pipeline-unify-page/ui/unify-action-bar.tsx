"use client";

import { useUnifiedLog } from "@/features/admin-pipeline-unify";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import type { FC } from "react";
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
			...(query.data?.steps.map(s => ({ slug: s.slug, title: s.title })) ?? []),
			...(query.data?.remaining ?? []),
		],
		[query.data],
	);
	const [pickedSlug, setPickedSlug] = useState<string>("");
	const first = allSlugs[0]?.slug ?? "";
	const slug = pickedSlug || first;

	const canRun = slug.length > 0 && !disabled;

	return (
		<div className="flex items-center gap-3 p-5 bg-(--surface) border border-(--border) rounded-2xl mb-6 flex-wrap">
			<div
				aria-hidden
				className="w-11 h-11 rounded-xl bg-info-dim text-info flex items-center justify-center text-xl shrink-0"
			>
				🔗
			</div>
			<div className="flex-1 min-w-[180px]">
				<div className="text-sm font-semibold text-(--text)">
					{dict.actionBar.label}
				</div>
				<div className="text-xs text-(--text-muted) font-mono">
					{dict.actionBar.desc}
				</div>
			</div>
			<div className="flex items-center gap-3 flex-wrap">
				<Select value={slug} onValueChange={setPickedSlug}>
					<SelectTrigger
						id="unify-slug-select"
						aria-label={dict.actionBar.label}
						className="h-[38px] min-w-[220px]"
					>
						<SelectValue placeholder={dict.actionBar.placeholder} />
					</SelectTrigger>
					<SelectContent>
						{allSlugs.map(d => (
							<SelectItem key={d.slug} value={d.slug}>
								{d.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
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
