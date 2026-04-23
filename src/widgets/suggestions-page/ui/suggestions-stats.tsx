import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface SuggestionsStatsProps {
	dict: Dictionary["suggestions"]["stats"];
	pending: number;
	approved: number;
	rejected: number;
}

interface StatTileProps {
	count: number;
	label: string;
	toneClass: string;
}

const StatTile: FC<StatTileProps> = ({ count, label, toneClass }) => (
	<div className="flex flex-1 min-w-0 items-center gap-2 px-3 py-2 rounded-md border border-edge bg-surface text-sm sm:flex-initial sm:px-4 sm:py-3">
		<span className={cn("font-bold text-md", toneClass)}>{count}</span>
		<span className="font-light text-muted text-xs sm:text-sm">{label}</span>
	</div>
);

export const SuggestionsStats: FC<SuggestionsStatsProps> = ({
	dict,
	pending,
	approved,
	rejected,
}) => (
	<div className="flex flex-wrap gap-2 mb-6 sm:gap-3">
		<StatTile count={pending} label={dict.pending} toneClass="text-warning" />
		<StatTile count={approved} label={dict.approved} toneClass="text-success" />
		<StatTile count={rejected} label={dict.rejected} toneClass="text-danger" />
	</div>
);
