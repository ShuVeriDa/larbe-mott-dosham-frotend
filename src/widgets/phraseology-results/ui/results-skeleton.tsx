import type { FC } from "react";

const SKELETON_COUNT = 5;

export const ResultsSkeleton: FC = () => (
	<div className="flex flex-col gap-3" aria-hidden>
		{Array.from({ length: SKELETON_COUNT }).map((_, i) => (
			<div
				key={i}
				className="bg-surface border border-edge rounded-lg px-5 py-4 animate-pulse"
			>
				<div className="h-5 w-32 bg-surface-hover rounded mb-3" />
				<div className="h-4 w-3/4 bg-surface-hover rounded mb-2" />
				<div className="h-4 w-1/2 bg-surface-hover rounded mb-2" />
				<div className="h-4 w-2/3 bg-surface-hover rounded" />
			</div>
		))}
	</div>
);
