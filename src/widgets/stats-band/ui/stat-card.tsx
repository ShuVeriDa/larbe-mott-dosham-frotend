import { FC } from "react";
import { splitLeadingDigits } from "@/shared/lib";
import { Typography } from "@/shared/ui";

interface IStatCardProps {
	label: string;
	value: number;
}

export const StatCard: FC<IStatCardProps> = ({ label, value }) => {
	const { leading, rest } = splitLeadingDigits(value);

	return (
		<div className="text-center p-4">
			<div
				className="text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold text-foreground
					leading-none mb-1 tracking-[-0.02em] tabular-nums"
			>
				<Typography tag="span" className="text-accent">
					{leading}
				</Typography>
				<Typography tag="span">&thinsp;{rest}</Typography>
			</div>
			<div>
				<Typography tag="span" className="text-xs text-muted">
					{label}
				</Typography>
			</div>
		</div>
	);
};
