import { FC } from "react";
import { AnimatedFill } from "@/shared/ui";
import type { LevelKey } from "../model/level-colors";
import { LEVEL_PALETTE } from "../model/level-colors";

interface ILevelRowProps {
	level: LevelKey;
	count: number;
	percentage: number;
}

const numberFormatter = new Intl.NumberFormat("ru-RU");

export const LevelRow: FC<ILevelRowProps> = ({ level, count, percentage }) => {
	const palette = LEVEL_PALETTE[level];

	return (
		<div className="flex items-center gap-2 md:gap-4">
			<div
				className="w-10 flex-shrink-0 font-mono font-bold text-sm"
				style={{ color: palette.text }}
			>
				{level}
			</div>
			<div className="flex-1 h-9 bg-surface rounded-md overflow-hidden">
				<AnimatedFill
					percent={percentage}
					className="rounded-md flex items-center px-3"
					style={{
						background: palette.background,
						border: `1px solid ${palette.border}`,
					}}
				>
					<span className="text-xs font-semibold font-mono text-foreground whitespace-nowrap tabular-nums">
						{numberFormatter.format(count)}
					</span>
				</AnimatedFill>
			</div>
			<div className="w-[52px] md:w-[60px] flex-shrink-0 text-right text-xs text-muted font-mono tabular-nums">
				{percentage.toFixed(1)}%
			</div>
		</div>
	);
};
