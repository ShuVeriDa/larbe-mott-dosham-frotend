"use client";

import type { SortOrder } from "@/entities/dictionary";
import {
	buildSearchParams,
	useSearchUrlState,
} from "@/features/search";
import type { Dictionary } from "@/i18n/dictionaries";
import { SearchBar } from "@/widgets/search-bar";
import { useParams, useRouter } from "next/navigation";
import { useCallback, type FC } from "react";
import { useSearchErrorToast } from "../model/use-search-error-toast";
import { useSearchQuery } from "../model/use-search-query";
import { EmptyState } from "./empty-state";
import { Pagination } from "./pagination";
import { ResultsError } from "./results-error";
import { ResultsList } from "./results-list";
import { ResultsMeta } from "./results-meta";
import { ResultsSkeleton } from "./results-skeleton";

interface SearchResultsProps {
	search: Dictionary["search"];
	lang: string;
}

export const SearchResults: FC<SearchResultsProps> = ({ search, lang }) => {
	const url = useSearchUrlState();
	const router = useRouter();
	const params = useParams<{ lang: string }>();

	const { data, isLoading, isError, error, refetch } = useSearchQuery(url);

	useSearchErrorToast(error, isError, search.error);

	const pushUrl = useCallback(
		(next: { sort?: SortOrder; page?: number }) => {
			const params_ = buildSearchParams({
				q: url.q,
				filters: url.filters,
				sort: next.sort ?? url.sort,
				page: next.page ?? url.page,
			});
			router.push(`/${params.lang}/search?${params_.toString()}`);
		},
		[url, router, params.lang],
	);

	const handleSortChange = useCallback(
		(sort: SortOrder) => pushUrl({ sort, page: 1 }),
		[pushUrl],
	);

	const handlePageChange = useCallback(
		(page: number) => pushUrl({ page }),
		[pushUrl],
	);

	return (
		<>
			<section
				aria-label={search.hero.title}
				className="sticky top-0 z-10 pt-8 pb-4 bg-background/95 backdrop-blur"
			>
				<SearchBar
					search={search}
					lang={lang}
					syncWithUrl
					hideHints
				/>
			</section>

			{isLoading && <ResultsSkeleton />}

			{isError && (
				<ResultsError dict={search.error} onRetry={() => refetch()} />
			)}

			{!isLoading && !isError && data && data.data.length > 0 && (
				<>
					<ResultsMeta
						total={data.meta.total}
						query={url.q}
						sort={url.sort}
						onSortChange={handleSortChange}
						dict={search.results}
					/>
					<ResultsList
						entries={data.data}
						query={url.q}
						lang={lang}
						labels={{
							neologism: search.filters.entryTypes.neologism,
						}}
						favoriteLabel={search.results.favorite}
					/>
					<Pagination
						page={url.page}
						total={data.meta.total}
						limit={data.meta.limit}
						prevLabel={search.pagination.prev}
						nextLabel={search.pagination.next}
						pageOfTemplate={search.pagination.pageOf}
						onPageChange={handlePageChange}
					/>
				</>
			)}

			{!isLoading && !isError && data && data.data.length === 0 && (
				<EmptyState
					query={url.q}
					lemmaHint={data.meta.lemmaHint}
					lang={lang}
					dict={search.empty}
				/>
			)}
		</>
	);
};
