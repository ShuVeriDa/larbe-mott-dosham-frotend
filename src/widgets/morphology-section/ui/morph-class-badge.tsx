import { cn } from "@/shared/lib";
import { FC } from "react";

type MorphClass = "vu" | "yu" | "du" | "bu";

interface IMorphClassBadgeProps {
	label: string;
	classKey: MorphClass;
}

const classColorMap: Record<MorphClass, string> = {
	vu: "bg-vu-bg text-vu",
	yu: "bg-yu-bg text-yu",
	du: "bg-du-bg text-du",
	bu: "bg-bu-bg text-bu",
};

export const MorphClassBadge: FC<IMorphClassBadgeProps> = ({ label, classKey }) => (
	<span
		className={cn(
			"inline-flex items-center px-2 py-1 rounded-sm text-xs font-mono font-semibold",
			classColorMap[classKey],
		)}
	>
		{label}
	</span>
);
