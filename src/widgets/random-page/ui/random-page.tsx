"use client";

import type { WordLevelBadgeContent } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import type { Level } from "../lib/parse-level";
import { mapRandomEntry } from "../model/map-random-entry";
import { useRandomPage } from "../model/use-random-page";
import { RandomCardError } from "./random-card-error";
import { RandomCardSkeleton } from "./random-card-skeleton";
import { RandomLevelFilter } from "./random-level-filter";
import { RandomShuffle } from "./random-shuffle";
import { RandomWordCard } from "./random-word-card";

interface RandomPageProps {
	random: Dictionary["random"];
	wordLevelContent: WordLevelBadgeContent;
	initialLevel: Level;
	lang: string;
}

export const RandomPage: FC<RandomPageProps> = ({
	random,
	wordLevelContent,
	initialLevel,
	lang,
}) => {
	const {
		activeLevel,
		entry,
		isPending,
		isFlipping,
		isError,
		shuffle,
		changeLevel,
		retry,
		resetFilter,
	} = useRandomPage({ initialLevel });

	const mapped = entry ? mapRandomEntry(entry) : null;
	const showEmpty = !isPending && !isError && !entry && activeLevel !== "ALL";
	const showInitialSkeleton = !mapped && isPending;
	const showError = isError;

	return (
		<section className="relative flex flex-col items-center px-6 pb-16">
			<RandomLevelFilter
				labels={random.filter}
				active={activeLevel}
				onChange={changeLevel}
				disabled={isPending}
			/>

			{showInitialSkeleton ? (
				<RandomCardSkeleton />
			) : showError ? (
				<RandomCardError
					labels={random.states}
					onRetry={retry}
					variant="error"
				/>
			) : showEmpty ? (
				<RandomCardError
					labels={random.states}
					onRetry={retry}
					onResetFilter={resetFilter}
					variant="empty"
				/>
			) : mapped ? (
				<RandomWordCard
					card={random.card}
					wordLevelContent={wordLevelContent}
					entry={mapped}
					isFlipping={isFlipping}
					lang={lang}
				/>
			) : (
				<RandomCardSkeleton />
			)}

			<RandomShuffle
				labels={random.shuffle}
				onShuffle={shuffle}
				isPending={isPending}
			/>
		</section>
	);
};
