"use client";

import { useConjugation } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC, ReactNode } from "react";

type ConjugationDict = Dictionary["entry"]["conjugation"];

interface ConjugationPanelProps {
	word: string;
	isApplicable: boolean;
	dict: ConjugationDict;
}

const SkeletonRows: FC = () => (
	<div className="space-y-2" aria-hidden>
		{Array.from({ length: 9 }).map((_, i) => (
			<div key={i} className="h-10 bg-surface animate-pulse rounded-md" />
		))}
	</div>
);

interface GroupTableProps {
	title: string;
	formHeader: string;
	valueHeader: string;
	rows: Array<{ label: string; value: string | null }>;
	dash: string;
}

const GroupTable: FC<GroupTableProps> = ({
	title,
	formHeader,
	valueHeader,
	rows,
	dash,
}) => (
	<div className="mb-6">
		<h3 className="text-xs font-medium text-faint uppercase tracking-[0.06em] mb-3 flex items-center gap-2">
			<span aria-hidden className="w-5 h-px bg-faint" />
			{title}
		</h3>
		<div className="overflow-x-auto border border-edge rounded-lg">
			<table className="w-full border-collapse text-sm">
				<thead>
					<tr>
						<th
							scope="col"
							className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-[0.06em] bg-surface border-b border-edge"
						>
							{formHeader}
						</th>
						<th
							scope="col"
							className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-[0.06em] bg-surface border-b border-edge"
						>
							{valueHeader}
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.map(row => (
						<tr
							key={row.label}
							className="border-b border-edge last:border-b-0 hover:bg-surface-hover"
						>
							<th
								scope="row"
								className="text-left px-4 py-3 text-muted font-medium text-xs min-w-[130px] align-top"
							>
								{row.label}
							</th>
							<td className="px-4 py-3 text-foreground font-medium" lang="ce">
								{row.value || dash}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</div>
);

export const ConjugationPanel: FC<ConjugationPanelProps> = ({
	word,
	isApplicable,
	dict,
}) => {
	const { data, isLoading, isError } = useConjugation(
		isApplicable ? word : "",
	);

	if (!isApplicable) {
		return <p className="text-sm text-muted py-4">{dict.notApplicable}</p>;
	}

	let content: ReactNode;
	if (isLoading) {
		content = <SkeletonRows />;
	} else if (isError || !data) {
		content = <p className="text-sm text-muted py-4">{dict.empty}</p>;
	} else {
		content = (
			<>
				<GroupTable
					title={dict.tenses.title}
					formHeader={dict.tenses.form}
					valueHeader={dict.tenses.value}
					dash="—"
					rows={[
						{ label: dict.tenses.presentSimple, value: data.tenses.presentSimple },
						{
							label: dict.tenses.presentCompound,
							value: data.tenses.presentCompound,
						},
						{ label: dict.tenses.recentPast, value: data.tenses.recentPast },
						{
							label: dict.tenses.evidentialPast,
							value: data.tenses.evidentialPast,
						},
						{ label: dict.tenses.perfect, value: data.tenses.perfect },
						{ label: dict.tenses.remotePast, value: data.tenses.remotePast },
						{
							label: dict.tenses.pastImperfective,
							value: data.tenses.pastImperfective,
						},
						{
							label: dict.tenses.futurePossible,
							value: data.tenses.futurePossible,
						},
						{
							label: dict.tenses.futureFactual,
							value: data.tenses.futureFactual,
						},
					]}
				/>
				<GroupTable
					title={dict.participles.title}
					formHeader={dict.tenses.form}
					valueHeader={dict.tenses.value}
					dash="—"
					rows={[
						{ label: dict.participles.present, value: data.participles.present },
						{ label: dict.participles.past, value: data.participles.past },
						{
							label: dict.participles.gerundPresent,
							value: data.participles.gerundPresent,
						},
						{
							label: dict.participles.gerundPast,
							value: data.participles.gerundPast,
						},
						{ label: dict.participles.masdar, value: data.participles.masdar },
					]}
				/>
				<GroupTable
					title={dict.imperative.title}
					formHeader={dict.tenses.form}
					valueHeader={dict.tenses.value}
					dash="—"
					rows={[
						{ label: dict.imperative.basic, value: data.imperative.basic },
						{ label: dict.imperative.polite, value: data.imperative.polite },
						{
							label: dict.imperative.politePlural,
							value: data.imperative.politePlural,
						},
						{
							label: dict.imperative.negationPresent,
							value: data.negation.present,
						},
						{
							label: dict.imperative.negationImperative,
							value: data.negation.imperative,
						},
					]}
				/>
			</>
		);
	}

	return (
		<section>
			<p className="text-sm text-muted mb-6">
				{dict.intro}{" "}
				<span className="text-foreground font-semibold" lang="ce">
					{dict.infinitive} {word}
				</span>
			</p>
			{content}
		</section>
	);
};
