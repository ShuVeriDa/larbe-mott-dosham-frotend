"use client";

import {
	type DictionaryEntry,
	type Meaning,
	useDictionaryEntry,
} from "@/entities/dictionary";
import type { QualityProblemRow } from "@/features/admin-quality-problems";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC } from "react";

type ProblemsDict = Dictionary["admin"]["qualityProblems"];

interface ProblemRowDetailProps {
	lang: Locale;
	row: QualityProblemRow;
	dict: ProblemsDict;
}

const DetailEmpty: FC<{ text: string }> = ({ text }) => (
	<div className="text-xs italic text-[var(--danger)]">{text}</div>
);

const MeaningsList: FC<{ meanings: Meaning[] }> = ({ meanings }) => (
	<div className="flex flex-col gap-2">
		{meanings.map((m, i) => (
			<div
				key={`${m.translation}-${i}`}
				className="px-3 py-2 bg-[var(--surface)] rounded-md border-l-2 border-[var(--accent)] text-sm"
			>
				<div className="text-[var(--text)]">{m.translation}</div>
				{m.examples?.length ? (
					<div className="text-xs text-[var(--text-muted)] italic mt-0.5">
						{m.examples
							.map((ex) => `«${ex.nah}» — ${ex.ru}`)
							.join(" · ")}
					</div>
				) : null}
			</div>
		))}
	</div>
);

const ExamplesList: FC<{ meanings: Meaning[] }> = ({ meanings }) => {
	const examples = meanings.flatMap((m) => m.examples ?? []);
	if (examples.length === 0) return null;
	return (
		<div className="flex flex-col gap-2">
			{examples.map((ex, i) => (
				<div
					key={`${ex.nah}-${i}`}
					className="px-3 py-2 bg-[var(--surface)] rounded-md border-l-2 border-[var(--accent)] text-sm"
				>
					<div className="text-xs text-[var(--text-muted)] italic">
						{ex.nah} — {ex.ru}
					</div>
				</div>
			))}
		</div>
	);
};

const DetailSection: FC<{ label: string; children: React.ReactNode }> = ({
	label,
	children,
}) => (
	<div className="flex flex-col gap-2">
		<div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
			{label}
		</div>
		{children}
	</div>
);

export const ProblemRowDetail: FC<ProblemRowDetailProps> = ({
	lang,
	row,
	dict,
}) => {
	const listMeanings = row.meanings;
	const needsFetch = !listMeanings;
	const entryQuery = useDictionaryEntry(needsFetch ? row.id : 0);

	const detailEntry: DictionaryEntry | undefined = entryQuery.data;
	const meanings: Meaning[] = listMeanings ?? detailEntry?.meanings ?? [];
	const hasMeanings = meanings.length > 0;
	const hasExamples = meanings.some((m) => (m.examples?.length ?? 0) > 0);

	const partOfSpeech = row.partOfSpeech ?? detailEntry?.partOfSpeech;
	const nounClass = row.nounClass ?? detailEntry?.nounClass;

	const showsProblem = new Set(row.problems);

	return (
		<div
			className={cn(
				"px-5 pt-4 pb-5 bg-[var(--bg)] border-t border-dashed border-[var(--border)]",
			)}
		>
			{needsFetch && entryQuery.isLoading ? (
				<div className="text-sm text-[var(--text-muted)] mb-3">
					{dict.detail.loading}
				</div>
			) : null}
			{needsFetch && entryQuery.isError ? (
				<div className="text-sm text-[var(--danger)] mb-3">
					{dict.detail.loadError}
				</div>
			) : null}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<DetailSection label={dict.detail.meanings}>
					{hasMeanings ? (
						<MeaningsList meanings={meanings} />
					) : (
						<DetailEmpty text={dict.detail.emptyMeanings} />
					)}
				</DetailSection>

				<DetailSection label={dict.detail.partOfSpeech}>
					{partOfSpeech ? (
						<div className="text-sm text-[var(--text)]">{partOfSpeech}</div>
					) : (
						<DetailEmpty text={dict.detail.emptyPartOfSpeech} />
					)}
				</DetailSection>

				<DetailSection label={dict.detail.nounClass}>
					{nounClass ? (
						<div className="text-sm text-[var(--text)]">
							{String(nounClass).toUpperCase()}
						</div>
					) : (
						<DetailEmpty text={dict.detail.emptyNounClass} />
					)}
				</DetailSection>

				<DetailSection label={dict.detail.examples}>
					{hasExamples ? (
						<ExamplesList meanings={meanings} />
					) : showsProblem.has("no-examples") ? (
						<DetailEmpty text={dict.detail.emptyExamples} />
					) : (
						<div className="text-sm text-[var(--text-muted)]">—</div>
					)}
				</DetailSection>

				<DetailSection label={dict.detail.sources}>
					<div className="text-sm text-[var(--text)]">
						{row.sources.join(", ")}
					</div>
				</DetailSection>
			</div>

			<div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[var(--border)]">
				<Link
					href={`/${lang}/admin/entries/${row.id}/edit`}
					className="inline-flex items-center justify-center gap-2 px-4 py-2 h-8 text-xs font-semibold rounded-md bg-[var(--accent)] text-[var(--accent-on)] hover:brightness-110 transition-all"
				>
					{dict.detail.actions.edit}
				</Link>
				<Link
					href={`/${lang}/entry/${row.id}`}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center justify-center gap-2 px-4 py-2 h-8 text-xs font-semibold rounded-md bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors"
				>
					{dict.detail.actions.view}
				</Link>
				<Link
					href={`/${lang}/admin/audit/entries/${row.id}`}
					className="inline-flex items-center justify-center gap-2 px-4 py-2 h-8 text-xs font-semibold rounded-md bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors"
				>
					{dict.detail.actions.history}
				</Link>
			</div>
		</div>
	);
};
