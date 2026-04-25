"use client";

import {
	adminAnalyticsApi,
	useAdminAnalyticsRealtime,
	type AnalyticsLiveEvent,
	type AnalyticsLiveEventType,
} from "@/features/admin-analytics";
import { useEffect, useMemo, useRef, useState } from "react";

const FEED_LIMIT = 100;
const POLL_INTERVAL_MS = 5000;
const JUST_IN_FLAG_MS = 1500;

export type LiveFilter = "all" | AnalyticsLiveEventType;

interface LiveEventEnriched extends AnalyticsLiveEvent {
	just?: boolean;
}

const dedupeAndCap = (
	incoming: AnalyticsLiveEvent[],
	current: LiveEventEnriched[],
): LiveEventEnriched[] => {
	if (incoming.length === 0) return current;
	const seen = new Set(current.map((e) => e.id));
	const fresh: LiveEventEnriched[] = [];
	for (const ev of incoming) {
		if (seen.has(ev.id)) continue;
		seen.add(ev.id);
		fresh.push({ ...ev, just: true });
	}
	if (fresh.length === 0) return current;
	return [...fresh, ...current].slice(0, FEED_LIMIT);
};

export const useLivePageState = (initialFilter: LiveFilter = "all") => {
	const [events, setEvents] = useState<LiveEventEnriched[]>([]);
	const [filter, setFilter] = useState<LiveFilter>(initialFilter);
	const [paused, setPaused] = useState(false);
	const [isInitialLoading, setInitialLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

	const maxIdRef = useRef<string | null>(null);
	const filterRef = useRef<LiveFilter>(filter);
	const pausedRef = useRef<boolean>(paused);
	const justInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const reqIdRef = useRef(0);

	useEffect(() => {
		filterRef.current = filter;
	}, [filter]);
	useEffect(() => {
		pausedRef.current = paused;
	}, [paused]);

	const realtime = useAdminAnalyticsRealtime();

	const buildEventTypeArg = (
		f: LiveFilter,
	): AnalyticsLiveEventType | undefined => (f === "all" ? undefined : f);

	const scheduleClearJust = () => {
		if (justInTimerRef.current) clearTimeout(justInTimerRef.current);
		justInTimerRef.current = setTimeout(() => {
			setEvents((prev) =>
				prev.some((e) => e.just) ? prev.map((e) => ({ ...e, just: false })) : prev,
			);
		}, JUST_IN_FLAG_MS);
	};

	useEffect(() => {
		const reqId = ++reqIdRef.current;
		setEvents([]);
		setInitialLoading(true);
		setLoadError(null);
		maxIdRef.current = null;

		void adminAnalyticsApi
			.getRecent({
				limit: FEED_LIMIT,
				eventType: buildEventTypeArg(filter),
			})
			.then((items) => {
				if (reqIdRef.current !== reqId) return;
				const enriched: LiveEventEnriched[] = items.map((e) => ({
					...e,
					just: false,
				}));
				setEvents(enriched);
				maxIdRef.current = items[0]?.id ?? null;
				setLastUpdate(new Date());
			})
			.catch((err: unknown) => {
				if (reqIdRef.current !== reqId) return;
				setLoadError(err instanceof Error ? err.message : "load_failed");
			})
			.finally(() => {
				if (reqIdRef.current !== reqId) return;
				setInitialLoading(false);
			});

		return () => {
			// invalidate in-flight on filter change
		};
	}, [filter]);

	useEffect(() => {
		const tick = async () => {
			if (pausedRef.current) return;
			if (typeof document !== "undefined" && document.hidden) return;
			try {
				const items = await adminAnalyticsApi.getRecent({
					limit: FEED_LIMIT,
					sinceId: maxIdRef.current ?? undefined,
					eventType: buildEventTypeArg(filterRef.current),
				});
				if (items.length > 0) {
					setEvents((prev) => dedupeAndCap(items, prev));
					maxIdRef.current = items[0].id;
					scheduleClearJust();
				}
				setLastUpdate(new Date());
				setLoadError(null);
			} catch (err: unknown) {
				setLoadError(err instanceof Error ? err.message : "load_failed");
			}
		};
		const id = window.setInterval(tick, POLL_INTERVAL_MS);
		return () => {
			window.clearInterval(id);
			if (justInTimerRef.current) clearTimeout(justInTimerRef.current);
		};
	}, []);

	const visibleEvents = useMemo(() => {
		if (filter === "all") return events;
		return events.filter((e) => e.eventType === filter);
	}, [events, filter]);

	const togglePause = () => setPaused((p) => !p);
	const clearFeed = () => {
		setEvents([]);
		maxIdRef.current = null;
	};

	return {
		events,
		visibleEvents,
		filter,
		setFilter,
		paused,
		togglePause,
		clearFeed,
		isInitialLoading,
		loadError,
		lastUpdate,
		realtime,
	};
};

export type UseLivePageStateReturn = ReturnType<typeof useLivePageState>;
