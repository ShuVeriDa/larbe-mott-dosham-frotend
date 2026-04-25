"use client";

import type {
	AnalyticsGranularity,
	AnalyticsMetric,
} from "@/features/admin-analytics";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const METRICS: ReadonlyArray<AnalyticsMetric> = [
	"pageviews",
	"uniqueVisitors",
	"sessions",
	"totalEvents",
	"bounceRate",
	"avgSessionSec",
];

const GRANULARITIES: ReadonlyArray<AnalyticsGranularity> = [
	"day",
	"week",
	"month",
];

const isMetric = (v: string | null): v is AnalyticsMetric =>
	!!v && (METRICS as readonly string[]).includes(v);

const isGranularity = (v: string | null): v is AnalyticsGranularity =>
	!!v && (GRANULARITIES as readonly string[]).includes(v);

export interface TimeseriesViewState {
	metric: AnalyticsMetric;
	granularity: AnalyticsGranularity;
	compare: boolean;
	setMetric: (m: AnalyticsMetric) => void;
	setGranularity: (g: AnalyticsGranularity) => void;
	setCompare: (on: boolean) => void;
}

export const useTimeseriesState = (): TimeseriesViewState => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const metric = useMemo<AnalyticsMetric>(() => {
		const v = searchParams.get("metric");
		return isMetric(v) ? v : "pageviews";
	}, [searchParams]);

	const granularity = useMemo<AnalyticsGranularity>(() => {
		const v = searchParams.get("gran");
		return isGranularity(v) ? v : "day";
	}, [searchParams]);

	const compare = searchParams.get("compare") === "1";

	const writeParam = useCallback(
		(patch: Record<string, string | null>) => {
			const params = new URLSearchParams(searchParams.toString());
			for (const [key, value] of Object.entries(patch)) {
				if (value === null || value === "") params.delete(key);
				else params.set(key, value);
			}
			const qs = params.toString();
			router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
		},
		[pathname, router, searchParams],
	);

	const setMetric = useCallback(
		(m: AnalyticsMetric) => writeParam({ metric: m }),
		[writeParam],
	);
	const setGranularity = useCallback(
		(g: AnalyticsGranularity) => writeParam({ gran: g }),
		[writeParam],
	);
	const setCompare = useCallback(
		(on: boolean) => writeParam({ compare: on ? "1" : null }),
		[writeParam],
	);

	return { metric, granularity, compare, setMetric, setGranularity, setCompare };
};
