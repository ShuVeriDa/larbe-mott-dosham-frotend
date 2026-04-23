import { cn } from "@/shared/lib";
import type { FC } from "react";

interface ImpactItem {
	kind: "destroy" | "keep";
	icon: string;
	title: string;
	description: string;
	detail: string;
}

interface ImpactGridProps {
	items: ImpactItem[];
}

const ImpactCard: FC<ImpactItem> = ({ kind, icon, title, description, detail }) => {
	const destroy = kind === "destroy";
	return (
		<div
			className={cn(
				"flex items-start gap-3 p-4 rounded-2xl border",
				destroy
					? "bg-[var(--danger-dim)] border-[rgba(248,113,113,0.12)]"
					: "bg-[var(--success-dim)] border-[rgba(52,211,153,0.12)]",
			)}
		>
			<div
				className={cn(
					"flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-sm",
					destroy
						? "bg-[rgba(248,113,113,0.15)] text-[var(--danger)]"
						: "bg-[rgba(52,211,153,0.15)] text-[var(--success)]",
				)}
				aria-hidden
			>
				{icon}
			</div>
			<div className="flex-1 min-w-0">
				<div
					className={cn(
						"text-sm font-semibold mb-0.5",
						destroy ? "text-[var(--danger)]" : "text-[var(--success)]",
					)}
				>
					{title}
				</div>
				<div className="text-xs text-[var(--text-muted)] leading-relaxed">
					{description}
				</div>
				<div className="text-xs text-[var(--text-secondary)] font-mono mt-1 break-all">
					{detail}
				</div>
			</div>
		</div>
	);
};

export const ImpactGrid: FC<ImpactGridProps> = ({ items }) => (
	<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
		{items.map((item) => (
			<ImpactCard key={`${item.kind}-${item.title}`} {...item} />
		))}
	</div>
);

export type { ImpactItem };
