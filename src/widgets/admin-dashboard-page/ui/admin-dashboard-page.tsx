"use client";

import { useAdminDashboardStats } from "@/features/admin-dashboard";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import {
	AdminErrorState,
	AdminTableSkeleton,
	PageHeader,
	StatCard,
	formatStatValue,
} from "@/shared/ui/admin";
import type { FC } from "react";
import { ProblemsTable } from "./problems-table";
import { QualityBreakdown } from "./quality-breakdown";
import { QualityRing } from "./quality-ring";
import { QuickActions } from "./quick-actions";

interface AdminDashboardPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["dashboard"];
	commonDict: Dictionary["admin"]["common"];
}

const nf = new Intl.NumberFormat("ru-RU");

export const AdminDashboardPage: FC<AdminDashboardPageProps> = ({
	lang,
	dict,
	commonDict,
}) => {
	const statsQuery = useAdminDashboardStats();

	const stats = statsQuery.data;
	const formatDescription = (template: string, total: number, clean: number) =>
		template
			.replace("{clean}", nf.format(clean))
			.replace("{total}", nf.format(total));

	return (
		<article className="max-w-[1280px] mx-auto">
			<PageHeader title={dict.header.title} subtitle={dict.header.subtitle} />

			{statsQuery.isError ? (
				<AdminErrorState
					title={commonDict.error}
					retryLabel={commonDict.retry}
					onRetry={() => statsQuery.refetch()}
				/>
			) : (
				<>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
						<StatCard
							icon="📚"
							tone="total"
							label={dict.stats.totalEntries}
							value={formatStatValue(stats?.totalEntries)}
							sub={
								stats
									? `${dict.stats.sourcesCount}: ${nf.format(stats.sourcesCount)}`
									: null
							}
							loading={statsQuery.isLoading}
						/>
						<StatCard
							icon="⊗"
							tone="danger"
							label={dict.stats.noMeanings}
							value={formatStatValue(stats?.byProblem.noMeanings.count)}
							sub={
								stats
									? `${stats.byProblem.noMeanings.pct.toFixed(1)}%`
									: null
							}
							loading={statsQuery.isLoading}
						/>
						<StatCard
							icon="?"
							tone="warning"
							label={dict.stats.noClass}
							value={formatStatValue(stats?.byProblem.noClass.count)}
							sub={
								stats ? `${stats.byProblem.noClass.pct.toFixed(1)}%` : null
							}
							loading={statsQuery.isLoading}
						/>
						<StatCard
							icon="·"
							tone="info"
							label={dict.stats.noPos}
							value={formatStatValue(stats?.byProblem.noPos.count)}
							sub={
								stats ? `${stats.byProblem.noPos.pct.toFixed(1)}%` : null
							}
							loading={statsQuery.isLoading}
						/>
					</div>

					{stats ? (
						<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 mb-8">
							<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
								<QualityRing
									pct={stats.completenessPct}
									label={dict.quality.ringLabel}
								/>
								<div className="text-sm text-[var(--text-secondary)] mt-4">
									{formatDescription(
										dict.quality.description,
										stats.totalEntries,
										stats.entriesWithoutProblems,
									)}
								</div>
							</div>
							<QualityBreakdown
								breakdown={stats.byProblem}
								dict={dict.quality}
								lang={lang}
							/>
						</div>
					) : statsQuery.isLoading ? (
						<AdminTableSkeleton rows={4} className="mb-8" />
					) : null}

					<QuickActions dict={dict.quickActions} lang={lang} />

					<ProblemsTable
						dict={dict.problems}
						commonDict={commonDict}
						lang={lang}
						breakdownCounts={{
							noMeanings: stats?.byProblem.noMeanings.count ?? 0,
							noClass: stats?.byProblem.noClass.count ?? 0,
							noPos: stats?.byProblem.noPos.count ?? 0,
							noExamples: stats?.byProblem.noExamples.count ?? 0,
						}}
					/>
				</>
			)}
		</article>
	);
};
