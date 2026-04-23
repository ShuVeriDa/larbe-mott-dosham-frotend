import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";

interface SectionCardProps {
	title?: string;
	actions?: ReactNode;
	children: ReactNode;
	className?: string;
	bodyClassName?: string;
}

export const SectionCard: FC<SectionCardProps> = ({
	title,
	actions,
	children,
	className,
	bodyClassName,
}) => (
	<section
		className={cn(
			"bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-6",
			className,
		)}
	>
		{(title || actions) && (
			<header className="flex items-center justify-between mb-4 gap-3 flex-wrap">
				{title ? (
					<h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
				) : (
					<span />
				)}
				{actions}
			</header>
		)}
		<div className={bodyClassName}>{children}</div>
	</section>
);
