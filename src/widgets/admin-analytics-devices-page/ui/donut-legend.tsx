"use client";

import type { Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import {
	formatPercent,
	formatVisitors,
	type DonutSegment,
} from "../lib/segments";

interface DonutLegendProps {
	segments: ReadonlyArray<DonutSegment>;
	maxValue: number;
	hoveredIndex: number | null;
	onHover: (index: number | null) => void;
	lang: Locale;
}

export const DonutLegend: FC<DonutLegendProps> = ({
	segments,
	maxValue,
	hoveredIndex,
	onHover,
	lang,
}) => (
	<ul className="flex flex-col gap-2" role="list">
		{segments.map((seg, idx) => {
			const dim = hoveredIndex !== null && hoveredIndex !== idx;
			const barWidth =
				maxValue > 0 ? Math.max(2, Math.round((seg.value / maxValue) * 100)) : 0;
			return (
				<li
					key={seg.key}
					onMouseEnter={() => onHover(idx)}
					onMouseLeave={() => onHover(null)}
					onFocus={() => onHover(idx)}
					onBlur={() => onHover(null)}
					tabIndex={0}
					className={cn(
						"relative grid grid-cols-[14px_1fr_auto] items-center gap-3 px-3 py-2 rounded-md cursor-pointer overflow-hidden",
						"hover:bg-[var(--surface-hover)] focus-visible:bg-[var(--surface-hover)]",
						"focus:outline-none transition-opacity",
						dim && "opacity-40",
					)}
				>
					<span
						aria-hidden="true"
						className="absolute inset-0 rounded-md pointer-events-none"
						style={{ background: seg.color, opacity: 0.06, width: `${barWidth}%` }}
					/>
					<span
						aria-hidden="true"
						className="relative w-3 h-3 rounded-[3px]"
						style={{ background: seg.color }}
					/>
					<span className="relative z-[1] flex items-center gap-2 text-sm text-[var(--text)] min-w-0 truncate">
						<span aria-hidden="true" className="text-base opacity-85">
							{seg.icon}
						</span>
						<span className="font-medium truncate">{seg.name}</span>
					</span>
					<span className="relative z-[1] flex flex-col items-end gap-[2px]">
						<span className="text-sm font-semibold text-[var(--text)] tabular-nums leading-none">
							{formatVisitors(seg.visitors, lang)}
						</span>
						<span className="text-xs text-[var(--text-muted)] tabular-nums font-medium">
							{formatPercent(seg.share)}
						</span>
					</span>
				</li>
			);
		})}
	</ul>
);
