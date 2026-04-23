import { FC } from "react";
import type { DictionarySource } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import { resolveDirectionLabel } from "../model/direction-label";
import { SourceRow } from "./source-row";

interface IStatsSourcesTableProps {
	sources: DictionarySource[];
	labels: Dictionary["stats"]["sources"];
}

export const StatsSourcesTable: FC<IStatsSourcesTableProps> = ({
	sources,
	labels,
}) => {
	const sorted = [...sources].sort((a, b) => b.count - a.count);
	const maxCount = sorted[0]?.count ?? 0;

	return (
		<section
			aria-labelledby="stats-sources-heading"
			className="max-w-[1020px] w-full mx-auto px-6 pb-16"
		>
			<div className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
				{labels.eyebrow}
			</div>
			<Typography
				tag="h2"
				id="stats-sources-heading"
				className="text-xl font-bold tracking-[-0.02em] text-foreground mb-6"
			>
				{labels.titleTemplate.replace("{count}", sources.length.toString())}
			</Typography>

			<div className="bg-raised border border-edge rounded-xl overflow-x-auto">
				<table className="w-full border-collapse">
					<thead>
						<tr>
							<th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted border-b border-edge">
								{labels.columns.name}
							</th>
							<th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted border-b border-edge max-[860px]:hidden">
								{labels.columns.slug}
							</th>
							<th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted border-b border-edge max-[680px]:hidden">
								{labels.columns.direction}
							</th>
							<th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted border-b border-edge max-[680px]:hidden">
								{labels.columns.count}
							</th>
							<th
								className="px-4 py-3 border-b border-edge"
								aria-hidden="true"
							/>
						</tr>
					</thead>
					<tbody>
						{sorted.map(src => (
							<SourceRow
								key={src.slug}
								name={src.name}
								slug={src.slug}
								directionLabel={resolveDirectionLabel(
									src.direction,
									labels.directions,
								)}
								count={src.count}
								maxCount={maxCount}
							/>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
};
