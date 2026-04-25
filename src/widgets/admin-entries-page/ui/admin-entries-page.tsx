"use client";

import {
	adminEntriesApi,
	useAdminEntries,
	useAdminEntriesStats,
	useBulkDeleteAdminEntries,
} from "@/features/admin-entries";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useDebounce } from "@/shared/lib";
import {
	AdminEmptyState,
	AdminErrorState,
	AdminTableSkeleton,
	Breadcrumb,
	PageHeader,
} from "@/shared/ui/admin";
import Link from "next/link";
import { type FC, useMemo, useState } from "react";
import { interpolate } from "../lib/format";
import { useEntriesFilters } from "../model/use-entries-filters";
import { useEntriesSelection } from "../model/use-entries-selection";
import { EntriesBulkBar } from "./entries-bulk-bar";
import { EntriesPagination } from "./entries-pagination";
import { EntriesPosTabs } from "./entries-pos-tabs";
import { EntriesStats } from "./entries-stats";
import { EntriesTable } from "./entries-table";
import { EntriesToolbar } from "./entries-toolbar";

interface Props {
	lang: Locale;
	dict: Dictionary["admin"]["entries"];
	commonDict: Dictionary["admin"]["common"];
}

const localeCodeFor = (lang: Locale): string => {
	switch (lang) {
		case "ru":
			return "ru-RU";
		case "en":
			return "en-US";
		default:
			return "ru-RU";
	}
};

const triggerDownload = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
};

export const AdminEntriesPage: FC<Props> = ({ lang, dict, commonDict }) => {
	const filters = useEntriesFilters();
	const selection = useEntriesSelection();
	const [exporting, setExporting] = useState(false);

	const debouncedQ = useDebounce(filters.state.q, 300);
	const query = useMemo(
		() => filters.toQuery(debouncedQ),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			debouncedQ,
			filters.state.pos,
			filters.state.source,
			filters.state.cefr,
			filters.state.nounClass,
			filters.state.entryType,
			filters.state.sort,
			filters.state.page,
			filters.state.limit,
		],
	);

	const statsQuery = useAdminEntriesStats();
	const listQuery = useAdminEntries(query);
	const bulkDelete = useBulkDeleteAdminEntries();

	const data = listQuery.data;
	const rows = data?.data ?? [];

	const handleBulkDelete = async () => {
		if (selection.count === 0) return;
		const ids = selection.selectedIds;
		const confirmed = window.confirm(
			interpolate(dict.bulk.confirmDelete, { count: ids.length }),
		);
		if (!confirmed) return;
		try {
			await bulkDelete.mutateAsync({ ids });
			selection.deselectAll();
		} catch {
			// Error toast could go here — for now silent.
		}
	};

	const handleExport = async (format: "json" | "csv") => {
		setExporting(true);
		try {
			const blob = await adminEntriesApi.exportEntries(query, format);
			triggerDownload(blob, `entries.${format}`);
		} catch {
			// swallow
		} finally {
			setExporting(false);
		}
	};

	return (
		<article className="max-w-[1280px] mx-auto">
			<Breadcrumb
				items={[
					{ href: `/${lang}/admin`, label: dict.breadcrumb.dashboard },
					{ label: dict.breadcrumb.entries },
				]}
			/>

			<PageHeader
				title={dict.header.title}
				subtitle={dict.header.subtitle}
				actions={
					<>
						<Link
							href={`/${lang}/admin/entries/bulk`}
							className="btn btn-sm btn-secondary"
						>
							{dict.actions.bulk}
						</Link>
						<button
							type="button"
							disabled={exporting}
							onClick={() => handleExport("json")}
							className="btn btn-sm btn-secondary disabled:opacity-40"
						>
							{exporting ? dict.actions.exporting : dict.actions.export}
						</button>
					</>
				}
			/>

			<EntriesStats
				stats={statsQuery.data}
				loading={statsQuery.isLoading}
				dict={dict.stats}
			/>

			<EntriesPosTabs
				value={filters.state.pos}
				onChange={filters.setPos}
				stats={statsQuery.data}
				dict={dict.tabs}
			/>

			<EntriesToolbar
				q={filters.state.q}
				onQChange={filters.setQ}
				source={filters.state.source}
				onSourceChange={filters.setSource}
				cefr={filters.state.cefr}
				onCefrChange={filters.setCefr}
				nounClass={filters.state.nounClass}
				onNounClassChange={filters.setNounClass}
				entryType={filters.state.entryType}
				onEntryTypeChange={filters.setEntryType}
				sort={filters.state.sort}
				onSortChange={filters.setSort}
				dict={dict.toolbar}
			/>

			<EntriesBulkBar
				count={selection.count}
				bulkHref={`/${lang}/admin/entries/bulk`}
				onSelectAll={() => selection.selectAll(rows.map((r) => r.id))}
				onDeselectAll={selection.deselectAll}
				onDelete={handleBulkDelete}
				deleting={bulkDelete.isPending}
				dict={dict.bulk}
			/>

			{listQuery.isLoading ? (
				<AdminTableSkeleton rows={8} />
			) : listQuery.isError ? (
				<AdminErrorState
					title={commonDict.error}
					retryLabel={commonDict.retry}
					onRetry={() => listQuery.refetch()}
				/>
			) : rows.length === 0 ? (
				<AdminEmptyState
					icon="📖"
					title={dict.empty.title}
					description={dict.empty.description}
					action={
						<button
							type="button"
							onClick={filters.reset}
							className="btn btn-sm btn-secondary"
						>
							{dict.empty.reset}
						</button>
					}
				/>
			) : (
				<>
					<EntriesTable
						rows={rows}
						lang={lang}
						selectedIds={selection.selected}
						onToggleRow={selection.toggle}
						onTogglePage={selection.togglePage}
						dict={dict}
						localeCode={localeCodeFor(lang)}
					/>

					{data ? (
						<EntriesPagination
							page={data.page}
							pages={data.pages}
							total={data.total}
							limit={data.limit}
							onPageChange={filters.setPage}
							onLimitChange={filters.setLimit}
							dict={dict.pagination}
						/>
					) : null}
				</>
			)}
		</article>
	);
};
