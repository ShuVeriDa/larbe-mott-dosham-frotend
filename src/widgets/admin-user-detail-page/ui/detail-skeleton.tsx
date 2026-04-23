import type { FC } from "react";

export const DetailSkeleton: FC = () => (
	<div role="status" aria-busy className="animate-pulse">
		<div className="flex items-center gap-5 mb-6">
			<div className="size-16 rounded-full bg-surface-active shrink-0" />
			<div className="flex-1 flex flex-col gap-2">
				<div className="h-6 w-64 bg-surface-active rounded-sm" />
				<div className="h-3 w-80 bg-surface-active rounded-sm" />
			</div>
		</div>
		<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
			<div>
				<div className="rounded-lg border border-border h-72 bg-surface mb-6" />
				<div className="rounded-lg border border-border h-96 bg-surface mb-6" />
			</div>
			<div>
				<div className="rounded-lg border border-border h-64 bg-surface mb-6" />
				<div className="rounded-lg border border-border h-64 bg-surface mb-6" />
			</div>
		</div>
	</div>
);
