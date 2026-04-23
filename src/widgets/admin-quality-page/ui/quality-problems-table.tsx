"use client";

import type { QualityProblemRow } from "@/features/admin-quality";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";
import { ProblemTag } from "./problem-tag";

interface QualityProblemsTableProps {
	rows: QualityProblemRow[];
	lang: Locale;
	dict: Dictionary["admin"]["quality"]["problems"];
}

const formatRelative = (iso: string, lang: Locale): string => {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "—";
	const diffMs = Date.now() - date.getTime();
	const seconds = Math.round(diffMs / 1000);
	const minutes = Math.round(seconds / 60);
	const hours = Math.round(minutes / 60);
	const days = Math.round(hours / 24);

	const rtfLang: Record<Locale, string> = {
		ru: "ru-RU",
		en: "en-US",
		che: "ru-RU",
	};
	const rtf = new Intl.RelativeTimeFormat(rtfLang[lang], { numeric: "auto" });

	if (Math.abs(seconds) < 60) return rtf.format(-seconds, "second");
	if (Math.abs(minutes) < 60) return rtf.format(-minutes, "minute");
	if (Math.abs(hours) < 24) return rtf.format(-hours, "hour");
	if (Math.abs(days) < 30) return rtf.format(-days, "day");
	return date.toLocaleDateString(rtfLang[lang]);
};

export const QualityProblemsTable: FC<QualityProblemsTableProps> = ({
	rows,
	lang,
	dict,
}) => (
	<div className="overflow-x-auto bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
		<table className="w-full border-collapse">
			<thead>
				<tr>
					<th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] whitespace-nowrap">
						{dict.columns.word}
					</th>
					<th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] whitespace-nowrap">
						{dict.columns.source}
					</th>
					<th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] whitespace-nowrap">
						{dict.columns.problems}
					</th>
					<th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] whitespace-nowrap">
						{dict.columns.updatedAt}
					</th>
					<th className="text-right px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] whitespace-nowrap">
						<span className="sr-only">{dict.columns.actions}</span>
					</th>
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr
						key={row.id}
						className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-hover)] transition-colors"
					>
						<td className="px-4 py-3 align-middle">
							<div className="font-semibold text-[var(--text)] text-base">
								{row.word}
							</div>
							<div className="text-xs font-mono text-[var(--text-faint)]">
								#{row.id}
							</div>
						</td>
						<td className="px-4 py-3 text-sm text-[var(--text-muted)] align-middle">
							{row.sources[0] ?? "—"}
						</td>
						<td className="px-4 py-3 align-middle">
							<div className="flex flex-wrap gap-1">
								{row.problems.map((p) => (
									<ProblemTag key={p} type={p} dict={dict.tags} />
								))}
							</div>
						</td>
						<td className="px-4 py-3 text-sm text-[var(--text-muted)] align-middle whitespace-nowrap">
							{formatRelative(row.updatedAt, lang)}
						</td>
						<td className="px-4 py-3 text-right align-middle">
							<Link
								href={`/${lang}/admin/entries/${row.id}/edit`}
								className="btn btn-sm btn-ghost"
							>
								{dict.edit}
							</Link>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);
