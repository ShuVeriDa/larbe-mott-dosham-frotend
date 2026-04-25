import type { Dictionary } from "@/i18n/dictionaries";
import { FC } from "react";
import { ABOUT_FEATURE_ENTRIES } from "../model/features";
import { AboutFeatureCard } from "./about-feature-card";
import { AboutSectionTitle } from "./about-section-title";

interface IAboutFeaturesProps {
	features: Dictionary["about"]["features"];
}

export const AboutFeatures: FC<IAboutFeaturesProps> = ({ features }) => (
	<section className="mb-12" aria-labelledby="about-features-heading">
		<AboutSectionTitle id="about-features-heading">
			{features.title}
		</AboutSectionTitle>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
			{ABOUT_FEATURE_ENTRIES.map(({ key, icon }) => (
				<AboutFeatureCard
					key={key}
					icon={icon}
					name={features.items[key].name}
					desc={features.items[key].desc}
				/>
			))}
		</div>
	</section>
);
