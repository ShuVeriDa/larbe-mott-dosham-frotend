"use client";

import type {
	QualityProblemsResponse,
	QualityProblemType,
	QualitySourceStat,
	QualityStats,
} from "@/features/admin-quality";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import {
	AdminEmptyState,
	AdminErrorState,
	AdminTableSkeleton,
} from "@/shared/ui/admin";
import type { FC } from "react";
import { QualityProblemsFilters } from "./quality-problems-filters";
import { QualityProblemsPagination } from "./quality-problems-pagination";
import { QualityProblemsTable } from "./quality-problems-table";

interface QualityProblemsSectionProps {
	lang: Locale;
	type: QualityProblemType | "";
	onTypeChange: (type: QualityProblemType | "") => void;
	search: string;
	onSearchChange: (value: string) => void;
	source: string;
	onSourceChange: (value: string) => void;
	sources?: QualitySourceStat[];
	stats?: QualityStats;
	page: number;
	onPageChange: (page: number) => void;
	problems?: QualityProblemsResponse;
	isLoading: boolean;
	isError: boolean;
	onRetry: () => void;
	dict: Dictionary["admin"]["quality"]["problems"];
	commonDict: Dictionary["admin"]["common"];
}

export const QualityProblemsSection: FC<QualityProblemsSectionProps> = ({
	lang,
	type,
	onTypeChange,
	search,
	onSearchChange,
	source,
	onSourceChange,
	sources,
	stats,
	page,
	onPageChange,
	problems,
	isLoading,
	isError,
	onRetry,
	dict,
	commonDict,
}) => (
	<section id="problems" aria-labelledby="problems-heading" className="scroll-mt-20">
		<div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
			<h2
				id="problems-heading"
				className="text-[var(--text)] font-semibold text-lg"
			>
				{dict.title}
			</h2>
		</div>

		<QualityProblemsFilters
			type={type}
			onTypeChange={onTypeChange}
			search={search}
			onSearchChange={onSearchChange}
			source={source}
			onSourceChange={onSourceChange}
			sources={sources}
			stats={stats}
			dict={dict}
		/>

		{isLoading && !problems ? (
			<AdminTableSkeleton rows={8} />
		) : isError ? (
			<AdminErrorState
				title={commonDict.error}
				retryLabel={commonDict.retry}
				onRetry={onRetry}
			/>
		) : !problems?.data.length ? (
			<AdminEmptyState
				title={dict.emptyTitle}
				description={dict.emptyDescription}
			/>
		) : (
			<>
				<QualityProblemsTable
					rows={problems.data}
					lang={lang}
					dict={dict}
				/>
				<QualityProblemsPagination
					page={problems.page}
					pages={problems.pages}
					total={problems.total}
					limit={problems.limit}
					onPageChange={onPageChange}
					pageInfoTemplate={dict.pageInfo}
				/>
			</>
		)}
	</section>
);
