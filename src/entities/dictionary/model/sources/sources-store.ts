import { create, createJSONStorage, devtools, persist } from "@/shared/lib";
import { dictionaryApi } from "../../api";
import type { DictionarySource } from "../../types";

const SOURCES_TTL_MS = 60 * 60 * 1000;

interface SourcesState {
	sources: DictionarySource[] | null;
	fetchedAt: number | null;
	isLoading: boolean;
	isError: boolean;
	fetchSources: () => Promise<void>;
}

export const useSourcesStore = create<SourcesState>()(
	devtools(
		persist(
			(set, get) => ({
				sources: null,
				fetchedAt: null,
				isLoading: false,
				isError: false,
				fetchSources: async () => {
					const { fetchedAt, sources, isLoading } = get();
					if (isLoading) return;
					if (
						sources &&
						fetchedAt &&
						Date.now() - fetchedAt < SOURCES_TTL_MS
					) {
						return;
					}
					set(
						{ isLoading: true, isError: false },
						false,
						"fetchSources/start",
					);
					try {
						const data = await dictionaryApi.getSources();
						set(
							{ sources: data, fetchedAt: Date.now(), isLoading: false },
							false,
							"fetchSources/success",
						);
					} catch {
						set(
							{ isLoading: false, isError: true },
							false,
							"fetchSources/error",
						);
					}
				},
			}),
			{
				name: "dictionary-sources:v1",
				storage: createJSONStorage(() => localStorage),
				partialize: state => ({
					sources: state.sources,
					fetchedAt: state.fetchedAt,
				}),
			},
		),
		{ name: "DictionarySourcesStore" },
	),
);
