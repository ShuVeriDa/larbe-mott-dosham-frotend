import type { Dictionary } from "@/i18n/dictionaries";
import { FC } from "react";
import { SOURCE_ENTRIES } from "../model/source-entries";
import { SourcePill } from "./source-pill";

interface ISourcesCloudProps {
	sources: Dictionary["sources"];
}

export const SourcesCloud: FC<ISourcesCloudProps> = ({ sources }) => (
	<div className="flex flex-wrap justify-center gap-3 mt-8">
		{SOURCE_ENTRIES.map(({ key, tag }) => {
			const annotation = tag
				? tag.kind === "dir"
					? { kind: "dir" as const, label: sources.directions[tag.dirKey] }
					: { kind: "domain" as const, label: sources.domains[tag.domainKey] }
				: undefined;

			return (
				<SourcePill
					key={key}
					name={sources.items[key]}
					annotation={annotation}
				/>
			);
		})}
	</div>
);
