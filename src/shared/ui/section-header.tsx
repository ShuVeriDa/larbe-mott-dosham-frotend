import { FC } from "react";
import { Typography } from "./typography";

interface ISectionHeaderProps {
	eyebrow: string;
	title: string;
	subtitle: string;
	headingId?: string;
}

export const SectionHeader: FC<ISectionHeaderProps> = ({
	eyebrow,
	title,
	subtitle,
	headingId,
}) => (
	<div>
		<div className="text-xs font-medium text-primary uppercase tracking-widest text-center mb-3">
			{eyebrow}
		</div>
		<Typography
			tag="h2"
			id={headingId}
			className="text-[clamp(1.5rem,3vw,2.8rem)] font-bold tracking-[-0.03em] text-center"
		>
			{title}
		</Typography>
		<Typography
			tag="p"
			className="text-base text-muted text-center max-w-[460px] mx-auto font-light"
		>
			{subtitle}
		</Typography>
	</div>
);
