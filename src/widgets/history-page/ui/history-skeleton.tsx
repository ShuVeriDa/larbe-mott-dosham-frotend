"use client";

import type { FC } from "react";

const PLACEHOLDERS = [0, 1, 2, 3, 4];

export const HistorySkeleton: FC = () => (
	<div aria-busy className="flex flex-col gap-2 mt-3" role="status">
		{PLACEHOLDERS.map(i => (
			<div
				key={i}
				className="flex items-center gap-4 px-4 py-3 rounded-lg bg-surface border border-edge animate-pulse"
			>
				<div className="size-9 rounded-md bg-surface-active shrink-0" />
				<div className="flex-1 min-w-0">
					<div className="h-4 w-2/3 rounded-sm bg-surface-active" />
					<div className="h-3 w-24 rounded-sm bg-surface-active mt-2" />
				</div>
			</div>
		))}
	</div>
);
