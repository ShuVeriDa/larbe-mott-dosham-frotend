"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { type FC, useEffect, useState } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineParse"]["progress"];
	slug: string | null;
	active: boolean;
}

export const ParseProgress: FC<Props> = ({ dict, slug, active }) => {
	const [pct, setPct] = useState(0);

	useEffect(() => {
		if (!active) {
			setPct(0);
			return;
		}
		setPct(5);
		const iv = setInterval(() => {
			setPct((prev) => {
				if (prev >= 95) return 95;
				return Math.min(95, prev + Math.random() * 12 + 3);
			});
		}, 350);
		return () => clearInterval(iv);
	}, [active, slug]);

	if (!active) return null;

	const label = slug ? dict.label.replace("{slug}", slug) : dict.labelAll;

	return (
		<div className="mb-6" role="status" aria-live="polite">
			<div className="flex items-center justify-between mb-2">
				<span className="text-sm font-medium text-[var(--text)]">{label}</span>
				<span className="text-sm font-semibold text-[var(--accent)] tabular-nums">
					{Math.round(pct)}%
				</span>
			</div>
			<div className="h-1.5 bg-[var(--surface-active)] rounded-full overflow-hidden">
				<div
					className="h-full bg-[var(--accent)] rounded-full transition-[width] duration-500 ease-out"
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
};
