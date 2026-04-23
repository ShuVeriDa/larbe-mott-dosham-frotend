"use client";

import {
	usePipelineDictionaries,
	useRunParse,
} from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	AdminErrorState,
	AdminTableSkeleton,
	Breadcrumb,
	PageHeader,
	SectionCard,
} from "@/shared/ui/admin";
import {
	PipelineLogPanel,
	PipelineStatusBanner,
} from "@/widgets/admin-pipeline-page";
import type { FC } from "react";
import { useState } from "react";

interface AdminPipelineParsePageProps {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineParse"];
	pipelineDict: Dictionary["admin"]["pipeline"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminPipelineParsePage: FC<AdminPipelineParsePageProps> = ({
	lang,
	dict,
	pipelineDict,
	commonDict,
}) => {
	const dictionariesQuery = usePipelineDictionaries();
	const runParse = useRunParse();
	const [slug, setSlug] = useState<string>("");

	const onRun = () => {
		if (
			window.confirm(dict.confirmText.replace("{slug}", slug || dict.selectAll))
		) {
			runParse.mutate({ slug: slug || undefined });
		}
	};

	return (
		<article className="max-w-[1200px] mx-auto">
			<Breadcrumb
				items={[
					{ label: pipelineDict.header.title, href: `/${lang}/admin/pipeline` },
					{ label: dict.header.title },
				]}
			/>
			<PageHeader title={dict.header.title} subtitle={dict.header.subtitle} />

			<PipelineStatusBanner dict={pipelineDict} commonDict={commonDict} />

			<SectionCard>
				<div className="flex gap-3 items-center flex-wrap">
					<select
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						className="min-w-[220px] bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)]"
					>
						<option value="">{dict.selectAll}</option>
						{dictionariesQuery.data?.map((d) => (
							<option key={d.slug} value={d.slug}>
								{d.title}
							</option>
						))}
					</select>
					<button
						type="button"
						onClick={onRun}
						disabled={runParse.isPending}
						className="btn btn-md btn-primary disabled:opacity-40"
					>
						{dict.run}
					</button>
					{runParse.data ? (
						<span className="text-xs text-[var(--success)]">
							✓ parsed={runParse.data.parsedCount ?? "?"} · source=
							{runParse.data.sourceCount ?? "?"}
						</span>
					) : null}
					{runParse.isError ? (
						<span className="text-xs text-[var(--danger)]">
							{commonDict.error}
						</span>
					) : null}
				</div>
			</SectionCard>

			<SectionCard>
				{dictionariesQuery.isLoading ? (
					<AdminTableSkeleton rows={6} />
				) : dictionariesQuery.isError ? (
					<AdminErrorState
						title={commonDict.error}
						retryLabel={commonDict.retry}
						onRetry={() => dictionariesQuery.refetch()}
					/>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-[var(--border)]">
									<th className="text-left px-3 py-2 text-xs uppercase text-[var(--text-muted)]">
										slug
									</th>
									<th className="text-left px-3 py-2 text-xs uppercase text-[var(--text-muted)]">
										direction
									</th>
									<th className="text-right px-3 py-2 text-xs uppercase text-[var(--text-muted)]">
										records
									</th>
									<th className="text-left px-3 py-2 text-xs uppercase text-[var(--text-muted)]">
										status
									</th>
									<th className="px-3 py-2" />
								</tr>
							</thead>
							<tbody>
								{dictionariesQuery.data?.map((d) => (
									<tr
										key={d.slug}
										className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-hover)]"
									>
										<td className="px-3 py-2">
											<div className="font-medium text-[var(--text)]">
												{d.title}
											</div>
											<div className="text-xs text-[var(--text-muted)] font-mono">
												{d.slug}
											</div>
										</td>
										<td className="px-3 py-2 text-xs">{d.direction}</td>
										<td className="px-3 py-2 text-right tabular-nums">
											{d.recordCount}
										</td>
										<td className="px-3 py-2">
											<span
												className={cn(
													"text-[0.65rem] font-semibold px-1.5 py-0.5 rounded font-mono",
													d.status === "parsed" &&
														"bg-[var(--info-dim)] text-[var(--info)]",
													d.status === "pending" &&
														"bg-[var(--warning-dim)] text-[var(--warning)]",
													d.status === "error" &&
														"bg-[var(--danger-dim)] text-[var(--danger)]",
													d.status === "merged" &&
														"bg-[var(--success-dim)] text-[var(--success)]",
													d.status === "running" &&
														"bg-[var(--accent-dim)] text-[var(--accent)]",
												)}
											>
												{pipelineDict.dictionaries.statuses[d.status]}
											</span>
										</td>
										<td className="px-3 py-2 text-right">
											<button
												type="button"
												disabled={runParse.isPending}
												onClick={() => runParse.mutate({ slug: d.slug })}
												className="btn btn-sm btn-secondary disabled:opacity-40"
											>
												▶
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</SectionCard>

			<PipelineLogPanel stage="parse" dict={pipelineDict.log} />
		</article>
	);
};
