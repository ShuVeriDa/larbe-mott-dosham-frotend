import { API_URL } from "@/shared/config";
import { apiClient } from "@/shared/api";
import type {
	AnalyticsAggregateResult,
	AnalyticsGeographyExportQuery,
	AnalyticsGeographyStats,
	AnalyticsGeographyStatsQuery,
	AnalyticsGeoIpStatus,
	AnalyticsMultiTimeseries,
	AnalyticsMultiTimeseriesQuery,
	AnalyticsOverview,
	AnalyticsOverviewExportQuery,
	AnalyticsPageItem,
	AnalyticsPagesExportQuery,
	AnalyticsPagesQuery,
	AnalyticsPagesResponse,
	AnalyticsPagesStats,
	AnalyticsPagesStatsQuery,
	AnalyticsLiveEvent,
	AnalyticsRealtime,
	AnalyticsRealtimeRaw,
	AnalyticsRecentQuery,
	AnalyticsReferrersBreakdown,
	AnalyticsReferrersBreakdownQuery,
	AnalyticsTimeseriesCompareResponse,
	AnalyticsTimeseriesPoint,
	AnalyticsTimeseriesQuery,
	AnalyticsTimeseriesSummary,
	AnalyticsTopCitiesQuery,
	AnalyticsTopCityItem,
	AnalyticsTopCountriesQuery,
	AnalyticsTopCountryItem,
	AnalyticsTopQuery,
	AnalyticsTopReferrerItem,
	AnalyticsTopReferrersQuery,
	AnalyticsSearchQueriesExportQuery,
	AnalyticsSearchQueriesQuery,
	AnalyticsSearchQueriesResponse,
	AnalyticsSearchQueriesStats,
	AnalyticsSearchQueriesStatsQuery,
	AnalyticsUaBreakdown,
	AnalyticsUaKind,
	AnalyticsUaQuery,
} from "./types";

const UA_KIND_PATH: Record<AnalyticsUaKind, string> = {
	device: "/admin/analytics/devices",
	browser: "/admin/analytics/browsers",
	os: "/admin/analytics/os",
};

const buildTimeseriesParams = (
	query: AnalyticsTimeseriesQuery,
	extra: Record<string, string> = {},
): Record<string, string> => {
	const params: Record<string, string> = {
		metric: query.metric,
		granularity: query.granularity,
		...extra,
	};
	if (query.from) params.from = query.from;
	if (query.to) params.to = query.to;
	return params;
};

const buildRangeParams = (
	from?: string,
	to?: string,
): Record<string, string> => {
	const params: Record<string, string> = {};
	if (from) params.from = from;
	if (to) params.to = to;
	return params;
};

const buildPagesParams = (
	query: AnalyticsPagesQuery,
): Record<string, string | number> => {
	const params: Record<string, string | number> = {};
	if (query.from) params.from = query.from;
	if (query.to) params.to = query.to;
	if (query.search?.trim()) params.search = query.search.trim();
	if (typeof query.limit === "number") params.limit = query.limit;
	if (typeof query.offset === "number") params.offset = query.offset;
	return params;
};

const buildStatsParams = (
	query: AnalyticsPagesStatsQuery,
): Record<string, string> => {
	const params: Record<string, string> = {};
	if (query.from) params.from = query.from;
	if (query.to) params.to = query.to;
	return params;
};

const buildExportParams = (
	query: AnalyticsPagesExportQuery,
): Record<string, string> => {
	const params: Record<string, string> = {};
	if (query.from) params.from = query.from;
	if (query.to) params.to = query.to;
	if (query.search?.trim()) params.search = query.search.trim();
	return params;
};

