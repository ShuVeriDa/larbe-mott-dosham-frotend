import type {
	DictionarySearchResult,
	NounClass,
	Phrase,
	WordLevel,
} from "@/entities/dictionary";

export interface MappedRandomEntry {
	id: number;
	word: string;
	nounClass?: NounClass;
	partOfSpeech?: string;
	partOfSpeechNah?: string;
	wordLevel?: WordLevel;
	attested?: boolean;
	meanings: string[];
	example?: Phrase;
	phrases: Phrase[];
	sources: string[];
}

export const mapRandomEntry = (
	entry: DictionarySearchResult,
): MappedRandomEntry => {
	const meanings = entry.meanings
		.map(m => m.translation)
		.filter((m): m is string => Boolean(m));

	const meaningWithExample = entry.meanings.find(
		m => m.examples && m.examples.length > 0,
	);

	return {
		id: entry.id,
		word: entry.wordAccented ?? entry.word,
		nounClass: entry.nounClass,
		partOfSpeech: entry.partOfSpeech,
		partOfSpeechNah: entry.partOfSpeechNah,
		wordLevel: entry.wordLevel,
		attested: entry.attested,
		meanings,
		example: meaningWithExample?.examples?.[0],
		phrases: entry.setPhrases ?? [],
		sources: entry.sources ?? [],
	};
};
