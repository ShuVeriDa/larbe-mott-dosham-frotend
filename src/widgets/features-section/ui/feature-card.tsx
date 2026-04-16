import { Typography } from "@/shared/ui";
import { FC } from "react";

interface IFeatureCardProps {
	icon: string;
	name: string;
	desc: string;
}

export const FeatureCard: FC<IFeatureCardProps> = ({ icon, name, desc }) => (
	<article className="bg-surface border border-edge rounded-lg p-6 transition-all duration-300 relative overflow-hidden hover:bg-surface-hover hover:border-edge-hover hover:-translate-y-1 hover:shadow-md">
		<div className="w-12 h-12 rounded-md bg-primary-dim border border-edge-accent flex items-center justify-center text-[1.2rem] mb-4">
			{icon}
		</div>
		<Typography
			tag="h3"
			className="text-md font-semibold text-foreground mb-2"
		>
			{name}
		</Typography>
		<p className="text-sm text-muted leading-[1.6]">{desc}</p>
	</article>
);
