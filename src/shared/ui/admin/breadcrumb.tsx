import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC } from "react";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
	className?: string;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ items, className }) => (
	<nav
		aria-label="Breadcrumb"
		className={cn(
			"flex items-center gap-2 text-xs text-[var(--text-muted)] mb-4 flex-wrap",
			className,
		)}
	>
		{items.map((item, i) => {
			const isLast = i === items.length - 1;
			return (
				<span key={`${item.label}-${i}`} className="flex items-center gap-2">
					{item.href && !isLast ? (
						<Link
							href={item.href}
							className="hover:text-[var(--accent)] transition-colors"
						>
							{item.label}
						</Link>
					) : (
						<span className={cn(isLast && "text-[var(--text-secondary)]")}>
							{item.label}
						</span>
					)}
					{!isLast ? <span aria-hidden>›</span> : null}
				</span>
			);
		})}
	</nav>
);
