"use client";

import {
	type AnalyticsLiveEvent,
	type AnalyticsLiveEventType,
	LIVE_EVENT_TYPES,
} from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { AnalyticsTabs } from "@/widgets/admin-analytics-overview-page/ui/analytics-tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useLivePageState, type LiveFilter } from "../model/use-live-page-state";
import { LiveBadge } from "./live-badge";
import { LiveEventDrawer } from "./live-event-drawer";
import { LiveFeedPanel } from "./live-feed-panel";
import { LiveStatsStrip } from "./live-stats-strip";
import { LiveToolbar } from "./live-toolbar";

interface AdminAnalyticsLivePageProps {
	lang: Locale;
	dict: Dictionary["admin"]["analyticsLive"];
	tabsDict: Dictionary["admin"]["analytics"]["tabs"];
}

const LIVE_TYPE_SET = new Set<string>(LIVE_EVENT_TYPES);

const parseFilter = (raw: string | null): LiveFilter => {
	if (!raw || raw === "all") return "all";
	if (LIVE_TYPE_SET.has(raw)) return raw as AnalyticsLiveEventType;
	return "all";
};

export const AdminAnalyticsLivePage: FC<AdminAnalyticsLivePageProps> = ({
	lang,
	dict,
	tabsDict,
}) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const initialFilter = useMemo(
		() => parseFilter(searchParams.get("type")),
		// initial — read once
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const state = useLivePageState(initialFilter);

	const [selected, setSelected] = useState<AnalyticsLiveEvent | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const handleFilterChange = useCallback(
		(next: LiveFilter) => {
			state.setFilter(next);
			const params = new URLSearchParams(searchParams.toString());
			if (next === "all") params.delete("type");
			else params.set("type", next);
			const qs = params.toString();
			router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
		},
		[pathname, router, searchParams, state],
	);

	useEffect(() => {
		const fromUrl = parseFilter(searchParams.get("type"));
		if (fromUrl !== state.filter) state.setFilter(fromUrl);
		// react to back/forward only
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	const handleSelect = useCallback((event: AnalyticsLiveEvent) => {
		setSelected(event);
		setDrawerOpen(true);
	}, []);

	const realtimeData = state.realtime.data;

	return (
		<article className="mx-auto max-w-[1200px]">
			<header className="mb-5 flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="mb-1 text-2xl font-bold tracking-tight text-[var(--text)]">
						{dict.header.title}
					</h1>
					<p className="max-w-xl text-base text-[var(--text-secondary)]">
						{dict.header.subtitle}
					</p>
				</div>
				<LiveBadge
					count={realtimeData?.count}
					loading={state.realtime.isLoading}
					paused={state.paused}
					label={dict.realtime.live}
					pausedLabel={dict.realtime.paused}
				/>
			</header>

			<AnalyticsTabs lang={lang} dict={tabsDict} activeKey="live" />

			<LiveStatsStrip
				lang={lang}
				dict={dict.stats}
				realtimeVisitors={realtimeData?.count}
				eventsPerMinute={realtimeData?.eventsPerMinute}
				queueSize={realtimeData?.queueSize}
				shownCount={state.visibleEvents.length}
				loading={state.realtime.isLoading && !realtimeData}
			/>

			<LiveToolbar
				dict={dict}
				filter={state.filter}
				onFilterChange={handleFilterChange}
				paused={state.paused}
				onTogglePause={state.togglePause}
				onClear={state.clearFeed}
			/>

			<LiveFeedPanel
				lang={lang}
				dict={dict}
				events={state.visibleEvents}
				visibleCount={state.visibleEvents.length}
				paused={state.paused}
				lastUpdate={state.lastUpdate}
				isInitialLoading={state.isInitialLoading}
				hasError={Boolean(state.loadError) && state.events.length === 0}
				onSelect={handleSelect}
				onRetry={() => handleFilterChange(state.filter)}
			/>

			<LiveEventDrawer
				open={drawerOpen}
				onOpenChange={(open) => {
					setDrawerOpen(open);
					if (!open) setSelected(null);
				}}
				event={selected}
				dict={dict.drawer}
			/>
		</article>
	);
};
