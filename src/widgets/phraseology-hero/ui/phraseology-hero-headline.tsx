import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import type { FC } from "react";

interface PhraseologyHeroHeadlineProps {
	hero: Dictionary["phraseology"]["hero"];
}

export const PhraseologyHeroHeadline: FC<PhraseologyHeroHeadlineProps> = ({
	hero,
}) => (
	<>
		<div
			aria-hidden
			className="text-[2.4rem] mb-4 inline-block opacity-70"
		>
			{hero.icon}
		</div>
		<Typography
			tag="h1"
			id="phraseology-hero-heading"
			className="text-[clamp(1.8rem,5vw,2.8rem)] text-foreground mb-2 font-extrabold tracking-[-0.04em]"
		>
			{hero.title}
		</Typography>
		<Typography
			tag="p"
			className="text-base text-muted font-light mb-10"
		>
			{hero.subtitle}
		</Typography>
	</>
);