export const adminAnalyticsApi = {
	async getRealtime(): Promise<AnalyticsRealtime> {
		const { data } = await apiClient.get<AnalyticsRealtimeRaw>(
			"/admin/analytics/realtime",
		);
		return {
			count: data.realtimeVisitors,
			queueSize: data.queueSize,
			eventsPerMinute: data.eventsPerMinute,
		};
	},

	async getRecent(query: AnalyticsRecentQuery = {}): Promise<AnalyticsLiveEvent[]> {
		const params: Record<string, string | number> = {};
		if (typeof query.limit === "number") params.limit = query.limit;
		if (query.sinceId) params.sinceId = query.sinceId;
		if (query.eventType) {
			params.eventType = Array.isArray(query.eventType)
				? query.eventType.join(",")
				: query.eventType;
		}
		const { data } = await apiClient.get<AnalyticsLiveEvent[]>(
			"/admin/analytics/recent",
			{ params },
		);
		return data;
	},

	async listPages(
		query: AnalyticsPagesQuery,
	): Promise<AnalyticsPagesResponse> {
		const { data } = await apiClient.get<AnalyticsPagesResponse>(
			"/admin/analytics/pages",
			{ params: buildPagesParams(query) },
		);
		return data;
	},

	async getPagesStats(
		query: AnalyticsPagesStatsQuery,
	): Promise<AnalyticsPagesStats> {
		const { data } = await apiClient.get<AnalyticsPagesStats>(
			"/admin/analytics/pages/stats",
			{ params: buildStatsParams(query) },
		);
		return data;
	},

	async exportPages(query: AnalyticsPagesExportQuery): Promise<Blob> {
		const { data } = await apiClient.get<Blob>(
			"/admin/analytics/pages/export",
			{
				params: buildExportParams(query),
				responseType: "blob",
			},
		);
		return data;
	},

	async getTimeseries(
		query: AnalyticsTimeseriesQuery,
	): Promise<AnalyticsTimeseriesPoint[]> {
		const { data } = await apiClient.get<AnalyticsTimeseriesPoint[]>(
			"/admin/analytics/timeseries",
			{ params: buildTimeseriesParams(query) },
		);
		return data;
	},

	async getTimeseriesWithCompare(
		query: AnalyticsTimeseriesQuery,
	): Promise<AnalyticsTimeseriesCompareResponse> {
		const { data } = await apiClient.get<AnalyticsTimeseriesCompareResponse>(
			"/admin/analytics/timeseries",
			{ params: buildTimeseriesParams(query, { compare: "true" }) },
		);
		return data;
	},

	async getTimeseriesSummary(
		query: AnalyticsTimeseriesQuery,
	): Promise<AnalyticsTimeseriesSummary> {
		const { data } = await apiClient.get<AnalyticsTimeseriesSummary>(
			"/admin/analytics/timeseries/summary",
			{ params: buildTimeseriesParams(query) },
		);
		return data;
	},

	async getOverview(
		from?: string,
		to?: string,
	): Promise<AnalyticsOverview> {
		const { data } = await apiClient.get<AnalyticsOverview>(
			"/admin/analytics/overview",
			{ params: buildRangeParams(from, to) },
		);
		return data;
	},

	buildTimeseriesExportUrl(query: AnalyticsTimeseriesQuery): string {
		const params = new URLSearchParams(buildTimeseriesParams(query));
		return `${API_URL}/admin/analytics/timeseries/export?${params.toString()}`;
	},

	async getMultiTimeseries(
		query: AnalyticsMultiTimeseriesQuery,
	): Promise<AnalyticsMultiTimeseries> {
		const params: Record<string, string> = {
			metrics: query.metrics.join(","),
		};
		if (query.granularity) params.granularity = query.granularity;
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		const { data } = await apiClient.get<AnalyticsMultiTimeseries>(
			"/admin/analytics/timeseries/multi",
			{ params },
		);
		return data;
	},

	async getTopPages(query: AnalyticsTopQuery): Promise<AnalyticsPageItem[]> {
		const params: Record<string, string | number> = {};
		if (query.limit !== undefined) params.limit = query.limit;
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		const { data } = await apiClient.get<AnalyticsPageItem[]>(
			"/admin/analytics/top-pages",
			{ params },
		);
		return data;
	},

	async getTopReferrers(
		query: AnalyticsTopQuery,
	): Promise<AnalyticsPageItem[]> {
		const params: Record<string, string | number> = {};
		if (query.limit !== undefined) params.limit = query.limit;
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		const { data } = await apiClient.get<AnalyticsPageItem[]>(
			"/admin/analytics/top-referrers",
			{ params },
		);
		return data;
	},

	async listTopReferrers(
		query: AnalyticsTopReferrersQuery,
	): Promise<AnalyticsTopReferrerItem[]> {
		const params: Record<string, string | number> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		if (typeof query.limit === "number") params.limit = query.limit;
		if (typeof query.offset === "number") params.offset = query.offset;
		if (query.category) params.category = query.category;
		const { data } = await apiClient.get<AnalyticsTopReferrerItem[]>(
			"/admin/analytics/top-referrers",
			{ params },
		);
		return data;
	},

	async getReferrersBreakdown(
		query: AnalyticsReferrersBreakdownQuery,
	): Promise<AnalyticsReferrersBreakdown> {
		const params: Record<string, string> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		const { data } = await apiClient.get<AnalyticsReferrersBreakdown>(
			"/admin/analytics/referrers/breakdown",
			{ params },
		);
		return data;
	},

	async aggregate(day?: string): Promise<AnalyticsAggregateResult> {
		const params: Record<string, string> = {};
		if (day) params.day = day;
		const { data } = await apiClient.post<AnalyticsAggregateResult>(
			"/admin/analytics/aggregate",
			null,
			{ params },
		);
		return data;
	},

	async getUaBreakdown(
		kind: AnalyticsUaKind,
		query: AnalyticsUaQuery,
	): Promise<AnalyticsUaBreakdown> {
		const { data } = await apiClient.get<AnalyticsUaBreakdown>(
			UA_KIND_PATH[kind],
			{ params: buildRangeParams(query.from, query.to) },
		);
		return data;
	},

	async exportOverviewCsv(
		query: AnalyticsOverviewExportQuery,
	): Promise<Blob> {
		const params: Record<string, string> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		const { data } = await apiClient.get<Blob>(
			"/admin/analytics/overview/export",
			{ params, responseType: "blob" },
		);
		return data;
	},

	async getGeoIpStatus(): Promise<AnalyticsGeoIpStatus> {
		const { data } = await apiClient.get<AnalyticsGeoIpStatus>(
			"/admin/analytics/geography/status",
		);
		return data;
	},

	async getTopCountries(
		query: AnalyticsTopCountriesQuery,
	): Promise<AnalyticsTopCountryItem[]> {
		const params: Record<string, string | number> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		if (typeof query.limit === "number") params.limit = query.limit;
		const { data } = await apiClient.get<AnalyticsTopCountryItem[]>(
			"/admin/analytics/top-countries",
			{ params },
		);
		return data;
	},

	async getTopCities(
		query: AnalyticsTopCitiesQuery,
	): Promise<AnalyticsTopCityItem[]> {
		const params: Record<string, string | number> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		if (typeof query.limit === "number") params.limit = query.limit;
		if (query.country) params.country = query.country;
		const { data } = await apiClient.get<AnalyticsTopCityItem[]>(
			"/admin/analytics/top-cities",
			{ params },
		);
		return data;
	},

	async getGeographyStats(
		query: AnalyticsGeographyStatsQuery,
	): Promise<AnalyticsGeographyStats> {
		const { data } = await apiClient.get<AnalyticsGeographyStats>(
			"/admin/analytics/geography/stats",
			{ params: buildRangeParams(query.from, query.to) },
		);
		return data;
	},

	async exportGeographyCsv(
		query: AnalyticsGeographyExportQuery,
	): Promise<Blob> {
		const params: Record<string, string> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		if (query.level) params.level = query.level;
		if (query.country) params.country = query.country;
		const { data } = await apiClient.get<Blob>(
			"/admin/analytics/geography/export",
			{ params, responseType: "blob" },
		);
		return data;
	},

	async listSearchQueries(
		query: AnalyticsSearchQueriesQuery,
	): Promise<AnalyticsSearchQueriesResponse> {
		const params: Record<string, string | number> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		if (typeof query.limit === "number") params.limit = query.limit;
		if (typeof query.offset === "number") params.offset = query.offset;
		if (query.search?.trim()) params.search = query.search.trim();
		if (query.onlyZeroResults) params.onlyZeroResults = "true";
		if (query.kind) params.kind = query.kind;
		if (query.group) params.group = query.group;
		const { data } = await apiClient.get<AnalyticsSearchQueriesResponse>(
			"/admin/analytics/search-queries",
			{ params },
		);
		return data;
	},

	async getSearchQueriesStats(
		query: AnalyticsSearchQueriesStatsQuery,
	): Promise<AnalyticsSearchQueriesStats> {
		const params: Record<string, string> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		if (query.kind) params.kind = query.kind;
		if (query.group) params.group = query.group;
		const { data } = await apiClient.get<AnalyticsSearchQueriesStats>(
			"/admin/analytics/search-queries/stats",
			{ params },
		);
		return data;
	},

	async exportSearchQueries(
		query: AnalyticsSearchQueriesExportQuery,
	): Promise<Blob> {
		const params: Record<string, string> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		if (query.search?.trim()) params.search = query.search.trim();
		if (query.onlyZeroResults) params.onlyZeroResults = "true";
		if (query.kind) params.kind = query.kind;
		if (query.group) params.group = query.group;
		const { data } = await apiClient.get<Blob>(
			"/admin/analytics/search-queries/export",
			{ params, responseType: "blob" },
		);
		return data;
	},
};
