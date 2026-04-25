"use client";

import type { AdminEntryFullResponse } from "@/features/admin-entries";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useAdjacentAdminEntries } from "@/features/admin-entries";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { formatDateShort } from "../lib/format-date";

type EditDict = Dictionary["admin"]["entryEdit"];

interface MetaSidebarProps {
	draft: AdminEntryFullResponse;
	entryId: string | number;
	dict: EditDict["metaPanel"];
	lang: Locale;
}

const MetaRow: FC<{ label: string; value: ReactNode; emphasize?: boolean }> = ({
	label,
	value,
	emphasize,
}) => (
	<div className="py-2 flex justify-between items-center text-xs border-b border-[var(--border)] last:border-b-0 gap-3">
		<span className="text-[var(--text-muted)] font-medium">{label}</span>
		<span
			className={`font-mono ${
				emphasize ? "text-[var(--success)]" : "text-[var(--text)]"
			} truncate max-w-[160px] text-right`}
		>
			{value}
		</span>
	</div>
);

export const MetaSidebar: FC<MetaSidebarProps> = ({
	draft,
	entryId,
	dict,
	lang,
}) => {
	const adjacentQuery = useAdjacentAdminEntries(entryId);
	const prevId = adjacentQuery.data?.prevId;
	const nextId = adjacentQuery.data?.nextId;
	const meanings = draft.meanings ?? [];
	const examplesCount = meanings.reduce(
		(sum, m) => sum + (m.examples?.length ?? 0),
		0,
	);

	return (
		<aside className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 lg:sticky lg:top-20">
			<div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
				{dict.title}
			</div>

			<MetaRow label={dict.id} value={draft.id} />
			<MetaRow label={dict.word} value={draft.word} />
			<MetaRow label={dict.pos} value={draft.partOfSpeech ?? "—"} />
			<MetaRow
				label={dict.level}
				value={draft.wordLevel ?? "—"}
				emphasize={!!draft.wordLevel}
			/>
			<MetaRow label={dict.meaningsCount} value={meanings.length} />
			<MetaRow label={dict.examplesCount} value={examplesCount} />
			<MetaRow
				label={dict.phraseologyCount}
				value={(draft.setPhrases ?? []).length}
			/>
			<MetaRow
				label={dict.citationsCount}
				value={(draft.citations ?? []).length}
			/>
			<MetaRow
				label={dict.sourcesCount}
				value={(draft.sources ?? []).length}
			/>
			<MetaRow label={dict.entryType} value={draft.entryType} />
			<MetaRow
				label={dict.createdAt}
				value={formatDateShort(draft.createdAt, lang)}
			/>
			<MetaRow
				label={dict.updatedAt}
				value={formatDateShort(draft.updatedAt, lang)}
			/>

			<div className="mt-4 flex flex-col gap-2">
				<Link
					href={`/${lang}/entry/${draft.id}`}
					target="_blank"
					rel="noreferrer"
					className="btn btn-sm btn-secondary w-full"
				>
					{dict.viewOnSite}
				</Link>
				<Link
					href={`/${lang}/admin/audit/entries/${draft.id}`}
					className="btn btn-sm btn-ghost w-full"
				>
					{dict.audit}
				</Link>
				{prevId ? (
					<Link
						href={`/${lang}/admin/entries/${prevId}/edit`}
						className="btn btn-sm btn-ghost w-full"
					>
						{dict.prev}
					</Link>
				) : null}
				{nextId ? (
					<Link
						href={`/${lang}/admin/entries/${nextId}/edit`}
						className="btn btn-sm btn-ghost w-full"
					>
						{dict.next}
					</Link>
				) : null}
			</div>
		</aside>
	);
};
