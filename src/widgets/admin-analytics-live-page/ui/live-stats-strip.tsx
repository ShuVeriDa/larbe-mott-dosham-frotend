"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { formatLiveNumber } from "../lib/format-live";
import { LiveStatCard } from "./live-stat-card";

interface LiveStatsStripProps {
	lang: Locale;
	dict: Dictionary["admin"]["analyticsLive"]["stats"];
	realtimeVisitors: number | undefined;
	eventsPerMinute: number | undefined;
	queueSize: number | undefined;
	shownCount: number;
	loading: boolean;
}

const fmt = (
	value: number | undefined,
	lang: Locale,
	loading: boolean,
): string => {
	if (loading || value === undefined) return "—";
	return formatLiveNumber(value, lang);
};

export const LiveStatsStrip: FC<LiveStatsStripProps> = ({
	lang,
	dict,
	realtimeVisitors,
	eventsPerMinute,
	queueSize,
	shownCount,
	loading,
}) => (
	<div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
		<LiveStatCard
			tone="success"
			icon="👤"
			value={fmt(realtimeVisitors, lang, loading)}
			label={dict.activeVisitors}
		/>
		<LiveStatCard
			tone="accent"
			icon="⚡"
			value={fmt(eventsPerMinute, lang, loading)}
			label={dict.eventsPerMinute}
		/>
		<LiveStatCard
			tone="warning"
			icon="📊"
			value={fmt(queueSize, lang, loading)}
			label={dict.queuePending}
		/>
		<LiveStatCard
			tone="purple"
			icon="📄"
			value={formatLiveNumber(shownCount, lang)}
			label={dict.inFeed}
		/>
	</div>
);
