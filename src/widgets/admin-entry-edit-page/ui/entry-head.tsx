"use client";

import type { AdminEntryFullResponse } from "@/features/admin-entries";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";
import { formatDateTime } from "../lib/format-date";

interface EntryHeadProps {
	entry: AdminEntryFullResponse;
	lang: Locale;
	dict: Dictionary["admin"]["entryEdit"]["header"];
	onDelete: () => void;
	isDeleting: boolean;
}

export const EntryHead: FC<EntryHeadProps> = ({
	entry,
	lang,
	dict,
	onDelete,
	isDeleting,
}) => (
	<header className="mb-6 flex items-start justify-between gap-4 flex-wrap">
		<div>
			<h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mb-1 flex items-center gap-3 flex-wrap">
				<span>{entry.word}</span>
				<span className="font-mono text-xs text-[var(--text-faint)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1 rounded-full font-normal">
					#{entry.id}
				</span>
			</h1>
			<p className="text-sm text-[var(--text-muted)]">
				{dict.subtitle}
				{entry.partOfSpeech ? ` · ${entry.partOfSpeech}` : ""}
				{entry.updatedAt
					? ` · ${dict.lastUpdate.replace(
							"{date}",
							formatDateTime(entry.updatedAt, lang),
						)}`
					: ""}
			</p>
		</div>
		<div className="flex items-center gap-2 flex-wrap">
			<Link
				href={`/${lang}/entry/${entry.id}`}
				target="_blank"
				rel="noreferrer"
				className="btn btn-sm btn-secondary"
			>
				{dict.view}
			</Link>
			<Link
				href={`/${lang}/admin/audit/entries/${entry.id}`}
				className="btn btn-sm btn-secondary"
			>
				{dict.audit}
			</Link>
			<button
				type="button"
				onClick={onDelete}
				disabled={isDeleting}
				className="btn btn-sm btn-secondary text-[var(--danger)] hover:bg-[var(--danger-dim)] disabled:opacity-50"
			>
				{dict.delete}
			</button>
		</div>
	</header>
);
