import { useQuery } from "@tanstack/react-query";
import { adminDashboardApi } from "./api";

export const adminDashboardKeys = {
	all: ["admin", "dashboard"] as const,
	sidebar: () => [...adminDashboardKeys.all, "sidebar"] as const,
};

interface AdminDashboardOptions {
	enabled?: boolean;
}

export const useAdminSidebarCounters = (
	options: AdminDashboardOptions = {},
) =>
	useQuery({
		queryKey: adminDashboardKeys.sidebar(),
		queryFn: adminDashboardApi.getStats,
		enabled: options.enabled ?? true,
		staleTime: 60 * 1000,
	});
