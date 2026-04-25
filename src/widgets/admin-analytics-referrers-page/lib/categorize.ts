import type { AnalyticsReferrerCategory } from "@/features/admin-analytics";

export type ReferrerCategoryFilter = "all" | AnalyticsReferrerCategory;

export const CATEGORY_CARDS: ReadonlyArray<ReferrerCategoryFilter> = [
	"all",
	"search",
	"direct",
	"social",
];

export const ALL_CATEGORIES: ReadonlyArray<AnalyticsReferrerCategory> = [
	"search",
	"direct",
	"social",
	"other",
];

export const categoryIcon = (cat: ReferrerCategoryFilter): string => {
	switch (cat) {
		case "all":
			return "🌐";
		case "search":
			return "🔍";
		case "direct":
			return "⇣";
		case "social":
			return "◈";
		case "other":
			return "•";
	}
};

export const cleanHost = (host: string): string =>
	host.replace(/^https?:\/\//i, "").replace(/^www\./i, "");

export const isDirectKey = (key: string): boolean =>
	key === "" || key === "(direct)";

export const externalUrl = (host: string): string | null => {
	if (isDirectKey(host)) return null;
	return `https://${cleanHost(host)}`;
};

export const formatShare = (share: number): string =>
	`${Math.round(Math.max(0, Math.min(1, share)) * 100)}%`;

export const interpolate = (
	template: string,
	values: Record<string, string | number>,
): string =>
	template.replace(/\{(\w+)\}/g, (_, key) =>
		key in values ? String(values[key]) : "",
	);
