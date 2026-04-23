"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import { useEffect, useState } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineUnify"];
	slug: string | null;
}

const UnifyProgressInner: FC<Props> = ({ dict, slug }) => {
	const [pct, setPct] = useState(8);

	useEffect(() => {
		const iv = setInterval(() => {
			setPct((p) => (p >= 94 ? p : p + Math.random() * 10 + 4));
		}, 280);
		return () => clearInterval(iv);
	}, []);

	const label = slug
		? dict.actionBar.progress.replace("{slug}", slug)
		: dict.actionBar.progressGeneric;

	return (
		<div className="mb-6">
			<div className="flex items-center justify-between mb-2">
				<span className="text-sm font-medium text-[var(--text)]">{label}</span>
				<span className="text-sm font-semibold text-[var(--accent)] tabular-nums">
					{Math.round(pct)}%
				</span>
			</div>
			<div className="h-1.5 bg-[var(--surface-active)] rounded-full overflow-hidden">
				<div
					className="h-full bg-[var(--accent)] rounded-full transition-[width] duration-500"
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
};

interface WrapperProps extends Props {
	active: boolean;
}

export const UnifyProgress: FC<WrapperProps> = ({ active, dict, slug }) => {
	if (!active) return null;
	return <UnifyProgressInner dict={dict} slug={slug} />;
};
