"use client";

import type { FC } from "react";
import type { DonutSegment } from "../lib/segments";

interface DonutChartProps {
	segments: ReadonlyArray<DonutSegment>;
	total: number;
	size?: number;
	strokeWidth?: number;
	hoveredIndex: number | null;
	onHover: (index: number | null) => void;
	ariaLabel: string;
}

const RADIUS = 70;
const VIEWBOX = 180;
const CENTER = VIEWBOX / 2;
const GAP = 2;
const MIN_SHARE_VISIBLE = 0.01;

export const DonutChart: FC<DonutChartProps> = ({
	segments,
	total,
	size = 180,
	strokeWidth = 14,
	hoveredIndex,
	onHover,
	ariaLabel,
}) => {
	const circumference = 2 * Math.PI * RADIUS;

	let offset = 0;
	const drawn = segments.map((seg) => {
		const share = total > 0 ? seg.value / total : 0;
		const length = circumference * share;
		const visible = share >= MIN_SHARE_VISIBLE && length > GAP;
		const dashLength = Math.max(0, length - GAP);
		const start = offset;
		offset += length;
		return { seg, share, dashLength, start, visible };
	});

	return (
		<svg
			role="img"
			aria-label={ariaLabel}
			viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
			width={size}
			height={size}
			style={{ transform: "rotate(-90deg)" }}
		>
			<circle
				cx={CENTER}
				cy={CENTER}
				r={RADIUS}
				fill="none"
				stroke="var(--border)"
				strokeWidth={strokeWidth}
			/>
			{drawn.map(({ seg, dashLength, start, visible }, idx) => {
				if (!visible) return null;
				const dim = hoveredIndex !== null && hoveredIndex !== idx;
				return (
					<circle
						key={seg.key}
						cx={CENTER}
						cy={CENTER}
						r={RADIUS}
						fill="none"
						stroke={seg.color}
						strokeWidth={hoveredIndex === idx ? strokeWidth + 4 : strokeWidth}
						strokeDasharray={`${dashLength} ${circumference}`}
						strokeDashoffset={-start}
						strokeLinecap="butt"
						style={{
							opacity: dim ? 0.25 : 1,
							transition:
								"opacity 200ms ease, stroke-width 200ms ease, stroke-dasharray 600ms cubic-bezier(.16,1,.3,1)",
							cursor: "pointer",
						}}
						onMouseEnter={() => onHover(idx)}
						onMouseLeave={() => onHover(null)}
						onFocus={() => onHover(idx)}
						onBlur={() => onHover(null)}
						tabIndex={0}
					/>
				);
			})}
		</svg>
	);
};
