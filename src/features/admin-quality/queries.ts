import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminQualityApi } from "./api";
import type { QualityProblemsQuery } from "./types";

export const adminQualityKeys = {
	all: ["admin", "quality"] as const,
	stats: () => [...adminQualityKeys.all, "stats"] as const,
	statsBySource: () => [...adminQualityKeys.all, "stats-by-source"] as const,
	problems: (query: QualityProblemsQuery) =>
		[...adminQualityKeys.all, "problems", query] as const,
};

interface Options {
	enabled?: boolean;
}

export const useQualityStats = (options: Options = {}) =>
	useQuery({
		queryKey: adminQualityKeys.stats(),
		queryFn: adminQualityApi.getStats,
		enabled: options.enabled ?? true,
		staleTime: 60 * 1000,
	});

export const useQualityStatsBySource = (options: Options = {}) =>
	useQuery({
		queryKey: adminQualityKeys.statsBySource(),
		queryFn: adminQualityApi.getStatsBySource,
		enabled: options.enabled ?? true,
		staleTime: 60 * 1000,
	});

export const useQualityProblems = (
	query: QualityProblemsQuery,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminQualityKeys.problems(query),
		queryFn: () => adminQualityApi.getProblems(query),
		enabled: options.enabled ?? true,
		placeholderData: keepPreviousData,
		staleTime: 0,
	});

export const useRefreshQuality = () => {
	const qc = useQueryClient();
	return () => qc.invalidateQueries({ queryKey: adminQualityKeys.all });
};

export const useExportQualityProblems = () =>
	useMutation({
		mutationFn: async (query: QualityProblemsQuery) => {
			const blob = await adminQualityApi.exportProblems(query);
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "quality-problems.csv";
			document.body.appendChild(link);
			link.click();
			link.remove();
			URL.revokeObjectURL(url);
		},
	});
