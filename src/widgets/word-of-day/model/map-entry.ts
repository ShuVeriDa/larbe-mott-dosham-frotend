import type {
	DictionarySearchResult,
	NounClass,
	WordLevel,
} from "@/entities/dictionary";

export interface MappedWordOfDay {
	word: string;
	nounClass?: NounClass;
	partOfSpeechNah?: string;
	wordLevel?: WordLevel;
	attested?: boolean;
	definition: string;
	sentence?: string;
	translation?: string;
}

export function mapEntry(entry: DictionarySearchResult): MappedWordOfDay {
	const meaningWithExamples = entry.meanings.find(
		(m) => m.examples && m.examples.length > 0,
	);
	const meaningForDefinition = meaningWithExamples ?? entry.meanings[0];
	const firstExample = meaningWithExamples?.examples?.[0];

	return {
		word: entry.wordAccented ?? entry.word,
		nounClass: entry.nounClass,
		partOfSpeechNah: entry.partOfSpeechNah,
		wordLevel: entry.wordLevel,
		attested: entry.attested,
		definition: meaningForDefinition?.translation ?? "",
		sentence: firstExample?.nah,
		translation: firstExample?.ru,
	};
}
