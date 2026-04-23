"use client";

import {
	type AdminEntriesPosFilter,
	useAdminEntries,
	useAdminEntriesStats,
} from "@/features/admin-entries";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	AdminEmptyState,
	AdminErrorState,
	AdminTableSkeleton,
	FilterChips,
	PageHeader,
	StatCard,
	formatStatValue,
} from "@/shared/ui/admin";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";

interface AdminEntriesPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["entries"];
	commonDict: Dictionary["admin"]["common"];
}

const nf = new Intl.NumberFormat("ru-RU");
const formatDate = (iso: string | undefined) => {
	if (!iso) return "—";
	try {
		return new Date(iso).toLocaleDateString("ru-RU", {
			day: "2-digit",
			month: "short",
			year: "2-digit",
		});
	} catch {
		return iso;
	}
};

export const AdminEntriesPage: FC<AdminEntriesPageProps> = ({
	lang,
	dict,
	commonDict,
}) => {
	const [q, setQ] = useState("");
	const [pos, setPos] = useState<AdminEntriesPosFilter>("");
	const [page, setPage] = useState(1);

	const statsQuery = useAdminEntriesStats();
	const listQuery = useAdminEntries({ q, pos, page, limit: 25 });

	const stats = statsQuery.data;
	const data = listQuery.data;

	const tabs = [
		{ value: "" as const, label: dict.tabs.all, count: stats?.total },
		{ value: "noun" as const, label: dict.tabs.nouns, count: stats?.nouns },
		{ value: "verb" as const, label: dict.tabs.verbs, count: stats?.verbs },
		{
			value: "adjective" as const,
			label: dict.tabs.adjectives,
			count: stats?.adjectives,
		},
		{
			value: "adverb" as const,
			label: dict.tabs.adverbs,
			count: stats?.adverbs,
		},
		{ value: "other" as const, label: dict.tabs.other, count: stats?.other },
	];

	return (
		<article className="max-w-[1400px] mx-auto">
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
						<button type="button" className="btn btn-sm btn-secondary">
							{dict.actions.export}
						</button>
					</>
				}
			/>

			<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
				<StatCard
					tone="total"
					label={dict.stats.total}
					value={formatStatValue(stats?.total)}
					loading={statsQuery.isLoading}
				/>
				<StatCard
					tone="info"
					label={dict.stats.nouns}
					value={formatStatValue(stats?.nouns)}
					loading={statsQuery.isLoading}
				/>
				<StatCard
					tone="success"
					label={dict.stats.verbs}
					value={formatStatValue(stats?.verbs)}
					loading={statsQuery.isLoading}
				/>
				<StatCard
					tone="warning"
					label={dict.stats.sources}
					value={formatStatValue(stats?.sourcesCount)}
					loading={statsQuery.isLoading}
				/>
				<StatCard
					tone="danger"
					label={dict.stats.updatedToday}
					value={formatStatValue(stats?.updatedToday)}
					loading={statsQuery.isLoading}
				/>
			</div>

			<div className="mb-4">
				<FilterChips
					options={tabs}
					value={pos}
					onChange={(v) => {
						setPos(v as AdminEntriesPosFilter);
						setPage(1);
					}}
				/>
			</div>

			<div className="flex items-center gap-3 mb-4 flex-wrap">
				<input
					type="text"
					value={q}
					onChange={(e) => {
						setQ(e.target.value);
						setPage(1);
					}}
					placeholder={dict.toolbar.searchPlaceholder}
					className="flex-1 min-w-[240px] bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
				/>
			</div>

			{listQuery.isLoading ? (
				<AdminTableSkeleton rows={8} />
			) : listQuery.isError ? (
				<AdminErrorState
					title={commonDict.error}
					retryLabel={commonDict.retry}
					onRetry={() => listQuery.refetch()}
				/>
			) : !data?.data.length ? (
				<AdminEmptyState
					title={commonDict.empty}
					description={commonDict.noResults}
				/>
			) : (
				<>
					<div className="overflow-x-auto border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-[var(--border)]">
									<th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium">
										{dict.columns.word}
									</th>
									<th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium">
										{dict.columns.translation}
									</th>
									<th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium">
										{dict.columns.pos}
									</th>
									<th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium hidden md:table-cell">
										{dict.columns.cefr}
									</th>
									<th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium hidden lg:table-cell">
										{dict.columns.sources}
									</th>
									<th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium hidden md:table-cell">
										{dict.columns.updatedAt}
									</th>
									<th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium">
										{dict.columns.actions}
									</th>
								</tr>
							</thead>
							<tbody>
								{data.data.map((row) => (
									<tr
										key={row.id}
										className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-hover)]"
									>
										<td className="px-4 py-3">
											<div className="font-semibold text-[var(--accent)]">
												{row.word}
											</div>
											<div className="text-xs text-[var(--text-muted)] font-mono">
												#{row.id}
											</div>
										</td>
										<td className="px-4 py-3 text-[var(--text-secondary)]">
											<div className="truncate max-w-[240px]">
												{row.translationPreview || "—"}
											</div>
											{row.meaningsCount > 1 ? (
												<span className="text-[0.65rem] text-[var(--text-muted)]">
													+{row.meaningsCount - 1}
												</span>
											) : null}
										</td>
										<td className="px-4 py-3">
											{row.partOfSpeech ? (
												<span className="text-[0.7rem] px-1.5 py-0.5 rounded bg-[var(--info-dim)] text-[var(--info)] font-mono">
													{row.partOfSpeech}
												</span>
											) : (
												<span className="text-[var(--text-faint)]">—</span>
											)}
										</td>
										<td className="px-4 py-3 hidden md:table-cell">
											{row.cefrLevel ? (
												<span
													className={cn(
														"text-[0.65rem] font-semibold px-1.5 py-0.5 rounded font-mono",
														`bg-[var(--cefr-${row.cefrLevel.toLowerCase()}-bg)]`,
														`text-[var(--cefr-${row.cefrLevel.toLowerCase()})]`,
													)}
												>
													{row.cefrLevel}
												</span>
											) : (
												<span className="text-[var(--text-faint)]">—</span>
											)}
										</td>
										<td className="px-4 py-3 hidden lg:table-cell">
											<div className="flex gap-1 flex-wrap">
												{row.sources.slice(0, 3).map((s) => (
													<span
														key={s}
														className="text-[0.65rem] px-1.5 py-0.5 rounded bg-[var(--surface-active)] text-[var(--text-muted)]"
													>
														{s}
													</span>
												))}
												{row.sources.length > 3 ? (
													<span className="text-[0.65rem] text-[var(--text-muted)]">
														+{row.sources.length - 3}
													</span>
												) : null}
											</div>
										</td>
										<td className="px-4 py-3 text-xs text-[var(--text-muted)] hidden md:table-cell">
											{formatDate(row.updatedAt)}
										</td>
										<td className="px-4 py-3 text-right">
											<Link
												href={`/${lang}/admin/entries/${row.id}/edit`}
												className="btn btn-sm btn-secondary"
											>
												{dict.rowActions.edit}
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="flex items-center justify-between mt-4 gap-3 flex-wrap">
						<div className="text-xs text-[var(--text-muted)]">
							{commonDict.page
								.replace("{page}", String(data.page))
								.replace("{total}", String(data.pages))}
							{" • "}
							{commonDict.entriesCount.replace("{count}", nf.format(data.total))}
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								disabled={data.page <= 1}
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								className="btn btn-sm btn-secondary disabled:opacity-40"
							>
								{commonDict.previous}
							</button>
							<button
								type="button"
								disabled={data.page >= data.pages}
								onClick={() => setPage((p) => p + 1)}
								className="btn btn-sm btn-secondary disabled:opacity-40"
							>
								{commonDict.next}
							</button>
						</div>
					</div>
				</>
			)}
		</article>
	);
};
