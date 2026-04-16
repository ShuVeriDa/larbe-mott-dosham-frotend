"use client";

import type { WordLevelBadgeContent } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { useWordOfDayModel } from "../model/use-word-of-day-model";
import { WordOfDayActions } from "./word-of-day-actions";
import { WordOfDayDefinition } from "./word-of-day-definition";
import { WordOfDayExample } from "./word-of-day-example";
import { WordOfDayLabel } from "./word-of-day-label";
import { WordOfDaySkeleton } from "./word-of-day-skeleton";
import { WordOfDayUnavailable } from "./word-of-day-unavailable";
import { WordOfDayWord } from "./word-of-day-word";

interface IWordOfDayProps {
	wordOfDay: Dictionary["wordOfDay"];
	wordLevelContent: WordLevelBadgeContent;
}

export function WordOfDay({ wordOfDay, wordLevelContent }: IWordOfDayProps) {
	const {
		lang,
		isLoading,
		isError,
		entryId,
		mapped,
		isLoadingNext,
		fetchRandom,
	} = useWordOfDayModel();

	if (isLoading) return <WordOfDaySkeleton />;

	if (isError || !mapped) {
		return (
			<WordOfDayUnavailable
				label={wordOfDay.label}
				unavailable={wordOfDay.unavailable}
			/>
		);
	}

	const usageLevelLabel = mapped.wordLevel
		? wordOfDay.wordLevel[mapped.wordLevel]
		: undefined;

	return (
		<section className="px-6 pb-16 w-full">
			<div className="max-w-[600px] mx-auto">
				<div
					className="relative bg-raised border border-edge rounded-xl p-8 overflow-hidden
					before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-[2px]
					before:bg-linear-to-r before:from-transparent before:via-primary before:to-transparent
					after:content-['✦'] after:absolute after:top-5 after:right-6 after:text-[2rem] after:text-accent after:opacity-[0.07]"
				>
					<WordOfDayLabel label={wordOfDay.label} />
					<WordOfDayWord
						word={mapped.word}
						nounClass={mapped.nounClass}
						partOfSpeech={mapped.partOfSpeechNah}
						wordLevel={mapped.wordLevel}
						attested={mapped.attested}
						usageLevelLabel={usageLevelLabel}
						wordLevelContent={wordLevelContent}
					/>
					{mapped.definition && (
						<WordOfDayDefinition definition={mapped.definition} />
					)}
					{mapped.sentence && (
						<WordOfDayExample
							sentence={mapped.sentence}
							translation={mapped.translation}
						/>
					)}
					<WordOfDayActions
						openCard={wordOfDay.openCard}
						nextWord={wordOfDay.nextWord}
						entryId={entryId}
						lang={lang}
						isLoadingNext={isLoadingNext}
						onNextWord={fetchRandom}
					/>
				</div>
			</div>
		</section>
	);
}
