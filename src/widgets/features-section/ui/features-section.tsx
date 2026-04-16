import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import { FC } from "react";
import { FEATURE_ENTRIES } from "../model/feature-entries";
import { FeatureCard } from "./feature-card";

interface IFeaturesSectionProps {
	features: Dictionary["features"];
}

export const FeaturesSection: FC<IFeaturesSectionProps> = ({ features }) => (
	<section className="py-20 px-6 max-w-[1020px] mx-auto mb-12">
		<div>
			<div className="text-xs font-medium text-primary uppercase tracking-widest text-center mb-3">
				{features.eyebrow}
			</div>
			<Typography
				tag="h2"
				className="text-[clamp(1.5rem,3vw,2.8rem)] font-bold tracking-[-0.03em] text-center"
			>
				{features.title}
			</Typography>
			<Typography
				tag="p"
				className="text-base text-muted text-center max-w-[460px] mx-auto font-light"
			>
				{features.subtitle}
			</Typography>
		</div>

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
