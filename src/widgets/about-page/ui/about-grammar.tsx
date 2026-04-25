import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import { FC } from "react";
import { GRAMMAR_CARD_ORDER } from "../model/grammar";
import { AboutGrammarCard } from "./about-grammar-card";
import { AboutSectionTitle } from "./about-section-title";

interface IAboutGrammarProps {
	grammar: Dictionary["about"]["grammar"];
}

export const AboutGrammar: FC<IAboutGrammarProps> = ({ grammar }) => (
	<section className="mb-12" aria-labelledby="about-grammar-heading">
		<AboutSectionTitle id="about-grammar-heading">
			{grammar.title}
		</AboutSectionTitle>
		<Typography
			tag="p"
			className="text-base text-subtle leading-[1.8] mb-4"
		>
			{grammar.description}
		</Typography>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
			{GRAMMAR_CARD_ORDER.map(key => (
				<AboutGrammarCard
					key={key}
					title={grammar.cards[key].title}
					segments={grammar.cards[key].segments}
				/>
			))}
		</div>
	</section>
);
