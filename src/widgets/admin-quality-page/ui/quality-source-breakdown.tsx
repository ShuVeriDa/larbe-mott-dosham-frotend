"use client";

import type { QualitySourceStat } from "@/features/admin-quality";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	AdminErrorState,
	AdminTableSkeleton,
	SectionCard,
} from "@/shared/ui/admin";
import type { FC } from "react";
import { useState } from "react";
import { QualitySourceRow } from "./quality-source-row";

interface QualitySourceBreakdownProps {
	sources?: QualitySourceStat[];
	loading?: boolean;
	error?: boolean;
	onRetry: () => void;
	dict: Dictionary["admin"]["quality"]["sources"];
	commonDict: Dictionary["admin"]["common"];
}

const VISIBLE_LIMIT = 5;

export const QualitySourceBreakdown: FC<QualitySourceBreakdownProps> = ({
	sources,
	loading,
	error,
	onRetry,
	dict,
	commonDict,
}) => {
	const [expanded, setExpanded] = useState(false);

	if (loading) return <AdminTableSkeleton rows={5} />;

	if (error) {
		return (
			<AdminErrorState
				title={commonDict.error}
				retryLabel={commonDict.retry}
				onRetry={onRetry}
			/>
		);
	}

	if (!sources || sources.length === 0) return null;

	const visible = expanded ? sources : sources.slice(0, VISIBLE_LIMIT);
	const hiddenCount = sources.length - VISIBLE_LIMIT;

	return (
		<SectionCard title={dict.title}>
			{visible.map((s) => (
				<QualitySourceRow key={s.source} data={s} />
			))}
			{!expanded && hiddenCount > 0 ? (
				<div className="text-center pt-3">
					<button
						type="button"
						onClick={() => setExpanded(true)}
						className="btn btn-sm btn-ghost"
					>
						{dict.showAll.replace("{count}", String(sources.length))}
					</button>
				</div>
			) : null}
		</SectionCard>
	);
};
