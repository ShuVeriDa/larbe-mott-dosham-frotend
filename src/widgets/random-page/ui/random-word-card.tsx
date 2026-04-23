"use client";

import {
	NounClassBadge,
	WordLevelBadge,
	type WordLevelBadgeContent,
} from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { Typography } from "@/shared/ui";
import type { FC } from "react";
import type { MappedRandomEntry } from "../model/map-random-entry";
import { RandomCardActions } from "./random-card-actions";
import { RandomPhrases } from "./random-phrases";
import { RandomSources } from "./random-sources";

interface RandomWordCardProps {
	card: Dictionary["random"]["card"];
	wordLevelContent: WordLevelBadgeContent;
	entry: MappedRandomEntry;
	isFlipping: boolean;
	lang: string;
}

export const RandomWordCard: FC<RandomWordCardProps> = ({
	card,
	wordLevelContent,
	entry,
	isFlipping,
	lang,
}) => {
	const showLevelBadge = Boolean(entry.wordLevel || entry.attested === false);

	return (
		<article
			className={cn(
				"relative bg-raised border border-edge rounded-xl p-8 max-w-[560px] w-full overflow-hidden transition-[opacity,transform] duration-250",
				"before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-[2px]",
				"before:bg-linear-to-r before:from-transparent before:via-primary before:to-transparent",
				"after:content-['✦'] after:absolute after:top-5 after:right-6 after:text-[2.5rem] after:text-accent after:opacity-[0.06] after:pointer-events-none",
				isFlipping && "opacity-0 scale-[0.97]",
			)}
			aria-live="polite"
		>
			<header className="flex items-baseline gap-3 flex-wrap mb-2">
				<Typography
					tag="h2"
					lang="ce"
					className="text-[clamp(2rem,5vw,2.8rem)] font-extrabold text-foreground tracking-[-0.03em] leading-[1.1]"
				>
					{entry.word}
				</Typography>
				<div className="flex gap-2 items-center flex-wrap">
					{entry.nounClass && <NounClassBadge nounClass={entry.nounClass} />}
					{(entry.partOfSpeechNah || entry.partOfSpeech) && (
						<Typography tag="span" className="text-sm text-muted font-normal">
							{entry.partOfSpeechNah ?? entry.partOfSpeech}
						</Typography>
					)}
					{showLevelBadge && (
						<WordLevelBadge
							wordLevel={entry.wordLevel}
							attested={entry.attested}
							content={wordLevelContent}
						/>
					)}
				</div>
			</header>

			{entry.meanings.length > 0 && (
				<ol className="mb-5 list-none">
					{entry.meanings.map((meaning, idx) => (
						<li
							// biome-ignore lint/suspicious/noArrayIndexKey: meanings are positional
							key={idx}
							className="text-md text-subtle font-light leading-relaxed mb-1"
						>
							<span className="text-xs font-semibold text-primary mr-1 tabular-nums">
								{idx + 1}.
							</span>
							{meaning}
						</li>
					))}
				</ol>
			)}

			{entry.example && (
				<blockquote className="bg-surface border-l-2 border-primary rounded-r-md px-5 py-4 mb-6">
					<Typography
						tag="p"
						lang="ce"
						className="text-base font-medium text-foreground mb-1 leading-[1.5]"
					>
						{entry.example.nah}
					</Typography>
					{entry.example.ru && (
						<Typography
							tag="p"
							className="text-sm text-muted italic leading-[1.5]"
						>
							{entry.example.ru}
						</Typography>
					)}
				</blockquote>
			)}

			<RandomPhrases label={card.phraseologyLabel} phrases={entry.phrases} />

			<RandomSources sources={entry.sources} />

			<RandomCardActions labels={card} entryId={entry.id} lang={lang} />
		</article>
	);
};
