import { create, createJSONStorage, devtools, persist } from "@/shared/lib";
import { dictionaryApi } from "../../api";

const POS_VALUES_TTL_MS = 60 * 60 * 1000;

interface PosValuesState {
	posValues: string[] | null;
	fetchedAt: number | null;
	isLoading: boolean;
	isError: boolean;
	fetchPosValues: () => Promise<void>;
}

export const usePosValuesStore = create<PosValuesState>()(
	devtools(
		persist(
			(set, get) => ({
				posValues: null,
				fetchedAt: null,
				isLoading: false,
				isError: false,
				fetchPosValues: async () => {
					const { fetchedAt, posValues, isLoading } = get();
					if (isLoading) return;
					if (
						posValues &&
						fetchedAt &&
						Date.now() - fetchedAt < POS_VALUES_TTL_MS
					) {
						return;
					}
					set(
						{ isLoading: true, isError: false },
						false,
						"fetchPosValues/start",
					);
					try {
						const data = await dictionaryApi.getPosValues();
						set(
							{ posValues: data, fetchedAt: Date.now(), isLoading: false },
							false,
							"fetchPosValues/success",
						);
					} catch {
						set(
							{ isLoading: false, isError: true },
							false,
							"fetchPosValues/error",
						);
					}
				},
			}),
			{
				name: "dictionary-pos-values:v1",
				storage: createJSONStorage(() => localStorage),
				partialize: state => ({
					posValues: state.posValues,
					fetchedAt: state.fetchedAt,
				}),
			},
		),
		{ name: "DictionaryPosValuesStore" },
	),
);
