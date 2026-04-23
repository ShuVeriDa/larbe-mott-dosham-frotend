import { FC } from "react";
import { AnimatedFill } from "@/shared/ui";

interface ISourceRowProps {
	name: string;
	slug: string;
	directionLabel: string;
	count: number;
	maxCount: number;
}

const formatter = new Intl.NumberFormat("ru-RU");

export const SourceRow: FC<ISourceRowProps> = ({
	name,
	slug,
	directionLabel,
	count,
	maxCount,
}) => {
	const percent = maxCount > 0 ? (count / maxCount) * 100 : 0;

	return (
		<tr className="hover:bg-surface">
			<td className="px-4 py-3 text-sm text-foreground font-semibold border-b border-edge">
				{name}
			</td>
			<td className="px-4 py-3 text-xs font-mono text-muted border-b border-edge max-[860px]:hidden">
				{slug}
			</td>
			<td className="px-4 py-3 border-b border-edge max-[680px]:hidden">
				<span className="inline-flex items-center gap-1 text-xs font-mono text-primary bg-primary-dim px-2 py-0.5 rounded-full">
					{directionLabel}
				</span>
			</td>
			<td className="px-4 py-3 text-xs font-mono text-muted border-b border-edge tabular-nums max-[680px]:hidden">
				{formatter.format(count)}
			</td>
			<td className="px-4 py-3 w-[140px] border-b border-edge">
				<div className="h-1.5 rounded-[3px] bg-surface-active overflow-hidden">
					<AnimatedFill
						percent={percent}
						className="rounded-[3px] bg-primary"
						durationMs={900}
					/>
				</div>
			</td>
		</tr>
	);
};
