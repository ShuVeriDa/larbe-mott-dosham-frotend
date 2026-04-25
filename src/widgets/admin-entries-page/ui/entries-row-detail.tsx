"use client";

import { useAdminEntry } from "@/features/admin-entries";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";

interface Props {
	id: number;
	lang: Locale;
	dict: Dictionary["admin"]["entries"]["rowDetail"];
	actionsDict: Dictionary["admin"]["entries"]["rowActions"];
}

const posLabel = (pos?: string) => {
	if (!pos) return null;
	const lc = pos.toLowerCase();
	if (lc.startsWith("сущ")) return "Существительное";
	if (lc.startsWith("гл")) return "Глагол";
	if (lc.startsWith("прил")) return "Прилагательное";
	if (lc.startsWith("нар")) return "Наречие";
	if (lc.startsWith("посл")) return "Послелог";
	return pos;
};

const classLabel = (nc?: string) => {
	if (!nc) return null;
	switch (nc) {
		case "vu":
			return "Ву (V)";
		case "yu":
			return "Йу (J)";
		case "du":
			return "Ду (D)";
		case "bu":
			return "Бу (B)";
		default:
			return nc;
	}
};

export const EntriesRowDetail: FC<Props> = ({ id, lang, dict, actionsDict }) => {
	const { data, isLoading, isError } = useAdminEntry(id);

	if (isLoading) {
		return (
			<div className="px-5 py-4 text-sm text-[var(--text-muted)]">
				{dict.loading}
			</div>
		);
	}
	if (isError || !data) {
		return (
			<div className="px-5 py-4 text-sm text-[var(--danger)]">{dict.error}</div>
		);
	}

	const pos = posLabel(data.partOfSpeech);
	const cls = classLabel(data.nounClass);

	return (
		<div className="p-5 bg-[var(--bg)] border-t border-dashed border-[var(--border)]">
			<div className="grid md:grid-cols-2 gap-4">
				<section className="flex flex-col gap-2">
					<div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
						{dict.meanings}
					</div>
					{data.meanings?.length ? (
						<ul className="flex flex-col gap-2">
							{data.meanings.map((m, i) => (
								<li
									key={i}
									className="p-2 px-3 bg-[var(--surface)] rounded-md border-l-2 border-[var(--accent)]"
								>
									<div className="text-sm text-[var(--text)]">
										{m.translation}
									</div>
									{m.examples?.length ? (
										<div className="text-xs italic text-[var(--text-muted)] mt-0.5">
											{m.examples[0].nah} — {m.examples[0].ru}
										</div>
									) : null}
								</li>
							))}
						</ul>
					) : (
						<p className="text-xs italic text-[var(--danger)]">
							{dict.noMeanings}
						</p>
					)}
				</section>

				<section className="flex flex-col gap-3 text-sm">
					{cls ? (
						<Field label={dict.grammClass}>{cls}</Field>
					) : null}
					{pos ? <Field label={dict.partOfSpeech}>{pos}</Field> : null}
					{data.wordLevel ? (
						<Field label={dict.cefr}>{data.wordLevel}</Field>
					) : null}
					{data.entryType ? (
						<Field label={dict.type}>{data.entryType}</Field>
					) : null}
					{data.domain ? <Field label={dict.domain}>{data.domain}</Field> : null}
					{data.sources?.length ? (
						<Field label={dict.sources}>{data.sources.join(", ")}</Field>
					) : null}
					{data.setPhrases?.length ? (
						<section className="flex flex-col gap-2">
							<div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
								{dict.phraseology}
							</div>
							<ul className="flex flex-col gap-1">
								{data.setPhrases.slice(0, 5).map((p, i) => (
									<li
										key={i}
										className="p-2 px-3 bg-[var(--surface)] rounded-md text-xs"
									>
										{p.nah} — {p.ru}
									</li>
								))}
							</ul>
						</section>
					) : null}
				</section>
			</div>

			<div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[var(--border)]">
				<Link
					href={`/${lang}/admin/entries/${id}/edit`}
					className="btn btn-primary btn-sm"
				>
					{actionsDict.editFull}
				</Link>
				<Link
					href={`/${lang}/entry/${id}`}
					target="_blank"
					rel="noreferrer"
					className="btn btn-ghost btn-sm"
				>
					{actionsDict.view}
				</Link>
				<Link
					href={`/${lang}/admin/audit/entries/${id}`}
					className="btn btn-ghost btn-sm"
				>
					{actionsDict.history}
				</Link>
			</div>
		</div>
	);
};

const Field: FC<{ label: string; children: React.ReactNode }> = ({
	label,
	children,
}) => (
	<div className="flex flex-col gap-1">
		<div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
			{label}
		</div>
		<div className="text-sm text-[var(--text)]">{children}</div>
	</div>
);
