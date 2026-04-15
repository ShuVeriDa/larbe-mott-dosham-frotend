import type { DictionaryEntry, NounClass, WordLevel } from "@/entities/dictionary";

export interface MappedWordOfDay {
	word: string;
	nounClass?: NounClass;
	partOfSpeechNah?: string;
	nounClassPlural?: NounClass;
	wordLevel?: WordLevel;
	definition: string;
	sentence?: string;
	translation?: string;
}

export function mapEntry(entry: DictionaryEntry): MappedWordOfDay {
	const meaningWithExamples = entry.meanings.find(
		(m) => m.examples && m.examples.length > 0,
	);
	const meaningForDefinition = meaningWithExamples ?? entry.meanings[0];
	const firstExample = meaningWithExamples?.examples?.[0];

	return {
		word: entry.wordAccented ?? entry.word,
		nounClass: entry.nounClass,
		partOfSpeechNah: entry.partOfSpeechNah,
		nounClassPlural: entry.nounClassPlural,
		wordLevel: entry.wordLevel,
		definition: meaningForDefinition?.translation ?? "",
		sentence: firstExample?.nah,
		translation: firstExample?.ru,
	};
}
