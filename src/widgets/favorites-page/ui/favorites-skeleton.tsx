import type { FC } from "react";

const PLACEHOLDERS = [0, 1, 2, 3, 4];

export const FavoritesSkeleton: FC = () => (
	<div
		aria-busy
		role="status"
		className="flex flex-col gap-3"
	>
		{PLACEHOLDERS.map(i => (
			<div
				key={i}
				className="rounded-lg border border-edge px-5 py-4 animate-pulse"
			>
				<div className="h-5 w-24 rounded-sm bg-surface-active mb-3" />
				<div className="h-3.5 w-3/4 rounded-sm bg-surface-active mb-3" />
				<div className="flex gap-2">
					<div className="h-4 w-12 rounded-xs bg-surface-active" />
					<div className="h-4 w-12 rounded-xs bg-surface-active" />
				</div>
			</div>
		))}
	</div>
);
