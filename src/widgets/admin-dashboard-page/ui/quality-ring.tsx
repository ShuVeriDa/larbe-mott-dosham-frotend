import type { FC } from "react";

interface QualityRingProps {
	pct: number;
	label: string;
}

export const QualityRing: FC<QualityRingProps> = ({ pct, label }) => {
	const clamped = Math.max(0, Math.min(100, pct));
	const radius = 70;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (clamped / 100) * circumference;
	const color =
		clamped >= 80
			? "var(--success)"
			: clamped >= 50
				? "var(--warning)"
				: "var(--danger)";

	return (
		<div className="relative w-40 h-40">
			<svg
				viewBox="0 0 160 160"
				className="w-full h-full"
				style={{ transform: "rotate(-90deg)" }}
				aria-label={label}
			>
				<circle
					cx={80}
					cy={80}
					r={radius}
					fill="none"
					stroke="var(--border)"
					strokeWidth={8}
				/>
				<circle
					cx={80}
					cy={80}
					r={radius}
					fill="none"
					stroke={color}
					strokeWidth={8}
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					style={{ transition: "stroke-dashoffset 1.2s var(--ease-out)" }}
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<div className="text-3xl font-extrabold text-[var(--text)] leading-none tabular-nums">
					{Math.round(clamped)}%
				</div>
				<div className="text-xs text-[var(--text-muted)] font-medium mt-1">
					{label}
				</div>
			</div>
		</div>
	);
};
