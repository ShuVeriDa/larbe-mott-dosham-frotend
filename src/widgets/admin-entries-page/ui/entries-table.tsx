"use client";

import type { AdminEntryListItem } from "@/features/admin-entries";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import Link from "next/link";
import { Fragment, type FC, useState } from "react";
import { formatDate } from "../lib/format";
import { EntriesRowDetail } from "./entries-row-detail";

interface Props {
	rows: AdminEntryListItem[];
	lang: Locale;
	selectedIds: Set<number>;
	onToggleRow: (id: number) => void;
	onTogglePage: (ids: number[]) => void;
	dict: Dictionary["admin"]["entries"];
	localeCode: string;
}

const CLASS_LABELS: Record<string, string> = {
	vu: "Ву",
	yu: "Йу",
	du: "Ду",
	bu: "Бу",
};

const cefrToneCls = (level?: string) => {
	switch (level) {
		case "A":
			return "text-[var(--success)] bg-[var(--success-dim)]";
		case "B":
			return "text-[var(--warning)] bg-[var(--warning-dim)]";
		case "C":
			return "text-[var(--danger)] bg-[var(--danger-dim)]";
		default:
			return "text-[var(--text-muted)] bg-[var(--surface-active)]";
	}
};

export const EntriesTable: FC<Props> = ({
	rows,
	lang,
	selectedIds,
	onToggleRow,
	onTogglePage,
	dict,
	localeCode,
}) => {
	const [expanded, setExpanded] = useState<Set<number>>(new Set());
	const toggleExpand = (id: number) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const pageIds = rows.map((r) => r.id);
	const allPageSelected =
		pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

	const headerCls =
		"text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] whitespace-nowrap";

	return (
		<div className="overflow-x-auto border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
			<table className="w-full border-collapse min-w-[800px]">
				<thead>
					<tr className="border-b border-[var(--border)]">
						<th className={`${headerCls} w-10`}>
							<Checkbox
								checked={allPageSelected}
								onChange={() => onTogglePage(pageIds)}
								ariaLabel={dict.bulk.selectAll}
							/>
						</th>
						<th className={`${headerCls} w-8`} aria-hidden="true" />
						<th className={headerCls}>{dict.columns.word}</th>
						<th className={headerCls}>{dict.columns.translation}</th>
						<th className={headerCls}>{dict.columns.pos}</th>
						<th className={`${headerCls} hidden md:table-cell`}>
							{dict.columns.cefr}
						</th>
						<th className={`${headerCls} hidden lg:table-cell`}>
							{dict.columns.sources}
						</th>
						<th className={`${headerCls} hidden md:table-cell`}>
							{dict.columns.updatedAt}
						</th>
						<th className={`${headerCls} text-right w-20`}>
							<span className="sr-only">{dict.columns.actions}</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => {
						const isSelected = selectedIds.has(row.id);
						const isExpanded = expanded.has(row.id);
						const classLabel = row.nounClass
							? CLASS_LABELS[row.nounClass]
							: null;

						return (
							<Fragment key={row.id}>
								<tr
									className={cn(
										"border-b border-[var(--border)] last:border-b-0 transition-colors",
										isSelected
											? "bg-[var(--accent-dim)]"
											: "hover:bg-[var(--surface-hover)]",
									)}
								>
									<td className="px-4 py-3">
										<Checkbox
											checked={isSelected}
											onChange={() => onToggleRow(row.id)}
											ariaLabel={`select-${row.id}`}
										/>
									</td>
									<td className="px-2 py-3">
										<button
											type="button"
											onClick={() => toggleExpand(row.id)}
											aria-label={dict.rowActions.expand}
											aria-expanded={isExpanded}
											className={cn(
												"w-6 h-6 rounded-md text-[var(--text-muted)] text-xs flex items-center justify-center transition-all hover:bg-[var(--surface)] hover:text-[var(--text)]",
												isExpanded &&
													"rotate-90 text-[var(--accent)] bg-[var(--accent-dim)]",
											)}
										>
											▶
										</button>
									</td>
									<td className="px-4 py-3">
										<div className="font-semibold text-[var(--text)] leading-tight">
											{row.wordAccented || row.word}
										</div>
										<div className="flex items-center gap-2 mt-0.5 flex-wrap">
											<span className="text-[0.65rem] text-[var(--text-faint)] font-mono">
												#{row.id}
											</span>
											{row.entryType === "neologism" ? (
												<span className="text-[0.6rem] px-1.5 rounded bg-[var(--accent-dim)] text-[var(--accent)]">
													{dict.rowBadges.neologism}
												</span>
											) : null}
											{row.domain ? (
												<span className="text-[0.6rem] px-1.5 rounded bg-[var(--surface)] text-[var(--text-faint)]">
													{row.domain}
												</span>
											) : null}
										</div>
									</td>
									<td className="px-4 py-3 text-[var(--text-secondary)]">
										<div className="truncate max-w-[260px] text-xs">
											{row.translationPreview || "—"}
										</div>
										{row.meaningsCount > 1 ? (
											<span className="text-[0.6rem] text-[var(--text-faint)]">
												+{row.meaningsCount - 1}
											</span>
										) : null}
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center gap-1 flex-wrap">
											{row.partOfSpeech ? (
												<span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-[var(--surface-active)] text-[var(--text-muted)]">
													{row.partOfSpeech}
												</span>
											) : null}
											{classLabel ? (
												<span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-[var(--info-dim)] text-[var(--info)]">
													{classLabel}
												</span>
											) : null}
										</div>
									</td>
									<td className="px-4 py-3 hidden md:table-cell">
										{row.wordLevel ? (
											<span
												className={cn(
													"text-[0.65rem] font-semibold px-1.5 py-0.5 rounded font-mono",
													cefrToneCls(row.wordLevel),
												)}
											>
												{row.wordLevel}
											</span>
										) : (
											<span className="text-[var(--text-faint)]">—</span>
										)}
									</td>
									<td className="px-4 py-3 hidden lg:table-cell">
										<div className="flex gap-1 flex-wrap">
											{row.sources.slice(0, 2).map((s) => (
												<span
													key={s}
													className="text-[0.6rem] px-1.5 py-0.5 font-mono rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text-faint)]"
												>
													{s}
												</span>
											))}
											{row.sources.length > 2 ? (
												<span className="text-[0.6rem] text-[var(--text-faint)]">
													+{row.sources.length - 2}
												</span>
											) : null}
										</div>
									</td>
									<td className="px-4 py-3 text-xs text-[var(--text-muted)] hidden md:table-cell">
										{formatDate(row.updatedAt, localeCode)}
									</td>
									<td className="px-4 py-3 text-right">
										<Link
											href={`/${lang}/admin/entries/${row.id}/edit`}
											className="btn btn-ghost btn-sm"
										>
											{dict.rowActions.edit}
										</Link>
									</td>
								</tr>
								{isExpanded ? (
									<tr className="border-b border-[var(--border)]">
										<td colSpan={9} className="p-0">
											<EntriesRowDetail
												id={row.id}
												lang={lang}
												dict={dict.rowDetail}
												actionsDict={dict.rowActions}
											/>
										</td>
									</tr>
								) : null}
							</Fragment>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

interface CheckboxProps {
	checked: boolean;
	onChange: () => void;
	ariaLabel: string;
}

const Checkbox: FC<CheckboxProps> = ({ checked, onChange, ariaLabel }) => (
	<button
		type="button"
		role="checkbox"
		aria-checked={checked}
		aria-label={ariaLabel}
		onClick={onChange}
		className={cn(
			"w-4 h-4 rounded-sm border-[1.5px] flex items-center justify-center transition-colors text-[0.7rem]",
			checked
				? "bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-on)]"
				: "bg-transparent border-[var(--border-hover)] text-transparent hover:border-[var(--accent)]",
		)}
	>
		✓
	</button>
);
