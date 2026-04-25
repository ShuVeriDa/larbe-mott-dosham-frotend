import type { PopularPhraseologyQuery } from "../../types";
import { usePopularPhraseologyStore } from "./popular-phraseology-store";

interface UsePopularPhraseologyQueriesResult {
	popular: PopularPhraseologyQuery[] | null;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	fetchPopular: () => Promise<void>;
}

export const usePopularPhraseologyQueries =
	(): UsePopularPhraseologyQueriesResult => {
		const popular = usePopularPhraseologyStore(s => s.popular);
		const isLoading = usePopularPhraseologyStore(s => s.isLoading);
		const isError = usePopularPhraseologyStore(s => s.isError);
		const fetchPopular = usePopularPhraseologyStore(s => s.fetchPopular);

		return {
			popular,
			isLoading,
			isError,
			isSuccess: popular !== null,
			fetchPopular,
		};
	};
