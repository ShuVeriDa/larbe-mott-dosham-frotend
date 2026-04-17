import type { PopularQuery } from "../../types";
import { usePopularStore } from "./popular-store";

interface UsePopularQueriesResult {
	popular: PopularQuery[] | null;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
}

export const usePopularQueries = (): UsePopularQueriesResult => {
	const popular = usePopularStore(s => s.popular);
	const isLoading = usePopularStore(s => s.isLoading);
	const isError = usePopularStore(s => s.isError);

	return {
		popular,
		isLoading,
		isError,
		isSuccess: popular !== null,
	};
};
