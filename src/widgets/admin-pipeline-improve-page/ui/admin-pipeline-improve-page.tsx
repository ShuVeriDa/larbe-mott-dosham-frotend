"use client";

import { useRunImprove } from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import {
	Breadcrumb,
	PageHeader,
	SectionCard,
	StatCard,
} from "@/shared/ui/admin";
import {
	PipelineLogPanel,
	PipelineStatusBanner,
} from "@/widgets/admin-pipeline-page";
import type { FC } from "react";

interface Props {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineImprove"];
	pipelineDict: Dictionary["admin"]["pipeline"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminPipelineImprovePage: FC<Props> = ({
	lang,
	dict,
	pipelineDict,
	commonDict,
}) => {
	const runImprove = useRunImprove();

	const operations = [
		dict.operations.normalizeStyles,
		dict.operations.fixExamples,
		dict.operations.removeEmpty,
		dict.operations.normalizeWords,
		dict.operations.trimLong,
		dict.operations.dedupMeanings,
	];

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

			<SectionCard>
				<div className="flex items-center justify-between flex-wrap gap-3">
					<div className="text-sm text-[var(--text-secondary)]">
						{dict.header.subtitle}
					</div>
					<button
						type="button"
						onClick={() => runImprove.mutate()}
						disabled={runImprove.isPending}
						className="btn btn-md btn-primary disabled:opacity-40"
					>
						{dict.run}
					</button>
				</div>
			</SectionCard>

			<SectionCard title={dict.operations.title}>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					{operations.map((label) => (
						<StatCard
							key={label}
							tone="info"
							label={label}
							value={dict.operations.lastRun.replace("{count}", "—")}
						/>
					))}
				</div>
			</SectionCard>

			<PipelineLogPanel stage="improve" dict={pipelineDict.log} />
		</article>
	);
};
