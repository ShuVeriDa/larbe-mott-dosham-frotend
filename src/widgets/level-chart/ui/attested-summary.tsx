import { FC } from "react";
import type { DictionaryStatsAttested } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";

interface IAttestedSummaryProps {
	attested: DictionaryStatsAttested;
	labels: Dictionary["stats"]["levels"];
}

const formatter = new Intl.NumberFormat("ru-RU");

export const AttestedSummary: FC<IAttestedSummaryProps> = ({
	attested,
	labels,
}) => {
	const total = attested.true + attested.false;
	if (total === 0) return null;

	const truePct = (attested.true / total) * 100;
	const falsePct = 100 - truePct;

	return (
		<div className="mt-6 pt-6 border-t border-edge">
			<Typography
				tag="span"
				className="block text-xs font-semibold text-subtle mb-3 uppercase tracking-wider"
			>
				{labels.attestedTitle}
			</Typography>
			<div className="flex h-3 w-full overflow-hidden rounded-full bg-surface">
				<div
					className="bg-success/70"
					style={{ width: `${truePct}%` }}
					aria-label={labels.attestedTrue}
				/>
				<div
					className="bg-muted/40"
					style={{ width: `${falsePct}%` }}
					aria-label={labels.attestedFalse}
				/>
			</div>
			<div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted font-mono tabular-nums">
				<span>
					<span className="inline-block w-2 h-2 rounded-full bg-success/70 mr-1.5 align-middle" />
					{labels.attestedTrue}: {formatter.format(attested.true)} (
					{truePct.toFixed(1)}%)
				</span>
				<span>
					<span className="inline-block w-2 h-2 rounded-full bg-muted/40 mr-1.5 align-middle" />
					{labels.attestedFalse}: {formatter.format(attested.false)} (
					{falsePct.toFixed(1)}%)
				</span>
			</div>
		</div>
	);
};
