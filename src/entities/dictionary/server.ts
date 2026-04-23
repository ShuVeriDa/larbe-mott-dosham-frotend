import "server-only";
import { API_URL } from "@/shared/config";
import type {
	DictionaryEntry,
	DictionarySource,
	DictionaryStats,
} from "./types";

const ENTRY_REVALIDATE_SECONDS = 300;
const SOURCES_REVALIDATE_SECONDS = 1800;
const STATS_REVALIDATE_SECONDS = 1800;

export const fetchEntryServer = async (
	id: number,
): Promise<DictionaryEntry | null> => {
	const res = await fetch(`${API_URL}/dictionary/${id}`, {
		next: { revalidate: ENTRY_REVALIDATE_SECONDS },
		headers: { Accept: "application/json" },
	});
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`Failed to fetch entry ${id}: ${res.status}`);
	return (await res.json()) as DictionaryEntry;
};

export const fetchSourcesServer = async (): Promise<DictionarySource[]> => {
	const res = await fetch(`${API_URL}/dictionary/sources`, {
		next: { revalidate: SOURCES_REVALIDATE_SECONDS },
		headers: { Accept: "application/json" },
	});
	if (!res.ok) throw new Error(`Failed to fetch sources: ${res.status}`);
	return (await res.json()) as DictionarySource[];
};

export const fetchStatsServer = async (): Promise<DictionaryStats | null> => {
	try {
		const res = await fetch(`${API_URL}/dictionary/stats`, {
			next: { revalidate: STATS_REVALIDATE_SECONDS },
			headers: { Accept: "application/json" },
		});
		if (!res.ok) return null;
		return (await res.json()) as DictionaryStats;
	} catch {
		return null;
	}
};

export const fetchSourcesServerSafe = async (): Promise<DictionarySource[]> => {
	try {
		return await fetchSourcesServer();
	} catch {
		return [];
	}
};
