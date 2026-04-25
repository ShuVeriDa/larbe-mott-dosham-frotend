"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";
import { interpolate } from "../lib/format";

interface Props {
	count: number;
	bulkHref: string;
	onSelectAll: () => void;
	onDeselectAll: () => void;
	onDelete: () => void;
	deleting?: boolean;
	dict: Dictionary["admin"]["entries"]["bulk"];
}

export const EntriesBulkBar: FC<Props> = ({
	count,
	bulkHref,
	onSelectAll,
	onDeselectAll,
	onDelete,
	deleting,
	dict,
}) => {
	if (count === 0) return null;

	return (
		<div
			role="region"
			aria-label={interpolate(dict.selected, { count })}
			className="flex flex-wrap items-center gap-4 px-5 py-3 mb-4 bg-[var(--accent-dim)] border border-[var(--border-accent)] rounded-2xl"
		>
			<span className="text-sm font-semibold text-[var(--accent)]">
				{interpolate(dict.selected, { count })}
			</span>
			<span className="text-xs text-[var(--text-muted)]">·</span>
			<button
				type="button"
				onClick={onSelectAll}
				className="btn btn-ghost btn-sm"
			>
				{dict.selectAll}
			</button>
			<button
				type="button"
				onClick={onDeselectAll}
				className="btn btn-ghost btn-sm"
			>
				{dict.deselectAll}
			</button>
			<div className="flex gap-2 ml-auto">
				<Link href={bulkHref} className="btn btn-secondary btn-sm">
					{dict.massEdit}
				</Link>
				<button
					type="button"
					onClick={onDelete}
					disabled={deleting}
					className="btn btn-danger-ghost btn-sm disabled:opacity-40"
				>
					{deleting ? dict.deleting : dict.delete}
				</button>
			</div>
		</div>
	);
};
