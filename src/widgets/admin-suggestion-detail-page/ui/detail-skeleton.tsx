import type { FC } from "react";

export const DetailSkeleton: FC = () => (
	<div className="animate-pulse">
		<div className="h-4 w-40 rounded bg-surface-hover mb-4" />
		<div className="h-8 w-2/3 rounded bg-surface-hover mb-2" />
		<div className="h-4 w-1/2 rounded bg-surface-hover mb-6" />
		<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
			<div className="rounded-lg border border-edge bg-surface p-6 space-y-4">
				<div className="h-6 w-1/3 rounded bg-surface-hover" />
				<div className="h-24 rounded bg-surface-hover" />
				<div className="h-40 rounded bg-surface-hover" />
			</div>
			<div className="space-y-4">
				<div className="h-48 rounded-lg border border-edge bg-surface" />
				<div className="h-56 rounded-lg border border-edge bg-surface" />
				<div className="h-36 rounded-lg border border-edge bg-surface" />
			</div>
		</div>
	</div>
);
