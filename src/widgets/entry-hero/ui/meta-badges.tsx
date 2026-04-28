import type {
	DictionaryEntry,
	WordLevelBadgeContent,
} from "@/entities/dictionary";
import { NounClassBadge, WordLevelBadge } from "@/entities/dictionary";
import type { FC } from "react";

interface MetaBadgesProps {
	entry: DictionaryEntry;
	wordLevelContent: WordLevelBadgeContent;
}

export const MetaBadges: FC<MetaBadgesProps> = ({
	entry,
	wordLevelContent,
}) => {
	const nounClasses =
		entry.nounClass
			?.split("/")
			.map(c => c.trim())
			.filter(Boolean) ?? [];

	return (
		<div className="flex gap-2 flex-wrap items-center mb-2">
			{nounClasses.map(c => (
				<NounClassBadge key={c} nounClass={c} />
			))}
			{entry.partOfSpeech && (
				<span className="text-sm text-subtle font-normal">
					{entry.partOfSpeech}
				</span>
			)}
			{entry.partOfSpeechNah && (
				<span className="text-xs text-faint">{entry.partOfSpeechNah}</span>
			)}
			{(entry.wordLevel || entry.attested === false) && (
				<>
					<span aria-hidden className="text-faint mx-0.5">
						·
					</span>
					<WordLevelBadge
						wordLevel={entry.wordLevel}
						attested={entry.attested}
						content={wordLevelContent}
					/>
				</>
			)}
			{entry.domain && (
				<>
					<span aria-hidden className="text-faint mx-0.5">
						·
					</span>
					<span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[0.65rem] font-medium bg-info-dim text-info">
						{entry.domain}
					</span>
				</>
			)}
		</div>
	);
};
