import { FC } from "react";

interface IPosItemProps {
	label: string;
	count: number;
	color: string;
}

const formatter = new Intl.NumberFormat("ru-RU");

export const PosItem: FC<IPosItemProps> = ({ label, count, color }) => (
	<div
		className="flex items-center gap-3 px-4 py-3 rounded-md
			border border-edge bg-surface transition-all
			hover:bg-surface-hover hover:border-edge-hover"
	>
		<span
			className="w-2 h-2 rounded-full flex-shrink-0"
			style={{ background: color }}
			aria-hidden="true"
		/>
		<span className="text-sm font-medium text-foreground flex-1 truncate">
			{label}
		</span>
		<span className="text-sm font-medium font-mono text-muted tabular-nums">
			{formatter.format(count)}
		</span>
	</div>
);
