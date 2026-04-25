"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import type { PreviewRow } from "../lib/build-payload";

interface Props {
	rows: PreviewRow[];
	totalEntries: number;
	visibleEntries?: number;
	dict: Dictionary["admin"]["entriesBulk"]["preview"];
}

const formatCell = (value: unknown): string => {
	if (value === null || value === undefined || value === "") return "—";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean")
		return String(value);
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
};

export const BulkPreviewTable: FC<Props> = ({
	rows,
	totalEntries,
	visibleEntries = 4,
	dict,
}) => {
	const shownIds = new Set<number>();
	const shownRows: PreviewRow[] = [];
	for (const row of rows) {
		if (shownIds.size >= visibleEntries && !shownIds.has(row.id)) break;
		shownIds.add(row.id);
		shownRows.push(row);
	}
	const hiddenCount = Math.max(0, totalEntries - shownIds.size);

	// Group consecutive rows by entry id for visual grouping
	let lastId: number | null = null;
	let stripe = false;

	return (
		<div className="overflow-x-auto border border-[var(--border)] rounded-lg bg-[var(--surface)]">
			<table className="w-full min-w-[600px] border-collapse">
				<thead>
					<tr>
						<th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--surface)]">
							{dict.columns.entry}
						</th>
						<th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--surface)]">
							{dict.columns.field}
						</th>
						<th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--surface)]">
							{dict.columns.before}
						</th>
						<th className="px-3 py-2 border-b border-[var(--border)] bg-[var(--surface)]" />
						<th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--surface)]">
							{dict.columns.after}
						</th>
					</tr>
				</thead>
				<tbody>
					{shownRows.map((row, i) => {
						const firstOfGroup = row.id !== lastId;
						if (firstOfGroup) {
							stripe = !stripe;
							lastId = row.id;
						}
						return (
							<tr
								key={`${row.id}-${row.field}-${i}`}
								className={cn(stripe && "bg-[var(--surface-hover)]")}
							>
								<td className="px-3 py-2 text-sm border-b border-[var(--border)] align-middle">
									{firstOfGroup ? (
										<span className="flex items-center gap-2">
											<strong className="text-[var(--text)]">
												{row.word}
											</strong>
											<span className="font-mono text-[0.6rem] text-[var(--text-faint)]">
												#{row.id}
											</span>
										</span>
									) : null}
								</td>
								<td className="px-3 py-2 text-xs font-mono border-b border-[var(--border)] align-middle">
									{row.field}
								</td>
								<td className="px-3 py-2 text-sm border-b border-[var(--border)] align-middle">
									<span className="text-[var(--danger)] line-through text-xs">
										{formatCell(row.before)}
									</span>
								</td>
								<td className="px-3 py-2 text-xs text-[var(--text-faint)] border-b border-[var(--border)] align-middle">
									→
								</td>
								<td className="px-3 py-2 text-sm border-b border-[var(--border)] align-middle">
									<span className="text-[var(--success)] font-medium">
										{formatCell(row.after)}
									</span>
								</td>
							</tr>
						);
					})}
					{hiddenCount > 0 ? (
						<tr>
							<td
								colSpan={5}
								className="px-3 py-3 text-center text-xs text-[var(--text-faint)]"
							>
								{dict.more.replace("{count}", String(hiddenCount))}
							</td>
						</tr>
					) : null}
				</tbody>
			</table>
		</div>
	);
};
