import type { FC } from "react";

export const RandomCardSkeleton: FC = () => (
	<div
		aria-busy="true"
		aria-live="polite"
		className="relative bg-raised border border-edge rounded-xl p-8 max-w-[560px] w-full overflow-hidden animate-pulse"
	>
		<div className="flex items-baseline gap-3 flex-wrap mb-4">
			<div className="h-10 w-40 bg-edge rounded" />
			<div className="flex gap-2">
				<div className="h-5 w-8 bg-edge rounded-xs" />
				<div className="h-5 w-10 bg-edge rounded-xs" />
				<div className="h-5 w-6 bg-edge rounded-xs" />
			</div>
		</div>
		<div className="space-y-2 mb-5">
			<div className="h-4 w-3/4 bg-edge rounded" />
			<div className="h-4 w-2/3 bg-edge rounded" />
		</div>
		<div className="bg-surface border-l-2 border-edge rounded-r-md px-5 py-4 mb-6 space-y-2">
			<div className="h-4 w-3/4 bg-edge rounded" />
			<div className="h-4 w-1/2 bg-edge rounded" />
		</div>
		<div className="flex flex-wrap gap-2 mb-6">
			<div className="h-4 w-14 bg-edge rounded" />
			<div className="h-4 w-16 bg-edge rounded" />
			<div className="h-4 w-12 bg-edge rounded" />
		</div>
		<div className="flex gap-3 pt-5 border-t border-edge">
			<div className="h-8 w-36 bg-edge rounded-md" />
			<div className="h-8 w-8 bg-edge rounded-md ml-auto" />
			<div className="h-8 w-8 bg-edge rounded-md" />
		</div>
	</div>
);
