"use client";

import type {
	DerivationType,
	DerivedFormsByType,
} from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";

interface DerivedFormsPanelProps {
	derivedForms: DerivedFormsByType;
	lang: string;
	dict: Dictionary["entry"]["derivedForms"];
	verbFormKindDict: Dictionary["entry"]["derivation"]["verbFormKind"];
}

// Порядок отображения групп (от частых типов к редким). Группы, которых нет
// в derivedForms, просто не рендерятся.
const TYPE_ORDER: readonly DerivationType[] = [
	"causative",
	"potential",
	"masdar",
	"participle",
	"gerund",
	"diminutive",
	"plural-of",
	"verb-form",
	"see",
];

export const DerivedFormsPanel: FC<DerivedFormsPanelProps> = ({
	derivedForms,
	lang,
	dict,
	verbFormKindDict,
}) => {
	const groups = TYPE_ORDER.filter(
		t => (derivedForms[t]?.length ?? 0) > 0,
	);

	if (groups.length === 0) {
		return <p className="text-sm text-muted py-4">{dict.empty}</p>;
	}

	return (
		<div className="flex flex-col gap-6">
			{groups.map(type => {
				const items = derivedForms[type] ?? [];
				return (
					<section key={type}>
						<h3 className="text-xs uppercase tracking-wider text-muted font-semibold mb-2">
							{dict.groupTitles[type]}
							<span className="ml-2 text-faint normal-case font-normal tracking-normal">
								{items.length}
							</span>
						</h3>
						<ul className="flex flex-wrap gap-2">
							{items.map(form => (
								<li key={form.id}>
									<Link
										href={`/${lang}/entry/${form.id}`}
										className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-edge rounded-md text-sm text-foreground hover:border-primary hover:bg-surface-hover transition"
										lang="ce"
									>
										<span className="font-medium">{form.word}</span>
										{form.verbFormKind && (
											<span className="text-[0.65rem] text-muted font-normal">
												{verbFormKindDict[form.verbFormKind]}
											</span>
										)}
									</Link>
								</li>
							))}
						</ul>
					</section>
				);
			})}
		</div>
	);
};
