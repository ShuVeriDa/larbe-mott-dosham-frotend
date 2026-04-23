"use client";

import { useRunLoad, usePipelineStats } from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import {
	Breadcrumb,
	PageHeader,
	SectionCard,
	StatCard,
	formatStatValue,
} from "@/shared/ui/admin";
import {
	PipelineLogPanel,
	PipelineStatusBanner,
} from "@/widgets/admin-pipeline-page";
import type { FC } from "react";

interface Props {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineLoad"];
	pipelineDict: Dictionary["admin"]["pipeline"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminPipelineLoadPage: FC<Props> = ({
	lang,
	dict,
	pipelineDict,
	commonDict,
}) => {
	const statsQuery = usePipelineStats();
	const runLoad = useRunLoad();

	return (
		<article className="max-w-[1100px] mx-auto">
			<Breadcrumb
				items={[
					{ label: pipelineDict.header.title, href: `/${lang}/admin/pipeline` },
					{ label: dict.header.title },
				]}
			/>
			<PageHeader title={dict.header.title} subtitle={dict.header.subtitle} />

			<PipelineStatusBanner dict={pipelineDict} commonDict={commonDict} />

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
				<StatCard
					tone="info"
					label={pipelineDict.stats.unifiedRecords}
					value={formatStatValue(statsQuery.data?.unifiedRecords)}
					loading={statsQuery.isLoading}
				/>
				<StatCard
					tone="success"
					label={pipelineDict.stats.inDb}
					value={formatStatValue(statsQuery.data?.inDb)}
					loading={statsQuery.isLoading}
				/>
				<StatCard
					tone="warning"
					label={commonDict.empty}
					value={formatStatValue(statsQuery.data?.skipped)}
					loading={statsQuery.isLoading}
				/>
				<StatCard
					tone="total"
					label="—"
					value={formatStatValue(statsQuery.data?.mergeSteps)}
					loading={statsQuery.isLoading}
				/>
			</div>

			<SectionCard>
				<div className="flex items-center justify-between gap-4 flex-wrap">
					<div className="text-sm text-[var(--text-secondary)]">
						unified.json → PostgreSQL
					</div>
					<button
						type="button"
						onClick={() => runLoad.mutate()}
						disabled={runLoad.isPending}
						className="btn btn-md btn-primary disabled:opacity-40"
					>
						{dict.run}
					</button>
				</div>
				{runLoad.data ? (
					<div className="text-xs text-[var(--success)] mt-3">
						✓ loaded={runLoad.data.loaded ?? 0} · skipped=
						{runLoad.data.skipped ?? 0}
					</div>
				) : null}
			</SectionCard>

			<SectionCard title={dict.db.title}>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
					<div>
						<span className="text-[var(--text-muted)]">{dict.db.table}:</span>{" "}
						<span className="text-[var(--text)]">dictionary_entries</span>
					</div>
					<div>
						<span className="text-[var(--text-muted)]">{dict.db.records}:</span>{" "}
						<span className="text-[var(--text)]">
							{statsQuery.data?.inDb ?? "—"}
						</span>
					</div>
					<div>
						<span className="text-[var(--text-muted)]">{dict.db.index}:</span>{" "}
						<span className="text-[var(--text)]">GIN(pg_trgm)</span>
					</div>
					<div>
						<span className="text-[var(--text-muted)]">{dict.db.search}:</span>{" "}
						<span className="text-[var(--text)]">trigram similarity</span>
					</div>
					<div>
						<span className="text-[var(--text-muted)]">{dict.db.cache}:</span>{" "}
						<span className="text-[var(--text)]">TTL 5 мин</span>
					</div>
					<div>
						<span className="text-[var(--text-muted)]">{dict.db.orm}:</span>{" "}
						<span className="text-[var(--text)]">Prisma</span>
					</div>
				</div>
			</SectionCard>

			<PipelineLogPanel stage="load" dict={pipelineDict.log} />
		</article>
	);
};
