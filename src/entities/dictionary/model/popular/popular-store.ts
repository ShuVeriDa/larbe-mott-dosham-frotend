import { create, createJSONStorage, devtools, persist } from "@/shared/lib";
import { dictionaryApi } from "../../api";
import type { PopularQuery } from "../../types";

const POPULAR_TTL_MS = 10 * 60 * 1000;

interface PopularState {
	popular: PopularQuery[] | null;
	fetchedAt: number | null;
	isLoading: boolean;
	isError: boolean;
	fetchPopular: () => Promise<void>;
}

export const usePopularStore = create<PopularState>()(
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
						"fetchPopular/start",
					);
					try {
						const data = await dictionaryApi.getPopular();
						set(
							{ popular: data, fetchedAt: Date.now(), isLoading: false },
							false,
							"fetchPopular/success",
						);
					} catch {
						set(
							{ isLoading: false, isError: true },
							false,
							"fetchPopular/error",
						);
					}
				},
			}),
			{
				name: "dictionary-popular:v1",
				storage: createJSONStorage(() => localStorage),
				partialize: state => ({
					popular: state.popular,
					fetchedAt: state.fetchedAt,
				}),
			},
		),
		{ name: "DictionaryPopularStore" },
	),
);
