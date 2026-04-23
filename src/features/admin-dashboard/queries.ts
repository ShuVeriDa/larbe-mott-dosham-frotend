import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminDashboardApi } from "./api";
import type { AdminProblemsQuery } from "./types";

export const adminDashboardKeys = {
	all: ["admin", "dashboard"] as const,
	stats: () => [...adminDashboardKeys.all, "stats"] as const,
	problems: (query: AdminProblemsQuery) =>
		[...adminDashboardKeys.all, "problems", query] as const,
};

interface AdminDashboardOptions {
	enabled?: boolean;
}

export const useAdminDashboardStats = (
	options: AdminDashboardOptions = {},
) =>
	useQuery({
		queryKey: adminDashboardKeys.stats(),
		queryFn: adminDashboardApi.getStats,
		enabled: options.enabled ?? true,
		staleTime: 30 * 1000,
	});

export const useAdminSidebarCounters = (
	options: AdminDashboardOptions = {},
) =>
	useQuery({
		queryKey: [...adminDashboardKeys.stats(), "sidebar"],
		queryFn: adminDashboardApi.getStats,
		enabled: options.enabled ?? true,
		staleTime: 60 * 1000,
		select: (data) => ({ sidebar: data.sidebar }),
	});

export const useAdminProblems = (
	query: AdminProblemsQuery,
	options: AdminDashboardOptions = {},
) =>
	useQuery({
		queryKey: adminDashboardKeys.problems(query),
		queryFn: () => adminDashboardApi.getProblems(query),
		enabled: options.enabled ?? true,
		placeholderData: keepPreviousData,
		staleTime: 30 * 1000,
	});
