import type { DictionarySource } from "../../types";
import { useSourcesStore } from "./sources-store";

interface UseSourcesValuesResult {
	sources: DictionarySource[] | null;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	fetchSources: () => Promise<void>;
}

export const useSourcesValues = (): UseSourcesValuesResult => {
	const sources = useSourcesStore(s => s.sources);
	const isLoading = useSourcesStore(s => s.isLoading);
	const isError = useSourcesStore(s => s.isError);
	const fetchSources = useSourcesStore(s => s.fetchSources);

	return {
		sources,
		isLoading,
		isError,
		isSuccess: sources !== null,
		fetchSources,
	};
};
