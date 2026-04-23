"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";

type ProblemsDict = Dictionary["admin"]["qualityProblems"];

interface ProblemsBulkBarProps {
	lang: Locale;
	count: number;
	onSelectAll: () => void;
	onDeselectAll: () => void;
	onSendImprove: () => void;
	isSending: boolean;
	dict: ProblemsDict;
}

const pickCountLabel = (count: number, dict: ProblemsDict): string => {
	const template =
		count === 1
			? dict.bulk.countOne
			: count >= 2 && count <= 4
				? dict.bulk.countFew
				: dict.bulk.countMany;
	return template.replace("{count}", String(count));
};

export const ProblemsBulkBar: FC<ProblemsBulkBarProps> = ({
	lang,
	count,
	onSelectAll,
	onDeselectAll,
	onSendImprove,
	isSending,
	dict,
}) => {
	if (count === 0) return null;

	return (
		<div
			role="toolbar"
			aria-label="bulk actions"
			className="flex items-center gap-4 flex-wrap px-5 py-3 mb-4 bg-[var(--accent-dim)] border border-[var(--border-accent)] rounded-[14px]"
		>
			<span className="text-sm font-semibold text-[var(--accent)]">
				{pickCountLabel(count, dict)}
			</span>
			<span
				className="text-xs text-[var(--text-muted)] hidden md:inline"
				aria-hidden
			>
				·
			</span>
			<button
				type="button"
				onClick={onSelectAll}
				className="px-4 py-2 h-8 text-xs font-semibold rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors"
			>
				{dict.bulk.selectAllPage}
			</button>
			<button
				type="button"
				onClick={onDeselectAll}
				className="px-4 py-2 h-8 text-xs font-semibold rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors"
			>
				{dict.bulk.deselectAll}
			</button>
			<div className="flex items-center gap-2 md:ml-auto flex-wrap">
				<Link
					href={`/${lang}/admin/entries/bulk`}
					className="inline-flex items-center justify-center gap-2 px-4 py-2 h-8 text-xs font-semibold rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] transition-colors"
				>
					{dict.bulk.edit}
				</Link>
				<button
					type="button"
					onClick={onSendImprove}
					disabled={isSending}
					className="inline-flex items-center justify-center gap-2 px-4 py-2 h-8 text-xs font-semibold rounded-md bg-transparent text-[var(--danger)] hover:bg-[var(--danger-dim)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{isSending ? dict.bulk.sending : dict.bulk.sendImprove}
				</button>
			</div>
		</div>
	);
};
