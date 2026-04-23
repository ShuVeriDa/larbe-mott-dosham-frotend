import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";

interface SettingRowProps {
	title: string;
	description?: string;
	children: ReactNode;
	className?: string;
}

export const SettingRow: FC<SettingRowProps> = ({
	title,
	description,
	children,
	className,
}) => (
	<div
		className={cn(
			"flex items-center justify-between gap-4 py-4 border-b border-edge last:border-0 max-sm:flex-col max-sm:items-start",
			className,
		)}
	>
		<div className="flex-1 min-w-0">
			<div className="text-base font-medium">{title}</div>
			{description && (
				<div className="text-xs text-muted mt-0.5">{description}</div>
			)}
		</div>
		<div className="shrink-0 max-sm:self-start">{children}</div>
	</div>
);
