import type { PopularQuery } from "../../types";
import { usePopularStore } from "./popular-store";

interface UsePopularQueriesResult {
	popular: PopularQuery[] | null;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	fetchPopular: () => Promise<void>;
}

export const usePopularQueries = (): UsePopularQueriesResult => {
	const popular = usePopularStore(s => s.popular);
	const isLoading = usePopularStore(s => s.isLoading);
	const isError = usePopularStore(s => s.isError);
	const fetchPopular = usePopularStore(s => s.fetchPopular);

	return {
		popular,
		isLoading,
		isError,
		isSuccess: popular !== null,
		fetchPopular,
	};
};
