import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import { FC } from "react";
import { ABOUT_SOURCE_ENTRIES } from "../model/sources";
import { AboutSectionTitle } from "./about-section-title";
import { AboutSourceCard } from "./about-source-card";

interface IAboutSourcesProps {
	sources: Dictionary["about"]["sources"];
}

export const AboutSources: FC<IAboutSourcesProps> = ({ sources }) => {
	const buildMeta = (
		direction: keyof typeof sources.directions,
		domain: keyof typeof sources.domains,
	) => {
		const parts = [sources.directions[direction]];
		const domainLabel = sources.domains[domain];
		if (domainLabel) parts.push(domainLabel);
		return parts.join(" · ");
	};

	return (
		<section className="mb-12" aria-labelledby="about-sources-heading">
			<AboutSectionTitle id="about-sources-heading">
				{sources.title}
			</AboutSectionTitle>
			<Typography
				tag="p"
				className="text-base text-subtle leading-[1.8] mb-4"
			>
				{sources.description}
			</Typography>
			<div
				className="grid gap-3 mt-4"
				style={{
					gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
				}}
			>
				{ABOUT_SOURCE_ENTRIES.map(({ slug, direction, domain }) => (
					<AboutSourceCard
						key={slug}
						slug={slug}
						name={sources.items[slug].name}
						meta={buildMeta(direction, domain)}
						domain={domain}
						domainLabel={sources.domains[domain] ?? null}
					/>
				))}
			</div>
		</section>
	);
};
