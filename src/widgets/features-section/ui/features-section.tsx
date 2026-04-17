import type { Dictionary } from "@/i18n/dictionaries";
import { SectionHeader } from "@/shared/ui";
import { FC } from "react";
import { FEATURE_ENTRIES } from "../model/feature-entries";
import { FeatureCard } from "./feature-card";

interface IFeaturesSectionProps {
	features: Dictionary["features"];
}

export const FeaturesSection: FC<IFeaturesSectionProps> = ({ features }) => (
	<section
		aria-labelledby="features-heading"
		className="py-20 px-6 max-w-[1020px] mx-auto"
	>
		<SectionHeader
			eyebrow={features.eyebrow}
			title={features.title}
			subtitle={features.subtitle}
			headingId="features-heading"
		/>

		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
			{FEATURE_ENTRIES.map(({ key, icon }) => (
				<FeatureCard
					key={key}
					icon={icon}
					name={features.items[key].name}
					desc={features.items[key].desc}
				/>
			))}
		</div>
	</section>
);
