"use client";

import {
	adminAnalyticsKeys,
	useAdminAnalyticsUaBreakdown,
	useAnalyticsRange,
} from "@/features/admin-analytics";
import type {
	AnalyticsUaKind,
	AnalyticsUaQuery,
} from "@/features/admin-analytics";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const UA_KINDS: ReadonlyArray<AnalyticsUaKind> = [
	"device",
	"browser",
	"os",
];

export const useDevicesPageState = () => {
	const range = useAnalyticsRange();
	const queryClient = useQueryClient();

	const breakdownQuery = useMemo<AnalyticsUaQuery>(
		() => ({ from: range.range.from, to: range.range.to }),
		[range.range.from, range.range.to],
	);

	const enabled = range.error === null;

	const devicesQuery = useAdminAnalyticsUaBreakdown("device", breakdownQuery, {
		enabled,
	});
	const browsersQuery = useAdminAnalyticsUaBreakdown("browser", breakdownQuery, {
		enabled,
	});
	const osQuery = useAdminAnalyticsUaBreakdown("os", breakdownQuery, {
		enabled,
	});

	const isAllEmpty = useMemo(() => {
		const queries = [devicesQuery, browsersQuery, osQuery];
		if (queries.some((q) => !q.data)) return false;
		return queries.every((q) => (q.data?.totalEvents ?? 0) === 0);
	}, [devicesQuery, browsersQuery, osQuery]);

	const isLoading =
		devicesQuery.isLoading || browsersQuery.isLoading || osQuery.isLoading;

	const isFetching =
		devicesQuery.isFetching ||
		browsersQuery.isFetching ||
		osQuery.isFetching;

	const refresh = async () => {
		await queryClient.invalidateQueries({
			queryKey: adminAnalyticsKeys.all,
		});
	};

	return {
		range,
		devicesQuery,
		browsersQuery,
		osQuery,
		isAllEmpty,
		isLoading,
		isFetching,
		refresh,
	};
};
