import type { Dictionary } from "@/i18n/dictionaries";
import { SectionHeader } from "@/shared/ui";
import { FC } from "react";
import { MORPH_ENTRIES } from "../model/morph-entries";
import { MorphClassBadge } from "./morph-class-badge";
import { MorphPanel } from "./morph-panel";
import { MorphRow } from "./morph-row";

interface IMorphologySectionProps {
	morphology: Dictionary["morphology"];
}

export const MorphologySection: FC<IMorphologySectionProps> = ({
	morphology,
}) => (
	<section
		aria-labelledby="morphology-heading"
		className="py-20 px-6 max-w-[1020px] mx-auto w-full"
	>
		<SectionHeader
			eyebrow={morphology.eyebrow}
			title={morphology.title}
			subtitle={morphology.subtitle}
			headingId="morphology-heading"
		/>

		<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
			{MORPH_ENTRIES.map(entry => {
				if (entry.kind === "declension") {
					return (
						<MorphPanel
							key={entry.word}
							word={entry.word}
							subtitle={`${morphology.typeI} · ${morphology.declension}`}
							badge={
								<MorphClassBadge
									classKey={entry.classKey}
									label={morphology.classes[entry.classKey]}
								/>
							}
						>
							{entry.rows.map(row => (
								<MorphRow
									key={row.caseKey}
									label={morphology.cases[row.caseKey]}
									form={row.form}
									highlight={row.highlight}
								/>
							))}
						</MorphPanel>
					);
				}

				return (
					<MorphPanel
						key={entry.word}
						word={entry.word}
						subtitle={`${morphology.typeI} · ${morphology.conjugation}`}
						badge={
							<span className="text-xs text-muted font-mono">
								{morphology.verbAbbr}
							</span>
						}
					>
						{entry.rows.map(row => (
							<MorphRow
								key={row.tenseKey}
								label={morphology.tenses[row.tenseKey]}
								form={row.form}
								highlight={row.highlight}
							/>
						))}
					</MorphPanel>
				);
			})}
		</div>
	</section>
);
