import type { DictionaryEntry } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import { EntryActions } from "./entry-actions";
import { MetaBadges } from "./meta-badges";
import { PronunciationButton } from "./pronunciation-button";

interface EntryHeroProps {
	entry: DictionaryEntry;
	lang: string;
	dict: Dictionary["entry"];
	wordLevelDict: Dictionary["wordLevel"];
}

export const EntryHero: FC<EntryHeroProps> = ({
	entry,
	lang,
	dict,
	wordLevelDict,
}) => {
	const hero = dict.hero;
	const hasVariants = entry.variants && entry.variants.length > 0;
	const variantList = hasVariants
		? [entry.word, ...(entry.variants ?? [])].join(", ")
		: null;

	return (
		<section className="relative py-6">
			<div className="absolute w-[400px] h-[400px] -top-[60%] left-[10%] bg-[radial-gradient(circle,var(--primary-glow),transparent_70%)] opacity-30 pointer-events-none blur-[80px]" />
			<div className="flex items-start gap-4 flex-wrap relative">
				<div className="flex-1 min-w-0">
					<h1 className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-[-0.04em] text-foreground leading-[1.1] mb-1">
						{entry.word}
					</h1>
					{entry.wordAccented && (
						<div
							className="text-sm text-muted font-light mb-3"
							aria-label="Accented form"
						>
							{entry.wordAccented}
						</div>
					)}

					<MetaBadges entry={entry} wordLevelContent={wordLevelDict} />

					{variantList && (
						<div className="text-sm text-muted mb-1">
							{hero.variantsLabel}{" "}
							<span className="text-subtle font-medium">{variantList}</span>
						</div>
					)}

					<PronunciationButton
						label={hero.pronunciationLabel}
						hint={hero.pronunciationHint}
					/>
				</div>

				<EntryActions
					entry={entry}
					lang={lang}
					dict={hero}
					suggestDict={dict.suggest}
				/>
			</div>
		</section>
	);
};
