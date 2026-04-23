import { FC } from "react";
import type {
	DictionaryStatsAttested,
	DictionaryStatsWordLevel,
} from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import { isLevelKey } from "../model/level-colors";
import { AttestedSummary } from "./attested-summary";
import { LevelRow } from "./level-row";

interface ILevelChartProps {
	wordLevels: DictionaryStatsWordLevel[];
	attested: DictionaryStatsAttested;
	levelsUnclassified: number;
	labels: Dictionary["stats"]["levels"];
}

const formatter = new Intl.NumberFormat("ru-RU");

export const LevelChart: FC<ILevelChartProps> = ({
	wordLevels,
	attested,
	levelsUnclassified,
	labels,
}) => (
	<section
		aria-labelledby="stats-levels-heading"
		className="max-w-[1020px] w-full mx-auto px-6 pb-16"
	>
		<div className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
			{labels.eyebrow}
		</div>
		<Typography
			tag="h2"
			id="stats-levels-heading"
			className="text-xl font-bold tracking-[-0.02em] text-foreground mb-6"
		>
			{labels.title}
		</Typography>
		<div className="flex flex-col gap-3">
			{wordLevels
				.filter(({ level }) => isLevelKey(level))
				.map(({ level, count, percentage }) => (
					<LevelRow
						key={level}
						level={level as "A" | "B" | "C"}
						count={count}
						percentage={percentage}
					/>
				))}
		</div>

		{levelsUnclassified > 0 && (
			<div className="mt-4 text-xs text-faint font-mono tabular-nums">
				{labels.unclassified.replace(
					"{count}",
					formatter.format(levelsUnclassified),
				)}
			</div>
		)}

		<AttestedSummary attested={attested} labels={labels} />
	</section>
);
