import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { adminQualityProblemsApi } from "./api";
import type { QualityProblemsQuery } from "./types";

export const adminQualityProblemsKeys = {
	all: ["admin", "quality-problems"] as const,
	stats: () => [...adminQualityProblemsKeys.all, "stats"] as const,
	list: (query: QualityProblemsQuery) =>
		[...adminQualityProblemsKeys.all, "list", query] as const,
};

interface Options {
	enabled?: boolean;
}

export const useQualityStats = (options: Options = {}) =>
	useQuery({
		queryKey: adminQualityProblemsKeys.stats(),
		queryFn: adminQualityProblemsApi.getStats,
		enabled: options.enabled ?? true,
		staleTime: 30 * 1000,
	});

export const useQualityProblems = (
	query: QualityProblemsQuery,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminQualityProblemsKeys.list(query),
		queryFn: () => adminQualityProblemsApi.getProblems(query),
		enabled: options.enabled ?? true,
		placeholderData: keepPreviousData,
		staleTime: 30 * 1000,
	});

export const useInvalidateQualityProblems = () => {
	const qc = useQueryClient();
	return () => {
		qc.invalidateQueries({ queryKey: adminQualityProblemsKeys.all });
	};
};

export const useExportQualityProblems = () =>
	useMutation({
		mutationFn: (
			query: Parameters<typeof adminQualityProblemsApi.exportCsv>[0],
		) => adminQualityProblemsApi.exportCsv(query),
	});
