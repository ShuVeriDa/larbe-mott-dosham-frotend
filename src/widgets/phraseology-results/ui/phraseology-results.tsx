"use client";

import {
	buildPhraseologyParams,
	usePhraseologyUrlState,
} from "@/features/phraseology-search";
import type { Dictionary } from "@/i18n/dictionaries";
import { PhraseologySearchBar } from "@/widgets/phraseology-search-bar";
import { useParams, useRouter } from "next/navigation";
import { useCallback, type FC } from "react";
import { usePhraseologyErrorToast } from "../model/use-phraseology-error-toast";
import { usePhraseologyQuery } from "../model/use-phraseology-query";
import { EmptyState } from "./empty-state";
import { Pagination } from "./pagination";
import { PhraseList } from "./phrase-list";
import { ResultsError } from "./results-error";
import { ResultsMeta } from "./results-meta";
import { ResultsSkeleton } from "./results-skeleton";

interface PhraseologyResultsProps {
	phraseology: Dictionary["phraseology"];
	lang: string;
}

export const PhraseologyResults: FC<PhraseologyResultsProps> = ({
	phraseology,
	lang,
}) => {
	const url = usePhraseologyUrlState();
	const router = useRouter();
	const params = useParams<{ lang: string }>();

	const { data, isLoading, isError, error, refetch } = usePhraseologyQuery(url);

	usePhraseologyErrorToast(error, isError, phraseology.error);

	const handlePageChange = useCallback(
		(page: number) => {
			const urlParams = buildPhraseologyParams({
				q: url.q,
				exact: url.exact,
				page,
			});
			router.push(`/${params.lang}/phraseology?${urlParams.toString()}`);
		},
		[url.q, url.exact, router, params.lang],
	);

	const labels = {
		variants: phraseology.variantsBadge,
	};

	return (
		<>
			<section
				aria-label={phraseology.hero.title}
				className="sticky top-0 z-10 pt-8 pb-4 bg-background/95 backdrop-blur"
			>
				<PhraseologySearchBar
					phraseology={phraseology}
					lang={lang}
					syncWithUrl
					hideHints
				/>
			</section>

			{isLoading && <ResultsSkeleton />}

			{isError && (
				<ResultsError dict={phraseology.error} onRetry={() => refetch()} />
			)}

			{!isLoading && !isError && data && data.data.length > 0 && (
				<>
					<ResultsMeta
						total={data.meta.total}
						query={url.q}
						dict={phraseology.results}
					/>
					<PhraseList
						entries={data.data}
						query={url.q}
						labels={labels}
					/>
					<Pagination
						page={url.page}
						total={data.meta.total}
						limit={data.meta.limit}
						prevLabel={phraseology.pagination.prev}
						nextLabel={phraseology.pagination.next}
						pageOfTemplate={phraseology.pagination.pageOf}
						onPageChange={handlePageChange}
					/>
				</>
			)}

			{!isLoading && !isError && data && data.data.length === 0 && (
				<EmptyState
					query={url.q}
					lang={lang}
					dict={phraseology.empty}
				/>
			)}
		</>
	);
};
