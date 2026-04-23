import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import type { FC } from "react";

interface RandomHeroProps {
	random: Dictionary["random"];
	totalCount?: number;
}

const formatSubtitle = (template: string, count: number | undefined) => {
	if (count === undefined) return template.replace("{count}", "—");
	return template.replace("{count}", new Intl.NumberFormat("ru-RU").format(count));
};

export const RandomHero: FC<RandomHeroProps> = ({ random, totalCount }) => {
	const subtitle = totalCount
		? formatSubtitle(random.hero.subtitle, totalCount)
		: random.hero.subtitleNoCount;

	return (
		<header className="relative text-center pt-16 pb-8 px-6">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
				style={{
					background:
						"radial-gradient(circle, var(--accent-glow), transparent 70%)",
				}}
			/>

			<div className="relative inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-primary mb-3 before:content-[''] before:block before:w-4 before:h-px before:bg-primary after:content-[''] after:block after:w-4 after:h-px after:bg-primary">
				{random.hero.eyebrow}
			</div>

			<Typography
				tag="h1"
				className="relative text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-[-0.03em] text-foreground mb-2"
			>
				{random.hero.title}
			</Typography>

			<Typography
				tag="p"
				className="relative text-sm text-muted font-light max-w-[520px] mx-auto"
			>
				{subtitle}
			</Typography>
		</header>
	);
};
