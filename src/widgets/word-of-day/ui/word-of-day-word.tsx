import type { WordLevel } from "@/entities/dictionary";
import { Typography } from "@/shared/ui";
import { FC } from "react";

const levelClasses: Record<WordLevel, string> = {
	COMMON: "bg-level-common-bg text-level-common",
	STANDARD: "bg-level-standard-bg text-level-standard",
	RARE: "bg-level-rare-bg text-level-rare",
	ARCHAIC: "bg-level-archaic-bg text-level-archaic",
};

interface IWordOfDayWordProps {
	word: string;
	nounClass?: string;
	partOfSpeech?: string;
	nounClassPlural?: string;
	wordLevel?: WordLevel;
	usageLevelLabel?: string;
}

export const WordOfDayWord: FC<IWordOfDayWordProps> = ({
	word,
	nounClass,
	partOfSpeech,
	nounClassPlural,
	wordLevel,
	usageLevelLabel,
}) => {
	return (
		<div className="flex items-baseline gap-3 flex-wrap mb-2">
			<Typography
				tag="span"
				className="text-[clamp(2rem,4vw,2.8rem)] font-extrabold text-foreground tracking-[-0.03em] leading-[1.1]"
			>
				{word}
			</Typography>
			{(nounClass || partOfSpeech || nounClassPlural || wordLevel) && (
				<div className="flex gap-2 items-center">
					{nounClass && (
						<Typography
							tag="span"
							className="bg-vu-bg text-vu inline-flex items-center font-semibold py-0.5 px-2 rounded-xs text-xs tracking-[0.02em]"
						>
							{nounClass}
						</Typography>
					)}
					{partOfSpeech && (
						<Typography tag="span" className="text-sm text-muted font-normal">
							{partOfSpeech}
						</Typography>
					)}
					{wordLevel && usageLevelLabel && (
						<Typography
							tag="span"
							className={`inline-flex items-center font-semibold py-0.5 px-2 rounded-xs text-xs tracking-[0.02em] ${levelClasses[wordLevel]}`}
						>
							{usageLevelLabel}
						</Typography>
					)}
				</div>
			)}
		</div>
	);
};
