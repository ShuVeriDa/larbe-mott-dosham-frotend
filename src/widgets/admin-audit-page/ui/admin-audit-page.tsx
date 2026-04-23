"use client";

import {
	type AuditActionType,
	type AuditPeriod,
	useAdminAudit,
	useAdminAuditStats,
} from "@/features/admin-audit";
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

interface AdminAuditPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["audit"];
	commonDict: Dictionary["admin"]["common"];
}

const ACTION_DOT: Record<AuditActionType, string> = {
	CREATE: "bg-[var(--success)]",
	UPDATE: "bg-[var(--info)]",
	DELETE: "bg-[var(--danger)]",
	BULK: "bg-[var(--warning)]",
	PIPELINE: "bg-[var(--accent)]",
};

const formatDateTime = (iso: string, lang: string) => {
	try {
		return new Date(iso).toLocaleString(
			lang === "ru" ? "ru-RU" : lang === "en" ? "en-US" : "ru-RU",
			{
				day: "2-digit",
				month: "short",
				hour: "2-digit",
				minute: "2-digit",
			},
		);
	} catch {
		return iso;
	}
};

export const AdminAuditPage: FC<AdminAuditPageProps> = ({
	lang,
	dict,
	commonDict,
}) => {
	const [action, setAction] = useState<AuditActionType | "">("");
	const [period, setPeriod] = useState<AuditPeriod>("week");
	const [q, setQ] = useState("");

	const statsQuery = useAdminAuditStats();
	const listQuery = useAdminAudit({
		q,
		action: action || undefined,
		period,
		limit: 50,
		page: 1,
	});

	return (
		<article className="max-w-[1200px] mx-auto">
			<PageHeader
				title={dict.header.title}
				subtitle={dict.header.subtitle}
				actions={
					<button type="button" className="btn btn-sm btn-secondary">
						↓ {commonDict.exportCsv}
					</button>
				}
			/>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
				<StatCard
					tone="info"
					label={dict.stats.today}
					value={formatStatValue(statsQuery.data?.today)}
					loading={statsQuery.isLoading}
				/>
				<StatCard
					tone="total"
					label={dict.stats.week}
					value={formatStatValue(statsQuery.data?.week)}
					loading={statsQuery.isLoading}
				/>
				<StatCard
					tone="warning"
					label={dict.stats.bulk}
					value={formatStatValue(statsQuery.data?.bulk)}
					loading={statsQuery.isLoading}
				/>
				<StatCard
					tone="success"
					label={dict.stats.pipeline}
					value={formatStatValue(statsQuery.data?.pipeline)}
					loading={statsQuery.isLoading}
				/>
			</div>

			<div className="flex gap-3 mb-4 flex-wrap items-center">
				<input
					type="text"
					value={q}
					onChange={(e) => setQ(e.target.value)}
					placeholder={dict.toolbar.searchPlaceholder}
					className="min-w-[240px] bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
				/>
				<select
					value={period}
					onChange={(e) => setPeriod(e.target.value as AuditPeriod)}
					className="bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)]"
				>
					<option value="today">{dict.toolbar.periods.today}</option>
					<option value="week">{dict.toolbar.periods.week}</option>
					<option value="month">{dict.toolbar.periods.month}</option>
					<option value="all">{dict.toolbar.periods.all}</option>
				</select>
			</div>

			<div className="mb-4">
				<FilterChips
					options={[
						{ value: "", label: dict.filters.all },
						{ value: "CREATE", label: dict.filters.create },
						{ value: "UPDATE", label: dict.filters.update },
						{ value: "DELETE", label: dict.filters.delete },
						{ value: "BULK", label: dict.filters.bulk },
						{ value: "PIPELINE", label: dict.filters.pipeline },
					]}
					value={action}
					onChange={(v) => setAction(v as AuditActionType | "")}
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
			) : !listQuery.data?.data.length ? (
				<AdminEmptyState title={dict.empty} />
			) : (
				<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)]">
					{listQuery.data.data.map((item) => (
						<div key={item.id} className="px-5 py-4 flex gap-4 items-start">
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
										{dict.actions[item.type]}
									</span>
									{item.word ? (
										<Link
											href={`/${lang}/admin/entries/${item.entryId}/edit`}
											className="text-sm font-semibold text-[var(--accent)] hover:underline"
										>
											{item.word}
										</Link>
									) : null}
									{item.entryId ? (
										<span className="text-xs text-[var(--text-muted)] font-mono">
											#{item.entryId}
										</span>
									) : null}
								</div>
								<div className="text-sm text-[var(--text-secondary)] mt-1">
									{item.description}
								</div>
							</div>
							<div className="text-xs text-[var(--text-muted)] text-right shrink-0">
								<div>{formatDateTime(item.at, lang)}</div>
								<div className="mt-1">{item.author.name}</div>
							</div>
						</div>
					))}
				</div>
			)}
		</article>
	);
};
