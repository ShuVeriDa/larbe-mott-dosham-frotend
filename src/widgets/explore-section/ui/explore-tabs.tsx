import type { FC } from "react";
import { cn } from "@/shared/lib";

export type ExploreTab = "popular" | "recent";

interface ExploreTabsProps {
	active: ExploreTab;
	labels: { popular: string; recent: string };
	onChange: (tab: ExploreTab) => void;
}

export const ExploreTabs: FC<ExploreTabsProps> = ({
	active,
	labels,
	onChange,
}) => (
	<div role="tablist" className="flex items-center gap-1 mb-4">
		{(["popular", "recent"] as const).map(tab => (
			<button
				key={tab}
				type="button"
				role="tab"
				id={`explore-tab-${tab}`}
				aria-selected={active === tab}
				aria-controls={`explore-panel-${tab}`}
				tabIndex={active === tab ? 0 : -1}
				onClick={() => onChange(tab)}
				className={cn(
					"px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] rounded-full transition-colors",
					active === tab
						? "bg-surface text-foreground"
						: "text-faint hover:text-foreground",
				)}
			>
				{labels[tab]}
			</button>
		))}
	</div>
);
