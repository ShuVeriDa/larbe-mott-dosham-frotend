import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import { FC } from "react";

interface IAboutHeroProps {
	hero: Dictionary["about"]["hero"];
}

export const AboutHero: FC<IAboutHeroProps> = ({ hero }) => (
	<section className="relative text-center pt-16 pb-12">
		<div
			aria-hidden="true"
			className="pointer-events-none absolute -top-[60px] left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full opacity-30"
			style={{
				background:
					"radial-gradient(circle, var(--accent-glow), transparent 70%)",
			}}
		/>
		<div className="relative text-xs font-semibold uppercase tracking-[0.12em] text-primary mb-4">
			{hero.eyebrow}
		</div>
		<Typography
			tag="h1"
			className="relative text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-foreground mb-4"
		>
			{hero.titleStart}
			<br />
			{hero.titleConnector}{" "}
			<Typography tag="em" className="not-italic text-primary">
				{hero.titleAccent}
			</Typography>
		</Typography>
		<Typography
			tag="p"
			className="relative text-md text-subtle font-light leading-[1.7] max-w-[520px] mx-auto"
		>
			{hero.subtitle}
		</Typography>
	</section>
);
