import { FC } from "react";
import type { DictionaryStatsPos } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import { posColorAt } from "../model/pos-colors";
import { resolvePosLabel } from "../model/resolve-pos-label";
import { PosItem } from "./pos-item";

interface IStatsPosGridProps {
	posDistribution: DictionaryStatsPos[];
	labels: Dictionary["stats"]["pos"];
	posValues: Dictionary["search"]["filters"]["posValues"];
}

export const StatsPosGrid: FC<IStatsPosGridProps> = ({
	posDistribution,
	labels,
	posValues,
}) => (
	<section
		aria-labelledby="stats-pos-heading"
		className="max-w-[1020px] w-full mx-auto px-6 pb-16"
	>
		<div className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
			{labels.eyebrow}
		</div>
		<Typography
			tag="h2"
			id="stats-pos-heading"
			className="text-xl font-bold tracking-[-0.02em] text-foreground mb-6"
		>
			{labels.title}
		</Typography>
		<div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] max-[680px]:grid-cols-2 max-[400px]:grid-cols-1">
			{posDistribution.map(({ pos, count }, index) => (
				<PosItem
					key={pos}
					label={resolvePosLabel(pos, posValues)}
					count={count}
					color={posColorAt(index)}
				/>
			))}
		</div>
	</section>
);
