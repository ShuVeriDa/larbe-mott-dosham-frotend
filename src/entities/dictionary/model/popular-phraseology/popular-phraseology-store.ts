import { create, createJSONStorage, devtools, persist } from "@/shared/lib";
import { dictionaryApi } from "../../api";
import type { PopularPhraseologyQuery } from "../../types";

const POPULAR_TTL_MS = 10 * 60 * 1000;

interface PopularPhraseologyState {
	popular: PopularPhraseologyQuery[] | null;
	fetchedAt: number | null;
	isLoading: boolean;
	isError: boolean;
	fetchPopular: () => Promise<void>;
}

export const usePopularPhraseologyStore = create<PopularPhraseologyState>()(
	devtools(
		persist(
			(set, get) => ({
				popular: null,
				fetchedAt: null,
				isLoading: false,
				isError: false,
				fetchPopular: async () => {
					const { fetchedAt, popular, isLoading } = get();
					if (isLoading) return;
					if (popular && fetchedAt && Date.now() - fetchedAt < POPULAR_TTL_MS) {
						return;
					}
					set(
						{ isLoading: true, isError: false },
						false,
						"fetchPopularPhraseology/start",
					);
					try {
						const data = await dictionaryApi.getPopularPhraseology();
						set(
							{ popular: data, fetchedAt: Date.now(), isLoading: false },
							false,
							"fetchPopularPhraseology/success",
						);
					} catch {
						set(
							{ isLoading: false, isError: true },
							false,
							"fetchPopularPhraseology/error",
						);
					}
				},
			}),
			{
				name: "dictionary-popular-phraseology:v1",
				storage: createJSONStorage(() => localStorage),
				partialize: state => ({
					popular: state.popular,
					fetchedAt: state.fetchedAt,
				}),
			},
		),
		{ name: "DictionaryPopularPhraseologyStore" },
	),
);
