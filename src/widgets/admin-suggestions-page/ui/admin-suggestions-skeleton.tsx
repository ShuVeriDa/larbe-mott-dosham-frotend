import type { FC } from "react";

const CARDS = [0, 1, 2];

export const AdminSuggestionsSkeleton: FC = () => (
	<div role="status" aria-busy className="flex flex-col gap-3">
		{CARDS.map((i) => (
			<div
				key={i}
				className="rounded-lg border border-border bg-surface p-5 animate-pulse"
			>
				<div className="flex items-center gap-3 mb-3">
					<div className="h-5 w-20 rounded-sm bg-surface-active" />
					<div className="h-4 w-12 rounded-sm bg-surface-active" />
					<div className="h-4 w-16 rounded-sm bg-surface-active" />
					<div className="h-4 w-20 rounded-sm bg-surface-active ml-auto" />
				</div>
				<div className="h-9 rounded-md bg-surface-active mb-2" />
				<div className="h-9 rounded-md bg-surface-active mb-3" />
				<div className="flex gap-2">
					<div className="h-8 w-24 rounded-sm bg-surface-active" />
					<div className="h-8 w-24 rounded-sm bg-surface-active ml-auto" />
				</div>
			</div>
		))}
	</div>
);
