"use client";

import { useEffect } from "react";
import { usePopularStore } from "../model/popular";
import { usePosValuesStore } from "../model/pos-values";
import { useSourcesStore } from "../model/sources";
import { useStatsStore } from "../model/stats";

export const DictionaryDataProvider = () => {
	const fetchStats = useStatsStore(s => s.fetchStats);
	const fetchPosValues = usePosValuesStore(s => s.fetchPosValues);
	const fetchPopular = usePopularStore(s => s.fetchPopular);
	const fetchSources = useSourcesStore(s => s.fetchSources);

	useEffect(() => {
		fetchStats();
		fetchPosValues();
		fetchPopular();
		fetchSources();
	}, [fetchStats, fetchPosValues, fetchPopular, fetchSources]);

	return null;
};
