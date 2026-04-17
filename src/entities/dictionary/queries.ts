import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dictionaryApi } from "./api";
import type {
	BulkUpdateDto,
	PhraseologyParams,
	SearchParams,
	UpdateEntryDto,
} from "./types";

export const dictionaryKeys = {
	all: ["dictionary"] as const,
	search: (params: SearchParams) =>
		[...dictionaryKeys.all, "search", params] as const,
	entry: (id: number) => [...dictionaryKeys.all, "entry", id] as const,
	lookup: (word: string) => [...dictionaryKeys.all, "lookup", word] as const,
	declension: (word: string) =>
		[...dictionaryKeys.all, "declension", word] as const,
	lemmatize: (form: string) =>
		[...dictionaryKeys.all, "lemmatize", form] as const,
	conjugation: (word: string) =>
		[...dictionaryKeys.all, "conjugation", word] as const,
	random: (level?: string) => [...dictionaryKeys.all, "random", level] as const,
	wordOfDay: () => [...dictionaryKeys.all, "word-of-day"] as const,
	sources: () => [...dictionaryKeys.all, "sources"] as const,
	phraseology: (params?: PhraseologyParams) =>
		[...dictionaryKeys.all, "phraseology", params] as const,
};

export function useSearch(params: SearchParams, enabled = true) {
	return useQuery({
		queryKey: dictionaryKeys.search(params),
		queryFn: () => dictionaryApi.search(params),
		enabled: enabled && params.q.length > 0,
	});
}

export function useDictionaryEntry(id: number) {
	return useQuery({
		queryKey: dictionaryKeys.entry(id),
		queryFn: () => dictionaryApi.getById(id),
		enabled: !!id,
	});
}

export function useLookup(word: string) {
	return useQuery({
		queryKey: dictionaryKeys.lookup(word),
		queryFn: () => dictionaryApi.lookup(word),
		enabled: !!word,
	});
}

export function useDeclension(word: string) {
	return useQuery({
		queryKey: dictionaryKeys.declension(word),
		queryFn: () => dictionaryApi.getDeclension(word),
		enabled: !!word,
	});
}

export function useLemmatize(form: string) {
	return useQuery({
		queryKey: dictionaryKeys.lemmatize(form),
		queryFn: () => dictionaryApi.lemmatize(form),
		enabled: !!form,
	});
}

export function useConjugation(word: string) {
	return useQuery({
		queryKey: dictionaryKeys.conjugation(word),
		queryFn: () => dictionaryApi.getConjugation(word),
		enabled: !!word,
	});
}

export function useRandomEntry(level?: string) {
	return useQuery({
		queryKey: dictionaryKeys.random(level),
		queryFn: () => dictionaryApi.getRandom(level),
		staleTime: 0,
	});
}

export function useWordOfDay() {
	return useQuery({
		queryKey: dictionaryKeys.wordOfDay(),
		queryFn: dictionaryApi.getWordOfDay,
		staleTime: 60 * 60 * 1000, // 1 hour — backend caches until midnight
	});
}

export function useSources() {
	return useQuery({
		queryKey: dictionaryKeys.sources(),
		queryFn: dictionaryApi.getSources,
		staleTime: 30 * 60 * 1000,
	});
}

export function usePhraseology(params?: PhraseologyParams) {
	return useQuery({
		queryKey: dictionaryKeys.phraseology(params),
		queryFn: () => dictionaryApi.getPhraseology(params),
	});
}

// Editor mutations
export function useUpdateEntry() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, dto }: { id: number; dto: UpdateEntryDto }) =>
			dictionaryApi.updateEntry(id, dto),
		onSuccess: data => {
			qc.setQueryData(dictionaryKeys.entry(data.id), data);
		},
	});
}

export function useDeleteEntry() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => dictionaryApi.deleteEntry(id),
		onSuccess: (_, id) => {
			qc.removeQueries({ queryKey: dictionaryKeys.entry(id) });
		},
	});
}

export function useBulkUpdateEntries() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: BulkUpdateDto) => dictionaryApi.bulkUpdate(dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.all });
		},
	});
}
