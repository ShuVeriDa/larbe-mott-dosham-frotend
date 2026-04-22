import { cn } from "@/shared/lib";
import type { FC } from "react";

export type PhraseologyExploreTab = "popular" | "recent";

interface PhraseologyExploreTabsProps {
	active: PhraseologyExploreTab;
	labels: { popular: string; recent: string };
	onChange: (tab: PhraseologyExploreTab) => void;
}

export const PhraseologyExploreTabs: FC<PhraseologyExploreTabsProps> = ({
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
				id={`phraseology-explore-tab-${tab}`}
				aria-selected={active === tab}
				aria-controls={`phraseology-explore-panel-${tab}`}
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
