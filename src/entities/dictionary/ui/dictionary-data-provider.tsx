"use client";

import { useEffect } from "react";
import { usePopularStore } from "../model/popular";
import { usePosValuesStore } from "../model/pos-values";
import { useStatsStore } from "../model/stats";

export const DictionaryDataProvider = () => {
	const fetchStats = useStatsStore(s => s.fetchStats);
	const fetchPosValues = usePosValuesStore(s => s.fetchPosValues);
	const fetchPopular = usePopularStore(s => s.fetchPopular);

	useEffect(() => {
		fetchStats();
		fetchPosValues();
		fetchPopular();
	}, [fetchStats, fetchPosValues, fetchPopular]);

	return null;
};
