import { cn } from "@/shared/lib";
import type { FC } from "react";
import type { MetricDelta } from "../lib/format";

interface DeltaIndicatorProps {
	delta: MetricDelta;
	vsLabel: string;
	inverse?: boolean;
}

const colorFor = (sign: MetricDelta["sign"], inverse: boolean): string => {
	if (sign === "neutral") return "text-[var(--text-muted)]";
	const isGood = inverse ? sign === "down" : sign === "up";
	return isGood ? "text-[var(--success)]" : "text-[var(--danger)]";
};

const arrowFor = (sign: MetricDelta["sign"]): string => {
	if (sign === "up") return "↑";
	if (sign === "down") return "↓";
	return "—";
};

export const DeltaIndicator: FC<DeltaIndicatorProps> = ({
	delta,
	vsLabel,
	inverse = false,
}) => {
	const arrow = arrowFor(delta.sign);
	const colorClass = colorFor(delta.sign, inverse);
	const text =
		delta.pct === null
			? "—"
			: delta.sign === "up"
				? `+${delta.pct}%`
				: delta.sign === "down"
					? `-${delta.pct}%`
					: "0%";
	return (
		<div
			className={cn(
				"inline-flex items-center gap-1 text-xs font-semibold tabular-nums",
				colorClass,
			)}
		>
			<span aria-hidden="true">{arrow}</span>
			<span>{text}</span>
			<span className="text-[var(--text-muted)] font-normal ml-1">
				{vsLabel}
			</span>
		</div>
	);
};
