import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	actions?: ReactNode;
	className?: string;
}

export const PageHeader: FC<PageHeaderProps> = ({
	title,
	subtitle,
	actions,
	className,
}) => (
	<div
		className={cn(
			"mb-8 flex items-start justify-between gap-4 flex-wrap",
			className,
		)}
	>
		<div>
			<h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mb-1">
				{title}
			</h1>
			{subtitle ? (
				<p className="text-base text-[var(--text-secondary)] max-w-xl">
					{subtitle}
				</p>
			) : null}
		</div>
		{actions ? <div className="flex items-center gap-2">{actions}</div> : null}
	</div>
);
