import { FC } from "react";
import { splitLeadingDigits } from "@/shared/lib";
import { Typography } from "@/shared/ui";

interface IHeroStatCardProps {
	label: string;
	value: number;
	highlight?: boolean;
}

export const HeroStatCard: FC<IHeroStatCardProps> = ({
	label,
	value,
	highlight = false,
}) => {
	const { leading, rest } = splitLeadingDigits(value);

	return (
		<div
			className="relative overflow-hidden text-center p-6 px-5 rounded-lg
				border border-edge bg-surface transition-all duration-300
				hover:bg-surface-hover hover:border-edge-hover hover:-translate-y-0.5 hover:shadow-md"
		>
			<div className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] font-mono text-foreground tabular-nums mb-1">
				{highlight && leading ? (
					<>
						<Typography tag="span" className="text-primary">
							{leading}
						</Typography>
						<Typography tag="span">&thinsp;{rest}</Typography>
					</>
				) : (
					<Typography tag="span">
						{leading}
						{leading ? " " : ""}
						{rest}
					</Typography>
				)}
			</div>
			<div className="text-xs font-normal text-muted">{label}</div>
		</div>
	);
};
