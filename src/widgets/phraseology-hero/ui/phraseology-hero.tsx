import type { Dictionary } from "@/i18n/dictionaries";
import { PhraseologySearchBar } from "@/widgets/phraseology-search-bar";
import type { FC } from "react";
import { PhraseologyHeroHeadline } from "./phraseology-hero-headline";

interface PhraseologyHeroProps {
	phraseology: Dictionary["phraseology"];
	lang: string;
}

export const PhraseologyHero: FC<PhraseologyHeroProps> = ({
	phraseology,
	lang,
}) => (
	<section
		aria-labelledby="phraseology-hero-heading"
		className="relative text-center pt-20 pb-12"
	>
		<div
			aria-hidden
			className="pointer-events-none absolute left-1/2 -top-[30%] w-[500px] h-[500px] -translate-x-1/2 opacity-35 blur-[80px]"
			style={{
				background:
					"radial-gradient(circle, var(--accent-glow), transparent 70%)",
			}}
		/>
		<PhraseologyHeroHeadline hero={phraseology.hero} />
		<PhraseologySearchBar phraseology={phraseology} lang={lang} />
	</section>
);
