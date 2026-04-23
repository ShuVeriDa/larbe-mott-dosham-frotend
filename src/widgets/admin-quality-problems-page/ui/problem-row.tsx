"use client";

import type { QualityProblemRow } from "@/features/admin-quality-problems";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC } from "react";
import { getProblemTagLabel } from "../lib/problem-meta";
import { formatRelativeTime } from "../lib/relative-time";
import { Checkbox } from "./checkbox";
import { ProblemRowDetail } from "./problem-row-detail";
import { ProblemTag } from "./problem-tag";
import { SourceBadge } from "./source-badge";

type ProblemsDict = Dictionary["admin"]["qualityProblems"];

interface ProblemRowProps {
	row: QualityProblemRow;
	lang: Locale;
	dict: ProblemsDict;
	isSelected: boolean;
	isExpanded: boolean;
	onToggleSelect: () => void;
	onToggleExpand: () => void;
}

export const ProblemRow: FC<ProblemRowProps> = ({
	row,
	lang,
	dict,
	isSelected,
	isExpanded,
	onToggleSelect,
	onToggleExpand,
}) => {
	const source = row.sources[0] ?? "";

	return (
		<>
			<tr
				className={cn(
					"border-b border-[var(--border)] transition-colors",
					isSelected
						? "bg-[var(--accent-dim)]"
						: "hover:bg-[var(--surface-hover)]",
				)}
			>
				<td className="px-4 py-3 align-middle w-9">
					<Checkbox
						checked={isSelected}
						onChange={onToggleSelect}
						ariaLabel={dict.table.columns.select}
					/>
				</td>
				<td className="px-4 py-3 align-middle w-7">
					<button
						type="button"
						onClick={onToggleExpand}
						aria-label={dict.table.expandAria}
						aria-expanded={isExpanded}
						className={cn(
							"w-6 h-6 rounded flex items-center justify-center text-xs text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-all",
							isExpanded && "rotate-90 text-[var(--accent)]",
						)}
					>
						▶
					</button>
				</td>
				<td className="px-4 py-3 align-middle">
					<div className="font-semibold text-[var(--text)] text-base leading-tight">
						{row.word}
					</div>
					<div className="flex items-center gap-2 mt-0.5">
						<span className="font-mono text-[0.65rem] text-[var(--text-faint)]">
							#{row.id}
						</span>
						{row.partOfSpeech ? (
							<span className="text-[0.65rem] text-[var(--text-muted)] bg-[var(--surface-active)] px-1.5 py-[1px] rounded">
								{row.partOfSpeech}
							</span>
						) : null}
					</div>
				</td>
				<td className="px-4 py-3 align-middle">
					{source ? <SourceBadge slug={source} /> : null}
				</td>
				<td className="px-4 py-3 align-middle">
					<div className="flex flex-wrap gap-1">
						{row.problems.map((p) => (
							<ProblemTag
								key={p}
								type={p}
								label={getProblemTagLabel(p, dict)}
							/>
						))}
					</div>
				</td>
				<td className="px-4 py-3 align-middle text-sm text-[var(--text-muted)] whitespace-nowrap">
					{formatRelativeTime(row.updatedAt, dict.time)}
				</td>
				<td className="px-4 py-3 align-middle text-right">
					<Link
						href={`/${lang}/admin/entries/${row.id}/edit`}
						className="inline-flex items-center justify-center gap-2 px-4 py-2 h-8 text-xs font-semibold rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors"
					>
						{dict.table.edit}
					</Link>
				</td>
			</tr>
			{isExpanded ? (
				<tr className="border-b border-[var(--border)]">
					<td colSpan={7} className="p-0">
						<ProblemRowDetail lang={lang} row={row} dict={dict} />
					</td>
				</tr>
			) : null}
		</>
	);
};
