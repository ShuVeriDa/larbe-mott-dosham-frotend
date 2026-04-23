import type { FC } from "react";

export const SettingsSkeleton: FC = () => (
	<div
		role="status"
		aria-live="polite"
		className="max-w-[720px] mx-auto px-6 py-8 pb-16 max-sm:px-4 max-sm:py-5 animate-pulse"
	>
		<div className="h-4 w-20 rounded-sm bg-surface mb-6" />
		<div className="h-8 w-48 rounded-sm bg-surface mb-2" />
		<div className="h-4 w-64 rounded-sm bg-surface mb-8" />
		<div className="flex gap-8 max-md:flex-col">
			<div className="md:w-[180px] flex md:flex-col gap-2">
				{[0, 1, 2, 3, 4].map(i => (
					<div key={i} className="h-9 rounded-lg bg-surface" />
				))}
			</div>
			<div className="flex-1 flex flex-col gap-3">
				{[0, 1, 2, 3].map(i => (
					<div key={i} className="h-16 rounded-md bg-surface" />
				))}
			</div>
		</div>
	</div>
);
