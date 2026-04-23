"use client";

import {
	useAdminAuditForEntry,
	useRevertAudit,
} from "@/features/admin-audit";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	AdminErrorState,
	AdminTableSkeleton,
	Breadcrumb,
	PageHeader,
	SectionCard,
	StatCard,
	formatStatValue,
} from "@/shared/ui/admin";
import Link from "next/link";
import type { FC } from "react";

interface AdminAuditEntryPageProps {
	id: string;
	lang: Locale;
	dict: Dictionary["admin"]["auditEntry"];
	auditDict: Dictionary["admin"]["audit"];
	commonDict: Dictionary["admin"]["common"];
}

const ACTION_DOT = {
	CREATE: "bg-[var(--success)]",
	UPDATE: "bg-[var(--info)]",
	DELETE: "bg-[var(--danger)]",
	BULK: "bg-[var(--warning)]",
	PIPELINE: "bg-[var(--accent)]",
} as const;

const formatDateTime = (iso: string, lang: string) => {
	try {
		return new Date(iso).toLocaleString(
			lang === "ru" ? "ru-RU" : lang === "en" ? "en-US" : "ru-RU",
			{ day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" },
		);
	} catch {
		return iso;
	}
};

export const AdminAuditEntryPage: FC<AdminAuditEntryPageProps> = ({
	id,
	lang,
	dict,
	auditDict,
	commonDict,
}) => {
	const query = useAdminAuditForEntry(id);
	const revert = useRevertAudit();

	if (query.isLoading) return <AdminTableSkeleton rows={8} />;
	if (query.isError)
		return (
			<AdminErrorState
				title={commonDict.error}
				retryLabel={commonDict.retry}
				onRetry={() => query.refetch()}
			/>
		);
	if (!query.data) return null;

	const { summary, items } = query.data;

	return (
		<article className="max-w-[1100px] mx-auto">
			<Breadcrumb
				items={[
					{ label: dict.breadcrumb.admin, href: `/${lang}/admin` },
					{ label: dict.breadcrumb.audit, href: `/${lang}/admin/audit` },
					{ label: `#${summary.entryId}` },
				]}
			/>

			<PageHeader
				title={`${dict.header.title} — ${summary.word}`}
				subtitle={`#${summary.entryId} · ${summary.partOfSpeech ?? ""}`}
				actions={
					<>
						<a
							href={`/${lang}/entry/${summary.entryId}`}
							target="_blank"
							rel="noreferrer"
							className="btn btn-sm btn-secondary"
						>
							{dict.header.view}
						</a>
						<Link
							href={`/${lang}/admin/entries/${summary.entryId}/edit`}
							className="btn btn-sm btn-secondary"
						>
							{dict.header.edit}
						</Link>
					</>
				}
			/>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
				<StatCard
					tone="info"
					label={dict.summary.changesCount}
					value={formatStatValue(summary.changesCount)}
				/>
				<StatCard
					tone="total"
					label={dict.summary.authors}
					value={formatStatValue(summary.authorsCount)}
				/>
				<StatCard
					tone="success"
					label={dict.summary.sinceCreated}
					value={formatDateTime(summary.createdAt, lang)}
				/>
			</div>

			<SectionCard>
				<div className="divide-y divide-[var(--border)]">
					{items.map((item) => (
						<div key={item.id} className="py-4 flex items-start gap-4">
							<div
								className={cn(
									"w-2 h-2 rounded-full mt-2 shrink-0",
									ACTION_DOT[item.type],
								)}
								aria-hidden
							/>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 flex-wrap">
									<span className="text-[0.65rem] font-semibold px-1.5 py-0.5 rounded bg-[var(--surface-active)] text-[var(--text-muted)] font-mono">
										{auditDict.actions[item.type]}
									</span>
									<span className="text-sm text-[var(--text-secondary)]">
										{item.description}
									</span>
								</div>
								{item.diff && item.diff.length ? (
									<div className="mt-2 overflow-x-auto">
										<table className="text-xs w-full">
											<thead>
												<tr>
													<th className="text-left px-2 py-1 text-[var(--text-muted)]">
														field
													</th>
													<th className="text-left px-2 py-1 text-[var(--text-muted)]">
														before
													</th>
													<th className="text-left px-2 py-1 text-[var(--text-muted)]">
														after
													</th>
												</tr>
											</thead>
											<tbody>
												{item.diff.map((d, i) => (
													<tr key={i} className="font-mono">
														<td className="px-2 py-1 text-[var(--text)]">
															{d.field}
														</td>
														<td className="px-2 py-1 text-[var(--danger)]">
															{JSON.stringify(d.before)}
														</td>
														<td className="px-2 py-1 text-[var(--success)]">
															{JSON.stringify(d.after)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								) : null}
								<div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
									<span>{formatDateTime(item.at, lang)}</span>
									<span>{item.author.name}</span>
									{item.type === "UPDATE" || item.type === "DELETE" ? (
										<button
											type="button"
											disabled={revert.isPending}
											onClick={() => {
												if (window.confirm(dict.revert.text)) {
													revert.mutate({ auditId: item.id });
												}
											}}
											className="btn btn-sm btn-ghost"
										>
											{auditDict.revert}
										</button>
									) : null}
								</div>
							</div>
						</div>
					))}
				</div>
			</SectionCard>
		</article>
	);
};
