"use client";

import type { DeclensionCaseSet } from "@/entities/dictionary";
import { useDeclension } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

type DeclensionDict = Dictionary["entry"]["declension"];

type CaseKey = keyof DeclensionDict["cases"];

const CASE_ORDER: CaseKey[] = [
	"nominative",
	"genitive",
	"dative",
	"ergative",
	"instrumental",
	"substantive",
	"locative",
	"comparative",
];

interface DeclensionPanelProps {
	word: string;
	isApplicable: boolean;
	dict: DeclensionDict;
}

const SkeletonRows: FC = () => (
	<div className="space-y-2" aria-hidden>
		{Array.from({ length: 8 }).map((_, i) => (
			<div key={i} className="h-10 bg-surface animate-pulse rounded-md" />
		))}
	</div>
);

const getForm = (set: DeclensionCaseSet | null | undefined, key: CaseKey) =>
	set ? set[key] : null;

export const DeclensionPanel: FC<DeclensionPanelProps> = ({
	word,
	isApplicable,
	dict,
}) => {
	const { data, isLoading, isError } = useDeclension(isApplicable ? word : "");

	if (!isApplicable) {
		return <p className="text-sm text-muted py-4">{dict.notApplicable}</p>;
	}

	return (
		<section className="mb-8">
			<h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
				<span
					aria-hidden
					className="w-[3px] h-[14px] bg-primary rounded-[2px]"
				/>
				{dict.title}
				{data?.declensionType ? (
					<span className="ml-2 text-xs text-faint font-normal">
						{dict.typeLabel} {data.declensionType}
					</span>
				) : null}
			</h2>

			{isLoading && <SkeletonRows />}

			{isError && <p className="text-sm text-muted py-4">{dict.empty}</p>}

			{!isLoading && !isError && data && (
				<div className="overflow-x-auto border border-edge rounded-lg">
					<table className="w-full border-collapse text-sm">
						<caption className="sr-only">
							{dict.tableCaption.replace("{word}", word)}
						</caption>
						<thead>
							<tr>
								<th
									scope="col"
									className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-[0.06em] bg-surface border-b border-edge"
								>
									{dict.caseColumn}
								</th>
								<th
									scope="col"
									className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-[0.06em] bg-surface border-b border-edge"
								>
									{dict.singularColumn}
								</th>
								<th
									scope="col"
									className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-[0.06em] bg-surface border-b border-edge"
								>
									{dict.pluralColumn}
								</th>
							</tr>
						</thead>
						<tbody>
							{CASE_ORDER.map((key, i) => {
								const sg = getForm(data.singular, key);
								const pl = getForm(data.plural, key);
								const isFirst = i === 0;
								return (
									<tr
										key={key}
										className="border-b border-edge last:border-b-0 hover:bg-surface-hover"
									>
										<th
											scope="row"
											className="text-left px-4 py-3 text-muted font-medium text-xs min-w-[130px] align-top"
										>
											{dict.cases[key].nah}
											<span className="block text-faint text-[0.6rem] font-normal mt-px">
												{dict.cases[key].ru}
											</span>
										</th>
										<td
											className={`px-4 py-3 text-foreground font-medium tracking-[-0.01em] ${
												isFirst ? "text-primary font-semibold" : ""
											}`}
											lang="ce"
										>
											{sg || dict.dash}
										</td>
										<td
											className="px-4 py-3 text-foreground font-medium tracking-[-0.01em]"
											lang="ce"
										>
											{pl || dict.dash}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
};
