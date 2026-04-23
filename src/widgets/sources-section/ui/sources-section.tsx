import type { Dictionary } from "@/i18n/dictionaries";
import { SectionHeader } from "@/shared/ui";
import { FC } from "react";
import { SourcesCloud } from "./sources-cloud";

interface ISourcesSectionProps {
	sources: Dictionary["sources"];
	count: number;
}

export const SourcesSection: FC<ISourcesSectionProps> = ({ sources, count }) => (
	<section
		aria-labelledby="sources-heading"
		className="py-16 px-6 max-w-[1020px] mx-auto w-full"
	>
		<SectionHeader
			eyebrow={sources.eyebrow}
			title={sources.title.replace("{count}", String(count))}
			subtitle={sources.subtitle}
			headingId="sources-heading"
		/>
		<SourcesCloud sources={sources} />
	</section>
);
