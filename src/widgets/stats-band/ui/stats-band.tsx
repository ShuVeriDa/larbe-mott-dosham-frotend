import { FC } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { dictionaryApi, dictionaryKeys } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { getQueryClient } from "@/shared/lib/get-query-client";
import { StatsBandView } from "./stats-band-view";

interface IStatsBandProps {
	statsBand: Dictionary["statsBand"];
}

export const StatsBand: FC<IStatsBandProps> = async ({ statsBand }) => {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: dictionaryKeys.stats(),
		queryFn: dictionaryApi.getStats,
		staleTime: 10 * 60 * 1000,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<StatsBandView statsBand={statsBand} />
		</HydrationBoundary>
	);
};
