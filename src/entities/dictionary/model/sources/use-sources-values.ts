import type { DictionarySource } from "../../types";
import { useSourcesStore } from "./sources-store";

interface UseSourcesValuesResult {
	sources: DictionarySource[] | null;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
}

export const useSourcesValues = (): UseSourcesValuesResult => {
	const sources = useSourcesStore(s => s.sources);
	const isLoading = useSourcesStore(s => s.isLoading);
	const isError = useSourcesStore(s => s.isError);

	return {
		sources,
		isLoading,
		isError,
		isSuccess: sources !== null,
	};
};
