"use client";

import {
	type AdminProblemRow,
	type AdminProblemType,
	useAdminProblems,
} from "@/features/admin-dashboard";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	AdminEmptyState,
	AdminErrorState,
	AdminTableSkeleton,
	FilterChips,
} from "@/shared/ui/admin";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";

interface ProblemsTableProps {
	dict: Dictionary["admin"]["dashboard"]["problems"];
	commonDict: Dictionary["admin"]["common"];
	lang: string;
	breakdownCounts: {
		noMeanings: number;
		noClass: number;
		noPos: number;
		noExamples: number;
	};
}

type FilterValue = AdminProblemType | "";

const PROBLEM_TAG_CLASSES: Record<AdminProblemType, string> = {
	"no-meanings": "bg-[var(--danger-dim)] text-[var(--danger)]",
	"no-class": "bg-[var(--warning-dim)] text-[var(--warning)]",
	"no-pos": "bg-[var(--info-dim)] text-[var(--info)]",
	"no-examples": "bg-[var(--surface-active)] text-[var(--text-muted)]",
};

const PROBLEM_LABELS: Record<AdminProblemType, keyof Dictionary["admin"]["dashboard"]["problems"]["filters"]> = {
	"no-meanings": "noMeanings",
	"no-class": "noClass",
	"no-pos": "noPos",
	"no-examples": "noExamples",
};

const formatDate = (iso: string, lang: string) => {
	try {
		return new Date(iso).toLocaleDateString(
			lang === "ru" ? "ru-RU" : lang === "en" ? "en-US" : "ru-RU",
			{ day: "2-digit", month: "short" },
		);
	} catch {
		return iso;
	}
};

export const ProblemsTable: FC<ProblemsTableProps> = ({
	dict,
	commonDict,
	lang,
	breakdownCounts,
}) => {
	const [filter, setFilter] = useState<FilterValue>("");
	const query = useAdminProblems({
		type: filter || undefined,
		page: 1,
		limit: 10,
	});

	const options = [
		{ value: "" as const, label: dict.filters.all },
		{
			value: "no-meanings" as const,
			label: dict.filters.noMeanings,
			count: breakdownCounts.noMeanings,
		},
		{
			value: "no-class" as const,
			label: dict.filters.noClass,
			count: breakdownCounts.noClass,
		},
		{
			value: "no-pos" as const,
			label: dict.filters.noPos,
			count: breakdownCounts.noPos,
		},
		{
			value: "no-examples" as const,
			label: dict.filters.noExamples,
			count: breakdownCounts.noExamples,
		},
	];

	return (
		<section className="mb-8">
			<header className="flex items-center justify-between gap-4 mb-4 flex-wrap">
				<h2 className="text-lg font-semibold text-[var(--text)]">
					{dict.title}
				</h2>
				<FilterChips
					options={options}
					value={filter}
					onChange={(v) => setFilter(v as FilterValue)}
				/>
			</header>

			{query.isLoading ? (
				<AdminTableSkeleton rows={5} />
			) : query.isError ? (
				<AdminErrorState
					title={commonDict.error}
					retryLabel={commonDict.retry}
					onRetry={() => query.refetch()}
				/>
			) : !query.data?.data.length ? (
				<AdminEmptyState title={commonDict.empty} />
			) : (
				<div className="overflow-x-auto border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-[var(--border)]">
								<th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium">
									{dict.columns.word}
								</th>
								<th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium">
									{dict.columns.source}
								</th>
								<th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium">
									{dict.columns.problems}
								</th>
								<th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium hidden md:table-cell">
									{dict.columns.updatedAt}
								</th>
								<th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium">
									{dict.columns.actions}
								</th>
							</tr>
						</thead>
						<tbody>
							{query.data.data.map((row: AdminProblemRow) => (
								<tr
									key={row.entryId}
									className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-hover)]"
								>
									<td className="px-4 py-3 font-semibold text-[var(--accent)]">
										{row.word}
									</td>
									<td className="px-4 py-3 text-xs text-[var(--text-muted)]">
										{row.source}
									</td>
									<td className="px-4 py-3">
										<div className="flex flex-wrap gap-1">
											{row.problems.map((p) => (
												<span
													key={p}
													className={cn(
														"text-[0.65rem] font-semibold px-1.5 py-0.5 rounded",
														PROBLEM_TAG_CLASSES[p],
													)}
												>
													{dict.filters[PROBLEM_LABELS[p]]}
												</span>
											))}
										</div>
									</td>
									<td className="px-4 py-3 text-xs text-[var(--text-muted)] hidden md:table-cell">
										{formatDate(row.updatedAt, lang)}
									</td>
									<td className="px-4 py-3 text-right">
										<Link
											href={`/${lang}/admin/entries/${row.entryId}/edit`}
											className="btn btn-sm btn-secondary"
										>
											{dict.edit}
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
};
