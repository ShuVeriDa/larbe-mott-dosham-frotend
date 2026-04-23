import { FC } from "react";
import { AnimatedFill } from "@/shared/ui";

interface IDomainCardProps {
	icon: string;
	label: string;
	count: number;
	percentage: number;
}

const formatter = new Intl.NumberFormat("ru-RU");

export const DomainCard: FC<IDomainCardProps> = ({
	icon,
	label,
	count,
	percentage,
}) => (
	<article
		className="p-5 rounded-lg border border-edge bg-surface
			transition-all duration-300
			hover:bg-surface-hover hover:border-edge-hover hover:-translate-y-0.5"
	>
		<div className="text-[1.4rem] mb-3" aria-hidden="true">
			{icon}
		</div>
		<div className="text-sm font-semibold text-foreground mb-1">{label}</div>
		<div className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold font-mono text-foreground tracking-[-0.02em] leading-[1.1] tabular-nums">
			{formatter.format(count)}
		</div>
		<div className="mt-1 text-xs text-muted font-mono tabular-nums">
			{percentage.toFixed(1)}%
		</div>
		<div className="mt-3 h-[3px] rounded-[2px] bg-surface-active overflow-hidden">
			<AnimatedFill
				percent={percentage}
				className="rounded-[2px] bg-primary"
				durationMs={900}
			/>
		</div>
	</article>
);
