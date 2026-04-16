import { apiClient } from "@/shared/api";
import type {
	BulkUpdateDto,
	BulkUpdateResult,
	ConjugationResult,
	DeclensionResult,
	DeleteEntryResult,
	DictionaryEntry,
	DictionarySearchResult,
	DictionarySource,
	DictionaryStats,
	LemmatizeResult,
	PhraseologyParams,
	PhraseologyResult,
	PopularQuery,
	SearchParams,
	SearchResult,
	UpdateEntryDto,
} from "./types";

export const dictionaryApi = {
	async search(params: SearchParams): Promise<SearchResult> {
		const { data } = await apiClient.get<SearchResult>("/dictionary/search", {
			params,
		});
		return data;
	},

	async lookup(word: string): Promise<DictionaryEntry[]> {
		const { data } = await apiClient.get<DictionaryEntry[]>(
			`/dictionary/lookup/${encodeURIComponent(word)}`,
		);
		return data;
	},

	async getById(id: number): Promise<DictionaryEntry> {
		const { data } = await apiClient.get<DictionaryEntry>(`/dictionary/${id}`);
		return data;
	},

	async getDeclension(word: string): Promise<DeclensionResult> {
		const { data } = await apiClient.get<DeclensionResult>(
			`/dictionary/declension/${encodeURIComponent(word)}`,
		);
		return data;
	},

	async lemmatize(form: string): Promise<LemmatizeResult> {
		const { data } = await apiClient.get<LemmatizeResult>(
			`/dictionary/lemmatize/${encodeURIComponent(form)}`,
		);
		return data;
	},

	async getConjugation(word: string): Promise<ConjugationResult> {
		const { data } = await apiClient.get<ConjugationResult>(
			`/dictionary/conjugation/${encodeURIComponent(word)}`,
		);
		return data;
	},

	async getStats(): Promise<DictionaryStats> {
		const { data } = await apiClient.get<DictionaryStats>("/dictionary/stats");
		return data;
	},

	async getRandom(level?: string): Promise<DictionarySearchResult | null> {
		const { data } = await apiClient.get<DictionarySearchResult | null>(
			"/dictionary/random",
			{ params: { level } },
		);
		return data;
	},

	async getWordOfDay(): Promise<DictionarySearchResult | null> {
		const { data } = await apiClient.get<DictionarySearchResult | null>(
			"/dictionary/word-of-day",
		);
		return data;
	},

	async getPopular(): Promise<PopularQuery[]> {
		const { data } = await apiClient.get<PopularQuery[]>("/dictionary/popular");
		return data;
	},

	async getPosValues(): Promise<string[]> {
		const { data } = await apiClient.get<string[]>(
			"/dictionary/meta/pos-values",
		);
		return data;
	},

	async getSources(): Promise<DictionarySource[]> {
		const { data } = await apiClient.get<DictionarySource[]>(
			"/dictionary/sources",
		);
		return data;
	},

	async getPhraseology(params?: PhraseologyParams): Promise<PhraseologyResult> {
		const { data } = await apiClient.get<PhraseologyResult>(
			"/dictionary/phraseology",
			{ params },
		);
		return data;
	},

	// Editor / Admin endpoints
	async updateEntry(id: number, dto: UpdateEntryDto): Promise<DictionaryEntry> {
		const { data } = await apiClient.patch<DictionaryEntry>(
			`/dictionary/${id}`,
			dto,
		);
		return data;
	},

	async deleteEntry(id: number): Promise<DeleteEntryResult> {
		const { data } = await apiClient.delete<DeleteEntryResult>(
			`/dictionary/${id}`,
		);
		return data;
	},

	async bulkUpdate(dto: BulkUpdateDto): Promise<BulkUpdateResult> {
		const { data } = await apiClient.patch<BulkUpdateResult>(
			"/dictionary/bulk/update",
			dto,
		);
		return data;
	},
};
