"use client";

import { useSources } from "@/entities/dictionary";
import {
	type QualityProblemFilter,
	type QualitySortField,
	adminQualityProblemsKeys,
	useExportQualityProblems,
	useQualityProblems,
	useQualityStats,
} from "@/features/admin-quality-problems";
import { useRunImproveEntries } from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useDebounce } from "@/shared/lib";
import {
	AdminEmptyState,
	AdminErrorState,
	AdminTableSkeleton,
	Breadcrumb,
	PageHeader,
} from "@/shared/ui/admin";
import { useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useExpanded } from "../model/expanded";
import { usePageState } from "../model/page-state";
import { useSelection } from "../model/selection";
import { useToast } from "../model/toast";
import { ProblemsBulkBar } from "./problems-bulk-bar";
import { ProblemsPagination } from "./problems-pagination";
import { ProblemsSummaryStrip } from "./problems-summary-strip";
import { ProblemsTable } from "./problems-table";
import { ProblemsToolbar } from "./problems-toolbar";
import { Toast } from "./toast";

interface AdminQualityProblemsPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["qualityProblems"];
	commonDict: Dictionary["admin"]["common"];
}

const triggerDownload = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};

export const AdminQualityProblemsPage: FC<AdminQualityProblemsPageProps> = ({
	lang,
	dict,
	commonDict,
}) => {
	const { state, update } = usePageState();
	const [qInput, setQInput] = useState(state.q);
	const debouncedQ = useDebounce(qInput, 300);

	useEffect(() => {
		if (debouncedQ !== state.q) {
			update({ q: debouncedQ }, { resetPage: true });
		}
	}, [debouncedQ, state.q, update]);

	const { selected, toggle: toggleSelect, selectMany, clear } = useSelection();
	const { expanded, toggle: toggleExpand } = useExpanded();
	const { toast, show } = useToast();

	const statsQuery = useQualityStats();
	const sourcesQuery = useSources();

	const problemsQuery = useQualityProblems({
		type: state.type || undefined,
		q: state.q || undefined,
		source: state.source || undefined,
		page: state.page,
		limit: state.limit,
		sortBy: state.sortBy,
		sortDir: state.sortDir,
	});

	const rows = useMemo(
		() => problemsQuery.data?.data ?? [],
		[problemsQuery.data],
	);
	const total = problemsQuery.data?.total ?? 0;
	const pages = problemsQuery.data?.pages ?? 1;

	const qc = useQueryClient();
	const exportMutation = useExportQualityProblems();
	const improveMutation = useRunImproveEntries();

	const handleTypeChange = useCallback(
		(type: QualityProblemFilter) => {
			update({ type }, { resetPage: true });
			clear();
		},
		[update, clear],
	);

	const handleSortChange = useCallback(
		(field: QualitySortField) => {
			const nextDir =
				state.sortBy === field && state.sortDir === "desc" ? "asc" : "desc";
			update({ sortBy: field, sortDir: nextDir }, { resetPage: true });
		},
		[state.sortBy, state.sortDir, update],
	);

	const handleSourceChange = useCallback(
		(source: string) => {
			update({ source }, { resetPage: true });
		},
		[update],
	);

	const handleLimitChange = useCallback(
		(limit: number) => {
			update({ limit }, { resetPage: true });
		},
		[update],
	);

	const handlePageChange = useCallback(
		(page: number) => {
			if (page < 1 || page > pages) return;
			update({ page });
		},
		[pages, update],
	);

	const handleToggleSelectAll = useCallback(() => {
		const ids = rows.map((r) => r.id);
		const allSelected =
			ids.length > 0 && ids.every((id) => selected.has(id));
		if (allSelected) {
			clear();
		} else {
			selectMany(ids);
		}
	}, [rows, selected, selectMany, clear]);

	const handleRefresh = useCallback(() => {
		qc.invalidateQueries({ queryKey: adminQualityProblemsKeys.all });
		show(dict.toast.refreshed);
	}, [dict.toast.refreshed, qc, show]);

	const handleExport = useCallback(async () => {
		try {
			const blob = await exportMutation.mutateAsync({
				type: state.type || undefined,
				q: state.q || undefined,
				source: state.source || undefined,
				sortBy: state.sortBy,
				sortDir: state.sortDir,
			});
			triggerDownload(blob, "quality-problems.csv");
			show(dict.toast.exported.replace("{count}", String(total)));
		} catch {
			show(dict.toast.exportError);
		}
	}, [
		dict.toast.exported,
		dict.toast.exportError,
		exportMutation,
		show,
		state.q,
		state.sortBy,
		state.sortDir,
		state.source,
		state.type,
		total,
	]);

	const handleSendImprove = useCallback(async () => {
		const ids = Array.from(selected);
		if (ids.length === 0) return;
		try {
			await improveMutation.mutateAsync({ ids });
			show(dict.toast.improveSent.replace("{count}", String(ids.length)));
			clear();
			qc.invalidateQueries({ queryKey: adminQualityProblemsKeys.all });
		} catch {
			show(dict.toast.improveError);
		}
	}, [
		clear,
		dict.toast.improveError,
		dict.toast.improveSent,
		improveMutation,
		qc,
		selected,
		show,
	]);

	const sources = useMemo(() => sourcesQuery.data ?? [], [sourcesQuery.data]);

	const isLoading = problemsQuery.isLoading && !problemsQuery.data;
	const isError = problemsQuery.isError && !problemsQuery.data;
	const isEmpty = !isLoading && rows.length === 0;

	return (
		<article className="max-w-[1280px] mx-auto">
			<Breadcrumb
				items={[
					{ label: dict.breadcrumb.dashboard, href: `/${lang}/admin` },
					{ label: dict.breadcrumb.quality, href: `/${lang}/admin/quality` },
					{ label: dict.breadcrumb.problems },
				]}
			/>
			<PageHeader title={dict.header.title} subtitle={dict.header.subtitle} />

			<ProblemsSummaryStrip
				value={state.type}
				stats={statsQuery.data}
				isLoading={statsQuery.isLoading}
				dict={dict}
				onChange={handleTypeChange}
			/>

			<ProblemsToolbar
				q={qInput}
				onQChange={setQInput}
				source={state.source}
				sources={sources}
				onSourceChange={handleSourceChange}
				sortBy={state.sortBy}
				onSortByChange={(field) =>
					update({ sortBy: field }, { resetPage: true })
				}
				onExport={handleExport}
				onRefresh={handleRefresh}
				isExporting={exportMutation.isPending}
				dict={dict}
			/>

			<ProblemsBulkBar
				lang={lang}
				count={selected.size}
				onSelectAll={() => selectMany(rows.map((r) => r.id))}
				onDeselectAll={clear}
				onSendImprove={handleSendImprove}
				isSending={improveMutation.isPending}
				dict={dict}
			/>

			{isLoading ? (
				<AdminTableSkeleton rows={10} />
			) : isError ? (
				<AdminErrorState
					title={commonDict.error}
					retryLabel={commonDict.retry}
					onRetry={() => problemsQuery.refetch()}
				/>
			) : isEmpty ? (
				<AdminEmptyState
					title={dict.table.empty.title}
					description={dict.table.empty.description}
				/>
			) : (
				<>
					<ProblemsTable
						lang={lang}
						dict={dict}
						rows={rows}
						selectedIds={selected}
						expandedIds={expanded}
						onToggleSelect={toggleSelect}
						onToggleExpand={toggleExpand}
						onToggleSelectAll={handleToggleSelectAll}
						sortBy={state.sortBy}
						sortDir={state.sortDir}
						onSortChange={handleSortChange}
					/>
					<ProblemsPagination
						page={state.page}
						pages={pages}
						total={total}
						limit={state.limit}
						rowsOnPage={rows.length}
						onPageChange={handlePageChange}
						onLimitChange={handleLimitChange}
						dict={dict}
					/>
				</>
			)}

			{toast ? <Toast message={toast.message} /> : null}
		</article>
	);
};
