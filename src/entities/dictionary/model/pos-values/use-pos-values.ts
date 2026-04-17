import { usePosValuesStore } from "./pos-values-store";

interface UsePosValuesResult {
	posValues: string[] | null;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
}

export const usePosValues = (): UsePosValuesResult => {
	const posValues = usePosValuesStore(s => s.posValues);
	const isLoading = usePosValuesStore(s => s.isLoading);
	const isError = usePosValuesStore(s => s.isError);

	return {
		posValues,
		isLoading,
		isError,
		isSuccess: posValues !== null,
	};
};
