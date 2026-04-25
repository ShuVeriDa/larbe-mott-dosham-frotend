import { Typography } from "@/shared/ui";
import { FC } from "react";

interface IAboutFeatureCardProps {
	icon: string;
	name: string;
	desc: string;
}

export const AboutFeatureCard: FC<IAboutFeatureCardProps> = ({
	icon,
	name,
	desc,
}) => (
	<article className="p-5 bg-surface border border-edge rounded-lg transition-all duration-150 ease-[cubic-bezier(.16,1,.3,1)] hover:bg-surface-hover hover:border-edge-hover hover:-translate-y-0.5">
		<div aria-hidden="true" className="text-[1.4rem] mb-3">
			{icon}
		</div>
		<Typography
			tag="h3"
			className="text-base font-semibold text-foreground mb-1"
		>
			{name}
		</Typography>
		<Typography tag="p" className="text-sm text-muted leading-[1.6]">
			{desc}
		</Typography>
	</article>
);
