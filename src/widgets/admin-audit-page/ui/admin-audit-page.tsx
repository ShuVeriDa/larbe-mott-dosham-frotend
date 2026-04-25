"use client";

import {
	type AuditQuery,
	useAdminAudit,
	useAdminAuditStats,
} from "@/features/admin-audit";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import {
	AdminEmptyState,
	AdminErrorState,
	AdminTableSkeleton,
	PageHeader,
} from "@/shared/ui/admin";
import type { FC } from "react";
import { useMemo } from "react";
import { useAuditPageState } from "../model/use-audit-page-state";
import { AuditExportButton } from "./audit-export-button";
import { AuditFilterChips } from "./audit-filter-chips";
import { AuditPagination } from "./audit-pagination";
import { AuditStatsRow } from "./audit-stats-row";
import { AuditTimeline } from "./audit-timeline";
import { AuditToolbar } from "./audit-toolbar";

interface AdminAuditPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["audit"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminAuditPage: FC<AdminAuditPageProps> = ({
	lang,
	dict,
	commonDict,
}) => {
	const state = useAuditPageState();

	const listQuery: AuditQuery = useMemo(
		() => ({
			q: state.debouncedQ || undefined,
			action: state.action || undefined,
			actorType: state.actorType || undefined,
			period: state.period,
			page: state.page,
			limit: state.pageSize,
		}),
		[
			state.debouncedQ,
			state.action,
			state.actorType,
			state.period,
			state.page,
			state.pageSize,
		],
	);

	const statsQuery = useAdminAuditStats();
	const audit = useAdminAudit(listQuery);

	const items = audit.data?.items ?? [];
	const totalPages = audit.data?.totalPages ?? 0;
	const isFilterActive =
		state.debouncedQ.trim().length > 0 ||
		state.action !== "" ||
		state.actorType !== "" ||
		state.period !== "all";
	const isInitialLoading = audit.isLoading && !audit.data;

	return (
		<article className="max-w-[1200px] mx-auto">
			<PageHeader
				title={dict.header.title}
				subtitle={dict.header.subtitle}
				actions={
					<AuditExportButton query={listQuery} dict={dict.toolbar} />
				}
			/>

			<AuditStatsRow
				stats={statsQuery.data}
				loading={statsQuery.isLoading}
				dict={dict.stats}
			/>

			<AuditToolbar
				q={state.q}
				onQChange={state.setQ}
				action={state.action}
				onActionChange={state.setAction}
				actorType={state.actorType}
				onActorTypeChange={state.setActorType}
				period={state.period}
				onPeriodChange={state.setPeriod}
				dict={dict.toolbar}
				filtersDict={dict.filters}
			/>

			<AuditFilterChips
				value={state.action}
				onChange={state.setAction}
				counts={statsQuery.data?.byAction}
				dict={dict.filters}
			/>

			{isInitialLoading ? (
				<AdminTableSkeleton rows={8} />
			) : audit.isError ? (
				<AdminErrorState
					title={dict.errorTitle}
					description={commonDict.error}
					retryLabel={commonDict.retry}
					onRetry={() => audit.refetch()}
				/>
			) : items.length === 0 ? (
				<AdminEmptyState
					icon="📭"
					title={isFilterActive ? dict.emptyFiltered : dict.empty}
				/>
			) : (
				<AuditTimeline items={items} lang={lang} dict={dict} />
			)}

			<AuditPagination
				page={state.page}
				totalPages={totalPages}
				onChange={state.setPage}
				dict={dict.pagination}
			/>
		</article>
	);
};
