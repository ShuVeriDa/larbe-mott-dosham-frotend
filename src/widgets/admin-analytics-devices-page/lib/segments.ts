import type { Locale } from "@/i18n/dictionaries";
import { formatNumber } from "@/widgets/admin-analytics-overview-page";
import type {
	AnalyticsUaItem,
	AnalyticsUaKind,
} from "@/features/admin-analytics";
import { getUaMeta } from "./ua-meta";
import type { Dictionary } from "@/i18n/dictionaries";

type DevicesDict = Dictionary["admin"]["analyticsDevices"];

export interface DonutSegment {
	key: string;
	name: string;
	icon: string;
	color: string;
	value: number;
	visitors: number;
	share: number;
}

export const buildSegments = (
	kind: AnalyticsUaKind,
	items: ReadonlyArray<AnalyticsUaItem>,
	dict: DevicesDict,
): DonutSegment[] =>
	items.map((item) => {
		const meta = getUaMeta(kind, item.key, dict);
		return {
			key: item.key || meta.name,
			name: meta.name,
			icon: meta.icon,
			color: meta.color,
			value: item.events,
			visitors: item.visitors,
			share: item.share,
		};
	});

export const formatVisitors = (count: number, lang: Locale): string =>
	formatNumber(count, lang);

export const formatPercent = (share: number, fractionDigits = 1): string => {
	const pct = share * 100;
	if (!Number.isFinite(pct)) return "0%";
	const rounded = pct.toFixed(fractionDigits);
	const trimmed = rounded.replace(/\.0+$/, "");
	return `${trimmed}%`;
};

export const formatShareCenter = (share: number): string => {
	const pct = Math.round(share * 100);
	return `${pct}%`;
};
