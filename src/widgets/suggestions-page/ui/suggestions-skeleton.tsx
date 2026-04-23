import type { FC } from "react";

const PLACEHOLDERS = [0, 1, 2, 3];

export const SuggestionsSkeleton: FC = () => (
	<div
		aria-busy
		role="status"
		className="flex flex-col gap-3 mt-3"
	>
		{PLACEHOLDERS.map(i => (
			<div
				key={i}
				className="rounded-lg border border-edge bg-surface px-5 py-5 animate-pulse"
			>
				<div className="flex items-center gap-3 mb-3">
					<div className="h-5 w-28 rounded-sm bg-surface-active" />
					<div className="h-4 w-20 rounded-sm bg-surface-active" />
					<div className="ml-auto h-3 w-24 rounded-sm bg-surface-active" />
				</div>
				<div className="h-9 w-full rounded-md bg-surface-active mb-2" />
				<div className="h-9 w-full rounded-md bg-surface-active" />
			</div>
		))}
	</div>
);
