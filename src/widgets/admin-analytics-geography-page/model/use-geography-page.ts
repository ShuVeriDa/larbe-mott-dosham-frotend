"use client";

import {
	useAdminAnalyticsGeographyStats,
	useAdminAnalyticsGeoIpStatus,
	useAdminAnalyticsTopCities,
	useAdminAnalyticsTopCountries,
	useAnalyticsRange,
	useExportAnalyticsGeographyCsv,
	useInvalidateAdminAnalytics,
} from "@/features/admin-analytics";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { isValidIso } from "../lib/country";

const COUNTRIES_LIMIT = 50;
const CITIES_LIMIT = 50;

export interface UseGeographyPageResult {
	range: ReturnType<typeof useAnalyticsRange>;
	statusQuery: ReturnType<typeof useAdminAnalyticsGeoIpStatus>;
	statsQuery: ReturnType<typeof useAdminAnalyticsGeographyStats>;
	countriesQuery: ReturnType<typeof useAdminAnalyticsTopCountries>;
	citiesQuery: ReturnType<typeof useAdminAnalyticsTopCities>;
	configured: boolean;
	countryFilter: string | null;
	setCountryFilter: (iso: string | null) => void;
	exportCountries: () => Promise<void>;
	exportCities: () => Promise<void>;
	isExportingCountries: boolean;
	isExportingCities: boolean;
	refresh: () => Promise<void>;
	refreshing: boolean;
	recheck: () => Promise<void>;
}

const triggerCsvDownload = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
};

export const useGeographyPage = (): UseGeographyPageResult => {
	const range = useAnalyticsRange();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const invalidate = useInvalidateAdminAnalytics();
	const [refreshing, setRefreshing] = useState(false);

	const urlCountry = searchParams.get("country");
	const countryFilter = isValidIso(urlCountry)
		? urlCountry!.toUpperCase()
		: null;

	const setCountryFilter = useCallback(
		(iso: string | null) => {
			const params = new URLSearchParams(searchParams.toString());
			if (iso && isValidIso(iso)) {
				params.set("country", iso.toUpperCase());
			} else {
				params.delete("country");
			}
			const qs = params.toString();
			router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
		},
		[pathname, router, searchParams],
	);

	const rangeArg = useMemo(
		() => ({ from: range.range.from, to: range.range.to }),
		[range.range.from, range.range.to],
	);

	const enabled = range.error === null;

	const statusQuery = useAdminAnalyticsGeoIpStatus();

	const configured = statusQuery.data?.configured ?? false;

	const dataEnabled = enabled && configured;

	const statsQuery = useAdminAnalyticsGeographyStats(rangeArg, {
		enabled: dataEnabled,
	});

	const countriesQuery = useAdminAnalyticsTopCountries(
		{ ...rangeArg, limit: COUNTRIES_LIMIT },
		{ enabled: dataEnabled },
	);

	const citiesQuery = useAdminAnalyticsTopCities(
		{
			...rangeArg,
			limit: CITIES_LIMIT,
			country: countryFilter ?? undefined,
		},
		{ enabled: dataEnabled },
	);

	const exportCountriesMutation = useExportAnalyticsGeographyCsv();
	const exportCitiesMutation = useExportAnalyticsGeographyCsv();

	const exportCountries = useCallback(async () => {
		const blob = await exportCountriesMutation.mutateAsync({
			...rangeArg,
			level: "country",
		});
		triggerCsvDownload(
			blob,
			`dosham-geography-country-${rangeArg.from}_${rangeArg.to}.csv`,
		);
	}, [exportCountriesMutation, rangeArg]);

	const exportCities = useCallback(async () => {
		const blob = await exportCitiesMutation.mutateAsync({
			...rangeArg,
			level: "city",
			country: countryFilter ?? undefined,
		});
		const suffix = countryFilter ? `-${countryFilter.toLowerCase()}` : "";
		triggerCsvDownload(
			blob,
			`dosham-geography-city${suffix}-${rangeArg.from}_${rangeArg.to}.csv`,
		);
	}, [exportCitiesMutation, rangeArg, countryFilter]);

	const refresh = useCallback(async () => {
		setRefreshing(true);
		try {
			await invalidate();
		} finally {
			setRefreshing(false);
		}
	}, [invalidate]);

	const recheck = useCallback(async () => {
		await statusQuery.refetch();
	}, [statusQuery]);

	return {
		range,
		statusQuery,
		statsQuery,
		countriesQuery,
		citiesQuery,
		configured,
		countryFilter,
		setCountryFilter,
		exportCountries,
		exportCities,
		isExportingCountries: exportCountriesMutation.isPending,
		isExportingCities: exportCitiesMutation.isPending,
		refresh,
		refreshing,
		recheck,
	};
};
