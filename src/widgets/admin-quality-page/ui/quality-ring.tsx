"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

interface QualityRingProps {
	total: number;
	cleanEntries: number;
	loading?: boolean;
	dict: Dictionary["admin"]["quality"]["ring"];
}

const RADIUS = 68;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const QualityRing: FC<QualityRingProps> = ({
	total,
	cleanEntries,
	loading,
	dict,
}) => {
	const pct = total > 0 ? Math.round((cleanEntries / total) * 100) : 0;
	const dashOffset = CIRCUMFERENCE * (1 - pct / 100);

	return (
		<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col items-center gap-4">
			<div className="relative flex items-center justify-center">
				<svg width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
					<circle
						cx="80"
						cy="80"
						r={RADIUS}
						fill="none"
						stroke="var(--surface-active)"
						strokeWidth="10"
					/>
					<circle
						cx="80"
						cy="80"
						r={RADIUS}
						fill="none"
						stroke="var(--success)"
						strokeWidth="10"
						strokeLinecap="round"
						strokeDasharray={CIRCUMFERENCE}
						strokeDashoffset={loading ? CIRCUMFERENCE : dashOffset}
						style={{
							transform: "rotate(-90deg)",
							transformOrigin: "center",
							transition: "stroke-dashoffset 1s cubic-bezier(.16,1,.3,1)",
						}}
					/>
				</svg>
				<div className="absolute text-center">
					<div className="text-3xl font-extrabold text-[var(--text)] leading-none tracking-tight tabular-nums">
						{loading ? "…" : pct}
						<span className="text-base text-[var(--text-muted)] font-bold">
							%
						</span>
					</div>
					<div className="text-xs text-[var(--text-muted)] mt-1">
						{dict.label}
					</div>
				</div>
			</div>
			<div className="text-sm text-[var(--text-muted)] text-center">
				{dict.cleanOf
					.replace("{clean}", cleanEntries.toLocaleString("ru-RU"))
					.replace("{total}", total.toLocaleString("ru-RU"))}
			</div>
		</div>
	);
};
