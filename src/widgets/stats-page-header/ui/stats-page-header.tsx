import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import { FC } from "react";

interface IStatsPageHeaderProps {
	header: Dictionary["stats"]["header"];
}

export const StatsPageHeader: FC<IStatsPageHeaderProps> = ({ header }) => (
	<header className="relative overflow-hidden py-16 px-6 text-center">
		<div
			aria-hidden="true"
			className="pointer-events-none absolute -top-[120px] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full opacity-30"
			style={{
				background:
					"radial-gradient(circle, var(--accent-glow), transparent 70%)",
			}}
		/>
		<div className="relative text-xs font-semibold uppercase tracking-[0.12em] text-primary mb-3">
			{header.eyebrow}
		</div>
		<Typography
			tag="h1"
			className="relative text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-[-0.03em] text-foreground mb-3"
		>
			{header.title}
		</Typography>
		<Typography
			tag="p"
			className="relative text-base text-muted font-light max-w-[480px] mx-auto"
		>
			{header.subtitle}
		</Typography>
	</header>
);
