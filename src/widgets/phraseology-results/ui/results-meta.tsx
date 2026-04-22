import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

type ResultsDict = Dictionary["phraseology"]["results"];

interface ResultsMetaProps {
	total: number;
	query: string;
	dict: ResultsDict;
}

export const ResultsMeta: FC<ResultsMetaProps> = ({ total, query, dict }) => (
	<div className="flex items-center justify-between flex-wrap gap-3 mb-5">
		<div className="text-sm text-muted">
			{query ? (
				<>
					{dict.foundPrefix}{" "}
					<strong className="text-foreground font-semibold">{total}</strong>{" "}
					{dict.foundSuffix} «
					<strong className="text-foreground font-semibold">{query}</strong>
					»
				</>
			) : (
				<>
					{dict.browseLabel}{" "}
					<strong className="text-foreground font-semibold">{total}</strong>
				</>
			)}
		</div>
	</div>
);
