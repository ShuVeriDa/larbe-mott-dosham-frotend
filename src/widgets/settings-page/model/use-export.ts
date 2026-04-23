"use client";

import { favoritesApi } from "@/features/favorites";
import { searchHistoryApi } from "@/features/search-history";
import { suggestionsApi } from "@/features/suggestions";
import { useState } from "react";
import { toast } from "sonner";
import { downloadBlob, toCsv } from "../lib/download";

type ExportKey = "favorites" | "history" | "suggestions";

interface UseExportOptions {
	errorMessage: string;
}

export const useExport = ({ errorMessage }: UseExportOptions) => {
	const [pendingKey, setPendingKey] = useState<ExportKey | null>(null);

	const run = async (key: ExportKey) => {
		setPendingKey(key);
		try {
			if (key === "favorites") {
				const data = await favoritesApi.getAll();
				downloadBlob(
					new Blob([JSON.stringify(data, null, 2)], {
						type: "application/json",
					}),
					"favorites.json",
				);
				return;
			}
			if (key === "history") {
				const data = await searchHistoryApi.getAll({ limit: 10000 });
				const csv = toCsv(
					["id", "query", "lang", "kind", "createdAt"],
					data.items.map(item => ({
						id: item.id,
						query: item.query,
						lang: item.lang ?? "",
						kind: item.kind ?? "",
						createdAt: item.createdAt,
					})),
				);
				downloadBlob(
					new Blob([csv], { type: "text/csv;charset=utf-8" }),
					"search-history.csv",
				);
				return;
			}
			const data = await suggestionsApi.getMine({ limit: 1000 });
			downloadBlob(
				new Blob([JSON.stringify(data, null, 2)], {
					type: "application/json",
				}),
				"suggestions.json",
			);
		} catch {
			toast.error(errorMessage);
		} finally {
			setPendingKey(null);
		}
	};

	return { run, pendingKey };
};
