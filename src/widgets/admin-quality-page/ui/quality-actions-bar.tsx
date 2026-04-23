"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";

interface QualityActionsBarProps {
	lang: Locale;
	dict: Dictionary["admin"]["quality"]["actions"];
	onRefresh: () => void;
	onExport: () => void;
	isRefreshing: boolean;
	isExporting: boolean;
}

export const QualityActionsBar: FC<QualityActionsBarProps> = ({
	lang,
	dict,
	onRefresh,
	onExport,
	isRefreshing,
	isExporting,
}) => (
	<div className="flex gap-3 mt-4 flex-wrap">
		<button
			type="button"
			onClick={onRefresh}
			disabled={isRefreshing}
			className="btn btn-sm btn-primary disabled:opacity-50"
		>
			{isRefreshing ? dict.refreshing : dict.refresh}
		</button>
		<Link
			href={`/${lang}/admin/pipeline/improve`}
			className="btn btn-sm btn-secondary"
		>
			{dict.improve}
		</Link>
		<button
			type="button"
			onClick={onExport}
			disabled={isExporting}
			className="btn btn-sm btn-secondary disabled:opacity-50"
		>
			{isExporting ? dict.exporting : dict.export}
		</button>
		<Link
			href={`/${lang}/admin/quality/problems`}
			className="btn btn-sm btn-secondary"
		>
			{dict.problems}
		</Link>
	</div>
);
