import "server-only";
import { API_URL } from "@/shared/config";
import type { DictionaryEntry, DictionarySource } from "./types";

const ENTRY_REVALIDATE_SECONDS = 300;
const SOURCES_REVALIDATE_SECONDS = 1800;

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
