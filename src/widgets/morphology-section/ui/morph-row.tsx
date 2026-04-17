import { cn } from "@/shared/lib";
import { FC } from "react";

interface IMorphRowProps {
	label: string;
	form: string;
	highlight?: boolean;
}

export const MorphRow: FC<IMorphRowProps> = ({ label, form, highlight }) => (
	<div className="flex items-center justify-between py-2 border-b border-edge last:border-b-0">
		<span className="text-xs text-muted uppercase tracking-wider">{label}</span>
		<span
			className={cn(
				"font-mono text-sm text-foreground",
				highlight && "text-primary font-semibold",
			)}
		>
			{form}
		</span>
	</div>
);
